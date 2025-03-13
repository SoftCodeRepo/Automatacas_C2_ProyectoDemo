/**
 * @typedef {Object} Usuario
 * @property {string} nombre - El nombre del usuario.
 * @property {string} currentWorld - El mundo actual en el que está el usuario.
 * @property {number} currentLevel - El nivel actual del usuario.
 * @property {number} points - Los puntos acumulados por el usuario.
 * @property {number} failures - El número de fallos del usuario.
 * @property {Date} lastPlayed - La última vez que el usuario jugó.
 * @property {string[]} worldProgress - Los mundos que ha completado el usuario.
 */

/**
 * @param {string} nombre
 * @returns {Usuario | null}
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
    return parsedResponse.usuario;
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
    data = data !== undefined
    const response = await fetch('http://localhost:9000', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, ...data })
    });
    if (!response.ok) {
        return null;
    }
    const parsedResponse = await response.json();
    return parsedResponse;
}