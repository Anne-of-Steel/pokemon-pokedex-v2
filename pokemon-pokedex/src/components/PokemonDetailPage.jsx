import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaStar, FaArrowLeft } from 'react-icons/fa';
import { usePokemonDetail } from '../hooks/usePokemonData';
import { useFavorites } from '../hooks/useFavorites';
import { translateType, translateStat, getTypeColor, getGenerationLabel } from '../utils/translatePokemon';
import './PokemonDetailPage.css';

const PokemonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { pokemon, loading, error } = usePokemonDetail(id);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="pokeball-spinner"></div>
        <p>ポケモン詳細を読み込んでいます...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="detail-error">
        <p>❌ ポケモンの詳細を取得できませんでした</p>
        <button onClick={() => navigate('/')}>リストに戻る</button>
      </div>
    );
  }

  const handlePrevious = () => {
    if (pokemon.id > 1) {
      navigate(`/pokemon/${pokemon.id - 1}`);
    }
  };

  const handleNext = () => {
    if (pokemon.id < 1025) {
      navigate(`/pokemon/${pokemon.id + 1}`);
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(pokemon.id);
  };

  const handleBackToList = () => {
    const state = location.state || {};
    
    navigate('/', {
      state: {
        page: state.fromPage || 1,
        itemsPerPage: state.itemsPerPage || 20,
        filterConditions: state.filterConditions || null,
        scrollPosition: state.scrollPosition || 0
      }
    });
  };

  const renderStatBar = (statName, statValue) => {
    const maxStat = 255; // ポケモンの最大能力値
    const percentage = (statValue / maxStat) * 100;
    
    return (
      <div className="stat-row">
        <div className="stat-name">{translateStat(statName)}</div>
        <div className="stat-bar-container">
          <div 
            className="stat-bar" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="stat-value">{statValue}</div>
      </div>
    );
  };

  return (
    <div className="detail-container">
      <div className="detail-pokedex">
        {/* 左パネル */}
        <div className="detail-left-panel">
          <div className="detail-screen">
            <div className="detail-image-container">
              <img
                src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                alt={pokemon.nameJa || pokemon.name}
                className="detail-image"
              />
            </div>
            
            <div className="detail-navigation">
              <button
                className="nav-button"
                onClick={handlePrevious}
                disabled={pokemon.id <= 1}
              >
                <FaChevronLeft />
                前のポケモン
              </button>
              <button
                className="nav-button"
                onClick={handleNext}
                disabled={pokemon.id >= 1025}
              >
                次のポケモン
                <FaChevronRight />
              </button>
            </div>
            
            <button
              className={`favorite-button-detail ${isFavorite(pokemon.id) ? 'active' : ''}`}
              onClick={handleFavoriteToggle}
            >
              <FaStar />
              {isFavorite(pokemon.id) ? 'お気に入り登録済み' : 'お気に入りに登録'}
            </button>
          </div>
        </div>

        {/* 右パネル */}
        <div className="detail-right-panel">
          <div className="detail-content">
            <div className="detail-header">
              <div className="detail-number">No. {pokemon.id.toString().padStart(3, '0')}</div>
              <h1 className="detail-name">{pokemon.nameJa || pokemon.name}</h1>
              <div className="detail-name-en">({pokemon.name})</div>
              
              <div className="detail-types">
                {pokemon.types.map((type, index) => (
                  <span
                    key={index}
                    className={`type-badge-detail type-${type.type.name}`}
                    style={{ backgroundColor: getTypeColor(type.type.name) }}
                  >
                    {translateType(type.type.name)}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-section-title">【基本情報】</h3>
              <div className="detail-basic-info">
                <div className="info-item">
                  <div className="info-label">身長</div>
                  <div className="info-value">{(pokemon.height / 10).toFixed(1)}m</div>
                </div>
                <div className="info-item">
                  <div className="info-label">体重</div>
                  <div className="info-value">{(pokemon.weight / 10).toFixed(1)}kg</div>
                </div>
              </div>
            </div>

            {pokemon.description && (
              <div className="detail-section">
                <h3 className="detail-section-title">【説明】</h3>
                <div className="detail-description">
                  {pokemon.description}
                </div>
              </div>
            )}

            {pokemon.stats && (
              <div className="detail-section">
                <h3 className="detail-section-title">【能力値】</h3>
                <div className="stats-container">
                  {pokemon.stats.map((stat, index) => (
                    <div key={index}>
                      {renderStatBar(stat.stat.name, stat.base_stat)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 && (
              <div className="detail-section">
                <h3 className="detail-section-title">【進化チェーン】</h3>
                <div className="evolution-chain">
                  {pokemon.evolutionChain.map((evolution, index) => (
                    <div key={index} className="evolution-pokemon">
                      <div className="evolution-image">
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`}
                          alt={evolution.nameJa || evolution.name}
                        />
                      </div>
                      <span>{evolution.nameJa || evolution.name}</span>
                      {index < pokemon.evolutionChain.length - 1 && (
                        <div className="evolution-arrow">→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pokemon.generation && (
              <div className="detail-section">
                <h3 className="detail-section-title">【出現シリーズ】</h3>
                <div className="games-list">
                  <div className="game-item">• {getGenerationLabel(pokemon.generation)}</div>
                </div>
              </div>
            )}

            <button onClick={handleBackToList} className="back-button">
              <FaArrowLeft />
              リストに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;
