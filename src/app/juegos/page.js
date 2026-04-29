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

function normalizeSearchKey(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function isGeneratedFallbackPlayer(player) {
  return String(player?.idPlayer || '').startsWith('wc-p-');
}

function dedupePlayersByIdOrName(players) {
  const seenNames = new Set();
  const seenIds = new Set();
  return players.filter((player) => {
    const id = String(player?.idPlayer || '').trim();
    const name = normalizeSearchKey(player?.strPlayer);
    if (!id && !name) return false;
    if ((name && seenNames.has(name)) || (id && seenIds.has(id))) return false;
    if (name) seenNames.add(name);
    if (id) seenIds.add(id);
    return true;
  });
}

async function getChampionsPlayers(teams) {
  const playerSourceTeams = teams.filter((team) => team.idTeam).slice(0, 16);
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
      excludeCoachProfiles: false,
      skipTeamLookups: true,
      maxNameHints: 24,
      limit: 600,
    }).catch(() => []),
  ]);

  const realWorldCupPhotoPlayers = worldCupPhotoPlayers.filter(
    (player) => hasUsablePhoto(player?.strThumb) && !isGeneratedFallbackPlayer(player)
  );
  const worldCupEligibleNames = new Set(
    [...worldCupPlayers, ...worldCupPhotoPlayers].map((player) => normalizeSearchKey(player?.strPlayer))
  );
  const championsPhotoPlayers = championsPlayers.filter((player) => hasUsablePhoto(player?.strThumb));
  const championsWorldCupPhotoPlayers = championsPhotoPlayers.filter((player) =>
    worldCupEligibleNames.has(normalizeSearchKey(player?.strPlayer))
  );
  const preferredPhotoPlayers = dedupePlayersByIdOrName([
    ...realWorldCupPhotoPlayers,
    ...championsWorldCupPhotoPlayers,
  ]);
  const resolvedPhotoPlayers = preferredPhotoPlayers.length >= 4 ? preferredPhotoPlayers : worldCupPhotoPlayers;

  if (process.env.DEBUG_WORLD_CUP_PHOTOS === '1') {
    const totalWithPhoto = worldCupPhotoPlayers.filter((player) => hasUsablePhoto(player?.strThumb)).length;
    const totalRealWorldCup = realWorldCupPhotoPlayers.length;
    const totalChampionsPhotos = championsPhotoPlayers.length;
    const totalChampionsEligible = championsWorldCupPhotoPlayers.length;
    console.info(
      `[juegos] worldCupPhotoPlayers=${worldCupPhotoPlayers.length} withPhoto=${totalWithPhoto} realWorldCup=${totalRealWorldCup} championsPhotos=${totalChampionsPhotos} championsEligible=${totalChampionsEligible} resolved=${resolvedPhotoPlayers.length}`
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
      photoPlayers: resolvedPhotoPlayers,
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
