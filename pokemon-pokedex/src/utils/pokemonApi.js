import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';
const TOTAL_POKEMON = 1025; // 第9世代まで

// ステップ1: 全ポケモンのリストを取得（IDとURLのみ）
export const fetchAllPokemonList = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/pokemon?limit=${TOTAL_POKEMON}&offset=0`
    );
    return response.data.results; // [{name, url}, ...]
  } catch (error) {
    console.error('ポケモンリスト取得エラー:', error);
    throw error;
  }
};

// ステップ2: 指定範囲のポケモン詳細を取得
export const fetchPokemonDetails = async (pokemonList, startIndex, endIndex) => {
  try {
    const slice = pokemonList.slice(startIndex, endIndex);
    
    // 並列で詳細データを取得
    const detailsPromises = slice.map(pokemon => {
      const id = pokemon.url.split('/').filter(Boolean).pop();
      return Promise.all([
        axios.get(pokemon.url),
        axios.get(`${BASE_URL}/pokemon-species/${id}`)
      ]);
    });
    
    const results = await Promise.all(detailsPromises);
    
    // データを整形
    return results.map(([pokemonRes, speciesRes]) => {
      const pokemon = pokemonRes.data;
      const species = speciesRes.data;
      
      // 日本語名を取得
      const japaneseName = species.names.find(
        name => name.language.name === 'ja'
      )?.name || pokemon.name;
      
      // 日本語説明文を取得
      const japaneseDescription = species.flavor_text_entries.find(
        entry => entry.language.name === 'ja'
      )?.flavor_text.replace(/\n/g, '') || '';
      
      return {
        id: pokemon.id,
        name: pokemon.name,
        nameJa: japaneseName,
        types: pokemon.types,
        height: pokemon.height,
        weight: pokemon.weight,
        sprites: pokemon.sprites,
        stats: pokemon.stats,
        description: japaneseDescription,
        evolutionChainUrl: species.evolution_chain?.url
      };
    });
  } catch (error) {
    console.error('ポケモン詳細取得エラー:', error);
    throw error;
  }
};

// ステップ3: 個別ポケモンの完全な詳細を取得（詳細ページ用）
export const fetchPokemonFullDetails = async (pokemonId) => {
  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      axios.get(`${BASE_URL}/pokemon/${pokemonId}`),
      axios.get(`${BASE_URL}/pokemon-species/${pokemonId}`)
    ]);
    
    const pokemon = pokemonRes.data;
    const species = speciesRes.data;
    
    // 日本語データ取得
    const japaneseName = species.names.find(
      name => name.language.name === 'ja'
    )?.name || pokemon.name;
    
    const japaneseDescription = species.flavor_text_entries
      .filter(entry => entry.language.name === 'ja')
      .map(entry => entry.flavor_text.replace(/\n/g, ''))
      .join(' ');
    
    // 進化チェーンを取得
    let evolutionChain = [];
    if (species.evolution_chain) {
      const evolutionRes = await axios.get(species.evolution_chain.url);
      evolutionChain = parseEvolutionChain(evolutionRes.data.chain);
    }
    
    // 登場シリーズを取得
    const games = species.generation.name;
    
    return {
      id: pokemon.id,
      name: pokemon.name,
      nameJa: japaneseName,
      types: pokemon.types,
      height: pokemon.height,
      weight: pokemon.weight,
      sprites: pokemon.sprites,
      stats: pokemon.stats,
      abilities: pokemon.abilities,
      description: japaneseDescription,
      evolutionChain,
      generation: games,
      genus: species.genera.find(g => g.language.name === 'ja')?.genus || ''
    };
  } catch (error) {
    console.error('ポケモン完全詳細取得エラー:', error);
    throw error;
  }
};

// 進化チェーンをパース（日本語名も取得）
const parseEvolutionChain = async (chain) => {
  const evolutionList = [];
  
  const traverse = async (node) => {
    const speciesId = node.species.url.split('/').filter(Boolean).pop();
    
    // 日本語名を取得
    try {
      const speciesRes = await axios.get(`${BASE_URL}/pokemon-species/${speciesId}`);
      const japaneseName = speciesRes.data.names.find(
        name => name.language.name === 'ja'
      )?.name || node.species.name;
      
      evolutionList.push({
        id: speciesId,
        name: node.species.name,
        nameJa: japaneseName,
        url: node.species.url
      });
    } catch (error) {
      evolutionList.push({
        id: speciesId,
        name: node.species.name,
        nameJa: node.species.name,
        url: node.species.url
      });
    }
    
    if (node.evolves_to.length > 0) {
      for (const evolution of node.evolves_to) {
        await traverse(evolution);
      }
    }
  };
  
  await traverse(chain);
  return evolutionList;
};

// 後方互換性のための既存関数（非推奨）
export const getPokemons = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    
    const details = await Promise.all(
      response.data.results.map(pokemon => 
        axios.get(pokemon.url)
      )
    );
    
    return details.map(d => d.data);
  } catch (error) {
    console.error('ポケモンリストの取得に失敗しました:', error);
    throw error;
  }
};

export const getPokemonById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
    return response.data;
  } catch (error) {
    console.error('ポケモン詳細の取得に失敗しました:', error);
    throw error;
  }
};

export const getPokemonSpecies = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon-species/${id}`);
    return response.data;
  } catch (error) {
    console.error('ポケモン種族情報の取得に失敗しました:', error);
    throw error;
  }
};

export const getPokemonWithDetails = async (id) => {
  try {
    const [pokemon, species] = await Promise.all([
      getPokemonById(id),
      getPokemonSpecies(id)
    ]);
    
    const nameJa = species.names.find(name => name.language.name === 'ja-Hrkt')?.name || pokemon.name;
    const description = species.flavor_text_entries
      .find(entry => entry.language.name === 'ja-Hrkt')?.flavor_text || '';
    const games = species.games.map(game => game.version.name);
    
    return {
      ...pokemon,
      nameJa,
      description: description.replace(/\f/g, ' '),
      games
    };
  } catch (error) {
    console.error('ポケモン詳細情報の統合取得に失敗しました:', error);
    throw error;
  }
};
