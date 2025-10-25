import React from 'react';
import { FaStar } from 'react-icons/fa';
import './FavoriteButton.css';

const FavoriteButton = ({ pokemonId, isFavorite, onToggle }) => {
  const handleClick = (e) => {
    e.stopPropagation(); // カードクリックイベントの伝播を防ぐ
    onToggle(pokemonId);
  };

  return (
    <button
      className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
      onClick={handleClick}
      aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <FaStar className="star-icon" />
    </button>
  );
};

export default FavoriteButton;


