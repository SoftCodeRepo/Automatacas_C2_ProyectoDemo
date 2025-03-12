import { difficultyLevels, worldTitles } from './config.js';
import { getCurrentLevel, getPoints, getCurrentDifficulty } from './gameState.js';

// Mostrar el patrón en la interfaz
function displayPattern(pattern) {
  document.getElementById("pattern-display").textContent = pattern;
}

// Mostrar la descripción del patrón
function displayPatternDescription(description) {
  document.getElementById("pattern-description").textContent = description;
}

// Actualizar y mostrar la información del nivel actual
function displayLevelInfo() {
  // Crear o actualizar el indicador de nivel
  let levelIndicator = document.getElementById("level-indicator");
  if (!levelIndicator) {
    levelIndicator = document.createElement("div");
    levelIndicator.id = "level-indicator";
    
    const pointsElement = document.getElementById("points").parentNode;
    pointsElement.parentNode.insertBefore(levelIndicator, pointsElement);
  }
  
  levelIndicator.textContent = `Nivel: ${getCurrentLevel()}`;
  levelIndicator.style.fontWeight = "bold";
  levelIndicator.style.margin = "10px 0";
}

// Actualizar el indicador de dificultad en la interfaz
function updateDifficultyIndicator() {
  const currentDifficulty = getCurrentDifficulty();
  
  // Crear o actualizar el indicador de dificultad
  let difficultyIndicator = document.getElementById("difficulty-indicator");
  if (!difficultyIndicator) {
    difficultyIndicator = document.createElement("div");
    difficultyIndicator.id = "difficulty-indicator";
    
    const challengeTitle = document.getElementById("challenge-title");
    challengeTitle.parentNode.insertBefore(difficultyIndicator, challengeTitle.nextSibling);
  }
  
  // Establecer el texto y color según la dificultad actual
  let difficultyText = "Dificultad: ";
  let difficultyColor = "";
  
  switch(currentDifficulty) {
    case "easy":
      difficultyText += "Fácil";
      difficultyColor = difficultyLevels.easy.color;
      break;
    case "medium":
      difficultyText += "Media";
      difficultyColor = difficultyLevels.medium.color;
      break;
    case "hard":
      difficultyText += "Difícil";
      difficultyColor = difficultyLevels.hard.color;
      break;
    case "expert":
      difficultyText += "Experto";
      difficultyColor = difficultyLevels.expert.color;
      break;
  }
  
  difficultyIndicator.textContent = difficultyText;
  difficultyIndicator.style.color = difficultyColor;
  difficultyIndicator.style.fontWeight = "bold";
  difficultyIndicator.style.margin = "10px 0";
}

// Actualizar la barra de progreso
function updateProgressBar() {
  const progressBar = document.getElementById("progress");
  const points = getPoints();
  progressBar.style.width = `${points}%`;
}

// Mostrar retroalimentación al usuario (correcto/incorrecto)
function showFeedback(isCorrect, message) {
  const feedbackElement = document.getElementById("feedback");
  
  if (isCorrect) {
    feedbackElement.textContent = message || "¡Correcto!";
    feedbackElement.style.color = "#27ae60";
  } else {
    feedbackElement.textContent = message || "¡Incorrecto! El nivel se reiniciará.";
    feedbackElement.style.color = "#e74c3c";
  }
}

// Limpiar la retroalimentación
function clearFeedback() {
  const feedbackElement = document.getElementById("feedback");
  feedbackElement.textContent = "";
}

// Actualizar los puntos mostrados
function updatePointsDisplay() {
  document.getElementById("points").textContent = getPoints();
}

// Mostrar un ejemplo en la interfaz
function displayExample(example) {
  // Crear o actualizar el elemento para el ejemplo
  let exampleElement = document.getElementById("example-text");
  if (!exampleElement) {
    exampleElement = document.createElement("p");
    exampleElement.id = "example-text";
    document.getElementById("challenge-container").appendChild(exampleElement);
  }
  
  if (example) {
    exampleElement.textContent = `Ejemplo: "${example}"`;
  } else {
    exampleElement.textContent = "No se pudo generar un ejemplo para este patrón.";
  }
}

// Actualizar título del desafío según el mundo seleccionado
function updateWorldTitle(world) {
  document.getElementById("challenge-title").textContent = worldTitles[world];
}

// Cambiar entre la selección de mundo y la pantalla de desafío
function showWorldSelection() {
  document.getElementById("world-selection").classList.remove("hidden");
  document.getElementById("challenge-container").classList.add("hidden");
}

function showChallengeContainer() {
  document.getElementById("world-selection").classList.add("hidden");
  document.getElementById("challenge-container").classList.remove("hidden");
}

// Obtener el texto del input de usuario
function getUserInput() {
  return document.getElementById("user-input").value;
}

// Limpiar el input de usuario
function clearUserInput() {
  document.getElementById("user-input").value = "";
  document.getElementById("user-input").focus();
}

// Exportar funciones de UI
export {
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
  showWorldSelection,
  showChallengeContainer,
  getUserInput,
  clearUserInput
};