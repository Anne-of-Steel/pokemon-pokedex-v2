import React from 'react';
import FavoriteButton from './FavoriteButton';
import { translateType, getTypeColor } from '../utils/translatePokemon';
import './PokemonCard.css';

const PokemonCard = ({ pokemon, isFavorite, onToggleFavorite, onCardClick }) => {
  const handleCardClick = () => {
    onCardClick(pokemon.id);
  };

  return (
    <div className="pokemon-card" onClick={handleCardClick}>
      <div className="pokemon-image-container">
        <img
          src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
          alt={pokemon.nameJa || pokemon.name}
          className="pokemon-image"
        />
      </div>
      
      <div className="pokemon-info">
        <div className="pokemon-number">No. {pokemon.id.toString().padStart(3, '0')}</div>
        <h3 className="pokemon-name">{pokemon.nameJa || pokemon.name}</h3>
        
        <div className="pokemon-types">
          {pokemon.types.map((type, index) => (
            <span
              key={index}
              className="type-badge"
              style={{ backgroundColor: getTypeColor(type.type.name) }}
            >
              {translateType(type.type.name)}
            </span>
          ))}
        </div>
        
        <div className="pokemon-series">
          {pokemon.generation && (
            <span className="series-text">{pokemon.generation}</span>
          )}
        </div>
      </div>
      
      <div className="pokemon-actions">
        <FavoriteButton
          pokemonId={pokemon.id}
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
        />
      </div>
    </div>
  );
};

export default PokemonCard;
