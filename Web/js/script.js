import { patterns } from './expresiones.js';

/**
 * @typedef {Object} Usuario
 * @property {string} nombre
 * 
 * @typedef {Object} Datos
 * @property {string?} nombreUsuario - El nombre del usuario.
 * @property {string?} currentWorld - El mundo actual en el que está el usuario.
 * @property {number?} currentLevel - El nivel actual del usuario.
 * @property {number?} points - Los puntos acumulados por el usuario.
 * @property {number?} failures - El número de fallos del usuario.
 * @property {Date?} lastPlayed - La última vez que el usuario jugó.
 * @property {string[]?} worldProgress - Los mundos que ha completado el usuario.
 */

/**
 * @param {string} nombre
 * @returns {{usuario:Usuario, datos:Datos, success: boolean, message: string} | null}
 */
async function getUsuario(nombre) {
  const response = await fetch('http://localhost:9000/usuarios', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre })
  });
  if (!response.ok) {
      return null;
  }
  const parsedResponse = await response.json();
  return parsedResponse;
}

/**
* @param {Usuario} usuario
* @returns {{ success:boolean, message: string } | null} 
*/
async function postUsuario(usuario) {
  const response = await fetch('http://localhost:9000/usuarios/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
  });
  if (!response.ok) {
      return null;
  }
  const parsedResponse = await response.json();
  return parsedResponse;
}

/**
* solo nombre es obligatorio, el resto es opcional, los datos van todos en un json
* @param {string} nombre 
* @param {{
*  currentWorld:string?, currentLevel:number?, points:number?, failures: number?, lastPlayed: Date?, worldProgress: string[]?
* }} data 
* @returns {{success:boolean, message: string} | null}
*/
async function putUsuario(nombre, data) {
  data = data !== undefined ? data : {};
  const response = await fetch('http://localhost:9000', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, args: {...data} })
  });
  if (!response.ok) {
      return null;
  }
  const parsedResponse = await response.json();
  return parsedResponse;
}

document.addEventListener('DOMContentLoaded', () => {
    const worldSelection = document.getElementById('world-selection');
    const challengeContainer = document.getElementById('challenge-container');
    const challengeTitle = document.getElementById('challenge-title');
    const patternDescription = document.getElementById('pattern-description');
    const patternDisplay = document.getElementById('pattern-display');
    const userInput = document.getElementById('user-input');
    const checkBtn = document.getElementById('check-btn');
    const feedback = document.getElementById('feedback');
    const pointsDisplay = document.getElementById('points');
    const progressBar = document.getElementById('progress');
    
    const vocalWorldBtn = document.getElementById('vocal-world');
    const consonantWorldBtn = document.getElementById('consonant-world');
    const tildeWorldBtn = document.getElementById('tilde-world');
    let currentWorld = '';
    let currentLevel = 1;
    let points = 0;
    let failures = 0;
    let maxFailures = 3;
    let currentPattern = null;
    let currentRegex = null;

    const POINTS_PER_LEVEL = 10;
    const MAX_LEVEL = 10;
    const LEVELS_TO_WIN = 10;

    loadGameData();
    
    displaySavedProgress();
    
    // Inicializar eventos de selección de mundo
    vocalWorldBtn.addEventListener('click', () => startWorld('vocals'));
    consonantWorldBtn.addEventListener('click', () => startWorld('consonants'));
    tildeWorldBtn.addEventListener('click', () => startWorld('tildes'));
    
    // Evento para comprobar la respuesta del usuario
    checkBtn.addEventListener('click', checkAnswer);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        checkAnswer();
      }
    });
    
    // Función para cargar datos del juego desde localStorage
    function loadGameData() {
      const savedData = JSON.parse(localStorage.getItem('elViajeData')) || {};
      
      if (savedData.currentWorld) {
        currentWorld = savedData.currentWorld;
        currentLevel = savedData.currentLevel || 1;
        points = savedData.points || 0;
        failures = savedData.failures || 0;
        
        // Añadir datos de progreso por mundo si existen
        if (savedData.worldProgress) {
          updateWorldProgressButtons(savedData.worldProgress);
        }
      }
    }
    
    // Función para guardar datos del juego en localStorage
    function saveGameData() {
      // Obtener progreso de mundos completados
      const worldProgress = JSON.parse(localStorage.getItem('elViajeData'))?.worldProgress || {
        vocals: false,
        consonants: false,
        tildes: false
      };
      
      // Actualizar progreso del mundo actual si se ha completado
      if (currentLevel > LEVELS_TO_WIN) {
        worldProgress[currentWorld] = true;
      }
      
      const gameData = {
        currentWorld,
        currentLevel,
        points,
        failures,
        lastPlayed: new Date().toISOString(),
        worldProgress
      };
      
      localStorage.setItem('elViajeData', JSON.stringify(gameData));
    }
    
    // Función para mostrar el progreso guardado
    function displaySavedProgress() {
      if (currentWorld && currentLevel > 1) {
        // Mostrar banner de progreso guardado
        const savedProgressBanner = document.createElement('div');
        savedProgressBanner.className = 'saved-progress';
        savedProgressBanner.innerHTML = `
          <p>¡Tienes progreso guardado en ${getWorldTitle()}!</p>
          <p>Nivel: ${currentLevel} - Puntos: ${points}</p>
          <div class="banner-buttons">
            <button id="continue-btn">Continuar</button>
            <button id="new-game-btn">Nuevo Juego</button>
          </div>
        `;
        
        worldSelection.prepend(savedProgressBanner);
        
        // Añadir estilos para el banner
        const style = document.createElement('style');
        style.textContent = `
          .saved-progress {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .banner-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
          }
          .banner-buttons button {
            padding: 8px 16px;
            font-size: 1em;
            width: auto;
          }
        `;
        document.head.appendChild(style);
        
        // Añadir eventos a los botones
        document.getElementById('continue-btn').addEventListener('click', () => {
          startWorld(currentWorld, true); // true indica que es continuación
        });
        
        document.getElementById('new-game-btn').addEventListener('click', () => {
          if (confirm('¿Estás seguro de que quieres comenzar un nuevo juego? Se perderá tu progreso actual.')) {
            resetGameProgress();
            savedProgressBanner.remove();
          }
        });
      }
    }
    
    // Función para actualizar los botones de mundo con indicadores de progreso
    function updateWorldProgressButtons(worldProgress) {
      if (worldProgress.vocals) {
        addCompletedBadge(vocalWorldBtn);
      }
      
      if (worldProgress.consonants) {
        addCompletedBadge(consonantWorldBtn);
      }
      
      if (worldProgress.tildes) {
        addCompletedBadge(tildeWorldBtn);
      }
      
      // Comprobar si todos los mundos están completados
      if (worldProgress.vocals && worldProgress.consonants && worldProgress.tildes) {
        showAllWorldsCompletedMessage();
      }
    }
    
    // Función para añadir insignia de completado a un botón
    function addCompletedBadge(button) {
      // Crear estilo para la insignia si no existe
      if (!document.getElementById('badge-style')) {
        const badgeStyle = document.createElement('style');
        badgeStyle.id = 'badge-style';
        badgeStyle.textContent = `
          .world-btn.completed:after {
            content: "✓";
            display: inline-block;
            margin-left: 10px;
            background: #2ecc71;
            color: white;
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 50%;
            font-size: 0.8em;
          }
        `;
        document.head.appendChild(badgeStyle);
      }
      
      button.classList.add('completed');
    }
    
    // Función para mostrar mensaje de todos los mundos completados
    function showAllWorldsCompletedMessage() {
      const completionBanner = document.createElement('div');
      completionBanner.className = 'all-completed';
      completionBanner.innerHTML = `
        <h2>¡Felicidades! Has completado todos los mundos</h2>
        <p>Eres un maestro de las palabras</p>
        <button id="reset-all-btn">Reiniciar Todos los Mundos</button>
      `;
      
      worldSelection.prepend(completionBanner);
      
      // Añadir estilos para el banner
      const style = document.createElement('style');
      style.textContent = `
        .all-completed {
          background: linear-gradient(135deg, #f1c40f, #f39c12);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        #reset-all-btn {
          background: linear-gradient(135deg, #3498db, #2980b9);
          margin-top: 15px;
        }
      `;
      document.head.appendChild(style);
      
      // Añadir evento al botón de reinicio
      document.getElementById('reset-all-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso?')) {
          localStorage.removeItem('elViajeData');
          location.reload();
        }
      });
    }
    
    // Función para resetear el progreso del juego
    function resetGameProgress() {
      currentWorld = '';
      currentLevel = 1;
      points = 0;
      failures = 0;
      localStorage.removeItem('elViajeData');
    }
    
    // Función para iniciar un mundo
    function startWorld(world, isContinuation = false) {
      currentWorld = world;
      
      // Si no es continuación, reiniciar nivel y puntos
      if (!isContinuation) {
        currentLevel = 1;
        points = 0;
        failures = 0;
      }
      
      pointsDisplay.textContent = points;
      progressBar.style.width = `${(currentLevel - 1) / LEVELS_TO_WIN * 100}%`;
      
      // Cambiar la visualización
      worldSelection.classList.add('hidden');
      challengeContainer.classList.remove('hidden');
      
      // Actualizar título según el mundo seleccionado
      let worldTitle = '';
      switch(world) {
        case 'vocals':
          worldTitle = 'Mundo de las Vocales';
          break;
        case 'consonants':
          worldTitle = 'Mundo de las Consonantes';
          break;
        case 'tildes':
          worldTitle = 'Mundo de las Tildes';
          break;
      }
      
      challengeTitle.textContent = `Desafío: ${worldTitle} - Nivel ${currentLevel}`;
      
      // Generar el primer patrón
      generateRandomPattern();
      
      // Guardar estado inicial
      saveGameData();
    }
    
    // Función para generar un patrón aleatorio
    function generateRandomPattern() {
      // Seleccionar un patrón aleatorio del mundo actual
      const worldPatterns = patterns[currentWorld];
      const randomIndex = Math.floor(Math.random() * worldPatterns.length);
      currentPattern = worldPatterns[randomIndex];
      currentRegex = currentPattern.regex;
      
      // Actualizar la descripción y visualización del patrón
      patternDescription.textContent = currentPattern.description;
      patternDisplay.textContent = currentPattern.regex.toString();
      
      // Limpiar el campo de entrada y el feedback
      userInput.value = '';
      feedback.textContent = '';
      userInput.focus();
    }
    
    // Función para comprobar la respuesta del usuario
    function checkAnswer() {
      const userWord = userInput.value.trim().toLowerCase();
      
      // Comprobar si el campo está vacío
      if (!userWord) {
        feedback.textContent = 'Por favor, escribe una palabra';
        feedback.className = 'error';
        return;
      }
      
      // Comprobar si la palabra cumple con el patrón
      if (currentRegex.test(userWord)) {
        // Respuesta correcta
        handleCorrectAnswer();
      } else {
        // Respuesta incorrecta
        handleIncorrectAnswer();
      }
    }
    
    // Manejar respuesta correcta
    function handleCorrectAnswer() {
      // Aumentar puntos y actualizar visualización
      points += POINTS_PER_LEVEL;
      pointsDisplay.textContent = points;
      
      // Mostrar feedback positivo
      feedback.textContent = '¡Correcto! +' + POINTS_PER_LEVEL + ' puntos';
      feedback.className = 'success';
      
      // Actualizar la barra de progreso
      const progress = (currentLevel / LEVELS_TO_WIN) * 100;
      progressBar.style.width = `${progress}%`;
      
      // Avanzar al siguiente nivel
      currentLevel++;
      
      // Guardar progreso en localStorage
      saveGameData();
      
      // Comprobar si el jugador ha ganado
      if (currentLevel > LEVELS_TO_WIN) {
        showVictoryMessage();
        return;
      }
      
      challengeTitle.textContent = `Desafío: ${getWorldTitle()} - Nivel ${currentLevel}`;
      
      // Generar un nuevo patrón
      setTimeout(generateRandomPattern, 1000);
    }
    
    // Manejar respuesta incorrecta
    function handleIncorrectAnswer() {
      failures++;
      
      // Mostrar feedback negativo
      feedback.textContent = `Incorrecto. Intentos fallidos: ${failures}/${maxFailures}`;
      feedback.className = 'error';
      
      // Aplicar efecto de sacudida al contenedor
      challengeContainer.classList.add('shake');
      setTimeout(() => {
        challengeContainer.classList.remove('shake');
      }, 500);
      
      // Guardar el estado actual
      saveGameData();
      
      // Comprobar si el jugador ha alcanzado el máximo de fallos
      if (failures >= maxFailures) {
        // Reiniciar puntuación
        points = 0;
        pointsDisplay.textContent = points;
        failures = 0;
        
        // Mostrar mensaje de reinicio
        feedback.textContent = '¡Demasiados fallos! Puntuación reiniciada.';
        
        // Reiniciar nivel
        currentLevel = 1;
        challengeTitle.textContent = `Desafío: ${getWorldTitle()} - Nivel ${currentLevel}`;
        progressBar.style.width = '0%';
        
        // Guardar el estado reiniciado
        saveGameData();
        
        // Generar un nuevo patrón
        setTimeout(generateRandomPattern, 2000);
      }
    }
    
    // Obtener el título del mundo actual
    function getWorldTitle() {
      switch(currentWorld) {
        case 'vocals':
          return 'Mundo de las Vocales';
        case 'consonants':
          return 'Mundo de las Consonantes';
        case 'tildes':
          return 'Mundo de las Tildes';
        default:
          return '';
      }
    }
    
    // Mostrar mensaje de victoria y registrar mundo completado
    function showVictoryMessage() {
      // Actualizar progreso en localStorage
      const savedData = JSON.parse(localStorage.getItem('elViajeData')) || {};
      const worldProgress = savedData.worldProgress || {
        vocals: false,
        consonants: false,
        tildes: false
      };
      
      worldProgress[currentWorld] = true;
      savedData.worldProgress = worldProgress;
      localStorage.setItem('elViajeData', JSON.stringify(savedData));
      
      // Mostrar mensaje de victoria
      challengeContainer.innerHTML = `
        <h2>¡Felicidades! Has completado el ${getWorldTitle()}</h2>
        <p>Has ganado con ${points} puntos</p>
        <div class="victory-stats">
          <p>Nivel completado: ${LEVELS_TO_WIN}/${LEVELS_TO_WIN}</p>
          <p>Mundo desbloqueado: ${getWorldTitle()}</p>
        </div>
        <button id="return-btn">Volver al menú principal</button>
      `;
      
      // Añadir estilos para la pantalla de victoria
      const style = document.createElement('style');
      style.textContent = `
        .victory-stats {
          background: rgba(255, 255, 255, 0.2);
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        #return-btn {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          font-size: 1.2em;
          margin-top: 20px;
        }
      `;
      document.head.appendChild(style);
      
      document.getElementById('return-btn').addEventListener('click', () => {
        // Reiniciar variables del juego actual pero mantener progreso global
        currentWorld = '';
        currentLevel = 1;
        points = 0;
        failures = 0;
        
        // Volver al menú principal
        challengeContainer.classList.add('hidden');
        worldSelection.classList.remove('hidden');
        
        // Actualizar botones con insignias de mundos completados
        updateWorldProgressButtons(worldProgress);
        
        // Comprobar si todos los mundos están completados
        if (worldProgress.vocals && worldProgress.consonants && worldProgress.tildes) {
          showAllWorldsCompletedMessage();
        }
      });
    }
    
    // Añadir evento de almacenamiento para sincronizar entre pestañas
    window.addEventListener('storage', (e) => {
      if (e.key === 'elViajeData') {
        loadGameData();
      }
    });
    
    // Añadir evento de cierre de ventana para guardar datos
    window.addEventListener('beforeunload', () => {
      saveGameData();
    });
  });