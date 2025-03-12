import { difficultyLevels, worldExamples } from './config.js';
import { 
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
} from './gameState.js';
import { 
  generateRandomPattern, 
  generatePatternDescription, 
  generateExample 
} from './patternGenerator.js';
import { 
  displayPattern, 
  displayPatternDescription,
  displayLevelInfo,
  updateDifficultyIndicator, 
  updateProgressBar,
  showFeedback,
  clearFeedback,
  updatePointsDisplay,
  displayExample,
  updateWorldTitle,
  showChallengeContainer,
  getUserInput,
  clearUserInput
} from './ui.js';

// Actualizar la dificultad basada en el nivel actual
function updateDifficultyByLevel() {
  const currentLevel = getCurrentLevel();
  let newDifficulty = "easy";
  
  if (currentLevel <= difficultyLevels.easy.maxLevel) {
    newDifficulty = "easy";
  } else if (currentLevel <= difficultyLevels.medium.maxLevel) {
    newDifficulty = "medium";
  } else if (currentLevel <= difficultyLevels.hard.maxLevel) {
    newDifficulty = "hard";
  } else {
    newDifficulty = "expert";
  }
  
  setDifficulty(newDifficulty);
  
  // Actualiza el indicador de dificultad en la interfaz
  updateDifficultyIndicator();
}

// Verificar la respuesta del usuario
function checkAnswer() {
  const userInput = getUserInput();
  const regex = new RegExp(getCurrentPattern());
  
  if (regex.test(userInput)) {
    // Respuesta correcta
    addPoints(10);
    showFeedback(true);
    updatePointsDisplay();
    updateProgressBar();
    
    // Verificar si se completa el nivel
    if (getPoints() >= 100) {
      handleLevelComplete();
    }
  } else {
    // Respuesta incorrecta
    showFeedback(false);
    handleGameReset();
  }
  
  // Limpiar el input para la siguiente palabra
  clearUserInput();
}

// Manejar la finalización del nivel
function handleLevelComplete() {
  incrementLevel();
  resetPoints();
  
  showFeedback(true, "¡Nivel completado!");
  updatePointsDisplay();
  
  // Actualizar la dificultad basada en el nuevo nivel
  updateDifficultyByLevel();
  displayLevelInfo();
  
  // Generar nuevo patrón después de un retraso
  setTimeout(() => {
    generateAndDisplayNewPattern();
    updateProgressBar();
    clearFeedback();
  }, 2000);
}

// Manejar reinicio del juego
function handleGameReset() {
  resetGame();
  updatePointsDisplay();
  
  // Actualizar indicadores
  updateDifficultyByLevel();
  displayLevelInfo();
  
  generateAndDisplayNewPattern();
  updateProgressBar();
}

// Generar y mostrar un nuevo patrón
function generateAndDisplayNewPattern() {
  const world = getSelectedWorld();
  const level = getCurrentLevel();
  const difficulty = getCurrentDifficulty();
  
  const pattern = generateRandomPattern(world, level, difficulty);
  setCurrentPattern(pattern);
  
  displayPattern(pattern);
  const description = generatePatternDescription(pattern, world);
  displayPatternDescription(description);
}

// Iniciar desafío en un mundo específico
function selectWorld(world) {
  resetGame(world);
  setWorld(world);
  
  // Actualizar la interfaz
  updateWorldTitle(world);
  updateDifficultyByLevel();
  displayLevelInfo();
  
  // Generar y mostrar el patrón
  generateAndDisplayNewPattern();
  
  // Mostrar la sección de desafío
  showChallengeContainer();
}

// Generar y mostrar un ejemplo para el patrón actual
function showExample() {
  const pattern = getCurrentPattern();
  const world = getSelectedWorld();
  const example = generateExample(pattern, world, worldExamples);
  
  displayExample(example);
}

// Exportar funciones de lógica del juego
export {
  updateDifficultyByLevel,
  checkAnswer,
  handleLevelComplete,
  handleGameReset,
  generateAndDisplayNewPattern,
  selectWorld,
  showExample
};