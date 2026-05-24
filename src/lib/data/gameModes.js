// Modo de juego por defecto: Mundial 2026
export const DEFAULT_GAME_MODE = 'world-cup';

export const GAME_MODES = {
  champions: {
    id: 'champions',
    label: 'Champions',
    emoji: '🏆',
    subtitle:
      'Modo clásico con preguntas históricas, escudos de clubes europeos y retos de jugadores top.',
    games: {
      trivia: {
        title: 'Maestro de Champions',
        description:
          'Trivia histórica de la UEFA Champions League para demostrar tu nivel de leyenda.',
        tags: ['📝 10 preguntas', '⏱️ Sin límite', '🏅 Ranking'],
      },
      badge: {
        title: 'Adivina el Escudo',
        description:
          'Te mostramos un escudo de club en sombras. Tienes 10 segundos para acertar.',
        tags: ['🛡️ Hasta 10 rondas', '⏱️ 10 seg c/u', '🔮 Sombras'],
      },
      playerClues: {
        title: 'Adivina el Jugador por Pistas',
        description:
          'Descubre al futbolista con pistas de posición, nacionalidad, club y más.',
        tags: ['🧩 Hasta 10 rondas', '🎯 Opciones múltiples', '🏅 Ranking'],
      },
    },
  },
  'world-cup': {
    id: 'world-cup',
    label: 'Mundial 2026',
    emoji: '🌍',
    subtitle:
      'Edición mundialista con mezcla de historia y enfoque al camino hacia el Mundial 2026.',
    games: {
      trivia: {
        title: 'Maestro del Mundial',
        description:
          'Preguntas históricas y actuales sobre Copas del Mundo y protagonistas rumbo a 2026.',
        tags: ['📝 10 preguntas', '⏱️ Sin límite', '🌎 Ranking Mundial'],
      },
      worldFlag: {
        title: 'Banderazo Mundial',
        description: 'Adivinar la selección por su bandera.',
        tags: ['🚩 Hasta 10 rondas', '⏱️ 10 seg c/u', '🌍 Banderas'],
      },
      worldSprint: {
        title: 'Sprint Mundial V/F',
        description:
          'Ronda relampago de verdadero o falso: 60 segundos y 3 vidas para sumar el maximo puntaje.',
        tags: ['⚡ 60 segundos', '❤️ 3 vidas', '🌎 Ranking Mundial'],
      },
      playerPhoto: {
        title: 'Adivina la Figura por Foto',
        description:
          'Mira la foto y elige al jugador correcto entre cuatro opciones. Tienes 3 vidas.',
        tags: ['📸 Hasta 50 rondas', '❤️ 3 vidas', '🌎 Ranking Mundial'],
      },
      playerClues: {
        title: 'Adivina la Figura Mundial',
        description:
          'Identifica jugadores de selecciones usando pistas progresivas y suma más con menos pistas.',
        tags: ['🧠 Hasta 10 rondas', '🎯 Opciones múltiples', '🌎 Ranking Mundial'],
      },
    },
  },
};

export function getGameMode(mode) {
  return GAME_MODES[mode] || GAME_MODES[DEFAULT_GAME_MODE];
}

export function getModeLeaderboardId(baseGameId, mode) {
  const safeMode = GAME_MODES[mode] ? mode : DEFAULT_GAME_MODE;
  return `${baseGameId}-${safeMode}`;
}

