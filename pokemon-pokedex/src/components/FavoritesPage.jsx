import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import FilterModal from './FilterModal';
import Pagination from './Pagination';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';
import { fetchAllPokemonList, fetchPokemonDetails } from '../utils/pokemonApi';
import { filterPokemons, searchPokemons } from '../utils/filterPokemon';
import { TYPE_TRANSLATIONS, GENERATION_TRANSLATIONS } from '../utils/translatePokemon';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConditions, setFilterConditions] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [favoritePokemons, setFavoritePokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // お気に入りポケモンの詳細データを取得
  useEffect(() => {
    const loadFavoritePokemons = async () => {
      if (favorites.length === 0) {
        setFavoritePokemons([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // 全ポケモンリストを取得
        const allPokemonList = await fetchAllPokemonList();
        
        // お気に入りのポケモンIDに対応するポケモンを取得
        const favoritePokemonData = [];
        
        for (const favoriteId of favorites) {
          const pokemon = allPokemonList.find(p => {
            const id = p.url.split('/').filter(Boolean).pop();
            return parseInt(id) === favoriteId;
          });
          
          if (pokemon) {
            favoritePokemonData.push(pokemon);
          }
        }
        
        // 詳細データを取得
        const details = await fetchPokemonDetails(favoritePokemonData, 0, favoritePokemonData.length);
        setFavoritePokemons(details);
        setLoading(false);
      } catch (err) {
        setError('お気に入りポケモンの取得に失敗しました');
        setLoading(false);
      }
    };

    loadFavoritePokemons();
  }, [favorites]);

  // フィルタリング + 検索
  const filteredPokemons = React.useMemo(() => {
    if (favoritePokemons.length === 0) return [];
    
    let result = favoritePokemons;
    
    // 検索フィルタを適用
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
      result = searchPokemons(result, debouncedSearchTerm);
    }
    
    // フィルタ条件を適用
    if (filterConditions) {
      result = filterPokemons(result, filterConditions);
    }
    
    return result;
  }, [favoritePokemons, filterConditions, debouncedSearchTerm]);

  // 現在のページに表示するポケモンを切り出し
  const displayedPokemons = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPokemons.slice(startIndex, endIndex);
  }, [filteredPokemons, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);

  const handleCardClick = (pokemonId) => {
    navigate(`/pokemon/${pokemonId}`, {
      state: {
        fromPage: currentPage,
        itemsPerPage: itemsPerPage,
        filterConditions: filterConditions,
        scrollPosition: window.scrollY,
        fromFavorites: true
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (count) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  const handleFilterApply = (conditions) => {
    setFilterConditions(conditions);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterConditions(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
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
  };

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
        <p>お気に入りポケモンを読み込み中...</p>
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

  if (favorites.length === 0) {
    return (
      <div className="favorites-page-container">
        <div className="pokemon-list-header">
          <div className="header-left">
            <h1>お気に入り: 0件</h1>
          </div>
          <div className="header-right">
            <button 
              className="go-to-list-button"
              onClick={() => navigate('/')}
            >
              リストへ戻る
            </button>
          </div>
        </div>
        <div className="no-favorites">
          <div className="no-favorites-icon">⭐</div>
          <h2>お気に入りがありません</h2>
          <p>ポケモンを探しに行こう！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page-container">
      <div className="pokemon-list-header">
        <div className="header-left">
          <h1>お気に入り: {favorites.length}件</h1>
        </div>
        <div className="header-right">
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
            totalCount={filteredPokemons.length}
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

export default FavoritesPage;