import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import MangaChapterPdf from '../MangaChapterPdf';

const DownloadPdfButton = ({ mangaTitle, chapterTitle, pageImages }) => {
  const handleDownload = async () => {
    if (!pageImages || pageImages.length === 0) {
      alert("No pages to download!");
      return;
    }
    const blob = await pdf(
      <MangaChapterPdf
        mangaTitle={mangaTitle}
        chapterTitle={chapterTitle}
        pageImages={pageImages}
      />
    ).toBlob();
    saveAs(blob, `${mangaTitle}-${chapterTitle}.pdf`);
  };

  return (
    <button onClick={handleDownload} className="download-pdf-btn" title="Download as PDF">
      {/* Download arrow SVG from Heroicons */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        style={{ width: 20, height: 20, marginRight: 8, verticalAlign: "middle" }}
        aria-hidden="true"
        focusable="false"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
      </svg>
      Download PDF
    </button>
  );
};

export default DownloadPdfButton;
