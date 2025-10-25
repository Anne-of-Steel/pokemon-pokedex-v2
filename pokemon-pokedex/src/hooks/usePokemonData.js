import { useState, useEffect, useMemo } from 'react';
import { fetchAllPokemonList, fetchPokemonDetails, fetchPokemonFullDetails } from '../utils/pokemonApi';
import { filterPokemons, searchPokemons } from '../utils/filterPokemon';

export const usePokemonData = (currentPage, itemsPerPage, filterConditions, searchTerm) => {
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [allPokemonDetails, setAllPokemonDetails] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Step 1: 初回に全ポケモンリストを取得
  useEffect(() => {
    const loadAllPokemonList = async () => {
      try {
        setLoading(true);
        const list = await fetchAllPokemonList();
        setAllPokemonList(list);
        setLoading(false);
      } catch (err) {
        setError('ポケモンリストの取得に失敗しました');
        setLoading(false);
      }
    };
    
    loadAllPokemonList();
  }, []);
  
  // Step 2: 全ポケモンの詳細を段階的に取得（バックグラウンド）
  useEffect(() => {
    if (allPokemonList.length === 0) return;
    
    const loadAllDetails = async () => {
      try {
        setDetailsLoading(true);
        // 最初の100件を優先取得
        const firstBatch = await fetchPokemonDetails(allPokemonList, 0, 100);
        setAllPokemonDetails(firstBatch);
        
        // 残りをバックグラウンドで取得
        for (let i = 100; i < allPokemonList.length; i += 100) {
          const batch = await fetchPokemonDetails(
            allPokemonList,
            i,
            Math.min(i + 100, allPokemonList.length)
          );
          setAllPokemonDetails(prev => [...prev, ...batch]);
        }
        setDetailsLoading(false);
      } catch (err) {
        console.error('詳細データの取得中にエラー:', err);
        setDetailsLoading(false);
      }
    };
    
    loadAllDetails();
  }, [allPokemonList]);
  
  // Step 3: フィルタリング + 検索
  const filteredPokemons = useMemo(() => {
    if (allPokemonDetails.length === 0) return [];
    
    let result = allPokemonDetails;
    
    // 検索フィルタを適用
    if (searchTerm && searchTerm.trim() !== '') {
      result = searchPokemons(result, searchTerm);
    }
    
    // フィルタ条件を適用
    if (filterConditions) {
      result = filterPokemons(result, filterConditions);
    }
    
    return result;
  }, [allPokemonDetails, filterConditions, searchTerm]);
  
  // Step 4: 現在のページに表示するポケモンを切り出し
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedPokemons(filteredPokemons.slice(startIndex, endIndex));
  }, [filteredPokemons, currentPage, itemsPerPage]);
  
  return {
    displayedPokemons,
    totalCount: filteredPokemons.length,
    totalPokemonCount: allPokemonList.length,
    loading,
    detailsLoading,
    error,
    allPokemonDetails
  };
};

// 詳細ページ用のカスタムフック
export const usePokemonDetail = (pokemonId) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemonId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPokemonFullDetails(pokemonId);
        setPokemon(data);
      } catch (err) {
        setError('ポケモン詳細の取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [pokemonId]);

  return { pokemon, loading, error };
};