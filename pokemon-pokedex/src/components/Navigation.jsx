import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './Navigation.css';

const Navigation = ({ favoritesCount }) => {
  const navigate = useNavigate();

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-left">
          <h1 className="nav-title">ポケモン図鑑</h1>
        </div>
        <div className="nav-right">
          <button 
            className="favorites-nav-btn"
            onClick={handleFavoritesClick}
            aria-label={`お気に入り (${favoritesCount}件)`}
          >
            <FaStar className="nav-star-icon" />
            <span className="favorites-count">{favoritesCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;


