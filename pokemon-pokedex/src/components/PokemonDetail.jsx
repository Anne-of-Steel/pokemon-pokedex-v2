import React, { useEffect } from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import FavoriteButton from './FavoriteButton';
import './PokemonDetail.css';

const PokemonDetail = ({ pokemon, isFavorite, onToggleFavorite, onClose, onNavigateToDetail }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!pokemon) return null;

  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[typeName] || '#68A090';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="pokemon-detail">
          <div className="pokemon-image-section">
            <img
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="detail-image"
            />
          </div>
          
          <div className="pokemon-info-section">
            <div className="pokemon-number">No. {pokemon.id.toString().padStart(3, '0')}</div>
            <h2 className="pokemon-name">
              {pokemon.nameJa || pokemon.name} ({pokemon.name})
            </h2>
            
            <div className="pokemon-types">
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className="type-badge"
                  style={{ backgroundColor: getTypeColor(type.type.name) }}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
            
            <div className="pokemon-stats">
              <div className="stat-item">
                <span className="stat-label">身長:</span>
                <span className="stat-value">{(pokemon.height / 10).toFixed(1)}m</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">体重:</span>
                <span className="stat-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
              </div>
            </div>
            
            {pokemon.description && (
              <div className="pokemon-description">
                <h3>【説明】</h3>
                <p>{pokemon.description}</p>
              </div>
            )}
            
            {pokemon.games && pokemon.games.length > 0 && (
              <div className="pokemon-games">
                <h3>【出現シリーズ】</h3>
                <ul>
                  {pokemon.games.slice(0, 10).map((game, index) => (
                    <li key={index}>• {game}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="pokemon-actions">
            <FavoriteButton
              pokemonId={pokemon.id}
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
            />
            <button 
              className="detail-page-btn"
              onClick={() => onNavigateToDetail(pokemon.id)}
            >
              詳細ページへ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;


