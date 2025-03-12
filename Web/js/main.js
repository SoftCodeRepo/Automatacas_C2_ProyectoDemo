import { selectWorld, checkAnswer, showExample } from './gameLogic.js';

// Función principal de inicialización
function initGame() {
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
    exampleBtn.addEventListener("click", showExample);
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
}

// Ejecutar la inicialización cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", initGame);