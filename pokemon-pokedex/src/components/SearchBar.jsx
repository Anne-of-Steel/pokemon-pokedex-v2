import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "ポケモンを検索...",
  onFilterClick,
  activeFilterCount = 0
}) => {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
      </div>
      <button 
        className="filter-button"
        onClick={onFilterClick}
      >
        🔍 フィルタ {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>
    </div>
  );
};

export default SearchBar;


