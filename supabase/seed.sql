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

    -- We will insert the 48 teams later when the official draw is completed
    -- For now, let's just insert the host nations
    INSERT INTO public.teams (name_et, name_en, code, flag_emoji) VALUES
    ('Ameerika Ühendriigid', 'United States', 'USA', '🇺🇸'),
    ('Kanada', 'Canada', 'CAN', '🇨🇦'),
    ('Mehhiko', 'Mexico', 'MEX', '🇲🇽')
    ON CONFLICT (code) DO NOTHING;

END $$;
