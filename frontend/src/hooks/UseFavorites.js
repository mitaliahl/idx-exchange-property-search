import { useState, useEffect } from "react";

const STORAGE_KEY = "favoriteListingIds";

// manages favorited property IDs and keeps them in localStorage
function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // whenever favoriteIds changes save it back to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  function isFavorite(id) {
    return favoriteIds.includes(id);
  }

  function toggleFavorite(id) {
    if (favoriteIds.includes(id)) {
      setFavoriteIds(favoriteIds.filter((favId) => favId !== id));
    } else {
      setFavoriteIds([...favoriteIds, id]);
    }
  }

  return { favoriteIds, isFavorite, toggleFavorite };
}

export default useFavorites;