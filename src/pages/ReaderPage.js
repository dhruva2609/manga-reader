import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReadingProgress } from "../context/ReadingProgressContext";
import DownloadPdfButton from "../components/reader/DownloadPdfButton";
import { getReaderData } from "../api/mangadex";
import { getMangaTitle } from "../utils";

const ReaderPage = () => {
  const { chapterId } = useParams();
  // FIX 1: Destructure 'getMangaProgress' (the correct name)
  const { updateProgress, getMangaProgress } = useReadingProgress(); 

  const [pages, setPages] = useState([]);
  const [manga, setManga] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [pageIdx, setPageIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

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
    <div className="reader">
      {/* Page Progress Bar */}
      <div
        className="reader-progress-bar"
        aria-label={`Reading progress: Page ${pageIdx + 1} of ${pages.length}`}
        role="progressbar"
        aria-valuenow={pageIdx + 1}
        aria-valuemin={1}
        aria-valuemax={pages.length}
        style={{
          width: "100%",
          height: "8px",
          background: "var(--border)",
          borderRadius: "4px",
          marginBottom: "1.2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pageProgress}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--accent), var(--accent2))",
            borderRadius: "4px",
            transition: "width 0.3s",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "12px",
            color: "var(--text-muted)",
            fontWeight: 500,
            background: "rgba(255,255,255,0.8)",
            padding: "0 4px",
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        >
          Page {pageIdx + 1} / {pages.length}
        </span>
      </div>

      {/* Toolbar with title and download button */}
      <div
        className="reader-toolbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          // FIX: Ensure the toolbar takes up the full width of its parent container
          width: "100%", 
        }}
      >
        <span style={{ fontWeight: 600 }}>
          {mangaTitle} {chapterTitle ? `- ${chapterTitle}` : ""}
        </span>
        <DownloadPdfButton
          mangaTitle={mangaTitle || "Manga"}
          chapterTitle={chapterTitle || `Chapter ${chapterId}`}
          pageImages={pages}
        />
      </div>

      {/* Manga Page Image */}
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

      {/* Navigation Controls */}
      <div
        className="page-controls"
        style={{
          margin: "1.5rem 0",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
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
    </div>
  );
};

export default ReaderPage;