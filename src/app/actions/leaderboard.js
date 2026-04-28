'use server';

import { sql, createTableIfNotExists } from '@/lib/db';
import { revalidatePath } from 'next/cache';

function isGameLeaderboardId(gameId) {
  return (
    typeof gameId === 'string' &&
    ['trivia', 'badge', 'player-clues', 'world-flag', 'world-sprint', 'player-photo'].some((prefix) =>
      gameId.startsWith(prefix)
    )
  );
}

function normalizeGameStats(gameId, gameStats) {
  if (!isGameLeaderboardId(gameId)) return null;
  if (!gameStats || typeof gameStats !== 'object' || Array.isArray(gameStats)) return null;

  const result = {};
  const allowedNumericKeys = [
    'rounds',
    'answered',
    'correct',
    'wrong',
    'bestStreak',
    'livesLeft',
    'timeLeft',
  ];

  allowedNumericKeys.forEach((key) => {
    const value = gameStats[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      result[key] = Math.max(0, Math.round(value));
    }
  });

  return Object.keys(result).length > 0 ? result : null;
}

// Guarda la puntuación de un minijuego en la base de datos Neon (PostgreSQL).
export async function submitScore(
  playerName,
  gameId,
  score,
  completedInSeconds = null,
  gameStats = null
) {
  if (!sql) {
    return { success: false, message: 'Base de datos no configurada.' };
  }

  // Prevenir nombres vacíos y hacer control de longitud
  const finalName = playerName?.trim() ? playerName.trim().substring(0, 30) : 'Anónimo';
  const normalizedStats = normalizeGameStats(gameId, gameStats);
  const serializedStats = normalizedStats ? JSON.stringify(normalizedStats) : null;

  try {
    await createTableIfNotExists(); // Garantizamos que la tabla exista

    await sql`
      INSERT INTO leaderboards (player_name, game_id, score, completed_in_seconds, stats_json)
      VALUES (${finalName}, ${gameId}, ${score}, ${completedInSeconds}, ${serializedStats}::jsonb);
    `;

    // Revalidamos la ruta para que todos los usuarios vean los datos frescos al instante
    revalidatePath('/juegos');

    return { success: true };
  } catch (error) {
    console.error('Error insertando score:', error);
    return { success: false, message: 'Error de conexión con la base de datos.' };
  }
}

// Obtiene los 10 mejores puntajes para un juego específico
export async function getLeaderboard(gameId) {
  if (!sql) return [];

  try {
    await createTableIfNotExists(); // Garantizamos que la tabla exista

    const rows = await sql`
      SELECT player_name, score, completed_in_seconds, stats_json, created_at
      FROM leaderboards
      WHERE game_id = ${gameId}
      ORDER BY score DESC, completed_in_seconds ASC, created_at DESC
      LIMIT 10;
    `;
    return rows;
  } catch (error) {
    console.error('Error obteniendo leaderboard para', gameId, ':', error);
    return [];
  }
}
