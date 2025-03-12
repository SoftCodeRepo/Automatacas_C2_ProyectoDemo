// Estado global del juego
let gameState = {
    currentPattern: "",
    points: 0,
    currentLevel: 1,
    selectedWorld: "vocal-world",
    currentDifficulty: "easy"
  };
  
  // Funciones para manipular el estado del juego
  function setCurrentPattern(pattern) {
    gameState.currentPattern = pattern;
  }
  
  function getCurrentPattern() {
    return gameState.currentPattern;
  }
  
  function addPoints(points) {
    gameState.points += points;
    return gameState.points;
  }
  
  function resetPoints() {
    gameState.points = 0;
    return gameState.points;
  }
  
  function getPoints() {
    return gameState.points;
  }
  
  function incrementLevel() {
    gameState.currentLevel++;
    return gameState.currentLevel;
  }
  
  function resetLevel() {
    gameState.currentLevel = 1;
    return gameState.currentLevel;
  }
  
  function getCurrentLevel() {
    return gameState.currentLevel;
  }
  
  function setWorld(world) {
    gameState.selectedWorld = world;
    return gameState.selectedWorld;
  }
  
  function getSelectedWorld() {
    return gameState.selectedWorld;
  }
  
  function setDifficulty(difficulty) {
    gameState.currentDifficulty = difficulty;
    return gameState.currentDifficulty;
  }
  
  function getCurrentDifficulty() {
    return gameState.currentDifficulty;
  }
  
  // Función para restablecer completamente el juego para un mundo
  function resetGame(world) {
    gameState.currentLevel = 1;
    gameState.points = 0;
    gameState.currentDifficulty = "easy";
    
    if (world) {
      gameState.selectedWorld = world;
    }
    
    return { ...gameState };
  }
  
  // Exportar funciones de estado
  export {
    gameState,
    setCurrentPattern,
    getCurrentPattern,
    addPoints,
    resetPoints,
    getPoints,
    incrementLevel,
    resetLevel,
    getCurrentLevel,
    setWorld,
    getSelectedWorld,
    setDifficulty,
    getCurrentDifficulty,
    resetGame
  };