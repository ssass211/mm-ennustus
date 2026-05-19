const fs = require('fs');

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const venues = [
  'Estadio Azteca, Mexico City', 
  'MetLife Stadium, New York/New Jersey', 
  'AT&T Stadium, Dallas', 
  'SoFi Stadium, Los Angeles', 
  'Mercedes-Benz Stadium, Atlanta', 
  'BC Place, Vancouver', 
  'BMO Field, Toronto', 
  'Estadio Akron, Guadalajara', 
  'Estadio BBVA, Monterrey', 
  'Gillette Stadium, Boston', 
  'NRG Stadium, Houston', 
  'Arrowhead Stadium, Kansas City', 
  'Hard Rock Stadium, Miami', 
  "Levi's Stadium, San Francisco Bay Area",
  'Lumen Field, Seattle', 
  'Lincoln Financial Field, Philadelphia'
];

let sql = '-- KUSTUTAME KÕIK OLEMASOLEVAD MÄNGUD\\nTRUNCATE public.matches CASCADE;\\n\\n';
sql += 'DO $$\\nDECLARE\\n  t_id UUID;\\nBEGIN\\n  SELECT id INTO t_id FROM public.tournaments WHERE year = 2026 LIMIT 1;\\n\\n';

for (let i = 0; i < groups.length; i++) {
  const gName = groups[i];
  
  // Base date for matchday 1 (Group A & B on June 11, C & D on June 12, etc.)
  const dayOffset = Math.floor(i / 2); 
  const md1Date = new Date(Date.UTC(2026, 5, 11 + dayOffset)); // June 11 is month 5
  const md2Date = new Date(Date.UTC(2026, 5, 11 + dayOffset + 5)); 
  const md3Date = new Date(Date.UTC(2026, 5, 11 + dayOffset + 10));

  const pairings = [
    { num1: 1, num2: 2, date: md1Date, time: '16:00:00' },
    { num1: 3, num2: 4, date: md1Date, time: '20:00:00' },
    { num1: 1, num2: 3, date: md2Date, time: '16:00:00' },
    { num1: 4, num2: 2, date: md2Date, time: '20:00:00' },
    { num1: 4, num2: 1, date: md3Date, time: '18:00:00' }, // Simultaneous last day
    { num1: 2, num2: 3, date: md3Date, time: '18:00:00' }
  ];

  for (const pair of pairings) {
    const venue = venues[Math.floor(Math.random() * venues.length)];
    const matchTime = `${pair.date.toISOString().split('T')[0]} ${pair.time}+00`;
    
    sql += `  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '${matchTime}', '${venue}', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = '${gName}' AND tournament_id = t_id)) gt1 ON gt1.rn = ${pair.num1}
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = '${gName}' AND tournament_id = t_id)) gt2 ON gt2.rn = ${pair.num2}
  WHERE g.name = '${gName}' AND g.tournament_id = t_id;\n\n`;
  }
}

sql += 'END $$;\n';
fs.writeFileSync('supabase/seed_matches.sql', sql);
