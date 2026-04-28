'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard, submitScore } from '@/app/actions/leaderboard';
import styles from './Leaderboard.module.css';

const GAME_PREFIXES = ['trivia', 'badge', 'player-clues', 'world-flag', 'world-sprint', 'player-photo'];

function isGameLeaderboard(gameId) {
  return typeof gameId === 'string' && GAME_PREFIXES.some((prefix) => gameId.startsWith(prefix));
}

function formatStats(stats) {
  if (!stats) return '--';

  let normalized = stats;
  if (typeof stats === 'string') {
    try {
      normalized = JSON.parse(stats);
    } catch {
      return '--';
    }
  }

  if (typeof normalized !== 'object' || Array.isArray(normalized)) return '--';

  const values = {
    correct: Number.isFinite(normalized.correct) ? Math.round(normalized.correct) : null,
    wrong: Number.isFinite(normalized.wrong) ? Math.round(normalized.wrong) : null,
    rounds: Number.isFinite(normalized.rounds) ? Math.round(normalized.rounds) : null,
    answered: Number.isFinite(normalized.answered) ? Math.round(normalized.answered) : null,
    bestStreak: Number.isFinite(normalized.bestStreak) ? Math.round(normalized.bestStreak) : null,
    livesLeft: Number.isFinite(normalized.livesLeft) ? Math.round(normalized.livesLeft) : null,
    timeLeft: Number.isFinite(normalized.timeLeft) ? Math.round(normalized.timeLeft) : null,
  };

  const chunks = [];
  if (values.correct !== null) chunks.push(`✅ ${values.correct}`);
  if (values.wrong !== null) chunks.push(`❌ ${values.wrong}`);
  if (values.rounds !== null) chunks.push(`🎯 ${values.rounds}`);
  else if (values.answered !== null) chunks.push(`🎯 ${values.answered}`);
  if (values.bestStreak !== null) chunks.push(`🔥 ${values.bestStreak}`);
  if (values.livesLeft !== null) chunks.push(`❤️ ${values.livesLeft}`);
  if (values.timeLeft !== null) chunks.push(`⏱️ ${values.timeLeft}s`);

  return chunks.length > 0 ? chunks.join(' · ') : '--';
}

export default function Leaderboard({ gameId, currentScore, timeElapsed, currentStats }) {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const gameBoard = isGameLeaderboard(gameId);
  const showsTimeColumn = gameId?.startsWith('badge') || gameId?.startsWith('player-clues');
  const showsStatsColumn =
    gameBoard && (Boolean(currentStats) || board.some((row) => row?.stats_json));

  useEffect(() => {
    setSubmitted(false);
    setName('');
    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const fetchBoard = async () => {
    setLoading(true);
    const data = await getLeaderboard(gameId);
    setBoard(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await submitScore(name, gameId, currentScore, timeElapsed, gameBoard ? currentStats : null);
    
    if (result.success) {
      setSubmitted(true);
      await fetchBoard();
    } else {
      alert(result.message || 'Error guardando puntuación');
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.boardContainer}>
      {/* SECCIÓN DE SUBMIT SCORE */}
      {!submitted && currentScore > 0 && (
        <form className={styles.submitScoreBox} onSubmit={handleSubmit}>
          <h3 className={styles.submitTitle}>¡Guarda tu récord!</h3>
          <p className={styles.submitDesc}>Has conseguido <strong>{currentScore}</strong> puntos. Escribe tu nombre para entrar al ranking.</p>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ej. Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={25}
              required
            />
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Guardando...' : 'Publicar Récord'}
            </button>
          </div>
        </form>
      )}

      {/* SECCIÓN DEL RANKING */}
      <h3 className={styles.boardTitle}>🏆 Top 10 Mejores Jugadores</h3>
      
      {loading ? (
        <p className={styles.loading}>Cargando Ranking Global...</p>
      ) : board.length === 0 ? (
        <p className={styles.empty}>Aún no hay puntuaciones registradas. ¡Sé el primero!</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Puntos</th>
              {showsTimeColumn && <th>Tiempo Total</th>}
              {showsStatsColumn && <th>Estadisticas</th>}
            </tr>
          </thead>
          <tbody>
            {board.map((row, idx) => (
              <tr key={idx} className={idx < 3 ? styles.top3 : ''}>
                <td className={styles.rankCol}>
                  {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                </td>
                <td className={styles.playerCol}>{row.player_name}</td>
                <td className={styles.scoreCol}>{row.score}</td>
                {showsTimeColumn && (
                  <td className={styles.timeCol}>
                    {row.completed_in_seconds ? `${row.completed_in_seconds}s` : '--'}
                  </td>
                )}
                {showsStatsColumn && (
                  <td className={styles.statsCol}>{formatStats(row.stats_json)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
