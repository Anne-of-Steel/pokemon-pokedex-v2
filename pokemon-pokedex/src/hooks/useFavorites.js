import { useState, useEffect } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../utils/localStorage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);
  
  const toggleFavorite = (pokemonId) => {
    if (favorites.includes(pokemonId)) {
      removeFavorite(pokemonId);
      setFavorites(prev => prev.filter(id => id !== pokemonId));
    } else {
      addFavorite(pokemonId);
      setFavorites(prev => [...prev, pokemonId]);
    }
  };
  
  const isFavorite = (pokemonId) => {
    return favorites.includes(pokemonId);
  };
  
  return { 
    favorites, 
    toggleFavorite, 
    isFavorite,
    favoritesCount: favorites.length
  };
};


