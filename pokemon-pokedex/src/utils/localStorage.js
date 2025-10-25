const FAVORITES_KEY = 'pokemon_favorites';

// お気に入り取得
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('お気に入りの取得に失敗しました:', error);
    return [];
  }
};

// お気に入り追加
export const addFavorite = (pokemonId) => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(pokemonId)) {
      favorites.push(pokemonId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('お気に入りの追加に失敗しました:', error);
  }
};

// お気に入り削除
export const removeFavorite = (pokemonId) => {
  try {
    const favorites = getFavorites();
    const updated = favorites.filter(id => id !== pokemonId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('お気に入りの削除に失敗しました:', error);
  }
};

// お気に入り判定
export const isFavorite = (pokemonId) => {
  return getFavorites().includes(pokemonId);
};

// お気に入り切り替え
export const toggleFavorite = (pokemonId) => {
  if (isFavorite(pokemonId)) {
    removeFavorite(pokemonId);
  } else {
    addFavorite(pokemonId);
  }
};


