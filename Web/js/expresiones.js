    export let currentWorld = '';
    export let currentLevel = 1;
    export let points = 0;
    export let failures = 0;
    export let maxFailures = 3;
    export let currentPattern = null;
    export let currentRegex = null;
    export let patternDescription1 = '';
    
    // Constantes
    export const POINTS_PER_LEVEL = 10;
    export const MAX_LEVEL = 10;
    export const LEVELS_TO_WIN = 10;
    
    // Definición de patrones por mundo
    export const patterns = {
      vocals: [
        { regex: /^[aeiou]{2,4}$/, description: "Palabras con 2-4 vocales consecutivas (ej: 'ae', 'aio')" },
        { regex: /^.*[aeiou]{3}.*$/, description: "Palabras con 3 vocales consecutivas en cualquier posición (ej: 'caer', 'poeta')" },
        { regex: /^[^aeiou]*[aeiou][^aeiou]*[aeiou][^aeiou]*$/, description: "Palabras con exactamente 2 vocales (ej: 'casa', 'pelo')" },
        { regex: /^.*[aeiouáéíóú].*[aeiouáéíóú].*[aeiouáéíóú].*$/, description: "Palabras con al menos 3 vocales (ej: 'amigo', 'botella')" },
        { regex: /^[^aeiou]*[aeiou][^aeiou]*[aeiou][^aeiou]*[aeiou][^aeiou]*$/, description: "Palabras con exactamente 3 vocales (ej: 'teléfono', 'camino')" },
        { regex: /^.*[aeiou]{2}.*[aeiou]{2}.*$/, description: "Palabras con dos pares de vocales consecutivas (ej: 'aeropuerto')" },
        { regex: /^.*[aeio][aeio].*$/, description: "Palabras con vocales consecutivas que no incluyan la 'u' (ej: 'maestro')" },
        { regex: /^[aeiou].*[aeiou]$/, description: "Palabras que empiezan y terminan con vocal (ej: 'amigo', 'estrella')" },
        { regex: /^[^aeiou].*[aeiou]$/, description: "Palabras que empiezan con consonante y terminan con vocal (ej: 'casa', 'techo')" },
        { regex: /^[aeiou].*[^aeiou]$/, description: "Palabras que empiezan con vocal y terminan con consonante (ej: 'árbol', 'animal')" },
        { regex: /^.*[aeu][aeu].*$/, description: "Palabras con 'a', 'e' o 'u' consecutivas (ej: 'maestra', 'reencuentro')" },
        { regex: /^.*[aeiou]{4}.*$/, description: "Palabras con 4 vocales consecutivas (ej: 'aeiou')" }
      ],
      consonants: [
        { regex: /^.*[bcdfghjklmnñpqrstvwxyz]{2}.*$/, description: "Palabras con al menos 2 consonantes consecutivas (ej: 'blanco', 'triste')" },
        { regex: /^.*[bcdfghjklmnñpqrstvwxyz]{3}.*$/, description: "Palabras con al menos 3 consonantes consecutivas (ej: 'transporte')" },
        { regex: /^[bcdfghjklmnñpqrstvwxyz].*$/, description: "Palabras que empiezan con consonante (ej: 'casa', 'libro')" },
        { regex: /^.*[bcdfghjklmnñpqrstvwxyz]$/, description: "Palabras que terminan con consonante (ej: 'reloj', 'animal')" },
        { regex: /^[bcdfghjklmnñpqrstvwxyz].*[bcdfghjklmnñpqrstvwxyz]$/, description: "Palabras que empiezan y terminan con consonante (ej: 'salud', 'reloj')" },
        { regex: /^.*[nñ][bcdfghjklmñpqrstvwxyz].*$/, description: "Palabras con 'n' o 'ñ' seguidas de otra consonante (ej: 'antes', 'canto')" },
        { regex: /^.*[bpv][lr].*$/, description: "Palabras con 'b', 'p' o 'v' seguidas de 'l' o 'r' (ej: 'brazo', 'plato')" },
        { regex: /^.*[td][lr].*$/, description: "Palabras con 't' o 'd' seguidas de 'l' o 'r' (ej: 'tren', 'drama')" },
        { regex: /^.*[ckg][lr].*$/, description: "Palabras con 'c', 'k' o 'g' seguidas de 'l' o 'r' (ej: 'gramo', 'clase')" },
        { regex: /^.*[szc]t.*$/, description: "Palabras con 's', 'z' o 'c' seguidas de 't' (ej: 'estación', 'azteca')" },
        { regex: /^[^aeiou]+$/, description: "Palabras sin vocales (ej: abreviaturas como 'Sr', 'Dr')" },
        { regex: /^.*[mñnl][bcdfghjklmñpqrstvwxyz]{2}.*$/, description: "Palabras con 'm', 'ñ', 'n' o 'l' seguidas de dos consonantes (ej: 'transformar')" }
      ],
      tildes: [
        { regex: /^.*[áéíóú].*$/, description: "Palabras con al menos una vocal con tilde (ej: 'árbol', 'café')" },
        { regex: /^.*[áéíóú].*[áéíóú].*$/, description: "Palabras con al menos dos vocales con tilde (ej: 'démosté')" },
        { regex: /^[áéíóú].*$/, description: "Palabras que empiezan con vocal tildada (ej: 'álbum', 'éramos')" },
        { regex: /^.*[áéíóú]$/, description: "Palabras que terminan con vocal tildada (ej: 'café', 'menú')" },
        { regex: /^.*á.*$/, description: "Palabras con 'á' (ej: 'árbol', 'cámara')" },
        { regex: /^.*é.*$/, description: "Palabras con 'é' (ej: 'café', 'éxito')" },
        { regex: /^.*í.*$/, description: "Palabras con 'í' (ej: 'río', 'país')" },
        { regex: /^.*ó.*$/, description: "Palabras con 'ó' (ej: 'canción', 'avión')" },
        { regex: /^.*ú.*$/, description: "Palabras con 'ú' (ej: 'menú', 'música')" },
        { regex: /^.*á.*é.*$/, description: "Palabras con 'á' y 'é' (ej: 'cátedra')" },
        { regex: /^[áéíóú].*[áéíóú]$/, description: "Palabras que empiezan y terminan con vocal tildada (ej: 'íntimoÁ')" },
        { regex: /^.*[áéíóú][bcdfghjklmnñpqrstvwxyz][áéíóú].*$/, description: "Palabras con vocal tildada + consonante + vocal tildada (ej: 'estábámos')" }
      ]
    };