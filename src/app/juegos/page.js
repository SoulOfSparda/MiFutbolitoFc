import { getTeamPlayers, getTeamsByLeague } from '@/lib/api';
import GamesClient from './GamesClient';
import styles from './page.module.css';

export const metadata = {
  title: 'Juegos — MiFutbolitoFc',
  description:
    'Pon a prueba tus conocimientos de fútbol con nuestra trivia de Champions, adivina escudos y el nuevo juego de pistas de jugadores.',
};

export default async function JuegosPage() {
  // Cargamos los equipos de Champions para el juego de escudos
  const teams = await getTeamsByLeague('UEFA Champions League').catch(() => []);
  const playerSourceTeams = teams.filter((team) => team.idTeam).slice(0, 8);

  const playersNested = await Promise.all(
    playerSourceTeams.map((team) => getTeamPlayers(team.idTeam).catch(() => []))
  );

  const seenPlayers = new Set();
  const players = playersNested
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

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <h1 className={`${styles.title} animate-in`}>🎮 Zona de Juegos</h1>
          <p className={`${styles.subtitle} animate-in animate-in-delay-1`}>
            Diviértete con trivia, escudos y el nuevo reto de jugadores por pistas
          </p>
        </div>
      </section>

      <GamesClient teams={teams} players={players} />
    </div>
  );
}
