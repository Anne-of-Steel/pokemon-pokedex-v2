// src/utils/translatePokemon.js

// タイプの日本語マッピング
export const TYPE_TRANSLATIONS = {
  normal: 'ノーマル',
  fire: 'ほのお',
  water: 'みず',
  electric: 'でんき',
  grass: 'くさ',
  ice: 'こおり',
  fighting: 'かくとう',
  poison: 'どく',
  ground: 'じめん',
  flying: 'ひこう',
  psychic: 'エスパー',
  bug: 'むし',
  rock: 'いわ',
  ghost: 'ゴースト',
  dragon: 'ドラゴン',
  dark: 'あく',
  steel: 'はがね',
  fairy: 'フェアリー'
};

// タイプを日本語に変換
export const translateType = (englishType) => {
  return TYPE_TRANSLATIONS[englishType] || englishType;
};

// 能力値の日本語マッピング
export const STAT_TRANSLATIONS = {
  hp: 'HP',
  attack: 'こうげき',
  defense: 'ぼうぎょ',
  'special-attack': 'とくこう',
  'special-defense': 'とくぼう',
  speed: 'すばやさ'
};

// 能力値を日本語に変換
export const translateStat = (englishStat) => {
  return STAT_TRANSLATIONS[englishStat] || englishStat;
};

// 世代・ゲームタイトルの日本語マッピング（v3仕様書準拠）
export const GENERATION_TRANSLATIONS = {
  'generation-i': {
    label: '第1世代: 赤・緑・青・ピカチュウ',
    games: ['red', 'green', 'blue', 'yellow'],
    gamesJa: ['赤', '緑', '青', 'ピカチュウ']
  },
  'generation-ii': {
    label: '第2世代: 金・銀・クリスタル',
    games: ['gold', 'silver', 'crystal'],
    gamesJa: ['金', '銀', 'クリスタル']
  },
  'generation-iii': {
    label: '第3世代: ルビー・サファイア・エメラルド',
    games: ['ruby', 'sapphire', 'emerald', 'firered', 'leafgreen'],
    gamesJa: ['ルビー', 'サファイア', 'エメラルド', 'ファイアレッド', 'リーフグリーン']
  },
  'generation-iv': {
    label: '第4世代: ダイヤモンド・パール・プラチナ',
    games: ['diamond', 'pearl', 'platinum', 'heartgold', 'soulsilver'],
    gamesJa: ['ダイヤモンド', 'パール', 'プラチナ', 'ハートゴールド', 'ソウルシルバー']
  },
  'generation-v': {
    label: '第5世代: ブラック・ホワイト',
    games: ['black', 'white', 'black-2', 'white-2'],
    gamesJa: ['ブラック', 'ホワイト', 'ブラック2', 'ホワイト2']
  },
  'generation-vi': {
    label: '第6世代: X・Y',
    games: ['x', 'y', 'omega-ruby', 'alpha-sapphire'],
    gamesJa: ['X', 'Y', 'オメガルビー', 'アルファサファイア']
  },
  'generation-vii': {
    label: '第7世代: サン・ムーン',
    games: ['sun', 'moon', 'ultra-sun', 'ultra-moon'],
    gamesJa: ['サン', 'ムーン', 'ウルトラサン', 'ウルトラムーン']
  },
  'generation-viii': {
    label: '第8世代: ソード・シールド',
    games: ['sword', 'shield', 'brilliant-diamond', 'shining-pearl', 'legends-arceus'],
    gamesJa: ['ソード', 'シールド', 'ブリリアントダイヤモンド', 'シャイニングパール', 'LEGENDS アルセウス']
  },
  'generation-ix': {
    label: '第9世代: スカーレット・バイオレット',
    games: ['scarlet', 'violet'],
    gamesJa: ['スカーレット', 'バイオレット']
  }
};

// 世代名から日本語ラベルを取得
export const getGenerationLabel = (generationName) => {
  return GENERATION_TRANSLATIONS[generationName]?.label || generationName;
};

// ゲーム名を日本語に変換
export const translateGameName = (gameName) => {
  for (const gen of Object.values(GENERATION_TRANSLATIONS)) {
    const index = gen.games.indexOf(gameName);
    if (index !== -1) {
      return gen.gamesJa[index];
    }
  }
  return gameName;
};

// タイプの色を取得
export const getTypeColor = (typeName) => {
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
