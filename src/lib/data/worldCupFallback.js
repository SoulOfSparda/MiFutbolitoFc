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

export const WORLD_CUP_FALLBACK_PLAYERS = [
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
].map(
  ([idPlayer, strPlayer, strTeam, strNationality, strPosition, dateBorn, strNumber]) => ({
    idPlayer,
    strPlayer,
    strTeam,
    strNationality,
    strPosition,
    dateBorn,
    strNumber,
    strHeight: '',
    strWeight: '',
    strThumb: '',
  })
);

