-- KUSTUTAME KÕIK OLEMASOLEVAD MÄNGUD\nTRUNCATE public.matches CASCADE;\n\nDO $$\nDECLARE\n  t_id UUID;\nBEGIN\n  SELECT id INTO t_id FROM public.tournaments WHERE year = 2026 LIMIT 1;\n\n  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-11 16:00:00+00', 'BMO Field, Toronto', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'A' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-11 20:00:00+00', 'AT&T Stadium, Dallas', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'A' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-16 16:00:00+00', 'Arrowhead Stadium, Kansas City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'A' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-16 20:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'A' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-21 18:00:00+00', 'Arrowhead Stadium, Kansas City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'A' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-21 18:00:00+00', 'Estadio Azteca, Mexico City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'A' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'A' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-11 16:00:00+00', 'Levi's Stadium, San Francisco Bay Area', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'B' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-11 20:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'B' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-16 16:00:00+00', 'Hard Rock Stadium, Miami', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'B' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-16 20:00:00+00', 'Lincoln Financial Field, Philadelphia', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'B' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-21 18:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'B' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-21 18:00:00+00', 'NRG Stadium, Houston', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'B' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'B' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-12 16:00:00+00', 'Arrowhead Stadium, Kansas City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'C' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-12 20:00:00+00', 'Estadio Azteca, Mexico City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'C' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-17 16:00:00+00', 'Lincoln Financial Field, Philadelphia', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'C' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-17 20:00:00+00', 'Hard Rock Stadium, Miami', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'C' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-22 18:00:00+00', 'Levi's Stadium, San Francisco Bay Area', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'C' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-22 18:00:00+00', 'Lincoln Financial Field, Philadelphia', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'C' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'C' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-12 16:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'D' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-12 20:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'D' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-17 16:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'D' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-17 20:00:00+00', 'MetLife Stadium, New York/New Jersey', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'D' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-22 18:00:00+00', 'BMO Field, Toronto', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'D' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-22 18:00:00+00', 'Estadio Azteca, Mexico City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'D' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'D' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-13 16:00:00+00', 'Estadio Akron, Guadalajara', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'E' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-13 20:00:00+00', 'NRG Stadium, Houston', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'E' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-18 16:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'E' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-18 20:00:00+00', 'Lumen Field, Seattle', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'E' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-23 18:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'E' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-23 18:00:00+00', 'Lumen Field, Seattle', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'E' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'E' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-13 16:00:00+00', 'BMO Field, Toronto', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'F' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-13 20:00:00+00', 'Estadio BBVA, Monterrey', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'F' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-18 16:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'F' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-18 20:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'F' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-23 18:00:00+00', 'MetLife Stadium, New York/New Jersey', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'F' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-23 18:00:00+00', 'MetLife Stadium, New York/New Jersey', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'F' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'F' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-14 16:00:00+00', 'BC Place, Vancouver', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'G' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-14 20:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'G' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-19 16:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'G' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-19 20:00:00+00', 'BMO Field, Toronto', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'G' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-24 18:00:00+00', 'Lumen Field, Seattle', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'G' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-24 18:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'G' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'G' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-14 16:00:00+00', 'Arrowhead Stadium, Kansas City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'H' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-14 20:00:00+00', 'Estadio Azteca, Mexico City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'H' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-19 16:00:00+00', 'Arrowhead Stadium, Kansas City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'H' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-19 20:00:00+00', 'Hard Rock Stadium, Miami', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'H' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-24 18:00:00+00', 'Arrowhead Stadium, Kansas City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'H' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-24 18:00:00+00', 'Lumen Field, Seattle', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'H' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'H' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-15 16:00:00+00', 'Lumen Field, Seattle', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'I' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-15 20:00:00+00', 'BMO Field, Toronto', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'I' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-20 16:00:00+00', 'MetLife Stadium, New York/New Jersey', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'I' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-20 20:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'I' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-25 18:00:00+00', 'MetLife Stadium, New York/New Jersey', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'I' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-25 18:00:00+00', 'SoFi Stadium, Los Angeles', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'I' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'I' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-15 16:00:00+00', 'Levi's Stadium, San Francisco Bay Area', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'J' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-15 20:00:00+00', 'Arrowhead Stadium, Kansas City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'J' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-20 16:00:00+00', 'Estadio Akron, Guadalajara', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'J' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-20 20:00:00+00', 'NRG Stadium, Houston', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'J' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-25 18:00:00+00', 'Gillette Stadium, Boston', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'J' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-25 18:00:00+00', 'AT&T Stadium, Dallas', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'J' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'J' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-16 16:00:00+00', 'BC Place, Vancouver', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'K' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-16 20:00:00+00', 'Levi's Stadium, San Francisco Bay Area', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'K' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-21 16:00:00+00', 'Hard Rock Stadium, Miami', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'K' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-21 20:00:00+00', 'NRG Stadium, Houston', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'K' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-26 18:00:00+00', 'NRG Stadium, Houston', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'K' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-26 18:00:00+00', 'Estadio Azteca, Mexico City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'K' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'K' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-16 16:00:00+00', 'Estadio BBVA, Monterrey', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'L' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-16 20:00:00+00', 'Lumen Field, Seattle', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt1 ON gt1.rn = 3
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt2 ON gt2.rn = 4
  WHERE g.name = 'L' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-21 16:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt1 ON gt1.rn = 1
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'L' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-21 20:00:00+00', 'Arrowhead Stadium, Kansas City', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt2 ON gt2.rn = 2
  WHERE g.name = 'L' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-26 18:00:00+00', 'AT&T Stadium, Dallas', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt1 ON gt1.rn = 4
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt2 ON gt2.rn = 1
  WHERE g.name = 'L' AND g.tournament_id = t_id;

  INSERT INTO public.matches (tournament_id, group_id, home_team_id, away_team_id, match_time, venue, status)
  SELECT t_id, g.id, gt1.team_id, gt2.team_id, '2026-06-26 18:00:00+00', 'NRG Stadium, Houston', 'scheduled'
  FROM public.groups g
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt1 ON gt1.rn = 2
  JOIN (SELECT team_id, ROW_NUMBER() OVER(ORDER BY team_id) as rn FROM public.group_teams WHERE group_id = (SELECT id FROM public.groups WHERE name = 'L' AND tournament_id = t_id)) gt2 ON gt2.rn = 3
  WHERE g.name = 'L' AND g.tournament_id = t_id;

END $$;
