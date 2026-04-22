'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Leaderboard from './Leaderboard';
import styles from './PlayerCluesGame.module.css';

const POSITION_TRANSLATIONS = {
  goalkeeper: 'Portero',
  keeper: 'Portero',
  defender: 'Defensa',
  'centre-back': 'Defensa central',
  'center-back': 'Defensa central',
  'right-back': 'Lateral derecho',
  'left-back': 'Lateral izquierdo',
  'sweeper': 'Líbero',
  midfielder: 'Centrocampista',
  'defensive midfield': 'Mediocentro defensivo',
  'central midfield': 'Mediocentro',
  'attacking midfield': 'Mediapunta',
  'right midfield': 'Volante derecho',
  'left midfield': 'Volante izquierdo',
  winger: 'Extremo',
  'right winger': 'Extremo derecho',
  'left winger': 'Extremo izquierdo',
  forward: 'Delantero',
  striker: 'Delantero centro',
  'centre-forward': 'Delantero centro',
  'center-forward': 'Delantero centro',
  'second striker': 'Segundo delantero',
  utility: 'Polivalente',
};

const NATIONALITY_TRANSLATIONS = {
  argentina: 'Argentina',
  argentinian: 'Argentina',
  austria: 'Austria',
  austrian: 'Austria',
  belgium: 'Bélgica',
  belgian: 'Bélgica',
  brazil: 'Brasil',
  brazilian: 'Brasil',
  chile: 'Chile',
  chilean: 'Chile',
  colombia: 'Colombia',
  colombian: 'Colombia',
  croatia: 'Croacia',
  croatian: 'Croacia',
  denmark: 'Dinamarca',
  danish: 'Dinamarca',
  ecuador: 'Ecuador',
  ecuadorian: 'Ecuador',
  england: 'Inglaterra',
  english: 'Inglaterra',
  france: 'Francia',
  french: 'Francia',
  germany: 'Alemania',
  german: 'Alemania',
  italy: 'Italia',
  italian: 'Italia',
  mexico: 'México',
  mexican: 'México',
  morocco: 'Marruecos',
  moroccan: 'Marruecos',
  netherlands: 'Países Bajos',
  dutch: 'Países Bajos',
  norway: 'Noruega',
  norwegian: 'Noruega',
  paraguay: 'Paraguay',
  paraguayan: 'Paraguay',
  peru: 'Perú',
  peruvian: 'Perú',
  poland: 'Polonia',
  polish: 'Polonia',
  portugal: 'Portugal',
  portuguese: 'Portugal',
  scotland: 'Escocia',
  scottish: 'Escocia',
  serbia: 'Serbia',
  serbian: 'Serbia',
  spain: 'España',
  spanish: 'España',
  sweden: 'Suecia',
  swedish: 'Suecia',
  switzerland: 'Suiza',
  swiss: 'Suiza',
  uruguay: 'Uruguay',
  uruguayan: 'Uruguay',
  venezuela: 'Venezuela',
  venezuelan: 'Venezuela',
  wales: 'Gales',
  welsh: 'Gales',
};

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getBirthYear(dateBorn) {
  if (!dateBorn) return '';
  const [year] = dateBorn.split('-');
  return year || '';
}

function normalizeLookupValue(value) {
  return value
    .toLowerCase()
    .replace(/[‐‑–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function translateListValue(rawValue, translations) {
  if (!rawValue) return '';
  const pieces = rawValue.split(/\s*[,/|]\s*/);
  return pieces
    .map((piece) => {
      const normalized = normalizeLookupValue(piece);
      return translations[normalized] || piece.trim();
    })
    .join(', ');
}

function translatePosition(position) {
  return translateListValue(position, POSITION_TRANSLATIONS);
}

function translateNationality(nationality) {
  return translateListValue(nationality, NATIONALITY_TRANSLATIONS);
}

function translateHeight(height) {
  if (!height) return '';
  return height
    .replace(/\bft\b/gi, 'pies')
    .replace(/\bin\b/gi, 'pulg')
    .replace(/\bcm\b/gi, 'cm');
}

function translateWeight(weight) {
  if (!weight) return '';
  return weight
    .replace(/\blbs?\b/gi, 'libras')
    .replace(/\bkg\b/gi, 'kg');
}

function getClues(player) {
  const clues = [];
  if (player.strPosition) clues.push(`🧤 Posición: ${translatePosition(player.strPosition)}`);
  if (player.strNationality) clues.push(`🌍 Nacionalidad: ${translateNationality(player.strNationality)}`);
  if (player.strTeam) clues.push(`🏟️ Club: ${player.strTeam}`);

  const birthYear = getBirthYear(player.dateBorn);
  if (birthYear) clues.push(`📅 Año de nacimiento: ${birthYear}`);

  if (player.strNumber) clues.push(`🔢 Dorsal: ${player.strNumber}`);
  else if (player.strHeight) clues.push(`📏 Altura: ${translateHeight(player.strHeight)}`);
  else if (player.strWeight) clues.push(`⚖️ Peso: ${translateWeight(player.strWeight)}`);

  const initial = player.strPlayer?.trim()?.charAt(0)?.toUpperCase();
  if (initial) clues.push(`🔤 Inicial del nombre: ${initial}`);

  return clues.slice(0, 6);
}

function generateRounds(players) {
  const validPlayers = players.filter((player) => player.idPlayer && player.strPlayer);
  if (validPlayers.length < 4) return [];

  const shuffled = shuffle(validPlayers);
  const rounds = [];
  const maxRounds = Math.min(10, Math.floor(validPlayers.length / 4));

  for (let i = 0; i < maxRounds; i++) {
    const target = shuffled[i];
    const clues = getClues(target);
    if (clues.length < 3) continue;

    const wrongOptions = shuffle(
      validPlayers.filter((player) => player.idPlayer !== target.idPlayer)
    ).slice(0, 3);

    if (wrongOptions.length < 3) continue;

    const options = shuffle(
      [target, ...wrongOptions].map((player) => ({
        idPlayer: player.idPlayer,
        strPlayer: player.strPlayer,
      }))
    );

    rounds.push({
      target,
      clues,
      options,
      correctIndex: options.findIndex((option) => option.idPlayer === target.idPlayer),
    });
  }

  return rounds;
}

function getRoundPoints(cluesShown) {
  return Math.max(1, 6 - cluesShown);
}

export default function PlayerCluesGame({ players }) {
  const [gameState, setGameState] = useState('idle');
  const [rounds, setRounds] = useState([]);
  const [currentR, setCurrentR] = useState(0);
  const [cluesShown, setCluesShown] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const startTimeRef = useRef(0);

  const startGame = useCallback(() => {
    const generatedRounds = generateRounds(players || []);
    if (generatedRounds.length === 0) return;

    setRounds(generatedRounds);
    setCurrentR(0);
    setCluesShown(1);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setCorrectAnswers(0);
    setFinalTime(0);
    startTimeRef.current = Date.now();
    setGameState('playing');
  }, [players]);

  const revealClue = () => {
    if (showAnswer) return;
    setCluesShown((current) => {
      const maxClues = rounds[currentR]?.clues.length || 1;
      return Math.min(current + 1, maxClues);
    });
  };

  const handleAnswer = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);

    if (idx === rounds[currentR].correctIndex) {
      setScore((prev) => prev + getRoundPoints(cluesShown));
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const nextRound = () => {
    if (currentR + 1 >= rounds.length) {
      const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      setFinalTime(elapsed);
      setGameState('finished');
      return;
    }
    setCurrentR((prev) => prev + 1);
    setCluesShown(1);
    setSelected(null);
    setShowAnswer(false);
  };

  if (!players || players.length < 4) {
    return (
      <p className={styles.unavailable}>
        No hay suficientes jugadores disponibles por ahora. Intenta de nuevo en unos minutos.
      </p>
    );
  }

  if (gameState === 'idle') {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <div className={styles.icon}>🧠</div>
          <h2 className={styles.title}>Adivina el Jugador por Pistas</h2>
          <p className={styles.subtitle}>
            Descubre al futbolista con pistas progresivas. Cuantas menos pistas uses,
            más puntos sumas en el ranking.
          </p>
          <button className={styles.startBtn} onClick={startGame}>
            ¡Empezar Reto!
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const totalRounds = rounds.length || 1;
    const pct = Math.round((correctAnswers / totalRounds) * 100);
    let rank = '🧩 Observador';
    if (pct >= 90) rank = '🧠 Scouter Elite';
    else if (pct >= 70) rank = '🎯 Cazatalentos';
    else if (pct >= 50) rank = '📋 Buen Analista';

    return (
      <div className={styles.container}>
        <div className={styles.resultScreen}>
          <div className={styles.icon}>{pct >= 70 ? '🎉' : '🧠'}</div>
          <h2 className={styles.title}>¡Reto completado!</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreBig}>{score}</span>
            <span className={styles.scoreOf}> pts</span>
          </div>
          <div className={styles.rank}>{rank}</div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>
                {correctAnswers}/{rounds.length}
              </span>
              <span className={styles.statLabel}>Aciertos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{finalTime}s</span>
              <span className={styles.statLabel}>Tiempo</span>
            </div>
          </div>
          <button className={styles.startBtn} onClick={startGame}>
            Jugar de Nuevo
          </button>

          <Leaderboard
            gameId="player-clues"
            currentScore={score}
            timeElapsed={finalTime}
          />
        </div>
      </div>
    );
  }

  const round = rounds[currentR];
  if (!round) return null;

  const isCorrect = selected === round.correctIndex;
  const pointsWon = isCorrect ? getRoundPoints(cluesShown) : 0;

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
          <span className={styles.roundInfo}>
            Ronda {currentR + 1} de {rounds.length}
          </span>
          <span className={styles.scoreInfo}>⭐ {score} pts</span>
        </div>
      </div>

      <div className={styles.cluesCard}>
        <h3 className={styles.cluesTitle}>Pistas activas</h3>
        <ul className={styles.cluesList}>
          {round.clues.slice(0, cluesShown).map((clue, idx) => (
            <li key={idx} className={styles.clueItem}>
              {clue}
            </li>
          ))}
        </ul>

        {!showAnswer && cluesShown < round.clues.length && (
          <button className={styles.hintBtn} onClick={revealClue}>
            Mostrar otra pista (-1 punto potencial)
          </button>
        )}
      </div>

      <div className={styles.options}>
        {round.options.map((option, idx) => {
          let cls = styles.option;
          if (showAnswer) {
            if (idx === round.correctIndex) cls += ` ${styles.correct}`;
            else if (idx === selected && !isCorrect) cls += ` ${styles.wrong}`;
            else cls += ` ${styles.dimmed}`;
          }
          return (
            <button
              key={option.idPlayer}
              className={cls}
              onClick={() => handleAnswer(idx)}
              disabled={showAnswer}
            >
              {option.strPlayer}
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className={styles.feedback}>
          {round.target.strThumb && (
            <div className={styles.playerPhoto}>
              <Image
                src={round.target.strThumb}
                alt={round.target.strPlayer}
                width={120}
                height={120}
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <p className={isCorrect ? styles.feedCorrect : styles.feedWrong}>
            {isCorrect
              ? `✅ ¡Correcto! +${pointsWon} puntos`
              : `❌ Era: ${round.target.strPlayer}`}
          </p>
          <p className={styles.playerMeta}>
            {round.target.strTeam}
            {round.target.strNationality ? ` · ${translateNationality(round.target.strNationality)}` : ''}
          </p>
          <button className={styles.nextBtn} onClick={nextRound}>
            {currentR + 1 >= rounds.length ? 'Ver Resultados' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}
