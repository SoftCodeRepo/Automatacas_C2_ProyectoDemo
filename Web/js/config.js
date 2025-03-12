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
  
  // Ejemplos para cada mundo
  const worldExamples = {
    "vocal-world": ["ae", "eio", "aeiou", "aeiouu", "aei123", "AEIOU", "aEiOu"],
    "consonant-world": ["bcd", "fghjk", "bcdfg", "mnpqr", "bcd123", "BCDFG", "mnPQr"],
    "tilde-world": ["abc", "hola", "adiós", "España", "México", "áéíóú", "holá123"]
  };
  
  // Nombres legibles de los mundos
  const worldTitles = {
    "vocal-world": "Desafío: Mundo de las Vocales",
    "consonant-world": "Desafío: Mundo de las Consonantes",
    "tilde-world": "Desafío: Mundo de las Tildes"
  };
  
  // Exportar configuraciones
  export { regexComponents, difficultyLevels, worldExamples, worldTitles };