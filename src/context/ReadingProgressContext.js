import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const ReadingProgressContext = createContext();

export const useReadingProgress = () => useContext(ReadingProgressContext);

export const ReadingProgressProvider = ({ children }) => {
    const [history, setHistory] = useState({});

    useEffect(() => {
        const savedHistory = localStorage.getItem('readingHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save to localStorage when history changes
    useEffect(() => {
        localStorage.setItem('readingHistory', JSON.stringify(history));
    }, [history]);

    const updateProgress = useCallback((manga, chapterId, chapterTitle, pageIdx) => {
        const mangaId = manga.id;
        setHistory(prevHistory => {
            const currentProgress = prevHistory[mangaId];
            if (currentProgress &&
                currentProgress.lastReadChapterId === chapterId &&
                currentProgress.lastReadPage === pageIdx) {
                return prevHistory;
            }

            const newHistory = {
                ...prevHistory,
                [mangaId]: {
                    ...manga,
                    lastReadChapterId: chapterId,
                    lastReadChapterTitle: chapterTitle,
                    lastReadPage: pageIdx,
                    timestamp: Date.now(),
                },
            };
            localStorage.setItem('readingHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    }, []);

    const getMangaProgress = useCallback((mangaId) => {
        return history[mangaId] || null;
    }, [history]);

    const getReadingHistory = useCallback(() => {
        // Returns sorted history, used by HistoryView.js
        return Object.values(history).sort((a, b) => b.timestamp - a.timestamp);
    }, [history]);
    
    // FIX: Add getLastRead for ContinueReading.js
    const getLastRead = useCallback(() => {
        const historyList = Object.values(history);
        if (historyList.length === 0) return null;
        
        // Return the item with the highest (latest) timestamp
        return historyList.reduce((latest, current) => {
            return current.timestamp > latest.timestamp ? current : latest;
        }, historyList[0]);
    }, [history]);

    return (
        <ReadingProgressContext.Provider value={{ updateProgress, getMangaProgress, getReadingHistory, getLastRead }}>
            {children}
        </ReadingProgressContext.Provider>
    );
};