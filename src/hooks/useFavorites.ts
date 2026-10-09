import { useState, useCallback } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('imgforge-favorites') || '[]');
    } catch { return []; }
  });

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites(prev => {
      const next = prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem('imgforge-favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
