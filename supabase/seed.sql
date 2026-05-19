-- ==========================================
-- MM Ennustus '26 — Seed Data
-- ==========================================

-- Insert Tournament
INSERT INTO public.tournaments (name_et, name_en, year, status)
VALUES ('FIFA MM 2026', 'FIFA World Cup 2026', 2026, 'upcoming')
ON CONFLICT DO NOTHING;

-- Get the tournament ID
DO $$
DECLARE
    t_id UUID;
BEGIN
    SELECT id INTO t_id FROM public.tournaments LIMIT 1;

    -- Insert Stages
    INSERT INTO public.stages (tournament_id, name_et, name_en, slug, is_open, sort_order) VALUES
    (t_id, 'Alagrupifaas', 'Group Stage', 'group_stage', true, 1),
    (t_id, '32. finaal', 'Round of 32', 'round_of_32', false, 2),
    (t_id, '16. finaal', 'Round of 16', 'round_of_16', false, 3),
    (t_id, 'Veerandfinaal', 'Quarter-finals', 'quarter_finals', false, 4),
    (t_id, 'Poolfinaal', 'Semi-finals', 'semi_finals', false, 5),
    (t_id, 'Kolmanda koha mäng', 'Third place play-off', 'third_place', false, 6),
    (t_id, 'Finaal', 'Final', 'final', false, 7)
    ON CONFLICT (tournament_id, slug) DO NOTHING;

    -- Insert Groups (A to L for 48 teams, 12 groups)
    INSERT INTO public.groups (tournament_id, name, sort_order) VALUES
    (t_id, 'A', 1), (t_id, 'B', 2), (t_id, 'C', 3), (t_id, 'D', 4),
    (t_id, 'E', 5), (t_id, 'F', 6), (t_id, 'G', 7), (t_id, 'H', 8),
    (t_id, 'I', 9), (t_id, 'J', 10), (t_id, 'K', 11), (t_id, 'L', 12)
    ON CONFLICT (tournament_id, name) DO NOTHING;

    -- Insert all 48 teams
    INSERT INTO public.teams (name_et, name_en, code, flag_emoji) VALUES
    ('Mehhiko', 'Mexico', 'MEX', '🇲🇽'),
    ('Lõuna-Aafrika Vabariik', 'South Africa', 'RSA', '🇿🇦'),
    ('Lõuna-Korea', 'South Korea', 'KOR', '🇰🇷'),
    ('Tšehhi', 'Czech Republic', 'CZE', '🇨🇿'),
    ('Kanada', 'Canada', 'CAN', '🇨🇦'),
    ('Bosnia ja Hertsegoviina', 'Bosnia and Herzegovina', 'BIH', '🇧🇦'),
    ('Katar', 'Qatar', 'QAT', '🇶🇦'),
    ('Šveits', 'Switzerland', 'SUI', '🇨🇭'),
    ('Brasiilia', 'Brazil', 'BRA', '🇧🇷'),
    ('Maroko', 'Morocco', 'MAR', '🇲🇦'),
    ('Haiti', 'Haiti', 'HAI', '🇭🇹'),
    ('Šotimaa', 'Scotland', 'SCO', '🏴󠁧󠁢󠁳󠁣󠁴󠁿'),
    ('Ameerika Ühendriigid', 'United States', 'USA', '🇺🇸'),
    ('Paraguay', 'Paraguay', 'PAR', '🇵🇾'),
    ('Austraalia', 'Australia', 'AUS', '🇦🇺'),
    ('Türgi', 'Turkey', 'TUR', '🇹🇷'),
    ('Saksamaa', 'Germany', 'GER', '🇩🇪'),
    ('Curaçao', 'Curaçao', 'CUW', '🇨🇼'),
    ('Elevandiluurannik', 'Ivory Coast', 'CIV', '🇨🇮'),
    ('Ecuador', 'Ecuador', 'ECU', '🇪🇨'),
    ('Holland', 'Netherlands', 'NED', '🇳🇱'),
    ('Jaapan', 'Japan', 'JPN', '🇯🇵'),
    ('Rootsi', 'Sweden', 'SWE', '🇸🇪'),
    ('Tuneesia', 'Tunisia', 'TUN', '🇹🇳'),
    ('Belgia', 'Belgium', 'BEL', '🇧🇪'),
    ('Egiptus', 'Egypt', 'EGY', '🇪🇬'),
    ('Iraan', 'Iran', 'IRN', '🇮🇷'),
    ('Uus-Meremaa', 'New Zealand', 'NZL', '🇳🇿'),
    ('Hispaania', 'Spain', 'ESP', '🇪🇸'),
    ('Roheneemesaared', 'Cape Verde', 'CPV', '🇨🇻'),
    ('Saudi Araabia', 'Saudi Arabia', 'KSA', '🇸🇦'),
    ('Uruguay', 'Uruguay', 'URU', '🇺🇾'),
    ('Prantsusmaa', 'France', 'FRA', '🇫🇷'),
    ('Senegal', 'Senegal', 'SEN', '🇸🇳'),
    ('Iraak', 'Iraq', 'IRQ', '🇮🇶'),
    ('Norra', 'Norway', 'NOR', '🇳🇴'),
    ('Argentiina', 'Argentina', 'ARG', '🇦🇷'),
    ('Alžeeria', 'Algeria', 'ALG', '🇩🇿'),
    ('Austria', 'Austria', 'AUT', '🇦🇹'),
    ('Jordaania', 'Jordan', 'JOR', '🇯🇴'),
    ('Portugal', 'Portugal', 'POR', '🇵🇹'),
    ('Kongo DV', 'DR Congo', 'COD', '🇨🇩'),
    ('Usbekistan', 'Uzbekistan', 'UZB', '🇺🇿'),
    ('Kolumbia', 'Colombia', 'COL', '🇨🇴'),
    ('Inglismaa', 'England', 'ENG', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
    ('Horvaatia', 'Croatia', 'CRO', '🇭🇷'),
    ('Ghana', 'Ghana', 'GHA', '🇬🇭'),
    ('Panama', 'Panama', 'PAN', '🇵🇦')
    ON CONFLICT (code) DO NOTHING;

    -- Assign teams to groups
    INSERT INTO public.group_teams (group_id, team_id)
    SELECT g.id, t.id
    FROM public.groups g, public.teams t
    WHERE g.tournament_id = t_id AND
      ((g.name = 'A' AND t.code IN ('MEX', 'RSA', 'KOR', 'CZE')) OR
       (g.name = 'B' AND t.code IN ('CAN', 'BIH', 'QAT', 'SUI')) OR
       (g.name = 'C' AND t.code IN ('BRA', 'MAR', 'HAI', 'SCO')) OR
       (g.name = 'D' AND t.code IN ('USA', 'PAR', 'AUS', 'TUR')) OR
       (g.name = 'E' AND t.code IN ('GER', 'CUW', 'CIV', 'ECU')) OR
       (g.name = 'F' AND t.code IN ('NED', 'JPN', 'SWE', 'TUN')) OR
       (g.name = 'G' AND t.code IN ('BEL', 'EGY', 'IRN', 'NZL')) OR
       (g.name = 'H' AND t.code IN ('ESP', 'CPV', 'KSA', 'URU')) OR
       (g.name = 'I' AND t.code IN ('FRA', 'SEN', 'IRQ', 'NOR')) OR
       (g.name = 'J' AND t.code IN ('ARG', 'ALG', 'AUT', 'JOR')) OR
       (g.name = 'K' AND t.code IN ('POR', 'COD', 'UZB', 'COL')) OR
       (g.name = 'L' AND t.code IN ('ENG', 'CRO', 'GHA', 'PAN')))
    ON CONFLICT (group_id, team_id) DO NOTHING;

END $$;
