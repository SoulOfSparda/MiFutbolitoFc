'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Leaderboard from './Leaderboard';
import { getGameMode, getModeLeaderboardId } from '@/lib/data/gameModes';
import styles from './BadgeGame.module.css';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function hasUsableFlag(value) {
  const normalized = (value || '').trim();
  if (!normalized) return false;
  const lower = normalized.toLowerCase();
  return lower !== 'null' && lower !== 'undefined' && lower !== 'n/a';
}

function getRankLabel(pct) {
  if (pct >= 90) return '🌟 Maestro de Banderas';
  if (pct >= 70) return '🏆 Experto Mundial';
  if (pct >= 50) return '🥈 Buen Aficionado';
  return '🥉 En entrenamiento';
}

export default function WorldFlagGame({ teams, mode = 'world-cup' }) {
  const [gameState, setGameState] = useState('idle');
  const [rounds, setRounds] = useState([]);
  const [currentR, setCurrentR] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(10);
  const [finalTime, setFinalTime] = useState(0);

  const totalTimeSpent = useRef(0);
  const modeConfig = getGameMode(mode);
  const worldCupConfig = getGameMode('world-cup');
  const gameMeta = modeConfig.games.worldFlag || worldCupConfig.games.worldFlag;
  const gameId = getModeLeaderboardId('world-flag', mode);

  const validTeams = useMemo(() => {
    const source = Array.isArray(teams) ? teams : [];
    const uniqueById = new Map();

    source.forEach((team) => {
      const idTeam = String(team?.idTeam || '').trim();
      const strTeam = (team?.strTeam || '').trim();
      const strCountryFlag = (team?.strCountryFlag || '').trim();
      if (!idTeam || !strTeam || !hasUsableFlag(strCountryFlag)) return;
      if (!uniqueById.has(idTeam)) {
        uniqueById.set(idTeam, { idTeam, strTeam, strCountryFlag });
      }
    });

    return Array.from(uniqueById.values());
  }, [teams]);

  const generateRounds = useCallback(() => {
    if (validTeams.length < 4) return [];

    const maxRounds = Math.min(10, validTeams.length);
    const shuffledTeams = shuffle(validTeams);
    const gameRounds = [];

    for (let i = 0; i < maxRounds; i++) {
      const correctTeam = shuffledTeams[i];
      const wrongTeams = shuffle(
        validTeams.filter((team) => team.idTeam !== correctTeam.idTeam)
      ).slice(0, 3);

      if (wrongTeams.length < 3) continue;

      const options = shuffle([correctTeam, ...wrongTeams]);
      gameRounds.push({
        correctTeam,
        options,
        correctIndex: options.findIndex((option) => option.idTeam === correctTeam.idTeam),
      });
    }

    return gameRounds;
  }, [validTeams]);

  const startGame = useCallback(() => {
    const generatedRounds = generateRounds();
    if (generatedRounds.length === 0) return;

    setRounds(generatedRounds);
    setCurrentR(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    setTimer(10);
    setFinalTime(0);
    totalTimeSpent.current = 0;
    setGameState('playing');
  }, [generateRounds]);

  useEffect(() => {
    if (gameState !== 'playing' || showAnswer) return;

    const interval = setInterval(() => {
      setTimer((currentTimer) => {
        const nextTimer = Math.max(0, currentTimer - 1);
        totalTimeSpent.current += 1;
        if (nextTimer === 0) {
          setShowAnswer(true);
        }
        return nextTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, showAnswer]);

  const handleAnswer = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    if (idx === rounds[currentR].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const nextRound = () => {
    if (currentR + 1 >= rounds.length) {
      setFinalTime(Math.max(1, totalTimeSpent.current));
      setGameState('finished');
      return;
    }

    setCurrentR((prev) => prev + 1);
    setSelected(null);
    setShowAnswer(false);
    setTimer(10);
  };

  if (mode !== 'world-cup') {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        Este minijuego está disponible solo en modo Mundial.
      </p>
    );
  }

  if (validTeams.length < 4) {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        No hay suficientes selecciones con bandera disponible por ahora. Intenta más tarde.
      </p>
    );
  }

  if (gameState === 'idle') {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <div className={styles.icon}>🚩</div>
          <h2 className={styles.title}>{gameMeta.title}</h2>
          <p className={styles.subtitle}>
            {gameMeta.description} Tienes <strong>10 segundos</strong> por ronda para acertar.
          </p>
          <button className={styles.startBtn} onClick={startGame}>
            ¡Comenzar!
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const pct = Math.round((score / rounds.length) * 100);
    const rank = getRankLabel(pct);

    return (
      <div className={styles.container}>
        <div className={styles.resultScreen}>
          <div className={styles.icon}>{pct >= 70 ? '🎉' : '🌍'}</div>
          <h2 className={styles.title}>¡Reto completado!</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreBig}>{score}</span>
            <span className={styles.scoreOf}>/ {rounds.length}</span>
          </div>
          <div className={styles.rank}>{rank}</div>
          <button className={styles.startBtn} onClick={startGame}>
            Jugar de Nuevo
          </button>

          <Leaderboard
            gameId={gameId}
            currentScore={score}
            timeElapsed={finalTime}
            currentStats={{
              rounds: rounds.length,
              correct: score,
              wrong: Math.max(0, rounds.length - score),
            }}
          />
        </div>
      </div>
    );
  }

  const round = rounds[currentR];
  const isCorrect = selected === round.correctIndex;
  const timerDanger = timer <= 3;

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${((currentR + 1) / rounds.length) * 100}%` }}
          />
        </div>
        <div className={styles.headerInfo}>
          <span className={styles.qCount}>
            Ronda {currentR + 1} de {rounds.length}
          </span>
          <span className={`${styles.timerBadge} ${timerDanger ? styles.timerDanger : ''}`}>
            ⏱️ {timer}s
          </span>
          <span className={styles.scoreSmall}>⭐ {score}</span>
        </div>
      </div>

      <div className={styles.badgeSection}>
        <div className={`${styles.badgeFrame} ${showAnswer ? styles.badgeRevealed : ''}`}>
          <Image
            src={round.correctTeam.strCountryFlag}
            alt={`Bandera de ${round.correctTeam.strTeam}`}
            width={160}
            height={110}
            unoptimized
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        </div>
        <p className={styles.badgeHint}>¿Qué selección corresponde a esta bandera?</p>
      </div>

      <div className={styles.options}>
        {round.options.map((team, idx) => {
          let cls = styles.option;
          if (showAnswer) {
            if (idx === round.correctIndex) cls += ` ${styles.correct}`;
            else if (idx === selected && !isCorrect) cls += ` ${styles.wrong}`;
            else cls += ` ${styles.dimmed}`;
          }
          return (
            <button key={team.idTeam} className={cls} onClick={() => handleAnswer(idx)} disabled={showAnswer}>
              <span>{team.strTeam}</span>
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className={styles.feedback}>
          <p className={isCorrect ? styles.feedCorrect : styles.feedWrong}>
            {selected === null
              ? `⏰ Tiempo agotado. Era: ${round.correctTeam.strTeam}`
              : isCorrect
              ? '✅ ¡Correcto!'
              : `❌ Era: ${round.correctTeam.strTeam}`}
          </p>
          <button className={styles.nextBtn} onClick={nextRound}>
            {currentR + 1 >= rounds.length ? 'Ver Resultados' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}
