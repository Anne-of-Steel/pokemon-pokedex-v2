// src/components/FilterModal.jsx

import React, { useState, useEffect } from 'react';
import { TYPE_TRANSLATIONS, GENERATION_TRANSLATIONS } from '../utils/translatePokemon';
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose, initialFilters, onApplyFilters }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [heightRange, setHeightRange] = useState([0.3, 20]);
  const [weightRange, setWeightRange] = useState([1, 1000]);
  const [selectedGenerations, setSelectedGenerations] = useState([]);
  
  // 初期値を設定
  useEffect(() => {
    if (initialFilters) {
      setSelectedTypes(initialFilters.types || []);
      setHeightRange(initialFilters.heightRange || [0.3, 20]);
      setWeightRange(initialFilters.weightRange || [1, 1000]);
      setSelectedGenerations(initialFilters.generations || []);
    }
  }, [initialFilters]);
  
  // タイプの選択/解除
  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  // 世代の選択/解除
  const toggleGeneration = (generation) => {
    setSelectedGenerations(prev =>
      prev.includes(generation)
        ? prev.filter(g => g !== generation)
        : [...prev, generation]
    );
  };
  
  // フィルタをクリア
  const handleClear = () => {
    setSelectedTypes([]);
    setHeightRange([0.3, 20]);
    setWeightRange([1, 1000]);
    setSelectedGenerations([]);
  };
  
  // 検索を実行
  const handleApply = () => {
    onApplyFilters({
      types: selectedTypes,
      heightMin: heightRange[0],
      heightMax: heightRange[1],
      weightMin: weightRange[0],
      weightMax: weightRange[1],
      generations: selectedGenerations
    });
    onClose();
  };
  
  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h2>🔍 ポケモンを絞り込む</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="filter-modal-body">
          {/* タイプフィルタ */}
          <div className="filter-section">
            <h3>タイプ</h3>
            <div className="type-grid">
              {Object.entries(TYPE_TRANSLATIONS).map(([englishType, japaneseType]) => (
                <label key={englishType} className="type-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(englishType)}
                    onChange={() => toggleType(englishType)}
                  />
                  <span className={`type-badge type-${englishType}`}>
                    {japaneseType}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* 身長フィルタ */}
          <div className="filter-section">
            <h3>身長</h3>
            <div className="range-slider">
              <input
                type="range"
                min="0.3"
                max="20"
                step="0.1"
                value={heightRange[0]}
                onChange={(e) => setHeightRange([parseFloat(e.target.value), heightRange[1]])}
              />
              <input
                type="range"
                min="0.3"
                max="20"
                step="0.1"
                value={heightRange[1]}
                onChange={(e) => setHeightRange([heightRange[0], parseFloat(e.target.value)])}
              />
              <p>{heightRange[0]}m - {heightRange[1]}m</p>
            </div>
          </div>
          
          {/* 体重フィルタ */}
          <div className="filter-section">
            <h3>体重</h3>
            <div className="range-slider">
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={weightRange[0]}
                onChange={(e) => setWeightRange([parseInt(e.target.value), weightRange[1]])}
              />
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={weightRange[1]}
                onChange={(e) => setWeightRange([weightRange[0], parseInt(e.target.value)])}
              />
              <p>{weightRange[0]}kg - {weightRange[1]}kg</p>
            </div>
          </div>
          
          {/* 出現シリーズフィルタ（ORロジック） */}
          <div className="filter-section">
            <h3>出現シリーズ（いずれかに該当）</h3>
            <div className="generation-list">
              {Object.entries(GENERATION_TRANSLATIONS).map(([key, value]) => (
                <label key={key} className="generation-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedGenerations.includes(key)}
                    onChange={() => toggleGeneration(key)}
                  />
                  <span>{value.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="filter-modal-footer">
          <button className="clear-button" onClick={handleClear}>
            クリア
          </button>
          <button className="apply-button" onClick={handleApply}>
            検索実行
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
