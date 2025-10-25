import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import FilterModal from './FilterModal';
import Pagination from './Pagination';
import { usePokemonData } from '../hooks/usePokemonData';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';
import { TYPE_TRANSLATIONS, GENERATION_TRANSLATIONS } from '../utils/translatePokemon';
import './PokemonList.css';

const PokemonList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URLパラメータから状態を復元
  const [currentPage, setCurrentPage] = useState(() => {
    const page = new URLSearchParams(location.search).get('page');
    return page ? parseInt(page) : 1;
  });
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const items = new URLSearchParams(location.search).get('items');
    return items ? parseInt(items) : 20;
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    return new URLSearchParams(location.search).get('search') || '';
  });
  const [filterConditions, setFilterConditions] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { displayedPokemons, totalCount, totalPokemonCount, loading, detailsLoading, error, allPokemonDetails } = usePokemonData(
    currentPage, 
    itemsPerPage, 
    filterConditions, 
    debouncedSearchTerm
  );
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // URLパラメータを更新する関数
  const updateURLParams = (newParams) => {
    const current = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    navigate({ search: current.toString() }, { replace: true });
  };

  // 詳細ページから戻ってきた時に状態を復元
  useEffect(() => {
    if (location.state) {
      if (location.state.page) setCurrentPage(location.state.page);
      if (location.state.itemsPerPage) setItemsPerPage(location.state.itemsPerPage);
      if (location.state.filterConditions) setFilterConditions(location.state.filterConditions);
      
      // スクロール位置を復元
      if (location.state.scrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, location.state.scrollPosition);
        }, 100);
      }
    }
  }, [location.state]);

  const handleCardClick = (pokemonId) => {
    navigate(`/pokemon/${pokemonId}`, {
      state: {
        fromPage: currentPage,
        itemsPerPage: itemsPerPage,
        filterConditions: filterConditions,
        scrollPosition: window.scrollY
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURLParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (count) => {
    setItemsPerPage(count);
    setCurrentPage(1);
    updateURLParams({ items: count.toString(), page: '1' });
  };

  const handleFilterApply = (conditions) => {
    setFilterConditions(conditions);
    setCurrentPage(1);
    updateURLParams({ page: '1' });
  };

  const handleClearFilters = () => {
    setFilterConditions(null);
    setSearchTerm('');
    setCurrentPage(1);
    updateURLParams({ search: '', page: '1' });
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    updateURLParams({ search: term, page: '1' });
  };

  const handleRemoveFilterTag = (filterType, value) => {
    if (!filterConditions) return;
    
    const newConditions = { ...filterConditions };
    
    if (filterType === 'types') {
      newConditions.types = newConditions.types.filter(t => t !== value);
      if (newConditions.types.length === 0) {
        delete newConditions.types;
      }
    } else if (filterType === 'generations') {
      newConditions.generations = newConditions.generations.filter(g => g !== value);
      if (newConditions.generations.length === 0) {
        delete newConditions.generations;
      }
    }
    
    setFilterConditions(Object.keys(newConditions).length > 0 ? newConditions : null);
    setCurrentPage(1);
    updateURLParams({ page: '1' });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 適用中のフィルタタグを生成
  const getActiveFilterTags = () => {
    const tags = [];
    
    if (filterConditions?.types?.length > 0) {
      filterConditions.types.forEach(type => {
        tags.push({
          type: 'types',
          value: type,
          label: `${TYPE_TRANSLATIONS[type]}タイプ`,
          color: '#dc0a2d'
        });
      });
    }
    
    if (filterConditions?.generations?.length > 0) {
      filterConditions.generations.forEach(generation => {
        tags.push({
          type: 'generations',
          value: generation,
          label: GENERATION_TRANSLATIONS[generation]?.label || generation,
          color: '#3b82f6'
        });
      });
    }
    
    if (filterConditions?.heightMin !== undefined || filterConditions?.heightMax !== undefined) {
      const min = filterConditions.heightMin || 0.3;
      const max = filterConditions.heightMax || 20;
      tags.push({
        type: 'height',
        value: 'height',
        label: `身長: ${min}-${max}m`,
        color: '#10b981'
      });
    }
    
    if (filterConditions?.weightMin !== undefined || filterConditions?.weightMax !== undefined) {
      const min = filterConditions.weightMin || 1;
      const max = filterConditions.weightMax || 1000;
      tags.push({
        type: 'weight',
        value: 'weight',
        label: `体重: ${min}-${max}kg`,
        color: '#f59e0b'
      });
    }
    
    return tags;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="pokeball-spinner"></div>
        <p>ポケモンデータを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>エラーが発生しました</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>再読み込み</button>
      </div>
    );
  }

  return (
    <div className="pokemon-list-container">
      <div className="pokemon-list-header">
        <div className="header-left">
          <h1>ポケモン図鑑</h1>
        </div>
        <div className="header-right">
          <div className="favorites-section">
            <span className="favorites-label">お気に入り</span>
            <button 
              className="favorites-button"
              onClick={() => navigate('/favorites')}
            >
              <span className="favorites-count">{favorites.length}</span>
              <span className="star-icon">★</span>
            </button>
          </div>
          <div className="items-per-page-selector">
            <label>表示件数:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
            >
              <option value={20}>20件</option>
              <option value={50}>50件</option>
              <option value={100}>100件</option>
            </select>
          </div>
        </div>
      </div>

      <div className="search-filter-area">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        
        <div className="filter-controls">
          <button 
            className="filter-button"
            onClick={() => setIsFilterModalOpen(true)}
          >
            🔍 フィルタ {getActiveFilterTags().length > 0 && `(${getActiveFilterTags().length})`}
          </button>
          
          {getActiveFilterTags().length > 0 && (
            <div className="active-filter-tags">
              {getActiveFilterTags().map((tag, index) => (
                <span key={index} className="filter-tag" style={{ backgroundColor: tag.color }}>
                  {tag.label}
                  <button 
                    className="remove-tag"
                    onClick={() => handleRemoveFilterTag(tag.type, tag.value)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {detailsLoading && (
        <div className="loading-indicator">
          <p>詳細データを読み込み中... ({allPokemonDetails?.length || 0}/{totalPokemonCount})</p>
        </div>
      )}

      {displayedPokemons.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>該当のポケモンがいません</h3>
          <p>検索条件を変更してみてください</p>
          <button onClick={handleClearFilters} className="clear-filters-button">
            フィルタをクリア
          </button>
        </div>
      ) : (
        <>
          <div className="pokemon-grid">
            {displayedPokemons.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isFavorite={isFavorite(pokemon.id)}
                onToggleFavorite={toggleFavorite}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalCount={totalCount}
          />
        </>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filterConditions}
        onApplyFilters={handleFilterApply}
      />
    </div>
  );
};

export default PokemonList;