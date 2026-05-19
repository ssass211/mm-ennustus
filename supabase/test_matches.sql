-- ==========================================
-- MM Ennustus '26 — Test Matches Data
-- ==========================================

-- Get the tournament ID and group stage ID
DO $$
DECLARE
    t_id UUID;
    s_id UUID;
    usa_id UUID;
    can_id UUID;
    mex_id UUID;
    eng_id UUID;
    bra_id UUID;
    arg_id UUID;
BEGIN
    SELECT id INTO t_id FROM public.tournaments LIMIT 1;
    SELECT id INTO s_id FROM public.stages WHERE slug = 'group_stage' LIMIT 1;

    -- Insert some extra teams just for testing
    INSERT INTO public.teams (name_et, name_en, code, flag_emoji) VALUES
    ('Inglismaa', 'England', 'ENG', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
    ('Brasiilia', 'Brazil', 'BRA', '🇧🇷'),
    ('Argentiina', 'Argentina', 'ARG', '🇦🇷')
    ON CONFLICT (code) DO NOTHING;

    -- Get team IDs
    SELECT id INTO usa_id FROM public.teams WHERE code = 'USA' LIMIT 1;
    SELECT id INTO can_id FROM public.teams WHERE code = 'CAN' LIMIT 1;
    SELECT id INTO mex_id FROM public.teams WHERE code = 'MEX' LIMIT 1;
    SELECT id INTO eng_id FROM public.teams WHERE code = 'ENG' LIMIT 1;
    SELECT id INTO bra_id FROM public.teams WHERE code = 'BRA' LIMIT 1;
    SELECT id INTO arg_id FROM public.teams WHERE code = 'ARG' LIMIT 1;

    -- Insert Test Matches
    -- Match 1: Upcoming (Tomorrow)
    INSERT INTO public.matches (tournament_id, stage_id, home_team_id, away_team_id, match_datetime, status, venue)
    VALUES (
        t_id, 
        s_id, 
        usa_id, 
        eng_id, 
        NOW() + INTERVAL '1 day', 
        'upcoming', 
        'MetLife Stadium, New York'
    );

    -- Match 2: Upcoming (In 2 hours)
    INSERT INTO public.matches (tournament_id, stage_id, home_team_id, away_team_id, match_datetime, status, venue)
    VALUES (
        t_id, 
        s_id, 
        bra_id, 
        mex_id, 
        NOW() + INTERVAL '2 hours', 
        'upcoming', 
        'Azteca Stadium, Mexico City'
    );

    -- Match 3: Finished (Yesterday)
    INSERT INTO public.matches (tournament_id, stage_id, home_team_id, away_team_id, match_datetime, status, home_score, away_score, is_result_confirmed, venue)
    VALUES (
        t_id, 
        s_id, 
        arg_id, 
        can_id, 
        NOW() - INTERVAL '1 day', 
        'finished',
        2,
        0,
        true,
        'BMO Field, Toronto'
    );

END $$;
