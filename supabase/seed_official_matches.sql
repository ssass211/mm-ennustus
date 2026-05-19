-- KUSTUTAME KÕIK OLEMASOLEVAD MÄNGUD
TRUNCATE public.matches CASCADE;

DO $$
DECLARE
  t_id UUID;
  s_id UUID;
BEGIN
  SELECT id INTO t_id FROM public.tournaments WHERE year = 2026 LIMIT 1;
  SELECT id INTO s_id FROM public.stages WHERE slug = 'group_stage' AND tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Mexico'),
         (SELECT id FROM public.teams WHERE name_en = 'South Africa'),
         '2026-06-11T19:00:00.000Z', 
         'Estadio Azteca, Mexico City', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'South Korea'),
         (SELECT id FROM public.teams WHERE name_en = 'Czech Republic'),
         '2026-06-12T02:00:00.000Z', 
         'Estadio Akron, Guadalajara', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Canada'),
         (SELECT id FROM public.teams WHERE name_en = 'Bosnia and Herzegovina'),
         '2026-06-12T19:00:00.000Z', 
         'BMO Field, Toronto', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'United States'),
         (SELECT id FROM public.teams WHERE name_en = 'Paraguay'),
         '2026-06-13T01:00:00.000Z', 
         'SoFi Stadium, Los Angeles', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Haiti'),
         (SELECT id FROM public.teams WHERE name_en = 'Scotland'),
         '2026-06-14T01:00:00.000Z', 
         'Gillette Stadium, Boston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Australia'),
         (SELECT id FROM public.teams WHERE name_en = 'Turkey'),
         '2026-06-13T04:00:00.000Z', 
         'BC Place, Vancouver', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Brazil'),
         (SELECT id FROM public.teams WHERE name_en = 'Morocco'),
         '2026-06-13T22:00:00.000Z', 
         'MetLife Stadium, New York/New Jersey', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Qatar'),
         (SELECT id FROM public.teams WHERE name_en = 'Switzerland'),
         '2026-06-13T19:00:00.000Z', 
         'Levi''s Stadium, San Francisco Bay Area', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Ivory Coast'),
         (SELECT id FROM public.teams WHERE name_en = 'Ecuador'),
         '2026-06-14T23:00:00.000Z', 
         'Lincoln Financial Field, Philadelphia', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Germany'),
         (SELECT id FROM public.teams WHERE name_en = 'Curaçao'),
         '2026-06-14T17:00:00.000Z', 
         'NRG Stadium, Houston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Netherlands'),
         (SELECT id FROM public.teams WHERE name_en = 'Japan'),
         '2026-06-14T20:00:00.000Z', 
         'AT&T Stadium, Dallas', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Sweden'),
         (SELECT id FROM public.teams WHERE name_en = 'Tunisia'),
         '2026-06-15T02:00:00.000Z', 
         'Estadio BBVA, Monterrey', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Saudi Arabia'),
         (SELECT id FROM public.teams WHERE name_en = 'Uruguay'),
         '2026-06-15T22:00:00.000Z', 
         'Hard Rock Stadium, Miami', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Spain'),
         (SELECT id FROM public.teams WHERE name_en = 'Cape Verde'),
         '2026-06-15T16:00:00.000Z', 
         'Mercedes-Benz Stadium, Atlanta', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Iran'),
         (SELECT id FROM public.teams WHERE name_en = 'New Zealand'),
         '2026-06-16T01:00:00.000Z', 
         'SoFi Stadium, Los Angeles', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Belgium'),
         (SELECT id FROM public.teams WHERE name_en = 'Egypt'),
         '2026-06-15T19:00:00.000Z', 
         'Lumen Field, Seattle', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'France'),
         (SELECT id FROM public.teams WHERE name_en = 'Senegal'),
         '2026-06-16T19:00:00.000Z', 
         'MetLife Stadium, New York/New Jersey', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Iraq'),
         (SELECT id FROM public.teams WHERE name_en = 'Norway'),
         '2026-06-16T22:00:00.000Z', 
         'Gillette Stadium, Boston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Argentina'),
         (SELECT id FROM public.teams WHERE name_en = 'Algeria'),
         '2026-06-17T01:00:00.000Z', 
         'Arrowhead Stadium, Kansas City', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Austria'),
         (SELECT id FROM public.teams WHERE name_en = 'Jordan'),
         '2026-06-16T04:00:00.000Z', 
         'Levi''s Stadium, San Francisco Bay Area', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Ghana'),
         (SELECT id FROM public.teams WHERE name_en = 'Panama'),
         '2026-06-17T23:00:00.000Z', 
         'BMO Field, Toronto', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'England'),
         (SELECT id FROM public.teams WHERE name_en = 'Croatia'),
         '2026-06-17T20:00:00.000Z', 
         'AT&T Stadium, Dallas', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Portugal'),
         (SELECT id FROM public.teams WHERE name_en = 'DR Congo'),
         '2026-06-17T17:00:00.000Z', 
         'NRG Stadium, Houston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Uzbekistan'),
         (SELECT id FROM public.teams WHERE name_en = 'Colombia'),
         '2026-06-18T02:00:00.000Z', 
         'Estadio Azteca, Mexico City', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Czech Republic'),
         (SELECT id FROM public.teams WHERE name_en = 'South Africa'),
         '2026-06-18T16:00:00.000Z', 
         'Mercedes-Benz Stadium, Atlanta', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Switzerland'),
         (SELECT id FROM public.teams WHERE name_en = 'Bosnia and Herzegovina'),
         '2026-06-18T19:00:00.000Z', 
         'SoFi Stadium, Los Angeles', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Canada'),
         (SELECT id FROM public.teams WHERE name_en = 'Qatar'),
         '2026-06-18T22:00:00.000Z', 
         'BC Place, Vancouver', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Mexico'),
         (SELECT id FROM public.teams WHERE name_en = 'South Korea'),
         '2026-06-19T01:00:00.000Z', 
         'Estadio Akron, Guadalajara', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Brazil'),
         (SELECT id FROM public.teams WHERE name_en = 'Haiti'),
         '2026-06-20T01:00:00.000Z', 
         'Lincoln Financial Field, Philadelphia', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Scotland'),
         (SELECT id FROM public.teams WHERE name_en = 'Morocco'),
         '2026-06-19T22:00:00.000Z', 
         'Gillette Stadium, Boston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Turkey'),
         (SELECT id FROM public.teams WHERE name_en = 'Paraguay'),
         '2026-06-20T03:00:00.000Z', 
         'Levi''s Stadium, San Francisco Bay Area', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'United States'),
         (SELECT id FROM public.teams WHERE name_en = 'Australia'),
         '2026-06-19T19:00:00.000Z', 
         'Lumen Field, Seattle', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Germany'),
         (SELECT id FROM public.teams WHERE name_en = 'Ivory Coast'),
         '2026-06-20T20:00:00.000Z', 
         'BMO Field, Toronto', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Ecuador'),
         (SELECT id FROM public.teams WHERE name_en = 'Curaçao'),
         '2026-06-21T00:00:00.000Z', 
         'Arrowhead Stadium, Kansas City', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Netherlands'),
         (SELECT id FROM public.teams WHERE name_en = 'Sweden'),
         '2026-06-20T17:00:00.000Z', 
         'NRG Stadium, Houston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Tunisia'),
         (SELECT id FROM public.teams WHERE name_en = 'Japan'),
         '2026-06-20T04:00:00.000Z', 
         'Estadio BBVA, Monterrey', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Uruguay'),
         (SELECT id FROM public.teams WHERE name_en = 'Cape Verde'),
         '2026-06-21T22:00:00.000Z', 
         'Hard Rock Stadium, Miami', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Spain'),
         (SELECT id FROM public.teams WHERE name_en = 'Saudi Arabia'),
         '2026-06-21T16:00:00.000Z', 
         'Mercedes-Benz Stadium, Atlanta', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Belgium'),
         (SELECT id FROM public.teams WHERE name_en = 'Iran'),
         '2026-06-21T19:00:00.000Z', 
         'SoFi Stadium, Los Angeles', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'New Zealand'),
         (SELECT id FROM public.teams WHERE name_en = 'Egypt'),
         '2026-06-22T01:00:00.000Z', 
         'BC Place, Vancouver', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Norway'),
         (SELECT id FROM public.teams WHERE name_en = 'Senegal'),
         '2026-06-23T00:00:00.000Z', 
         'MetLife Stadium, New York/New Jersey', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'France'),
         (SELECT id FROM public.teams WHERE name_en = 'Iraq'),
         '2026-06-22T21:00:00.000Z', 
         'Lincoln Financial Field, Philadelphia', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Argentina'),
         (SELECT id FROM public.teams WHERE name_en = 'Austria'),
         '2026-06-22T17:00:00.000Z', 
         'AT&T Stadium, Dallas', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Jordan'),
         (SELECT id FROM public.teams WHERE name_en = 'Algeria'),
         '2026-06-23T03:00:00.000Z', 
         'Levi''s Stadium, San Francisco Bay Area', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'England'),
         (SELECT id FROM public.teams WHERE name_en = 'Ghana'),
         '2026-06-23T20:00:00.000Z', 
         'Gillette Stadium, Boston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Panama'),
         (SELECT id FROM public.teams WHERE name_en = 'Croatia'),
         '2026-06-23T23:00:00.000Z', 
         'BMO Field, Toronto', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Portugal'),
         (SELECT id FROM public.teams WHERE name_en = 'Uzbekistan'),
         '2026-06-23T17:00:00.000Z', 
         'NRG Stadium, Houston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Colombia'),
         (SELECT id FROM public.teams WHERE name_en = 'DR Congo'),
         '2026-06-24T02:00:00.000Z', 
         'Estadio Akron, Guadalajara', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Scotland'),
         (SELECT id FROM public.teams WHERE name_en = 'Brazil'),
         '2026-06-24T22:00:00.000Z', 
         'Hard Rock Stadium, Miami', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Morocco'),
         (SELECT id FROM public.teams WHERE name_en = 'Haiti'),
         '2026-06-24T22:00:00.000Z', 
         'Mercedes-Benz Stadium, Atlanta', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Switzerland'),
         (SELECT id FROM public.teams WHERE name_en = 'Canada'),
         '2026-06-24T19:00:00.000Z', 
         'BC Place, Vancouver', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Bosnia and Herzegovina'),
         (SELECT id FROM public.teams WHERE name_en = 'Qatar'),
         '2026-06-24T19:00:00.000Z', 
         'Lumen Field, Seattle', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Czech Republic'),
         (SELECT id FROM public.teams WHERE name_en = 'Mexico'),
         '2026-06-25T01:00:00.000Z', 
         'Estadio Azteca, Mexico City', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'South Africa'),
         (SELECT id FROM public.teams WHERE name_en = 'South Korea'),
         '2026-06-25T01:00:00.000Z', 
         'Estadio BBVA, Monterrey', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Curaçao'),
         (SELECT id FROM public.teams WHERE name_en = 'Ivory Coast'),
         '2026-06-25T20:00:00.000Z', 
         'Lincoln Financial Field, Philadelphia', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Ecuador'),
         (SELECT id FROM public.teams WHERE name_en = 'Germany'),
         '2026-06-25T20:00:00.000Z', 
         'MetLife Stadium, New York/New Jersey', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Japan'),
         (SELECT id FROM public.teams WHERE name_en = 'Sweden'),
         '2026-06-25T23:00:00.000Z', 
         'AT&T Stadium, Dallas', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Tunisia'),
         (SELECT id FROM public.teams WHERE name_en = 'Netherlands'),
         '2026-06-25T23:00:00.000Z', 
         'Arrowhead Stadium, Kansas City', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Turkey'),
         (SELECT id FROM public.teams WHERE name_en = 'United States'),
         '2026-06-26T02:00:00.000Z', 
         'SoFi Stadium, Los Angeles', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Paraguay'),
         (SELECT id FROM public.teams WHERE name_en = 'Australia'),
         '2026-06-26T02:00:00.000Z', 
         'Levi''s Stadium, San Francisco Bay Area', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Norway'),
         (SELECT id FROM public.teams WHERE name_en = 'France'),
         '2026-06-26T19:00:00.000Z', 
         'Gillette Stadium, Boston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Senegal'),
         (SELECT id FROM public.teams WHERE name_en = 'Iraq'),
         '2026-06-26T19:00:00.000Z', 
         'BMO Field, Toronto', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Egypt'),
         (SELECT id FROM public.teams WHERE name_en = 'Iran'),
         '2026-06-27T03:00:00.000Z', 
         'Lumen Field, Seattle', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'New Zealand'),
         (SELECT id FROM public.teams WHERE name_en = 'Belgium'),
         '2026-06-27T03:00:00.000Z', 
         'BC Place, Vancouver', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Cape Verde'),
         (SELECT id FROM public.teams WHERE name_en = 'Saudi Arabia'),
         '2026-06-27T00:00:00.000Z', 
         'NRG Stadium, Houston', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Uruguay'),
         (SELECT id FROM public.teams WHERE name_en = 'Spain'),
         '2026-06-27T00:00:00.000Z', 
         'Estadio Akron, Guadalajara', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Panama'),
         (SELECT id FROM public.teams WHERE name_en = 'England'),
         '2026-06-27T21:00:00.000Z', 
         'MetLife Stadium, New York/New Jersey', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Croatia'),
         (SELECT id FROM public.teams WHERE name_en = 'Ghana'),
         '2026-06-27T21:00:00.000Z', 
         'Lincoln Financial Field, Philadelphia', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Algeria'),
         (SELECT id FROM public.teams WHERE name_en = 'Austria'),
         '2026-06-28T02:00:00.000Z', 
         'Arrowhead Stadium, Kansas City', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Jordan'),
         (SELECT id FROM public.teams WHERE name_en = 'Argentina'),
         '2026-06-28T02:00:00.000Z', 
         'AT&T Stadium, Dallas', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'Colombia'),
         (SELECT id FROM public.teams WHERE name_en = 'Portugal'),
         '2026-06-27T23:30:00.000Z', 
         'Hard Rock Stadium, Miami', 
         'upcoming';

  INSERT INTO public.matches (tournament_id, stage_id, group_id, home_team_id, away_team_id, match_datetime, venue, status)
  SELECT t_id, 
         s_id,
         (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id),
         (SELECT id FROM public.teams WHERE name_en = 'DR Congo'),
         (SELECT id FROM public.teams WHERE name_en = 'Uzbekistan'),
         '2026-06-27T23:30:00.000Z', 
         'Mercedes-Benz Stadium, Atlanta', 
         'upcoming';

END $$;
