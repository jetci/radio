import { useState, useEffect, useCallback } from 'react';
import { Station } from '../types';

interface HistoryEntry {
    station: Station;
    timestamp: number;
    playCount: number;
}

const MAX_HISTORY = 20;

export const useListeningHistory = () => {
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        const saved = localStorage.getItem('j-radio-history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('j-radio-history', JSON.stringify(history));
    }, [history]);

    const addToHistory = useCallback((station: Station) => {
        setHistory(prev => {
            // Check if station already exists in history
            const existingIndex = prev.findIndex(
                entry => entry.station.stationuuid === station.stationuuid
            );

            let updated: HistoryEntry[];

            if (existingIndex !== -1) {
                // Update existing entry
                updated = [...prev];
                updated[existingIndex] = {
                    station,
                    timestamp: Date.now(),
                    playCount: updated[existingIndex].playCount + 1
                };
                // Move to front
                const [entry] = updated.splice(existingIndex, 1);
                updated.unshift(entry);
            } else {
                // Add new entry
                updated = [
                    {
                        station,
                        timestamp: Date.now(),
                        playCount: 1
                    },
                    ...prev
                ];
            }

            // Keep only MAX_HISTORY entries
            return updated.slice(0, MAX_HISTORY);
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem('j-radio-history');
    }, []);

    return {
        history,
        addToHistory,
        clearHistory
    };
};
