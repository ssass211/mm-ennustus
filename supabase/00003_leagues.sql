-- ==========================================
-- 1. LEAGUES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.leagues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    join_code TEXT UNIQUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. LEAGUE MEMBERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.league_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(league_id, user_id)
);

-- ==========================================
-- 3. UPDATE SPECIAL QUESTIONS
-- ==========================================
ALTER TABLE public.special_questions ADD COLUMN IF NOT EXISTS league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE;

-- ==========================================
-- 4. RLS POLICIES
-- ==========================================
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leagues are viewable by everyone" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create leagues" ON public.leagues FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "League admins can update leagues" ON public.leagues FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.league_members WHERE league_id = id AND user_id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "League members are viewable by everyone" ON public.league_members FOR SELECT USING (true);
CREATE POLICY "Users can insert their own membership" ON public.league_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "League admins can update members" ON public.league_members FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.league_members lm WHERE lm.league_id = public.league_members.league_id AND lm.user_id = auth.uid() AND lm.role = 'admin')
);
-- Users can also leave a league (delete their own membership)
CREATE POLICY "Users can delete own membership" ON public.league_members FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "League admins can delete members" ON public.league_members FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.league_members lm WHERE lm.league_id = public.league_members.league_id AND lm.user_id = auth.uid() AND lm.role = 'admin')
);

-- ==========================================
-- 5. LEADERBOARD RPC
-- ==========================================
-- Drops the old view if it exists, as we are replacing global leaderboard with a dynamic league one
DROP VIEW IF EXISTS public.leaderboard_view;

CREATE OR REPLACE FUNCTION get_league_leaderboard(p_league_id UUID)
RETURNS TABLE (
    user_id UUID,
    display_name TEXT,
    avatar_url TEXT,
    match_points BIGINT,
    question_points BIGINT,
    total_points BIGINT,
    predictions_count BIGINT,
    exact_scores BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS user_id,
        p.display_name,
        p.avatar_url,
        COALESCE(SUM(mp.points_earned), 0) AS match_points,
        COALESCE((
            SELECT SUM(sqa.points_earned) 
            FROM public.special_question_answers sqa 
            JOIN public.special_questions sq ON sq.id = sqa.question_id
            WHERE sqa.user_id = p.id AND sq.league_id = p_league_id
        ), 0) AS question_points,
        COALESCE(SUM(mp.points_earned), 0) + 
        COALESCE((
            SELECT SUM(sqa.points_earned) 
            FROM public.special_question_answers sqa 
            JOIN public.special_questions sq ON sq.id = sqa.question_id
            WHERE sqa.user_id = p.id AND sq.league_id = p_league_id
        ), 0) AS total_points,
        COUNT(mp.id) AS predictions_count,
        COUNT(CASE WHEN mp.points_earned = 5 THEN 1 END) AS exact_scores
    FROM 
        public.profiles p
    JOIN 
        public.league_members lm ON lm.user_id = p.id
    LEFT JOIN 
        public.match_predictions mp ON p.id = mp.user_id
    WHERE 
        lm.league_id = p_league_id AND lm.status = 'approved'
    GROUP BY 
        p.id, p.display_name, p.avatar_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
