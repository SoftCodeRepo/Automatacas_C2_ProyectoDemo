let currentPattern = "";
let points = 0;
let currentLevel = 1;
let selectedWorld = "vocal-world";
let currentDifficulty = "easy"; // La dificultad ahora se actualiza automáticamente

// Componentes básicos para construir expresiones regulares
const regexComponents = {
  "vocal-world": {
    characters: ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"],
    quantifiers: ["{2,}", "{3,}", "{4,}", "{2,4}", "{3,5}"],
    anchors: ["^", "$"],
    extras: ["[0-9]*", "[0-9]+", "[0-9]{1,2}"]
  },
  "consonant-world": {
    characters: ["b-d", "f-h", "j-n", "p-t", "v-z", "B-D", "F-H", "J-N", "P-T", "V-Z"],
    quantifiers: ["{3,}", "{4,}", "{5,}", "{3,5}", "{4,6}"],
    anchors: ["^", "$"],
    extras: ["[0-9]*", "[0-9]+", "[!@#$%^&*()]+"]
  },
  "tilde-world": {
    characters: ["a-z", "A-Z", "áéíóú", "ÁÉÍÓÚ"],
    quantifiers: ["{1,}", "{2,}", "{3,}", "{4,}", "{5,}", "{6,}"],
    anchors: ["^", "$"],
    extras: ["[!@#$%^&*()]*", "[!@#$%^&*()]+", "[0-9]*", "[0-9]+"]
  }
};

// Definición de niveles y dificultades
const difficultyLevels = {
  easy: { maxLevel: 3, color: "#27ae60" },
  medium: { maxLevel: 6, color: "#f39c12" },
  hard: { maxLevel: 9, color: "#e74c3c" },
  expert: { maxLevel: 12, color: "#8e44ad" }
};

// Función para seleccionar aleatoriamente un elemento de un array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Actualiza la dificultad basándose en el nivel actual
function updateDifficultyByLevel() {
  if (currentLevel <= difficultyLevels.easy.maxLevel) {
    currentDifficulty = "easy";
  } else if (currentLevel <= difficultyLevels.medium.maxLevel) {
    currentDifficulty = "medium";
  } else if (currentLevel <= difficultyLevels.hard.maxLevel) {
    currentDifficulty = "hard";
  } else {
    currentDifficulty = "expert";
  }
  
  // Actualiza el indicador de dificultad en la interfaz
  updateDifficultyIndicator();
}

// Actualiza el indicador visual de dificultad
function updateDifficultyIndicator() {
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

// Función para generar una expresión regular aleatoria basada en el mundo y nivel
function generateRandomPattern(world, level) {
  const components = regexComponents[world];
  
  // Ajusta la complejidad basada en el nivel actual y la dificultad
  let complexity = Math.min(level, 5); // Máximo 5 niveles de complejidad base
  
  // Modificadores basados en la dificultad
  switch(currentDifficulty) {
    case "easy":
      complexity = Math.max(1, Math.min(2, complexity));
      break;
    case "medium":
      complexity = Math.max(2, Math.min(3, complexity));
      break;
    case "hard":
      complexity = Math.max(3, Math.min(4, complexity));
      break;
    case "expert":
      complexity = Math.max(4, complexity);
      break;
  }
  
  let pattern = "";
  
  // En dificultades fáciles y medias, siempre usar anclas
  if (currentDifficulty === "easy" || currentDifficulty === "medium" || Math.random() < 0.7) {
    pattern += "^";
  }
  
  // Construir el patrón principal
  pattern += "[";
  
  // Añadir caracteres según el mundo
  const charCount = Math.min(complexity, components.characters.length);
  const selectedChars = [];
  
  for (let i = 0; i < charCount; i++) {
    let char = getRandomElement(components.characters);
    // Evitar duplicados
    while (selectedChars.includes(char)) {
      char = getRandomElement(components.characters);
    }
    selectedChars.push(char);
    pattern += char;
  }
  
  pattern += "]";
  
  // Añadir cuantificador
  let quantifierIndex = Math.min(complexity - 1, components.quantifiers.length - 1);
  if (quantifierIndex < 0) quantifierIndex = 0;
  pattern += components.quantifiers[quantifierIndex];
  
  // Añadir extras basados en la dificultad
  if ((currentDifficulty === "hard" || currentDifficulty === "expert") && Math.random() < 0.7) {
    pattern += getRandomElement(components.extras);
  } else if (currentDifficulty === "medium" && Math.random() < 0.3) {
    pattern += getRandomElement(components.extras);
  }
  
  // En dificultades fáciles y medias, siempre usar anclas
  if (currentDifficulty === "easy" || currentDifficulty === "medium" || Math.random() < 0.7) {
    pattern += "$";
  }
  
  return pattern;
}

// Generar descripciones para los patrones
function generatePatternDescription(pattern, world) {
  let description = "Busca palabras que ";
  
  if (pattern.includes("^") && pattern.includes("$")) {
    description += "coincidan exactamente con ";
  } else if (pattern.includes("^")) {
    description += "comiencen con ";
  } else if (pattern.includes("$")) {
    description += "terminen con ";
  } else {
    description += "contengan ";
  }
  
  if (world === "vocal-world") {
    if (pattern.includes("[aeiou]") || pattern.includes("[aeiouAEIOU]")) {
      description += "vocales";
    } else if (pattern.includes("[aeiou") && !pattern.includes("AEIOU")) {
      description += "vocales minúsculas";
    } else if (pattern.includes("AEIOU")) {
      description += "vocales (mayúsculas o minúsculas)";
    }
  } else if (world === "consonant-world") {
    description += "consonantes";
    if (pattern.includes("B-D") || pattern.includes("F-H")) {
      description += " (mayúsculas o minúsculas)";
    }
  } else if (world === "tilde-world") {
    description += "letras";
    if (pattern.includes("áéíóú") || pattern.includes("ÁÉÍÓÚ")) {
      description += " que pueden incluir tildes";
    }
  }
  
  // Añadir información sobre la longitud
  if (pattern.includes("{")) {
    const lengthMatch = pattern.match(/{(\d+),(\d*)?}/);
    if (lengthMatch) {
      const min = lengthMatch[1];
      const max = lengthMatch[2];
      if (max) {
        description += ` de ${min} a ${max} caracteres`;
      } else {
        description += ` de al menos ${min} caracteres`;
      }
    }
  }
  
  // Añadir información sobre caracteres adicionales
  if (pattern.includes("[0-9]")) {
    description += " y pueden incluir números";
  }
  if (pattern.includes("[!@#$%^&*()]")) {
    description += " y pueden incluir símbolos especiales";
  }
  
  return description;
}

function displayPattern(pattern) {
  document.getElementById("pattern-display").textContent = pattern;
}

function displayPatternDescription(pattern) {
  const description = generatePatternDescription(pattern, selectedWorld);
  document.getElementById("pattern-description").textContent = description;
}

function displayLevelInfo() {
  // Crear o actualizar el indicador de nivel
  let levelIndicator = document.getElementById("level-indicator");
  if (!levelIndicator) {
    levelIndicator = document.createElement("div");
    levelIndicator.id = "level-indicator";
    
    const pointsElement = document.getElementById("points").parentNode;
    pointsElement.parentNode.insertBefore(levelIndicator, pointsElement);
  }
  
  levelIndicator.textContent = `Nivel: ${currentLevel}`;
  levelIndicator.style.fontWeight = "bold";
  levelIndicator.style.margin = "10px 0";
}

function checkAnswer() {
  const userInput = document.getElementById("user-input").value;
  
  // Validar que se ha ingresado algo
  if (!userInput.trim()) {
    document.getElementById("feedback").textContent = "Por favor, ingresa una palabra";
    document.getElementById("feedback").style.color = "#e67e22";
    return;
  }
  
  console.log("Patrón actual:", currentPattern);
  console.log("Entrada del usuario:", userInput);
  
  try {
    // Crear una expresión regular a partir del patrón
    const regex = new RegExp(currentPattern);
    console.log("Regex creada:", regex);
    
    // Comprobar si la entrada coincide con el patrón
    const isMatch = regex.test(userInput);
    console.log("¿Coincide?:", isMatch);
    
    if (isMatch) {
      points += 10;
      document.getElementById("feedback").textContent = "¡Correcto!";
      document.getElementById("feedback").style.color = "#27ae60";
      document.getElementById("points").textContent = points;
      updateProgressBar();
      // Limpiar el input para la siguiente palabra
      document.getElementById("user-input").value = "";
      document.getElementById("user-input").focus();
    } else {
      document.getElementById("feedback").textContent = "¡Incorrecto! El nivel se reiniciará.";
      document.getElementById("feedback").style.color = "#e74c3c";
      resetLevel();
      // Limpiar el input después de un error
      document.getElementById("user-input").value = "";
      document.getElementById("user-input").focus();
    }
  } catch (error) {
    console.error("Error al evaluar la expresión regular:", error);
    document.getElementById("feedback").textContent = "Error en el patrón. Generando uno nuevo...";
    document.getElementById("feedback").style.color = "#e74c3c";
    
    // Generar un nuevo patrón en caso de error
    setTimeout(() => {
      currentPattern = generateRandomPattern(selectedWorld, currentLevel);
      displayPattern(currentPattern);
      displayPatternDescription(currentPattern);
      document.getElementById("feedback").textContent = "";
    }, 2000);
  }
}

function updateProgressBar() {
  const progressBar = document.getElementById("progress");
  progressBar.style.width = `${points}%`;
  if (points >= 100) {
    currentLevel++;
    points = 0;
    document.getElementById("points").textContent = points;
    document.getElementById("feedback").textContent = "¡Nivel completado!";
    
    // Actualizar la dificultad basada en el nuevo nivel
    updateDifficultyByLevel();
    displayLevelInfo();
    
    setTimeout(() => {
      currentPattern = generateRandomPattern(selectedWorld, currentLevel);
      displayPattern(currentPattern);
      displayPatternDescription(currentPattern);
      progressBar.style.width = "0%";
      document.getElementById("feedback").textContent = "";
    }, 2000);
  }
}

function resetLevel() {
  points = 0;
  currentLevel = 1;
  currentDifficulty = "easy";
  document.getElementById("points").textContent = points;
  
  // Actualizar indicadores
  updateDifficultyByLevel();
  displayLevelInfo();
  
  currentPattern = generateRandomPattern(selectedWorld, currentLevel);
  displayPattern(currentPattern);
  displayPatternDescription(currentPattern);
  document.getElementById("progress").style.width = "0%";
}

function selectWorld(world) {
  selectedWorld = world;
  currentLevel = 1;
  points = 0;
  currentDifficulty = "easy";
  document.getElementById("points").textContent = points;
  
  // Actualizar el título del desafío
  let worldTitle = "";
  switch(world) {
    case "vocal-world": 
      worldTitle = "Desafío: Mundo de las Vocales"; 
      break;
    case "consonant-world": 
      worldTitle = "Desafío: Mundo de las Consonantes"; 
      break;
    case "tilde-world": 
      worldTitle = "Desafío: Mundo de las Tildes"; 
      break;
  }
  document.getElementById("challenge-title").textContent = worldTitle;
  
  // Actualizar indicadores
  updateDifficultyByLevel();
  displayLevelInfo();
  
  // Generar y mostrar el patrón
  currentPattern = generateRandomPattern(world, currentLevel);
  displayPattern(currentPattern);
  displayPatternDescription(currentPattern);
  
  // Mostrar la sección de desafío
  document.getElementById("world-selection").classList.add("hidden");
  document.getElementById("challenge-container").classList.remove("hidden");
}

function generateExample() {
  try {
    const regex = new RegExp(currentPattern);
    
    // Lista de ejemplos según el mundo seleccionado
    const examples = {
      "vocal-world": ["ae", "eio", "aeiou", "aeiouu", "aei123", "AEIOU", "aEiOu", "aaaaaa", "eeeee", "iiiii", "oooooo", "uuuuu"],
      "consonant-world": ["bcd", "fghjk", "bcdfg", "mnpqr", "bcd123", "BCDFG", "mnPQr", "bbbbb", "ccccc", "ddddd", "fffff", "ggggg"],
      "tilde-world": ["abc", "hola", "adiós", "España", "México", "áéíóú", "holá123", "acentuación", "árbol", "Ángel", "bebé", "café"]
    };
    
    // Filtrar ejemplos que coincidan con el patrón
    const matchingExamples = examples[selectedWorld].filter(ex => regex.test(ex));
    
    // Elemento para mostrar el ejemplo
    let exampleElement = document.getElementById("example-text");
    if (!exampleElement) {
      exampleElement = document.createElement("p");
      exampleElement.id = "example-text";
      document.getElementById("challenge-container").appendChild(exampleElement);
    }
    
    if (matchingExamples.length > 0) {
      const example = getRandomElement(matchingExamples);
      exampleElement.textContent = `Ejemplo: "${example}"`;
      exampleElement.style.color = "#27ae60";
      exampleElement.style.fontWeight = "bold";
    } else {
      // Si no hay ejemplos predefinidos, generar uno
      let example = "";
      let attempts = 0;
      const maxAttempts = 50; // Límite de intentos para evitar bucles infinitos
      
      while (attempts < maxAttempts) {
        attempts++;
        
        if (selectedWorld === "vocal-world") {
          const vowels = "aeiouAEIOU";
          const length = Math.floor(Math.random() * 5) + 2;
          example = "";
          for (let i = 0; i < length; i++) {
            example += vowels.charAt(Math.floor(Math.random() * vowels.length));
          }
        } else if (selectedWorld === "consonant-world") {
          const consonants = "bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";
          const length = Math.floor(Math.random() * 5) + 3;
          example = "";
          for (let i = 0; i < length; i++) {
            example += consonants.charAt(Math.floor(Math.random() * consonants.length));
          }
        } else if (selectedWorld === "tilde-world") {
          const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúÁÉÍÓÚ";
          const length = Math.floor(Math.random() * 7) + 3;
          example = "";
          for (let i = 0; i < length; i++) {
            example += chars.charAt(Math.floor(Math.random() * chars.length));
          }
        }
        
        // Verificar si el ejemplo generado coincide con el patrón
        if (regex.test(example)) {
          break;
        }
      }
      
      if (regex.test(example)) {
        exampleElement.textContent = `Ejemplo: "${example}"`;
        exampleElement.style.color = "#27ae60";
        exampleElement.style.fontWeight = "bold";
      } else {
        exampleElement.textContent = "No se pudo generar un ejemplo para este patrón.";
        exampleElement.style.color = "#e74c3c";
      }
    }
  } catch (error) {
    console.error("Error al generar ejemplo:", error);
    let exampleElement = document.getElementById("example-text");
    if (!exampleElement) {
      exampleElement = document.createElement("p");
      exampleElement.id = "example-text";
      document.getElementById("challenge-container").appendChild(exampleElement);
    }
    exampleElement.textContent = "Error al generar ejemplo. Generando un nuevo patrón...";
    exampleElement.style.color = "#e74c3c";
    
    // Generar un nuevo patrón en caso de error
    setTimeout(() => {
      currentPattern = generateRandomPattern(selectedWorld, currentLevel);
      displayPattern(currentPattern);
      displayPatternDescription(currentPattern);
      exampleElement.textContent = "";
    }, 2000);
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
  // Configurar eventos para los botones del mundo
  document.getElementById("vocal-world").addEventListener("click", () => selectWorld("vocal-world"));
  document.getElementById("consonant-world").addEventListener("click", () => selectWorld("consonant-world"));
  document.getElementById("tilde-world").addEventListener("click", () => selectWorld("tilde-world"));
  document.getElementById("check-btn").addEventListener("click", checkAnswer);
  
  // Añadir botón de ejemplo si no existe
  if (!document.getElementById("example-btn")) {
    const exampleBtn = document.createElement("button");
    exampleBtn.id = "example-btn";
    exampleBtn.textContent = "Mostrar Ejemplo";
    exampleBtn.className = "example-btn";
    
    // Añadir después del botón de comprobación
    const checkBtn = document.getElementById("check-btn");
    checkBtn.parentNode.insertBefore(exampleBtn, checkBtn.nextSibling);
    
    // Configurar evento para el botón de ejemplo
    exampleBtn.addEventListener("click", generateExample);
  }
  
  // Añadir contenedor para el ejemplo si no existe
  if (!document.getElementById("example-text")) {
    const exampleText = document.createElement("p");
    exampleText.id = "example-text";
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.parentNode.insertBefore(exampleText, feedbackElement);
  }
  
  // Configuración adicional para que input acepte Enter
  document.getElementById("user-input").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });
  
  // Generar primer patrón
  currentPattern = generateRandomPattern(selectedWorld, currentLevel);
  displayPattern(currentPattern);
  displayPatternDescription(currentPattern);
  
  // Mostrar nivel inicial
  displayLevelInfo();
  updateDifficultyByLevel();
});