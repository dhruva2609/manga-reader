import React from 'react'; // FIX: Removed useEffect and useState
import { useNavigate } from 'react-router-dom'; // FIX: Removed useParams
// FIX: Removed getChapters import

// FIX: Accept chapters prop
const ChapterList = ({ chapters = [] }) => {
  const navigate = useNavigate();

  // FIX: Removed all internal state and useEffect for fetching chapters

  const handleSelectChapter = (chapterId) => {
    navigate(`/read/${chapterId}`);
  };

  // FIX: Use prop for loading check
  if (!chapters.length) return <h1 className="chapter-list">No chapters found for this title.</h1>;

  return (
    <div className="chapter-list">
      <h3>Available Chapters ({chapters.length})</h3>
      
      {/* Dropdown for quicker navigation */}
      <select
        className="chapter-dropdown"
        onChange={e => handleSelectChapter(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Jump to chapter…</option>
        {chapters.map(ch => (
          <option key={ch.id} value={ch.id}>
            {ch.attributes.chapter || "Oneshot"}: {ch.attributes.title || 'Untitled'}
          </option>
        ))}
      </select>

      {/* Detailed List */}
      <ul style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {chapters.map(ch => (
          <li key={ch.id}>
            <button onClick={() => handleSelectChapter(ch.id)}>
              {ch.attributes.chapter || 'Oneshot'}: {ch.attributes.title || 'Untitled'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChapterList;