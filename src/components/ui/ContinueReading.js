import React from "react";
import { useReadingProgress } from "../../context/ReadingProgressContext";

const ContinueReading = ({ onContinue }) => { // Changed prop name to be generic
  const { getLastRead } = useReadingProgress();
  const last = getLastRead();

  if (!last) return null;

  return (
    <div className="continue-reading">
      <button
        onClick={() => onContinue(last)} // Pass the whole 'last' object
        className="continue-reading-btn"
      >
        <span>Continue Reading:</span>
        <strong>{last.manga.title}</strong>
      </button>
    </div>
  );
};

export default ContinueReading;