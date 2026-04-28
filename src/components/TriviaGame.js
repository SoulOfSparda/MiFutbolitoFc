'use client';

import { useState, useCallback } from 'react';
import Leaderboard from './Leaderboard';
import { getGameMode, getModeLeaderboardId } from '@/lib/data/gameModes';
import { TRIVIA_QUESTIONS_BY_MODE } from '@/lib/data/triviaQuestions';
import styles from './TriviaGame.module.css';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRankLabel(mode, pct) {
  if (mode === 'world-cup') {
    if (pct >= 90) return '🌟 Leyenda Mundial';
    if (pct >= 70) return '🏆 Maestro del Mundial';
    if (pct >= 50) return '🥈 Conocedor Global';
    return '🥉 Aficionado';
  }

  if (pct >= 90) return '👑 Leyenda Absoluta';
  if (pct >= 70) return '🥇 Maestro de Champions';
  if (pct >= 50) return '🥈 Conocedor';
  return '🥉 Aficionado';
}

export default function TriviaGame({ mode = 'champions' }) {
  const [gameState, setGameState] = useState('idle'); // idle | playing | finished
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const modeConfig = getGameMode(mode);
  const questionPool = TRIVIA_QUESTIONS_BY_MODE[mode] || TRIVIA_QUESTIONS_BY_MODE.champions;
  const gameId = getModeLeaderboardId('trivia', mode);

  const startGame = useCallback(() => {
    setQuestions(shuffle(questionPool).slice(0, 10));
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    setStreak(0);
    setBestStreak(0);
    setGameState('playing');
  }, [questionPool]);

  const handleAnswer = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    const correct = idx === questions[currentQ].answer;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        setBestStreak((b) => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setGameState('finished');
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  if (questionPool.length < 4) {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        No hay preguntas suficientes para este modo en este momento.
      </p>
    );
  }

  if (gameState === 'idle') {
    return (
      <div className={styles.container}>
        <div className={styles.startScreen}>
          <div className={styles.trophy}>{mode === 'world-cup' ? '🌍' : '🏆'}</div>
          <h2 className={styles.title}>{modeConfig.games.trivia.title}</h2>
          <p className={styles.subtitle}>{modeConfig.games.trivia.description}</p>
          <button className={styles.startBtn} onClick={startGame}>
            ¡Empezar Trivia!
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const pct = Math.round((score / questions.length) * 100);
    const rank = getRankLabel(mode, pct);

    return (
      <div className={styles.container}>
        <div className={styles.resultScreen}>
          <div className={styles.resultEmoji}>{pct >= 70 ? '🎉' : '💪'}</div>
          <h2 className={styles.title}>¡Juego Terminado!</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreBig}>{score}</span>
            <span className={styles.scoreOf}>/ {questions.length}</span>
          </div>
          <div className={styles.rank}>{rank}</div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{pct}%</span>
              <span className={styles.statLabel}>Aciertos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>🔥 {bestStreak}</span>
              <span className={styles.statLabel}>Mejor Racha</span>
            </div>
          </div>
          <button className={styles.startBtn} onClick={startGame}>
            Jugar de Nuevo
          </button>

          <Leaderboard
            gameId={gameId}
            currentScore={score}
            currentStats={{
              rounds: questions.length,
              correct: score,
              wrong: Math.max(0, questions.length - score),
              bestStreak,
            }}
          />
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className={styles.headerInfo}>
          <span className={styles.qCount}>
            Pregunta {currentQ + 1} de {questions.length}
          </span>
          <span className={styles.scoreSmall}>
            ⭐ {score} {streak > 1 && <span className={styles.streakBadge}>🔥 x{streak}</span>}
          </span>
        </div>
      </div>

      <div className={styles.questionCard}>
        <h3 className={styles.question}>{q.q}</h3>

        <div className={styles.options}>
          {q.options.map((opt, idx) => {
            let cls = styles.option;
            if (showAnswer) {
              if (idx === q.answer) cls += ` ${styles.correct}`;
              else if (idx === selected && idx !== q.answer) cls += ` ${styles.wrong}`;
              else cls += ` ${styles.dimmed}`;
            }
            return (
              <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={showAnswer}>
                <span className={styles.optLetter}>{String.fromCharCode(65 + idx)}</span>
                <span className={styles.optText}>{opt}</span>
              </button>
            );
          })}
        </div>

        {showAnswer && (
          <div className={styles.feedback}>
            <p className={selected === q.answer ? styles.feedbackCorrect : styles.feedbackWrong}>
              {selected === q.answer ? '✅ ¡Correcto!' : '❌ Incorrecto'}
            </p>
            <p className={styles.infoText}>{q.info}</p>
            <button className={styles.nextBtn} onClick={nextQuestion}>
              {currentQ + 1 >= questions.length ? 'Ver Resultados' : 'Siguiente →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

