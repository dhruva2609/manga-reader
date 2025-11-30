import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChapters } from '../../api/mangadex';


const ChapterList = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      const chaps = await getChapters(mangaId);
      setChapters(chaps);
      setLoading(false);
    };
    fetchChapters();
  }, [mangaId]);

  const handleSelectChapter = (chapterId) => {
    // Navigate to the reader route using the selected chapter ID
    navigate(`/read/${chapterId}`);
  };

  if (loading) return <div className="loader">Loading Chapters...</div>;
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