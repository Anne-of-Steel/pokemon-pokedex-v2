// src/utils/filterPokemon.js

/**
 * ポケモンをフィルタリング
 * @param {Array} pokemons - 全ポケモンデータ
 * @param {Object} conditions - フィルタ条件
 * @returns {Array} - フィルタ後のポケモン配列
 */
export const filterPokemons = (pokemons, conditions) => {
  if (!conditions) return pokemons;
  
  return pokemons.filter(pokemon => {
    // 1. タイプフィルタ（OR条件）⭐重要: 仕様書v3で変更
    if (conditions.types && conditions.types.length > 0) {
      const hasMatchingType = pokemon.types.some(typeObj =>
        conditions.types.includes(typeObj.type.name)
      );
      if (!hasMatchingType) return false;
    }
    
    // 2. 身長フィルタ
    if (conditions.heightMin !== undefined && pokemon.height < conditions.heightMin * 10) {
      return false;
    }
    if (conditions.heightMax !== undefined && pokemon.height > conditions.heightMax * 10) {
      return false;
    }
    
    // 3. 体重フィルタ
    if (conditions.weightMin !== undefined && pokemon.weight < conditions.weightMin * 10) {
      return false;
    }
    if (conditions.weightMax !== undefined && pokemon.weight > conditions.weightMax * 10) {
      return false;
    }
    
    // 4. 出現シリーズフィルタ（OR条件）⭐重要
    if (conditions.generations && conditions.generations.length > 0) {
      // pokemon.generationが選択された世代のいずれかに含まれるか
      const matchesGeneration = conditions.generations.includes(pokemon.generation);
      if (!matchesGeneration) return false;
    }
    
    return true;
  });
};

/**
 * 検索フィルタ（名前・番号）
 */
export const searchPokemons = (pokemons, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') return pokemons;
  
  const query = searchQuery.toLowerCase().trim();
  
  return pokemons.filter(pokemon => {
    // 日本語名で検索
    const nameMatch = pokemon.nameJa?.toLowerCase().includes(query);
    // 英語名で検索
    const nameEnMatch = pokemon.name?.toLowerCase().includes(query);
    // 番号で検索（例: "6" or "006"）
    const idMatch = pokemon.id.toString().includes(query) || 
                   pokemon.id.toString().padStart(3, '0').includes(query);
    
    return nameMatch || nameEnMatch || idMatch;
  });
};
