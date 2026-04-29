import {
  getTeamPlayers,
  getTeamsByLeague,
  getWorldCupPlayers,
  getWorldCupTeams,
} from '@/lib/api';
import { connection } from 'next/server';
import GamesClient from './GamesClient';
import styles from './page.module.css';

export const metadata = {
  title: 'Juegos — MiFutbolitoFc',
  description:
    'Juega en modo Champions o Mundial 2026 con trivia, escudos, banderas, sprint verdadero/falso, foto de jugadores y reto por pistas.',
};

function normalizePlayersPool(playersNested) {
  const seenPlayers = new Set();
  return playersNested
    .flat()
    .filter((player) => {
      if (!player?.idPlayer || !player?.strPlayer || seenPlayers.has(player.idPlayer)) {
        return false;
      }
      const availableClues = [
        player.strPosition,
        player.strNationality,
        player.strTeam,
        player.dateBorn,
        player.strNumber || player.strHeight || player.strWeight,
      ].filter(Boolean).length;
      if (availableClues < 3) return false;
      seenPlayers.add(player.idPlayer);
      return true;
    })
    .map((player) => ({
      idPlayer: player.idPlayer,
      strPlayer: player.strPlayer,
      strTeam: player.strTeam || '',
      strNationality: player.strNationality || '',
      strPosition: player.strPosition || '',
      dateBorn: player.dateBorn || '',
      strNumber: player.strNumber || '',
      strHeight: player.strHeight || '',
      strWeight: player.strWeight || '',
      strThumb: player.strThumb || player.strCutout || '',
    }))
    .slice(0, 160);
}

function hasUsablePhoto(value) {
  const normalized = (value || '').trim();
  if (!normalized) return false;
  const lower = normalized.toLowerCase();
  return lower !== 'null' && lower !== 'undefined' && lower !== 'n/a';
}

async function getChampionsPlayers(teams) {
  const playerSourceTeams = teams.filter((team) => team.idTeam).slice(0, 8);
  const playersNested = await Promise.all(
    playerSourceTeams.map((team) => getTeamPlayers(team.idTeam).catch(() => []))
  );
  return normalizePlayersPool(playersNested);
}

export default async function JuegosPage() {
  await connection();

  const [championsTeams, worldCupTeams] = await Promise.all([
    getTeamsByLeague('UEFA Champions League').catch(() => []),
    getWorldCupTeams().catch(() => []),
  ]);

  const [championsPlayers, worldCupPlayers, worldCupPhotoPlayers] = await Promise.all([
    getChampionsPlayers(championsTeams).catch(() => []),
    getWorldCupPlayers(worldCupTeams, { requireMinimumClues: true, limit: 260 }).catch(() => []),
    getWorldCupPlayers(worldCupTeams, {
      requireMinimumClues: false,
      includeNameHints: true,
      excludeCoachProfiles: true,
      skipTeamLookups: true,
      maxNameHints: 24,
      limit: 600,
    }).catch(() => []),
  ]);

  if (process.env.DEBUG_WORLD_CUP_PHOTOS === '1') {
    const totalWithPhoto = worldCupPhotoPlayers.filter((player) => hasUsablePhoto(player?.strThumb)).length;
    console.info(
      `[juegos] worldCupPhotoPlayers=${worldCupPhotoPlayers.length} withPhoto=${totalWithPhoto}`
    );
  }

  const datasets = {
    champions: {
      teams: championsTeams,
      players: championsPlayers,
    },
    'world-cup': {
      teams: worldCupTeams,
      players: worldCupPlayers,
      photoPlayers: worldCupPhotoPlayers,
    },
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <h1 className={`${styles.title} animate-in`}>🎮 Zona de Juegos</h1>
          <p className={`${styles.subtitle} animate-in animate-in-delay-1`}>
            Elige entre modo Champions y modo Mundial 2026 para retar tu conocimiento futbolero
          </p>
        </div>
      </section>

      <GamesClient datasets={datasets} />
    </div>
  );
}
