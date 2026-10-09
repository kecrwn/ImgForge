import { useState, useCallback } from 'react';

export function useRecentTools() {
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('imgforge-recent') || '[]');
    } catch { return []; }
  });

  const addRecent = useCallback((toolId: string) => {
    setRecent(prev => {
      const next = [toolId, ...prev.filter(id => id !== toolId)].slice(0, 20);
      localStorage.setItem('imgforge-recent', JSON.stringify(next));
      return next;
    });
  }, []);

  return { recent, addRecent };
}
