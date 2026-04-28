'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import TriviaGame from '@/components/TriviaGame';
import BadgeGame from '@/components/BadgeGame';
import WorldFlagGame from '@/components/WorldFlagGame';
import PlayerCluesGame from '@/components/PlayerCluesGame';
import WorldSprintGame from '@/components/WorldSprintGame';
import WorldPlayerPhotoGame from '@/components/WorldPlayerPhotoGame';
import { DEFAULT_GAME_MODE, GAME_MODES, getGameMode } from '@/lib/data/gameModes';
import styles from './page.module.css';

const GAME_CARDS_BY_MODE = {
  champions: [
    { id: 'trivia', configKey: 'trivia', icon: '🏆', colorClass: '' },
    { id: 'badge', configKey: 'badge', icon: '🛡️', colorClass: 'gameCardPurple' },
    {
      id: 'player-clues',
      configKey: 'playerClues',
      icon: '🧠',
      colorClass: 'gameCardCyan',
    },
  ],
  'world-cup': [
    { id: 'trivia', configKey: 'trivia', icon: '🏆', colorClass: '' },
    {
      id: 'world-flag',
      configKey: 'worldFlag',
      icon: '🚩',
      colorClass: 'gameCardPurple',
    },
    {
      id: 'world-sprint',
      configKey: 'worldSprint',
      icon: '⚡',
      colorClass: 'gameCardOrange',
    },
    {
      id: 'player-photo',
      configKey: 'playerPhoto',
      icon: '📸',
      colorClass: 'gameCardLime',
    },
    {
      id: 'player-clues',
      configKey: 'playerClues',
      icon: '🧠',
      colorClass: 'gameCardCyan',
    },
  ],
};

export default function GamesClient({ datasets }) {
  const [activeMode, setActiveMode] = useState(DEFAULT_GAME_MODE);
  const [activeGame, setActiveGame] = useState(null);
  const gameSectionRef = useRef(null);
  const modeConfig = getGameMode(activeMode);
  const modeDataset = datasets?.[activeMode] || { teams: [], players: [] };
  const gameCards = GAME_CARDS_BY_MODE[activeMode] || GAME_CARDS_BY_MODE[DEFAULT_GAME_MODE];

  const focusGameSection = useCallback(() => {
    if (!gameSectionRef.current) return;
    gameSectionRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, []);

  useEffect(() => {
    if (!activeGame) return;
    const id = window.requestAnimationFrame(() => {
      focusGameSection();
    });
    return () => window.cancelAnimationFrame(id);
  }, [activeGame, focusGameSection]);

  if (activeGame === 'trivia') {
    return (
      <section className="section" ref={gameSectionRef}>
        <div className="container">
          <button className={styles.backBtn} onClick={() => setActiveGame(null)}>
            ← Volver a Juegos
          </button>
          <TriviaGame mode={activeMode} />
        </div>
      </section>
    );
  }

  if (activeGame === 'badge') {
    return (
      <section className="section" ref={gameSectionRef}>
        <div className="container">
          <button className={styles.backBtn} onClick={() => setActiveGame(null)}>
            ← Volver a Juegos
          </button>
          <BadgeGame teams={modeDataset.teams || []} mode={activeMode} />
        </div>
      </section>
    );
  }

  if (activeGame === 'world-flag') {
    return (
      <section className="section" ref={gameSectionRef}>
        <div className="container">
          <button className={styles.backBtn} onClick={() => setActiveGame(null)}>
            ← Volver a Juegos
          </button>
          <WorldFlagGame teams={modeDataset.teams || []} mode={activeMode} />
        </div>
      </section>
    );
  }

  if (activeGame === 'world-sprint') {
    return (
      <section className="section" ref={gameSectionRef}>
        <div className="container">
          <button className={styles.backBtn} onClick={() => setActiveGame(null)}>
            ← Volver a Juegos
          </button>
          <WorldSprintGame mode={activeMode} />
        </div>
      </section>
    );
  }

  if (activeGame === 'player-clues') {
    return (
      <section className="section" ref={gameSectionRef}>
        <div className="container">
          <button className={styles.backBtn} onClick={() => setActiveGame(null)}>
            ← Volver a Juegos
          </button>
          <PlayerCluesGame players={modeDataset.players || []} mode={activeMode} />
        </div>
      </section>
    );
  }

  if (activeGame === 'player-photo') {
    return (
      <section className="section" ref={gameSectionRef}>
        <div className="container">
          <button className={styles.backBtn} onClick={() => setActiveGame(null)}>
            ← Volver a Juegos
          </button>
          <WorldPlayerPhotoGame
            players={modeDataset.photoPlayers || modeDataset.players || []}
            mode={activeMode}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className={styles.modeSwitcher}>
          {Object.values(GAME_MODES).map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`${styles.modeButton} ${activeMode === mode.id ? styles.modeButtonActive : ''}`}
              onClick={() => {
                setActiveMode(mode.id);
                setActiveGame(null);
              }}
            >
              <span>{mode.emoji}</span> {mode.label}
            </button>
          ))}
        </div>

        <p className={styles.modeSubtitle}>{modeConfig.subtitle}</p>

        <div className={styles.gamesGrid}>
          {gameCards.map((game, idx) => {
            const gameConfig = modeConfig.games[game.configKey];
            return (
              <div
                key={game.id}
                className={`${styles.gameCard} ${game.colorClass ? styles[game.colorClass] : ''} animate-in ${
                  idx === 1
                    ? 'animate-in-delay-1'
                    : idx === 2
                    ? 'animate-in-delay-2'
                    : idx === 3
                    ? 'animate-in-delay-3'
                    : idx === 4
                    ? 'animate-in-delay-4'
                    : ''
                }`}
                onClick={() => setActiveGame(game.id)}
              >
                <div className={styles.gameIcon}>{game.icon}</div>
                <div className={styles.gameCardContent}>
                  <h2 className={styles.gameTitle}>{gameConfig.title}</h2>
                  <p className={styles.gameDesc}>{gameConfig.description}</p>
                  <div className={styles.gameTags}>
                    {gameConfig.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.playBadge}>JUGAR →</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
