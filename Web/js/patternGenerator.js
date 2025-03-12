import { regexComponents } from './config.js';

// Función para seleccionar aleatoriamente un elemento de un array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Función para generar una expresión regular aleatoria basada en el mundo y nivel
function generateRandomPattern(world, level, difficulty) {
  const components = regexComponents[world];
  
  // Ajusta la complejidad basada en el nivel actual y la dificultad
  let complexity = Math.min(level, 5); // Máximo 5 niveles de complejidad base
  
  // Modificadores basados en la dificultad
  switch(difficulty) {
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
  if (difficulty === "easy" || difficulty === "medium" || Math.random() < 0.7) {
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
  if ((difficulty === "hard" || difficulty === "expert") && Math.random() < 0.7) {
    pattern += getRandomElement(components.extras);
  } else if (difficulty === "medium" && Math.random() < 0.3) {
    pattern += getRandomElement(components.extras);
  }
  
  // En dificultades fáciles y medias, siempre usar anclas
  if (difficulty === "easy" || difficulty === "medium" || Math.random() < 0.7) {
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

// Generar un ejemplo aleatorio que coincida con el patrón
function generateExample(pattern, world, examples) {
  const regex = new RegExp(pattern);
  
  // Filtrar ejemplos que coincidan con el patrón
  const matchingExamples = examples[world].filter(ex => regex.test(ex));
  
  if (matchingExamples.length > 0) {
    return getRandomElement(matchingExamples);
  } else {
    // Si no hay ejemplos predefinidos, generar uno
    let example = "";
    if (world === "vocal-world") {
      const vowels = "aeiouAEIOU";
      const length = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < length; i++) {
        example += vowels.charAt(Math.floor(Math.random() * vowels.length));
      }
    } else if (world === "consonant-world") {
      const consonants = "bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";
      const length = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < length; i++) {
        example += consonants.charAt(Math.floor(Math.random() * consonants.length));
      }
    } else if (world === "tilde-world") {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúÁÉÍÓÚ";
      const length = Math.floor(Math.random() * 7) + 3;
      for (let i = 0; i < length; i++) {
        example += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    
    // Verificar si el ejemplo generado coincide con el patrón
    if (regex.test(example)) {
      return example;
    } else {
      return null; // Indicar que no se pudo generar un ejemplo válido
    }
  }
}

// Exportar funciones de generación
export {
  getRandomElement,
  generateRandomPattern,
  generatePatternDescription,
  generateExample
};