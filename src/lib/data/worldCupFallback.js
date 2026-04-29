function createInitials(label) {
  return label
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

function createFallbackBadge(label, primary, secondary) {
  const initials = createInitials(label);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${primary}' />
        <stop offset='100%' stop-color='${secondary}' />
      </linearGradient>
    </defs>
    <rect x='6' y='6' width='208' height='208' rx='28' fill='url(#g)' />
    <rect x='18' y='18' width='184' height='184' rx='20' fill='rgba(0,0,0,0.22)' />
    <text x='110' y='128' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='58' font-weight='800'>${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createFallbackCountryFlag(primary, secondary) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='120' viewBox='0 0 180 120'>
    <rect width='180' height='120' fill='${primary}' />
    <rect y='40' width='180' height='40' fill='${secondary}' />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function normalizeLookupKey(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function createPlayerInitials(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const WORLD_CUP_TEAM_BASE = [
  ['wc-arg', 'Argentina', '#6ec7ff', '#0a3d91'],
  ['wc-bra', 'Brasil', '#f7d117', '#1f8f3f'],
  ['wc-fra', 'Francia', '#3552d0', '#c92f2f'],
  ['wc-esp', 'España', '#d12f2f', '#f2b705'],
  ['wc-ger', 'Alemania', '#111111', '#d12f2f'],
  ['wc-eng', 'Inglaterra', '#ffffff', '#2146b5'],
  ['wc-por', 'Portugal', '#0a7c3a', '#cf1e1e'],
  ['wc-ned', 'Paises Bajos', '#ff8c00', '#d12f2f'],
  ['wc-ita', 'Italia', '#1d4ed8', '#16a34a'],
  ['wc-cro', 'Croacia', '#d12f2f', '#ffffff'],
  ['wc-bel', 'Belgica', '#111111', '#d12f2f'],
  ['wc-uru', 'Uruguay', '#67b8ff', '#ffffff'],
  ['wc-col', 'Colombia', '#f7d117', '#1d4ed8'],
  ['wc-mex', 'Mexico', '#127a3f', '#d12f2f'],
  ['wc-usa', 'Estados Unidos', '#2146b5', '#c92f2f'],
  ['wc-can', 'Canada', '#d12f2f', '#ffffff'],
  ['wc-mar', 'Marruecos', '#b91c1c', '#16a34a'],
  ['wc-jpn', 'Japon', '#ffffff', '#d12f2f'],
  ['wc-kor', 'Corea del Sur', '#d12f2f', '#1d4ed8'],
  ['wc-sen', 'Senegal', '#16a34a', '#f7d117'],
  ['wc-nga', 'Nigeria', '#0f9f55', '#ffffff'],
  ['wc-civ', 'Costa de Marfil', '#ff8c00', '#16a34a'],
  ['wc-cmr', 'Camerun', '#16a34a', '#d12f2f'],
  ['wc-gha', 'Ghana', '#d12f2f', '#f7d117'],
  ['wc-sui', 'Suiza', '#d12f2f', '#ffffff'],
  ['wc-srb', 'Serbia', '#d12f2f', '#1d4ed8'],
  ['wc-den', 'Dinamarca', '#b91c1c', '#ffffff'],
  ['wc-swe', 'Suecia', '#1d4ed8', '#f7d117'],
  ['wc-nor', 'Noruega', '#d12f2f', '#1d4ed8'],
  ['wc-pol', 'Polonia', '#ffffff', '#d12f2f'],
  ['wc-aut', 'Austria', '#d12f2f', '#ffffff'],
  ['wc-chi', 'Chile', '#d12f2f', '#1d4ed8'],
  ['wc-ecu', 'Ecuador', '#f7d117', '#1d4ed8'],
  ['wc-par', 'Paraguay', '#d12f2f', '#1d4ed8'],
  ['wc-per', 'Peru', '#d12f2f', '#ffffff'],
  ['wc-aus', 'Australia', '#f7d117', '#0a3d91'],
  ['wc-jam', 'Jamaica', '#16a34a', '#111111'],
  ['wc-irn', 'Iran', '#16a34a', '#d12f2f'],
  ['wc-tun', 'Tunez', '#d12f2f', '#ffffff'],
  ['wc-qat', 'Qatar', '#7a1535', '#ffffff'],
];

const TEAM_COLORS_BY_NAME = new Map(
  WORLD_CUP_TEAM_BASE.map(([, teamName, primary, secondary]) => [
    normalizeLookupKey(teamName),
    { primary, secondary },
  ])
);

function createFallbackPlayerPhoto(playerName, teamName) {
  const palette = TEAM_COLORS_BY_NAME.get(normalizeLookupKey(teamName)) || {
    primary: '#1d4ed8',
    secondary: '#111111',
  };
  const initials = createPlayerInitials(playerName) || 'FP';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360' viewBox='0 0 360 360'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${palette.primary}' />
        <stop offset='100%' stop-color='${palette.secondary}' />
      </linearGradient>
    </defs>
    <rect width='360' height='360' fill='url(#bg)' />
    <circle cx='180' cy='136' r='72' fill='rgba(255,255,255,0.9)' />
    <path d='M62 314c0-69 53-111 118-111s118 42 118 111z' fill='rgba(255,255,255,0.9)' />
    <rect x='18' y='18' width='324' height='324' rx='22' fill='none' stroke='rgba(255,255,255,0.25)' stroke-width='8' />
    <text x='180' y='340' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='34' font-weight='700'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const WORLD_CUP_FALLBACK_TEAMS = WORLD_CUP_TEAM_BASE.map(
  ([idTeam, strTeam, primary, secondary]) => ({
    idTeam,
    strTeam,
    strBadge: createFallbackBadge(strTeam, primary, secondary),
    strCountryFlag: createFallbackCountryFlag(primary, secondary),
  })
);

export const WORLD_CUP_TEAM_SEARCH_HINTS = [
  'Argentina',
  'Brazil',
  'France',
  'Spain',
  'Germany',
  'England',
  'Portugal',
  'Netherlands',
  'Italy',
  'Croatia',
  'Belgium',
  'Uruguay',
  'Colombia',
  'Mexico',
  'United States',
  'Canada',
  'Morocco',
  'Japan',
  'South Korea',
  'Senegal',
];

export const WORLD_CUP_PLAYER_SEARCH_HINTS = [
  'Lionel Messi',
  'Julian Alvarez',
  'Enzo Fernandez',
  'Emiliano Martinez',
  'Lautaro Martinez',
  'Alexis Mac Allister',
  'Nicolas Otamendi',
  'Vinicius Junior',
  'Rodrygo',
  'Bruno Guimaraes',
  'Alisson Becker',
  'Marquinhos',
  'Raphinha',
  'Gabriel Martinelli',
  'Kylian Mbappe',
  'Antoine Griezmann',
  'Aurelien Tchouameni',
  'Mike Maignan',
  'Ousmane Dembele',
  'Theo Hernandez',
  'William Saliba',
  'Lamine Yamal',
  'Pedri',
  'Rodri',
  'Unai Simon',
  'Alvaro Morata',
  'Nico Williams',
  'Dani Carvajal',
  'Jamal Musiala',
  'Kai Havertz',
  'Florian Wirtz',
  'Marc-Andre ter Stegen',
  'Joshua Kimmich',
  'Antonio Rudiger',
  'Jude Bellingham',
  'Harry Kane',
  'Bukayo Saka',
  'Jordan Pickford',
  'Phil Foden',
  'Declan Rice',
  'Cole Palmer',
  'Cristiano Ronaldo',
  'Bruno Fernandes',
  'Rafael Leao',
  'Diogo Costa',
  'Bernardo Silva',
  'Joao Cancelo',
  'Federico Valverde',
  'Darwin Nunez',
  'Ronald Araujo',
  'Sergio Rochet',
  'Manuel Ugarte',
  'Luis Diaz',
  'James Rodriguez',
  'Richard Rios',
  'Camilo Vargas',
  'Jhon Duran',
  'Daniel Munoz',
  'Achraf Hakimi',
  'Sofyan Amrabat',
  'Youssef En-Nesyri',
  'Yassine Bounou',
  'Azzedine Ounahi',
  'Sergio Ramos',
  'Gianluigi Donnarumma',
  'Adrien Rabiot',
  'Christian Pulisic',
  'Alphonso Davies',
  'Hirving Lozano',
  'Santiago Gimenez',
  'Takefusa Kubo',
  'Kaoru Mitoma',
  'Kim Min-jae',
  'Son Heung-min',
  'Victor Osimhen',
  'Ademola Lookman',
  'Mohamed Salah',
  'Andre Onana',
  'Khvicha Kvaratskhelia',
  'Dominik Szoboszlai',
];

const WORLD_CUP_WIKIMEDIA_PHOTO_OVERRIDES = [
  ['Lionel Messi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Lionel_Messi_White_House_2026_%283x4_cropped%29.jpg/330px-Lionel_Messi_White_House_2026_%283x4_cropped%29.jpg'],
  ['Julian Alvarez', 'https://upload.wikimedia.org/wikipedia/commons/0/03/Argentina_national_football_team_-_2_-_2022_%28Juli%C3%A1n_%C3%81lvarez%29.jpg'],
  ['Enzo Fernandez', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Enzo_Fern%C3%A1ndez_2025_FIFA_Club_World_Cup_Final.jpg/330px-Enzo_Fern%C3%A1ndez_2025_FIFA_Club_World_Cup_Final.jpg'],
  ['Emiliano Martinez', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/St._Louis_City_vs_Aston_Villa_%28Jul_2025%29_14_%28Emiliano_Mart%C3%ADnez%29.jpg/330px-St._Louis_City_vs_Aston_Villa_%28Jul_2025%29_14_%28Emiliano_Mart%C3%ADnez%29.jpg'],
  ['Lautaro Martinez', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Lautaro_Martinez_ARGENTINA_VS_VENEZUELA_2017.jpg/330px-Lautaro_Martinez_ARGENTINA_VS_VENEZUELA_2017.jpg'],
  ['Alexis Mac Allister', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Alexis_Mac_Allister_04012026_%281%29.jpg/330px-Alexis_Mac_Allister_04012026_%281%29.jpg'],
  ['Nicolas Otamendi', 'https://upload.wikimedia.org/wikipedia/commons/d/de/Argentina_team_in_St._Petersburg_%28cropped%29_Otamendi.jpg'],
  ['Vinicius Junior', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/2023_05_06_Final_de_la_Copa_del_Rey_-_52879242230_%28cropped%29.jpg/330px-2023_05_06_Final_de_la_Copa_del_Rey_-_52879242230_%28cropped%29.jpg'],
  ['Rodrygo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Rodrygo_2023_%28cropped%29.jpg/330px-Rodrygo_2023_%28cropped%29.jpg'],
  ['Bruno Guimaraes', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Bruno_Guimar%C3%A3es.png/330px-Bruno_Guimar%C3%A3es.png'],
  ['Alisson Becker', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_850_1625.jpg/330px-20180610_FIFA_Friendly_Match_Austria_vs._Brazil_850_1625.jpg'],
  ['Marquinhos', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/FC_Salzburg_gegen_Paris_Saint-Germain_UEFA_Champions_League_49_%28cropped%29.jpg/330px-FC_Salzburg_gegen_Paris_Saint-Germain_UEFA_Champions_League_49_%28cropped%29.jpg'],
  ['Raphinha', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raphael_Dias_Belloli_2023.jpg/330px-Raphael_Dias_Belloli_2023.jpg'],
  ['Gabriel Martinelli', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/1_Gabriel_Martinelli_arsenal_2025_%28cropped%29.jpg/330px-1_Gabriel_Martinelli_arsenal_2025_%28cropped%29.jpg'],
  ['Kylian Mbappe', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Picture_with_Mbapp%C3%A9_%28cropped_and_rotated%29.jpg/330px-Picture_with_Mbapp%C3%A9_%28cropped_and_rotated%29.jpg'],
  ['Antoine Griezmann', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/FRA-ARG_%2810%29_%28cropped%29.jpg/330px-FRA-ARG_%2810%29_%28cropped%29.jpg'],
  ['Aurelien Tchouameni', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/2025_04_26_Final_de_la_Copa_del_Rey_-_Aur%C3%A9lien_Tchouam%C3%A9ni.jpg'],
  ['Mike Maignan', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mike_Maignan_2022_Salzburg_vs_AC_Milan_2022-09-06.jpg/330px-Mike_Maignan_2022_Salzburg_vs_AC_Milan_2022-09-06.jpg'],
  ['Ousmane Dembele', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ousmane_Demb%C3%A9l%C3%A9_2018_%28cropped%29.jpg/330px-Ousmane_Demb%C3%A9l%C3%A9_2018_%28cropped%29.jpg'],
  ['Theo Hernandez', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/FC_Salzburg_vs._AC_Mailand_%28UEFA_Championsleague_2022-09-06%29_Th%C3%A9o_Hernandez.jpg/330px-FC_Salzburg_vs._AC_Mailand_%28UEFA_Championsleague_2022-09-06%29_Th%C3%A9o_Hernandez.jpg'],
  ['William Saliba', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/1_william_saliba_arsenal_2025_%28cropped%29.jpg/330px-1_william_saliba_arsenal_2025_%28cropped%29.jpg'],
  ['Lamine Yamal', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Lamine_Yamal_in_2025.jpg/330px-Lamine_Yamal_in_2025.jpg'],
  ['Pedri', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Pedri.jpg/330px-Pedri.jpg'],
  ['Unai Simon', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Unai_Sim%C3%B3n_2025_%28cropped%29.jpg/330px-Unai_Sim%C3%B3n_2025_%28cropped%29.jpg'],
  ['Alvaro Morata', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/%C3%81lvaro_Morata_in_2025.jpg/330px-%C3%81lvaro_Morata_in_2025.jpg'],
  ['Nico Williams', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/ATHLETIC-OSASUNA_SEMIFINAL._MAIDER_GOIKOETXEA_%28168%29_%28cropped%29.jpg/330px-ATHLETIC-OSASUNA_SEMIFINAL._MAIDER_GOIKOETXEA_%28168%29_%28cropped%29.jpg'],
  ['Dani Carvajal', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/UEFA_EURO_qualifiers_Sweden_vs_Spain_20191015_Dani_Carvajal_10_%28cropped%29.jpg/330px-UEFA_EURO_qualifiers_Sweden_vs_Spain_20191015_Dani_Carvajal_10_%28cropped%29.jpg'],
  ['Jamal Musiala', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Jamal_Musiala_2022_%28cropped%29.jpg/330px-Jamal_Musiala_2022_%28cropped%29.jpg'],
  ['Kai Havertz', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Deutschland-Estland_StP_2059_LR10_by_Stepro.jpg/330px-2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Deutschland-Estland_StP_2059_LR10_by_Stepro.jpg'],
  ['Florian Wirtz', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Florian_Wirtz_04012026_%283%29_%28extracted%29.jpg/330px-Florian_Wirtz_04012026_%283%29_%28extracted%29.jpg'],
  ['Marc-Andre ter Stegen', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Marc-Andre_Ter_Stegen_ACCI_FCBARCELONA_Turisme_Catalunya_gira_pretemporada_CATPRESS.jpg/330px-Marc-Andre_Ter_Stegen_ACCI_FCBARCELONA_Turisme_Catalunya_gira_pretemporada_CATPRESS.jpg'],
  ['Joshua Kimmich', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Deutschland-Estland_StP_2078_LR10_by_Stepro_%28cropped%29.jpg/330px-2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Deutschland-Estland_StP_2078_LR10_by_Stepro_%28cropped%29.jpg'],
  ['Antonio Rudiger', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/20180602_FIFA_Friendly_Match_Austria_vs._Germany_Antonio_R%C3%BCdiger_850_0711.jpg/330px-20180602_FIFA_Friendly_Match_Austria_vs._Germany_Antonio_R%C3%BCdiger_850_0711.jpg'],
  ['Jude Bellingham', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190551-2_%28cropped%29.jpg/330px-25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190551-2_%28cropped%29.jpg'],
  ['Harry Kane', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Harry_Kane_on_October_10%2C_2023.jpg/330px-Harry_Kane_on_October_10%2C_2023.jpg'],
  ['Bukayo Saka', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/1_bukayo_saka_arsenal_2025_%28cropped%29.jpg/330px-1_bukayo_saka_arsenal_2025_%28cropped%29.jpg'],
  ['Jordan Pickford', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Jordan_Pickford_2022-07-16_1.jpg/330px-Jordan_Pickford_2022-07-16_1.jpg'],
  ['Phil Foden', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2613%2C_Phil_Foden.jpg/330px-2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2613%2C_Phil_Foden.jpg'],
  ['Declan Rice', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/1_declan_rice_arsenal_2025_%28cropped%29.jpg/330px-1_declan_rice_arsenal_2025_%28cropped%29.jpg'],
  ['Cole Palmer', 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Cole_Palmer_2025_FIFA_Club_World_Cup_Final.jpg'],
  ['Cristiano Ronaldo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/President_Donald_Trump_meets_with_Cristiano_Ronaldo_in_the_Oval_Office_%2854933344262%29_%28cropped_and_rotated%29.jpg/330px-President_Donald_Trump_meets_with_Cristiano_Ronaldo_in_the_Oval_Office_%2854933344262%29_%28cropped_and_rotated%29.jpg'],
  ['Bruno Fernandes', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Bruno_Fernandes_USMNT_v_Portugal_Mar_31_2026-27_%28cropped%29.jpg/330px-Bruno_Fernandes_USMNT_v_Portugal_Mar_31_2026-27_%28cropped%29.jpg'],
  ['Rafael Leao', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/RafaelLe%C3%A3oPortugal23.jpg/330px-RafaelLe%C3%A3oPortugal23.jpg'],
  ['Diogo Costa', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Portugal_national_football_team_0866_%28Diogo_Costa%29.jpg/330px-Portugal_national_football_team_0866_%28Diogo_Costa%29.jpg'],
  ['Bernardo Silva', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Bernardo_Silva_%28Isto_%C3%89_Gozar_Com_Quem_Trabalha%2C_2024%29.png/330px-Bernardo_Silva_%28Isto_%C3%89_Gozar_Com_Quem_Trabalha%2C_2024%29.png'],
  ['Joao Cancelo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Jo%C3%A3o_Cancelo_USMNT_v_Portugal_Mar_31_2026-30_%28cropped%29.jpg/330px-Jo%C3%A3o_Cancelo_USMNT_v_Portugal_Mar_31_2026-30_%28cropped%29.jpg'],
  ['Federico Valverde', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Federico_Valverde_2021_%28cropped%29.jpg/330px-Federico_Valverde_2021_%28cropped%29.jpg'],
  ['Darwin Nunez', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Darwin_N%C3%BA%C3%B1ez_%28cropped%29.jpg/330px-Darwin_N%C3%BA%C3%B1ez_%28cropped%29.jpg'],
  ['Ronald Araujo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/FC_Red_Bull_Salzburg_gegen_CF_Barcelona_%28Testspiel_4._August_2021%29_45_%28cropped%29.jpg/330px-FC_Red_Bull_Salzburg_gegen_CF_Barcelona_%28Testspiel_4._August_2021%29_45_%28cropped%29.jpg'],
  ['Achraf Hakimi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Achraf_Hakimi_vs_Niger%2C_5_Sept_2025.jpg/330px-Achraf_Hakimi_vs_Niger%2C_5_Sept_2025.jpg'],
  ['Sofyan Amrabat', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Sofyan_Amrabat_vs_Niger_%28cropped%29.jpg/330px-Sofyan_Amrabat_vs_Niger_%28cropped%29.jpg'],
  ['Youssef En-Nesyri', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Ennesyri.jpg/330px-Ennesyri.jpg'],
  ['Yassine Bounou', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Yassine_Bono_%28cropped%29.jpg/330px-Yassine_Bono_%28cropped%29.jpg'],
  ['Sergio Ramos', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sergio_Ramos_Interview_2021_%28cropped%29.jpg/330px-Sergio_Ramos_Interview_2021_%28cropped%29.jpg'],
  ['Adrien Rabiot', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Rabiot_asse_om_2425.png/330px-Rabiot_asse_om_2425.png'],
  ['Alphonso Davies', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Alphonso_Davies_in_2022.jpg/330px-Alphonso_Davies_in_2022.jpg'],
  ['Takefusa Kubo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Takefusa_Kubo_2019.png/330px-Takefusa_Kubo_2019.png'],
  ['Mohamed Salah', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mohamed_Salah_2018.jpg/330px-Mohamed_Salah_2018.jpg'],
  ['Khvicha Kvaratskhelia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kvaratskhelia_asse_psg_2425.png/330px-Kvaratskhelia_asse_psg_2425.png'],
  ['Rodri', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/RODRI_-_SWE_vs_ESP_-_UEFA_EURO_2020_QUALIFIERS_-_2019.10.15_%28cropped%29.jpg/330px-RODRI_-_SWE_vs_ESP_-_UEFA_EURO_2020_QUALIFIERS_-_2019.10.15_%28cropped%29.jpg'],
  ['James Rodriguez', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/James_Rodriguez_2018.jpg/330px-James_Rodriguez_2018.jpg'],
  ['Santiago Gimenez', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Santiago_Gim%C3%A9nez.png/330px-Santiago_Gim%C3%A9nez.png'],
];

const WORLD_CUP_WIKIMEDIA_PHOTOS_BY_NAME = new Map(
  WORLD_CUP_WIKIMEDIA_PHOTO_OVERRIDES.map(([name, photo]) => [normalizeLookupKey(name), photo])
);

const WORLD_CUP_FALLBACK_PLAYER_BASE = [
  ['wc-p-001', 'Lionel Messi', 'Argentina', 'Argentina', 'Forward', '1987-06-24', '10'],
  ['wc-p-002', 'Julian Alvarez', 'Argentina', 'Argentina', 'Forward', '2000-01-31', '9'],
  ['wc-p-003', 'Enzo Fernandez', 'Argentina', 'Argentina', 'Midfielder', '2001-01-17', '8'],
  ['wc-p-004', 'Emiliano Martinez', 'Argentina', 'Argentina', 'Goalkeeper', '1992-09-02', '23'],
  ['wc-p-005', 'Vinicius Junior', 'Brasil', 'Brasil', 'Winger', '2000-07-12', '7'],
  ['wc-p-006', 'Rodrygo', 'Brasil', 'Brasil', 'Forward', '2001-01-09', '10'],
  ['wc-p-007', 'Bruno Guimaraes', 'Brasil', 'Brasil', 'Midfielder', '1997-11-16', '8'],
  ['wc-p-008', 'Alisson Becker', 'Brasil', 'Brasil', 'Goalkeeper', '1992-10-02', '1'],
  ['wc-p-009', 'Kylian Mbappe', 'Francia', 'Francia', 'Forward', '1998-12-20', '10'],
  ['wc-p-010', 'Antoine Griezmann', 'Francia', 'Francia', 'Forward', '1991-03-21', '7'],
  ['wc-p-011', 'Aurelien Tchouameni', 'Francia', 'Francia', 'Midfielder', '2000-01-27', '8'],
  ['wc-p-012', 'Mike Maignan', 'Francia', 'Francia', 'Goalkeeper', '1995-07-03', '16'],
  ['wc-p-013', 'Lamine Yamal', 'España', 'España', 'Winger', '2007-07-13', '19'],
  ['wc-p-014', 'Pedri', 'España', 'España', 'Midfielder', '2002-11-25', '8'],
  ['wc-p-015', 'Rodri', 'España', 'España', 'Midfielder', '1996-06-22', '16'],
  ['wc-p-016', 'Unai Simon', 'España', 'España', 'Goalkeeper', '1997-06-11', '23'],
  ['wc-p-017', 'Jamal Musiala', 'Alemania', 'Alemania', 'Midfielder', '2003-02-26', '10'],
  ['wc-p-018', 'Kai Havertz', 'Alemania', 'Alemania', 'Forward', '1999-06-11', '7'],
  ['wc-p-019', 'Florian Wirtz', 'Alemania', 'Alemania', 'Midfielder', '2003-05-03', '17'],
  ['wc-p-020', 'Marc-Andre ter Stegen', 'Alemania', 'Alemania', 'Goalkeeper', '1992-04-30', '1'],
  ['wc-p-021', 'Jude Bellingham', 'Inglaterra', 'Inglaterra', 'Midfielder', '2003-06-29', '10'],
  ['wc-p-022', 'Harry Kane', 'Inglaterra', 'Inglaterra', 'Forward', '1993-07-28', '9'],
  ['wc-p-023', 'Bukayo Saka', 'Inglaterra', 'Inglaterra', 'Winger', '2001-09-05', '7'],
  ['wc-p-024', 'Jordan Pickford', 'Inglaterra', 'Inglaterra', 'Goalkeeper', '1994-03-07', '1'],
  ['wc-p-025', 'Cristiano Ronaldo', 'Portugal', 'Portugal', 'Forward', '1985-02-05', '7'],
  ['wc-p-026', 'Bruno Fernandes', 'Portugal', 'Portugal', 'Midfielder', '1994-09-08', '8'],
  ['wc-p-027', 'Rafael Leao', 'Portugal', 'Portugal', 'Winger', '1999-06-10', '17'],
  ['wc-p-028', 'Diogo Costa', 'Portugal', 'Portugal', 'Goalkeeper', '1999-09-19', '1'],
  ['wc-p-029', 'Federico Valverde', 'Uruguay', 'Uruguay', 'Midfielder', '1998-07-22', '15'],
  ['wc-p-030', 'Darwin Nunez', 'Uruguay', 'Uruguay', 'Forward', '1999-06-24', '9'],
  ['wc-p-031', 'Ronald Araujo', 'Uruguay', 'Uruguay', 'Defender', '1999-03-07', '4'],
  ['wc-p-032', 'Sergio Rochet', 'Uruguay', 'Uruguay', 'Goalkeeper', '1993-03-23', '1'],
  ['wc-p-033', 'Luis Diaz', 'Colombia', 'Colombia', 'Winger', '1997-01-13', '7'],
  ['wc-p-034', 'James Rodriguez', 'Colombia', 'Colombia', 'Midfielder', '1991-07-12', '10'],
  ['wc-p-035', 'Richard Rios', 'Colombia', 'Colombia', 'Midfielder', '2000-06-02', '6'],
  ['wc-p-036', 'Camilo Vargas', 'Colombia', 'Colombia', 'Goalkeeper', '1989-01-09', '12'],
  ['wc-p-037', 'Achraf Hakimi', 'Marruecos', 'Marruecos', 'Defender', '1998-11-04', '2'],
  ['wc-p-038', 'Sofyan Amrabat', 'Marruecos', 'Marruecos', 'Midfielder', '1996-08-21', '4'],
  ['wc-p-039', 'Youssef En-Nesyri', 'Marruecos', 'Marruecos', 'Forward', '1997-06-01', '19'],
  ['wc-p-040', 'Yassine Bounou', 'Marruecos', 'Marruecos', 'Goalkeeper', '1991-04-05', '1'],
];

const WORLD_CUP_FALLBACK_BASE_PLAYERS = WORLD_CUP_FALLBACK_PLAYER_BASE.map(
  ([idPlayer, strPlayer, strTeam, strNationality, strPosition, dateBorn, strNumber]) => {
    const overridePhoto = WORLD_CUP_WIKIMEDIA_PHOTOS_BY_NAME.get(normalizeLookupKey(strPlayer)) || '';
    return {
      idPlayer,
      strPlayer,
      strTeam,
      strNationality,
      strPosition,
      dateBorn,
      strNumber,
      strHeight: '',
      strWeight: '',
      strThumb: overridePhoto || createFallbackPlayerPhoto(strPlayer, strTeam),
    };
  }
);

const BASE_PLAYER_NAMES = new Set(
  WORLD_CUP_FALLBACK_PLAYER_BASE.map(([, strPlayer]) => normalizeLookupKey(strPlayer))
);

const WORLD_CUP_FALLBACK_EXTRA_PLAYERS = WORLD_CUP_WIKIMEDIA_PHOTO_OVERRIDES.filter(
  ([name]) => !BASE_PLAYER_NAMES.has(normalizeLookupKey(name))
).map(([strPlayer, strThumb], idx) => ({
  idPlayer: `wc-x-${String(idx + 1).padStart(3, '0')}`,
  strPlayer,
  strTeam: 'Seleccion Nacional',
  strNationality: '',
  strPosition: 'Forward',
  dateBorn: '',
  strNumber: '',
  strHeight: '',
  strWeight: '',
  strThumb,
}));

export const WORLD_CUP_FALLBACK_PLAYERS = [
  ...WORLD_CUP_FALLBACK_BASE_PLAYERS,
  ...WORLD_CUP_FALLBACK_EXTRA_PLAYERS,
].map(
  ({ idPlayer, strPlayer, strTeam, strNationality, strPosition, dateBorn, strNumber, strHeight, strWeight, strThumb }) => ({
    idPlayer,
    strPlayer,
    strTeam,
    strNationality,
    strPosition,
    dateBorn,
    strNumber,
    strHeight,
    strWeight,
    strThumb,
  })
);

