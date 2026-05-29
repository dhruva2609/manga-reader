import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReadingProgress } from "../context/ReadingProgressContext";
import DownloadPdfButton from "../components/reader/DownloadPdfButton";
import { getReaderData } from "../api/mangadex";
import { getMangaTitle } from "../utils";

const ReaderPage = () => {
  const { chapterId } = useParams();
  const { updateProgress, getMangaProgress } = useReadingProgress();

  const [pages, setPages] = useState([]);
  const [manga, setManga] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [pageIdx, setPageIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const [scrollMode, setScrollMode] = useState(() => localStorage.getItem("readerScrollMode") || "single");
  const [theme, setTheme] = useState(() => localStorage.getItem("readerTheme") || "dark");
  const [paperFilter, setPaperFilter] = useState(() => localStorage.getItem("readerPaperFilter") || "none");
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem("readerScrollMode", scrollMode);
  }, [scrollMode]);

  useEffect(() => {
    localStorage.setItem("readerTheme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("readerPaperFilter", paperFilter);
  }, [paperFilter]);

  // Track window scroll percentage for continuous mode
  useEffect(() => {
    if (scrollMode !== "continuous" || pages.length === 0 || loading) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = (scrollTop / docHeight) * 100;
        setScrollPercent(pct);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial run
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollMode, loading, pages]);

  // Observer for page changes in continuous scroll mode
  useEffect(() => {
    if (scrollMode !== "continuous" || pages.length === 0 || loading) return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px", // triggers when image crosses screen center area
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-page-index"), 10);
          if (!isNaN(index)) {
            setPageIdx(index);
          }
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const images = document.querySelectorAll(".manga-page-continuous");
      images.forEach(img => observer.observe(img));
    }, 400);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [scrollMode, pages, loading]);

  // Auto scroll to active page when continuous layout is loaded
  useEffect(() => {
    if (scrollMode === "continuous" && pages.length > 0 && pageIdx > 0 && !loading) {
      const timer = setTimeout(() => {
        const targetImg = document.querySelector(`[data-page-index="${pageIdx}"]`);
        if (targetImg) {
          targetImg.scrollIntoView({ block: "center" });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollMode, loading]);

  useEffect(() => {
    const fetchReaderData = async () => {
      setLoading(true);
      try {
        const { pages: fetchedPages, manga: fetchedManga, chapterTitle: fetchedChapterTitle } = await getReaderData(chapterId);
        setPages(fetchedPages);
        setManga(fetchedManga);
        setChapterTitle(fetchedChapterTitle);
      } catch (error) {
        console.error("Failed to fetch reader data:", error);
        setPages([]);
        setManga(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReaderData();
  }, [chapterId]);

  useEffect(() => {
    if (manga) {
      const progress = getMangaProgress(manga.id);
      if (progress && progress.lastReadChapterId === chapterId) {
        setPageIdx(progress.lastReadPage || 0);
      } else {
        setPageIdx(0);
      }
    }
  }, [manga, chapterId, getMangaProgress]);


  // 1. Save reading progress with current page
  useEffect(() => {
    if (manga && chapterId && !loading) {
      updateProgress(manga, chapterId, chapterTitle, pageIdx);
    }
  }, [manga, chapterId, chapterTitle, pageIdx, updateProgress, loading]);

  // 2. Preload next/prev images for smoother navigation
  useEffect(() => {
    if (!pages || pages.length === 0) return;

    // Preload the NEXT image
    if (pageIdx < pages.length - 1) {
      const nextImg = new Image();
      nextImg.src = pages[pageIdx + 1];
    }

    // Preload the PREVIOUS image (optional, for smooth backtracking)
    if (pageIdx > 0) {
      const prevImg = new Image();
      prevImg.src = pages[pageIdx - 1];
    }
  }, [pageIdx, pages]);

  // 3. Reset loading state when page changes
  useEffect(() => {
    setImgLoaded(false);
  }, [pageIdx]);

  // 4. Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") setPageIdx((i) => Math.min(i + 1, pages.length - 1));
      if (e.key === "ArrowLeft") setPageIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pages.length]);

  if (loading) return <div className="loader">Loading Reader...</div>;
  if (!pages.length) return <h1>Chapter pages not found.</h1>;

  // Page progress (within chapter)
  const pageProgress = ((pageIdx + 1) / pages.length) * 100;
  const mangaTitle = manga ? getMangaTitle(manga) : '';

  return (
    <div className={`reader reader-theme-${theme} reader-scroll-${scrollMode}`}>
      {/* Page Progress Bar */}
      <div
        className="reader-progress-bar-wrapper"
        aria-label={`Reading progress: Page ${pageIdx + 1} of ${pages.length}`}
        role="progressbar"
        aria-valuenow={pageIdx + 1}
        aria-valuemin={1}
        aria-valuemax={pages.length}
      >
        <div
          className="reader-progress-bar-fill"
          style={{
            width: `${scrollMode === "continuous" ? scrollPercent : pageProgress}%`,
          }}
        />
        <span
          className="reader-progress-bar-text"
        >
          Page {pageIdx + 1} / {pages.length}
        </span>
      </div>

      {/* Toolbar with title and download button */}
      <div className="reader-toolbar">
        <span>
          {mangaTitle} {chapterTitle ? `- ${chapterTitle}` : ""}
        </span>
        <DownloadPdfButton
          mangaTitle={mangaTitle || "Manga"}
          chapterTitle={chapterTitle || `Chapter ${chapterId}`}
          pageImages={pages}
        />
      </div>

      {/* Reader Settings Control Panel */}
      <div className="reader-settings-panel">
        <div className="reader-setting-group">
          <label htmlFor="layout-select">Layout Mode:</label>
          <select
            id="layout-select"
            className="reader-setting-select"
            value={scrollMode}
            onChange={(e) => setScrollMode(e.target.value)}
          >
            <option value="single">📖 Single Page</option>
            <option value="continuous">📜 Continuous Scroll</option>
          </select>
        </div>
        <div className="reader-setting-group">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            className="reader-setting-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="dark">🌙 Dark Mode</option>
            <option value="light">☀️ Light Mode</option>
            <option value="sepia">🌾 Warm Sepia</option>
            <option value="oled">🕶️ OLED Black</option>
          </select>
        </div>
        <div className="reader-setting-group">
          <label htmlFor="filter-select">Comfort Filter:</label>
          <select
            id="filter-select"
            className="reader-setting-select"
            value={paperFilter}
            onChange={(e) => setPaperFilter(e.target.value)}
          >
            <option value="none">✨ Original Digital</option>
            <option value="vintage">📖 Vintage Manga Book</option>
            <option value="eink">🕶️ E-Ink Comfort Mode</option>
            <option value="parchment">🌾 Cozy Amber Parchment</option>
            <option value="contrast">✒️ High-Contrast Ink</option>
          </select>
        </div>
      </div>

      {/* Manga Page Image(s) with comfort filters */}
      <div className={`manga-pages-container reader-filter-${paperFilter}`}>
        {scrollMode === "continuous" ? (
          <div style={{ width: "100%" }}>
            {pages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Page ${idx + 1}`}
                data-page-index={idx}
                className="manga-page-continuous"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/800x1200/256c8064/ffffff?text=Page+Load+Error';
                }}
              />
            ))}
          </div>
        ) : (
          <img
            src={pages[pageIdx]}
            alt={`Page ${pageIdx + 1}`}
            className={`manga-page${imgLoaded ? " loaded" : ""}`}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%",
              maxWidth: 800,
              display: "block",
              margin: "0 auto",
            }}
          />
        )}
      </div>

      {/* Navigation Controls */}
      {scrollMode === "single" && (
        <div className="page-controls">
          <button
            onClick={() => setPageIdx((i) => Math.max(i - 1, 0))}
            disabled={pageIdx === 0}
          >
            Previous
          </button>
          <span>
            Page {pageIdx + 1} / {pages.length}
          </span>
          <button
            onClick={() => setPageIdx((i) => Math.min(i + 1, pages.length - 1))}
            disabled={pageIdx === pages.length - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReaderPage;