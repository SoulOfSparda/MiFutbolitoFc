'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Leaderboard from './Leaderboard';
import { getGameMode, getModeLeaderboardId } from '@/lib/data/gameModes';
import styles from './WorldPlayerPhotoGame.module.css';

const START_LIVES = 3;
const MIN_ROUNDS = 20;
const MAX_ROUNDS = 50;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hasUsablePhoto(value) {
  const normalized = (value || '').trim();
  if (!normalized) return false;
  const lower = normalized.toLowerCase();
  return lower !== 'null' && lower !== 'undefined' && lower !== 'n/a';
}

function hasPlayerCoreSignals(player) {
  const position = (player?.strPosition || '').toLowerCase();
  const hasNumber = Boolean(String(player?.strNumber || '').trim());
  const hasPlayerPosition =
    position.includes('goalkeeper') ||
    position.includes('keeper') ||
    position.includes('defender') ||
    position.includes('back') ||
    position.includes('midfield') ||
    position.includes('winger') ||
    position.includes('forward') ||
    position.includes('striker');

  return hasPlayerPosition || hasNumber;
}

function isCoachProfile(player) {
  const position = (player?.strPosition || '').toLowerCase();
  const status = (player?.strStatus || '').toLowerCase();
  const description = (player?.strDescriptionEN || '').toLowerCase();
  const name = (player?.strPlayer || '').toLowerCase();
  const hasCoachKeywords =
    position.includes('manager') ||
    position.includes('coach') ||
    position.includes('assistant') ||
    position.includes('trainer') ||
    position.includes('director') ||
    position.includes('staff') ||
    status.includes('manager') ||
    status.includes('coach') ||
    description.includes('head coach') ||
    description.includes('assistant coach') ||
    description.includes('football manager') ||
    description.includes('manager of') ||
    name.includes(' coach') ||
    name.startsWith('coach ');

  if (hasCoachKeywords) return true;

  // Si no hay señales de jugador y sí hay texto descriptivo/status, lo tratamos como perfil técnico.
  const hasAnyMeta = Boolean(status || description || position);
  const mentionsPlayerInDescription =
    description.includes('footballer') ||
    description.includes('midfielder') ||
    description.includes('defender') ||
    description.includes('forward') ||
    description.includes('striker') ||
    description.includes('goalkeeper');

  if (!hasPlayerCoreSignals(player) && hasAnyMeta && !mentionsPlayerInDescription) return true;

  return false;
}

function isLikelyFieldPlayer(player) {
  return hasPlayerCoreSignals(player);
}

function hasPlayerIdentitySignal(player) {
  const description = (player?.strDescriptionEN || '').toLowerCase();
  const hasPlayerWords =
    description.includes('footballer') ||
    description.includes('midfielder') ||
    description.includes('defender') ||
    description.includes('forward') ||
    description.includes('striker') ||
    description.includes('goalkeeper');
  return hasPlayerCoreSignals(player) || hasPlayerWords;
}

function getRankLabel(pct) {
  if (pct >= 90) return '📸 Radar Elite';
  if (pct >= 70) return '🏆 Ojo Mundialista';
  if (pct >= 50) return '🥈 Buen Reconocimiento';
  return '🥉 En Progreso';
}

export default function WorldPlayerPhotoGame({ players, mode = 'world-cup' }) {
  const [gameState, setGameState] = useState('idle');
  const [rounds, setRounds] = useState([]);
  const [currentR, setCurrentR] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  const modeConfig = getGameMode(mode);
  const worldCupConfig = getGameMode('world-cup');
  const gameMeta = modeConfig.games.playerPhoto || worldCupConfig.games.playerPhoto;
  const gameId = getModeLeaderboardId('player-photo', mode);

  const validPlayers = useMemo(() => {
    const source = Array.isArray(players) ? players : [];
    const uniqueById = new Map();

    source.forEach((player) => {
      const idPlayer = String(player?.idPlayer || '').trim();
      const strPlayer = (player?.strPlayer || '').trim();
      const strThumb = (player?.strThumb || '').trim();
      if (!idPlayer || !strPlayer || !hasUsablePhoto(strThumb)) return;
      if (!uniqueById.has(idPlayer)) {
        uniqueById.set(idPlayer, {
          idPlayer,
          strPlayer,
          strThumb,
          strTeam: (player?.strTeam || '').trim(),
          strNationality: (player?.strNationality || '').trim(),
          strPosition: (player?.strPosition || '').trim(),
          strStatus: (player?.strStatus || '').trim(),
          strDescriptionEN: (player?.strDescriptionEN || '').trim(),
          strNumber: (player?.strNumber || '').trim(),
          strHeight: (player?.strHeight || '').trim(),
          strWeight: (player?.strWeight || '').trim(),
          isCoach: isCoachProfile(player),
        });
      }
    });

    const normalized = Array.from(uniqueById.values());
    const strictPlayers = normalized.filter(
      (profile) => !profile.isCoach && hasPlayerIdentitySignal(profile)
    );
    const nonCoachPlayers = normalized.filter((profile) => !profile.isCoach);

    if (strictPlayers.length >= 8) return strictPlayers;
    if (nonCoachPlayers.length >= 4) return nonCoachPlayers;
    return strictPlayers;
  }, [players]);

  const generateRounds = useCallback(() => {
    if (validPlayers.length < 4) return [];

    const maxRounds = Math.min(
      MAX_ROUNDS,
      Math.max(MIN_ROUNDS, Math.floor(validPlayers.length * 0.82))
    );
    const gameRounds = [];
    const usedCorrectIds = new Set();
    let recentOptionIds = new Set();

    for (let i = 0; i < maxRounds; i++) {
      let availableCorrectPlayers = validPlayers.filter(
        (player) => !usedCorrectIds.has(player.idPlayer)
      );
      if (availableCorrectPlayers.length === 0) {
        usedCorrectIds.clear();
        availableCorrectPlayers = [...validPlayers];
      }

      const correctPlayer = pickRandomFrom(availableCorrectPlayers);
      usedCorrectIds.add(correctPlayer.idPlayer);

      const fullWrongPool = validPlayers.filter((player) => player.idPlayer !== correctPlayer.idPlayer);
      const preferredWrongPool = fullWrongPool.filter(
        (player) => !recentOptionIds.has(player.idPlayer)
      );
      const wrongSource =
        preferredWrongPool.length >= 3 ? preferredWrongPool : fullWrongPool;
      const wrongPlayers = shuffle(wrongSource).slice(0, 3);
      if (wrongPlayers.length < 3) continue;

      const options = shuffle([correctPlayer, ...wrongPlayers]);
      recentOptionIds = new Set(options.map((option) => option.idPlayer));
      gameRounds.push({
        correctPlayer,
        options,
        correctIndex: options.findIndex((option) => option.idPlayer === correctPlayer.idPlayer),
      });
    }

    return gameRounds;
  }, [validPlayers]);

  const startGame = useCallback(() => {
    const generatedRounds = generateRounds();
    if (generatedRounds.length === 0) return;

    setRounds(generatedRounds);
    setCurrentR(0);
    setScore(0);
    setLives(START_LIVES);
    setSelected(null);
    setShowAnswer(false);
    setAnsweredCount(0);
    setGameState('playing');
  }, [generateRounds]);

  const handleAnswer = (idx) => {
    if (showAnswer || gameState !== 'playing') return;

    const isCorrect = idx === rounds[currentR].correctIndex;
    setSelected(idx);
    setShowAnswer(true);
    setAnsweredCount((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      return;
    }

    setLives((prev) => Math.max(0, prev - 1));
  };

  const nextRound = () => {
    const isLastRound = currentR + 1 >= rounds.length;

    if (isLastRound || lives <= 0) {
      setGameState('finished');
      return;
    }

    setCurrentR((prev) => prev + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  if (mode !== 'world-cup') {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        Este minijuego esta disponible solo en modo Mundial.
      </p>
    );
  }

  if (validPlayers.length < 4) {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        No hay suficientes jugadores con imagen disponible por ahora. Intenta mas tarde.
      </p>
    );
  }

  if (gameState === 'idle') {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <div className={styles.icon}>📸</div>
          <h2 className={styles.title}>{gameMeta.title}</h2>
          <p className={styles.subtitle}>
            {gameMeta.description} Tienes <strong>3 vidas</strong> para llegar lo mas lejos posible.
          </p>
          <button className={styles.startBtn} onClick={startGame}>
            Iniciar Juego
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
          <div className={styles.icon}>{pct >= 70 ? '🎉' : '🌍'}</div>
          <h2 className={styles.title}>Reto terminado</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreBig}>{score}</span>
            <span className={styles.scoreOf}>/ {answeredCount}</span>
          </div>
          <div className={styles.rank}>{rank}</div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>❤️ {lives}</span>
              <span className={styles.statLabel}>Vidas restantes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{pct}%</span>
              <span className={styles.statLabel}>Precision</span>
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
            }}
          />
        </div>
      </div>
    );
  }

  const round = rounds[currentR];
  const isCorrect = selected === round.correctIndex;

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
          <span className={styles.livesBadge}>❤️ {lives}</span>
          <span className={styles.scoreSmall}>⭐ {score}</span>
        </div>
      </div>

      <div className={styles.photoSection}>
        <div className={styles.photoFrame}>
          <Image
            src={round.correctPlayer.strThumb}
            alt={`Foto de ${round.correctPlayer.strPlayer}`}
            width={280}
            height={280}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            unoptimized
          />
        </div>
      </div>

      <div className={styles.options}>
        {round.options.map((player, idx) => {
          let cls = styles.option;
          if (showAnswer) {
            if (idx === round.correctIndex) cls += ` ${styles.correct}`;
            else if (idx === selected && !isCorrect) cls += ` ${styles.wrong}`;
            else cls += ` ${styles.dimmed}`;
          }
          return (
            <button
              key={player.idPlayer}
              className={cls}
              onClick={() => handleAnswer(idx)}
              disabled={showAnswer}
            >
              {player.strPlayer}
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className={styles.feedback}>
          <p className={isCorrect ? styles.feedCorrect : styles.feedWrong}>
            {isCorrect ? '✅ Correcto' : `❌ Era: ${round.correctPlayer.strPlayer}`}
          </p>
          <p className={styles.playerMeta}>
            {round.correctPlayer.strTeam}
            {round.correctPlayer.strNationality ? ` · ${round.correctPlayer.strNationality}` : ''}
          </p>
          <button className={styles.nextBtn} onClick={nextRound}>
            {currentR + 1 >= rounds.length || lives <= 0 ? 'Ver Resultados' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}
