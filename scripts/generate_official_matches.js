const fs = require('fs');

const rawData = `
1	11-Jun-26	15:00	13:00	Mexico v South Africa	A	Estadio Azteca	Mexico City
2	11-Jun-26	22:00	20:00	South Korea v Czechia	A	Estadio Akron	Guadalajara
3	12-Jun-26	15:00	15:00	Canada v Bosnia and Herzegovina	B	BMO Field	Toronto
4	12-Jun-26	21:00	18:00	USA v Paraguay	D	SoFi Stadium	Los Angeles
5	13-Jun-26	21:00	21:00	Haiti v Scotland	C	Gillette Stadium	Boston
6	13-Jun-26	00:00	21:00	Australia v Türkiye	D	BC Place	Vancouver
7	13-Jun-26	18:00	18:00	Brazil v Morocco	C	MetLife Stadium	New York/New Jersey
8	13-Jun-26	15:00	12:00	Qatar v Switzerland	B	Levi's Stadium	San Francisco Bay Area
9	14-Jun-26	19:00	19:00	Ivory Coast v Ecuador	E	Lincoln Financial Field	Philadelphia
10	14-Jun-26	13:00	12:00	Germany v Curaçao	E	NRG Stadium	Houston
11	14-Jun-26	16:00	15:00	Netherlands v Japan	F	AT&T Stadium	Dallas
12	14-Jun-26	22:00	20:00	Sweden v Tunisia	F	Estadio BBVA	Monterrey
13	15-Jun-26	18:00	18:00	Saudi Arabia v Uruguay	H	Hard Rock Stadium	Miami
14	15-Jun-26	12:00	12:00	Spain v Cape Verde	H	Mercedes-Benz Stadium	Atlanta
15	15-Jun-26	21:00	18:00	Iran v New Zealand	G	SoFi Stadium	Los Angeles
16	15-Jun-26	15:00	12:00	Belgium v Egypt	G	Lumen Field	Seattle
17	16-Jun-26	15:00	15:00	France v Senegal	I	MetLife Stadium	New York/New Jersey
18	16-Jun-26	18:00	18:00	Iraq v Norway	I	Gillette Stadium	Boston
19	16-Jun-26	21:00	20:00	Argentina v Algeria	J	Arrowhead Stadium	Kansas City
20	16-Jun-26	00:00	21:00	Austria v Jordan	J	Levi's Stadium	San Francisco Bay Area
21	17-Jun-26	19:00	19:00	Ghana v Panama	L	BMO Field	Toronto
22	17-Jun-26	16:00	15:00	England v Croatia	L	AT&T Stadium	Dallas
23	17-Jun-26	13:00	12:00	Portugal v Congo DR	K	NRG Stadium	Houston
24	17-Jun-26	22:00	20:00	Uzbekistan v Colombia	K	Estadio Azteca	Mexico City
25	18-Jun-26	12:00	12:00	Czechia v South Africa	A	Mercedes-Benz Stadium	Atlanta
26	18-Jun-26	15:00	12:00	Switzerland v Bosnia and Herzegovina	B	SoFi Stadium	Los Angeles
27	18-Jun-26	18:00	15:00	Canada v Qatar	B	BC Place	Vancouver
28	18-Jun-26	21:00	19:00	Mexico v South Korea	A	Estadio Akron	Guadalajara
29	19-Jun-26	21:00	21:00	Brazil v Haiti	C	Lincoln Financial Field	Philadelphia
30	19-Jun-26	18:00	18:00	Scotland v Morocco	C	Gillette Stadium	Boston
31	19-Jun-26	23:00	20:00	Türkiye v Paraguay	D	Levi's Stadium	San Francisco Bay Area
32	19-Jun-26	15:00	12:00	USA v Australia	D	Lumen Field	Seattle
33	20-Jun-26	16:00	16:00	Germany v Ivory Coast	E	BMO Field	Toronto
34	20-Jun-26	20:00	19:00	Ecuador v Curaçao	E	Arrowhead Stadium	Kansas City
35	20-Jun-26	13:00	12:00	Netherlands v Sweden	F	NRG Stadium	Houston
36	20-Jun-26	00:00	22:00	Tunisia v Japan	F	Estadio BBVA	Monterrey
37	21-Jun-26	18:00	18:00	Uruguay v Cape Verde	H	Hard Rock Stadium	Miami
38	21-Jun-26	12:00	12:00	Spain v Saudi Arabia	H	Mercedes-Benz Stadium	Atlanta
39	21-Jun-26	15:00	12:00	Belgium v Iran	G	SoFi Stadium	Los Angeles
40	21-Jun-26	21:00	18:00	New Zealand v Egypt	G	BC Place	Vancouver
41	22-Jun-26	20:00	20:00	Norway v Senegal	I	MetLife Stadium	New York/New Jersey
42	22-Jun-26	17:00	17:00	France v Iraq	I	Lincoln Financial Field	Philadelphia
43	22-Jun-26	13:00	12:00	Argentina v Austria	J	AT&T Stadium	Dallas
44	22-Jun-26	23:00	20:00	Jordan v Algeria	J	Levi's Stadium	San Francisco Bay Area
45	23-Jun-26	16:00	16:00	England v Ghana	L	Gillette Stadium	Boston
46	23-Jun-26	19:00	19:00	Panama v Croatia	L	BMO Field	Toronto
47	23-Jun-26	13:00	12:00	Portugal v Uzbekistan	K	NRG Stadium	Houston
48	23-Jun-26	22:00	20:00	Colombia v Congo DR	K	Estadio Akron	Guadalajara
49	24-Jun-26	18:00	18:00	Scotland v Brazil	C	Hard Rock Stadium	Miami
50	24-Jun-26	18:00	18:00	Morocco v Haiti	C	Mercedes-Benz Stadium	Atlanta
51	24-Jun-26	15:00	12:00	Switzerland v Canada	B	BC Place	Vancouver
52	24-Jun-26	15:00	12:00	Bosnia and Herzegovina v Qatar	B	Lumen Field	Seattle
53	24-Jun-26	21:00	19:00	Czechia v Mexico	A	Estadio Azteca	Mexico City
54	24-Jun-26	21:00	19:00	South Africa v South Korea	A	Estadio BBVA	Monterrey
55	25-Jun-26	16:00	16:00	Curaçao v Ivory Coast	E	Lincoln Financial Field	Philadelphia
56	25-Jun-26	16:00	16:00	Ecuador v Germany	E	MetLife Stadium	New York/New Jersey
57	25-Jun-26	19:00	18:00	Japan v Sweden	F	AT&T Stadium	Dallas
58	25-Jun-26	19:00	18:00	Tunisia v Netherlands	F	Arrowhead Stadium	Kansas City
59	25-Jun-26	22:00	19:00	Türkiye v USA	D	SoFi Stadium	Los Angeles
60	25-Jun-26	22:00	19:00	Paraguay v Australia	D	Levi's Stadium	San Francisco Bay Area
61	26-Jun-26	15:00	15:00	Norway v France	I	Gillette Stadium	Boston
62	26-Jun-26	15:00	15:00	Senegal v Iraq	I	BMO Field	Toronto
63	26-Jun-26	23:00	20:00	Egypt v Iran	G	Lumen Field	Seattle
64	26-Jun-26	23:00	20:00	New Zealand v Belgium	G	BC Place	Vancouver
65	26-Jun-26	20:00	19:00	Cape Verde v Saudi Arabia	H	NRG Stadium	Houston
66	26-Jun-26	20:00	18:00	Uruguay v Spain	H	Estadio Akron	Guadalajara
67	27-Jun-26	17:00	17:00	Panama v England	L	MetLife Stadium	New York/New Jersey
68	27-Jun-26	17:00	17:00	Croatia v Ghana	L	Lincoln Financial Field	Philadelphia
69	27-Jun-26	22:00	21:00	Algeria v Austria	J	Arrowhead Stadium	Kansas City
70	27-Jun-26	22:00	21:00	Jordan v Argentina	J	AT&T Stadium	Dallas
71	27-Jun-26	19:30	19:30	Colombia v Portugal	K	Hard Rock Stadium	Miami
72	27-Jun-26	19:30	19:30	Congo DR v Uzbekistan	K	Mercedes-Benz Stadium	Atlanta
`;

const lines = rawData.trim().split('\n');

let sql = '-- KUSTUTAME KÕIK OLEMASOLEVAD MÄNGUD\nTRUNCATE public.matches CASCADE;\n\n';
sql += 'DO $$\nDECLARE\n  t_id UUID;\n  s_id UUID;\nBEGIN\n  SELECT id INTO t_id FROM public.tournaments WHERE year = 2026 LIMIT 1;\n  SELECT id INTO s_id FROM public.stages WHERE slug = \'group_stage\' AND tournament_id = t_id;\n\n';

for (const line of lines) {
  if (!line.trim() || line.startsWith('Match')) continue;

  const parts = line.split('\t');
  if (parts.length < 8) continue;

  const matchNum = parts[0];
  const dateStr = parts[1]; // 11-Jun-26
  const timeEst = parts[2]; // 15:00 (EST is UTC-4 in summer)
  const matchup = parts[4]; // Mexico v South Africa
  const group = parts[5]; // A
  const venue = parts[6];
  const city = parts[7];

  // Map team names back to the DB exactly as they are in seed.sql
  // E.g. "Congo DR" -> "DR Congo", "USA" -> "United States", "Türkiye" -> "Turkey"
  let homeTeam = matchup.split(' v ')[0].trim();
  let awayTeam = matchup.split(' v ')[1].trim();

  const nameMapping = {
    'USA': 'United States',
    'Türkiye': 'Turkey',
    'Congo DR': 'DR Congo',
    'Czechia': 'Czech Republic'
  };

  if (nameMapping[homeTeam]) homeTeam = nameMapping[homeTeam];
  if (nameMapping[awayTeam]) awayTeam = nameMapping[awayTeam];

  // Handle cross-midnight dates correctly based on the local/EST time
  const isoDate = new Date(`${dateStr} ${timeEst} EDT`).toISOString();

  // Escape single quotes for SQL (e.g. Levi's Stadium -> Levi''s Stadium)
  const venueStr = `${venue}, ${city}`.replace(/'/g, "''");

  sql += `  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = '${group}' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = '${homeTeam}'),
         (SELECT id FROM public.teams WHERE name_en = '${awayTeam}'),
         '${isoDate}', 
         '${venueStr}', 
         'upcoming';\n\n`;
}

sql += 'END $$;\n';
fs.writeFileSync('supabase/seed_official_matches.sql', sql);
