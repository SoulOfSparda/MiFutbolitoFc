'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Leaderboard from './Leaderboard';
import { getGameMode, getModeLeaderboardId } from '@/lib/data/gameModes';
import { WORLD_SPRINT_STATEMENTS } from '@/lib/data/worldSprintStatements';
import styles from './WorldSprintGame.module.css';

const GAME_DURATION_SECONDS = 60;
const START_LIVES = 3;
const ROUND_LIMIT = 12;
const FEEDBACK_DELAY_MS = 750;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRankLabel(pct) {
  if (pct >= 90) return '⚡ Relampago Mundial';
  if (pct >= 75) return '🏆 Maquina Mundialista';
  if (pct >= 50) return '🥈 Buen Ritmo';
  return '🥉 En Calentamiento';
}

export default function WorldSprintGame({ mode = 'world-cup' }) {
  const [gameState, setGameState] = useState('idle');
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [timer, setTimer] = useState(GAME_DURATION_SECONDS);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [feedbackType, setFeedbackType] = useState(null);

  const advanceTimeoutRef = useRef(null);
  const gameStateRef = useRef(gameState);
  const modeConfig = getGameMode(mode);
  const worldCupConfig = getGameMode('world-cup');
  const gameMeta = modeConfig.games.worldSprint || worldCupConfig.games.worldSprint;
  const gameId = getModeLeaderboardId('world-sprint', mode);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimer((currentTimer) => {
        const nextTimer = Math.max(0, currentTimer - 1);
        if (nextTimer === 0) {
          setGameState('finished');
        }
        return nextTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  const startGame = useCallback(() => {
    const pool = shuffle(WORLD_SPRINT_STATEMENTS).slice(0, ROUND_LIMIT);
    setRounds(pool);
    setCurrentRound(0);
    setScore(0);
    setLives(START_LIVES);
    setTimer(GAME_DURATION_SECONDS);
    setAnsweredCount(0);
    setFeedbackType(null);
    setGameState('playing');
  }, []);

  const scheduleAdvance = useCallback((nextLives) => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }

    advanceTimeoutRef.current = setTimeout(() => {
      if (gameStateRef.current !== 'playing') return;

      if (nextLives <= 0 || currentRound + 1 >= rounds.length) {
        setGameState('finished');
        return;
      }

      setCurrentRound((prev) => prev + 1);
      setFeedbackType(null);
    }, FEEDBACK_DELAY_MS);
  }, [currentRound, rounds.length]);

  const handleAnswer = useCallback((answerValue) => {
    if (gameState !== 'playing' || feedbackType !== null) return;

    const currentStatement = rounds[currentRound];
    if (!currentStatement) return;

    const isCorrect = answerValue === currentStatement.answer;
    const nextLives = isCorrect ? lives : Math.max(0, lives - 1);

    setFeedbackType(isCorrect ? 'correct' : 'wrong');
    setAnsweredCount((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setLives(nextLives);
    }

    scheduleAdvance(nextLives);
  }, [currentRound, feedbackType, gameState, lives, rounds, scheduleAdvance]);

  const currentStatement = useMemo(() => rounds[currentRound], [rounds, currentRound]);
  const totalRounds = rounds.length || ROUND_LIMIT;

  if (mode !== 'world-cup') {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        Este minijuego esta disponible solo en modo Mundial.
      </p>
    );
  }

  if (WORLD_SPRINT_STATEMENTS.length < ROUND_LIMIT) {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        No hay afirmaciones suficientes para este modo en este momento.
      </p>
    );
  }

  if (gameState === 'idle') {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <div className={styles.icon}>⚡</div>
          <h2 className={styles.title}>{gameMeta.title}</h2>
          <p className={styles.subtitle}>
            {gameMeta.description}
          </p>
          <button className={styles.startBtn} onClick={startGame}>
            Iniciar Sprint
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const safeAnswered = Math.max(answeredCount, 1);
    const pct = Math.round((score / safeAnswered) * 100);
    const rank = getRankLabel(pct);

    return (
      <div className={styles.container}>
        <div className={styles.resultScreen}>
          <div className={styles.icon}>{pct >= 75 ? '🔥' : '🌍'}</div>
          <h2 className={styles.title}>Fin del Sprint</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreBig}>{score}</span>
            <span className={styles.scoreOf}>/ {answeredCount}</span>
          </div>
          <div className={styles.rank}>{rank}</div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{pct}%</span>
              <span className={styles.statLabel}>Precision</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{Math.max(0, timer)}s</span>
              <span className={styles.statLabel}>Tiempo restante</span>
            </div>
          </div>
          <button className={styles.startBtn} onClick={startGame}>
            Jugar de Nuevo
          </button>

          <Leaderboard
            gameId={gameId}
            currentScore={score}
            currentStats={{
              answered: answeredCount,
              correct: score,
              wrong: Math.max(0, answeredCount - score),
              livesLeft: lives,
              timeLeft: Math.max(0, timer),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
          />
        </div>
        <div className={styles.headerInfo}>
          <span className={styles.counter}>
            Ronda {Math.min(currentRound + 1, totalRounds)} / {totalRounds}
          </span>
          <span className={`${styles.timerBadge} ${timer <= 10 ? styles.timerDanger : ''}`}>
            ⏱️ {timer}s
          </span>
          <span className={styles.lives}>❤️ {lives}</span>
          <span className={styles.score}>⭐ {score}</span>
        </div>
      </div>

      <div className={styles.statementCard}>
        <p className={styles.statementText}>{currentStatement?.statement}</p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.answerBtn} ${styles.answerTrue}`}
          onClick={() => handleAnswer(true)}
          disabled={feedbackType !== null}
        >
          Verdadero
        </button>
        <button
          type="button"
          className={`${styles.answerBtn} ${styles.answerFalse}`}
          onClick={() => handleAnswer(false)}
          disabled={feedbackType !== null}
        >
          Falso
        </button>
      </div>

      <div className={styles.feedbackBox}>
        {feedbackType === null && (
          <p className={styles.feedbackNeutral}>Responde rapido para encadenar puntos.</p>
        )}
        {feedbackType === 'correct' && (
          <p className={styles.feedbackCorrect}>✅ Correcto: {currentStatement?.info}</p>
        )}
        {feedbackType === 'wrong' && (
          <p className={styles.feedbackWrong}>❌ Fallaste: {currentStatement?.info}</p>
        )}
      </div>
    </div>
  );
}
