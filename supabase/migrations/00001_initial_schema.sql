-- ==========================================
-- MM Ennustus '26 — Initial Schema
-- ==========================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. PROFILES & AUTH
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'et' CHECK (preferred_language IN ('et', 'en')),
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger logic is only needed on the first migration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 2. TOURNAMENTS & STRUCTURE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_et TEXT NOT NULL,
    name_en TEXT NOT NULL,
    year INTEGER NOT NULL,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_et TEXT NOT NULL,
    name_en TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    flag_emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    UNIQUE(tournament_id, name)
);

CREATE TABLE IF NOT EXISTS public.group_teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    UNIQUE(group_id, team_id)
);

CREATE TABLE IF NOT EXISTS public.stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    name_et TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL,
    is_open BOOLEAN DEFAULT true,
    sort_order INTEGER NOT NULL,
    UNIQUE(tournament_id, slug)
);

-- ==========================================
-- 3. MATCHES & PREDICTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES public.stages(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
    home_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    away_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    match_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    venue TEXT,
    home_score INTEGER,
    away_score INTEGER,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'finished')),
    is_result_confirmed BOOLEAN DEFAULT false,
    external_match_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.match_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    predicted_home_score INTEGER NOT NULL,
    predicted_away_score INTEGER NOT NULL,
    points_earned INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, match_id)
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_match_predictions_updated_at
    BEFORE UPDATE ON public.match_predictions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 4. SPECIAL QUESTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.special_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    question_et TEXT NOT NULL,
    question_en TEXT NOT NULL,
    max_points INTEGER NOT NULL DEFAULT 5,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    correct_answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.special_question_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.special_questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    points_earned INTEGER,
    is_reviewed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, question_id)
);

-- ==========================================
-- 5. LEADERBOARD VIEW
-- ==========================================
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
    p.id AS user_id,
    p.display_name,
    p.avatar_url,
    COALESCE(SUM(mp.points_earned), 0) AS match_points,
    COALESCE((
        SELECT SUM(sqa.points_earned) 
        FROM public.special_question_answers sqa 
        WHERE sqa.user_id = p.id
    ), 0) AS question_points,
    COALESCE(SUM(mp.points_earned), 0) + 
    COALESCE((
        SELECT SUM(sqa.points_earned) 
        FROM public.special_question_answers sqa 
        WHERE sqa.user_id = p.id
    ), 0) AS total_points,
    COUNT(mp.id) AS predictions_count,
    COUNT(CASE WHEN mp.points_earned = 5 THEN 1 END) AS exact_scores
FROM 
    public.profiles p
LEFT JOIN 
    public.match_predictions mp ON p.id = mp.user_id
GROUP BY 
    p.id, p.display_name, p.avatar_url;

-- ==========================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_question_answers ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public read access for structure data
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Groups are viewable by everyone" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Group teams are viewable by everyone" ON public.group_teams FOR SELECT USING (true);
CREATE POLICY "Stages are viewable by everyone" ON public.stages FOR SELECT USING (true);
CREATE POLICY "Matches are viewable by everyone" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Special questions are viewable by everyone" ON public.special_questions FOR SELECT USING (true);

-- Match Predictions
-- 1. Users can always read their own
CREATE POLICY "Users can read own predictions" ON public.match_predictions FOR SELECT USING (auth.uid() = user_id);
-- 2. Users can read others' predictions ONLY IF the match has started (match_datetime <= now())
CREATE POLICY "Users can read others predictions after match start" ON public.match_predictions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.matches m 
        WHERE m.id = match_id AND m.match_datetime <= now()
    )
);
-- 3. Users can insert/update their own predictions ONLY IF match has NOT started
CREATE POLICY "Users can insert own predictions before match" ON public.match_predictions FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.matches m 
        WHERE m.id = match_id AND m.match_datetime > now()
    )
);
CREATE POLICY "Users can update own predictions before match" ON public.match_predictions FOR UPDATE USING (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.matches m 
        WHERE m.id = match_id AND m.match_datetime > now()
    )
);

-- Special Question Answers
-- 1. Users can always read their own
CREATE POLICY "Users can read own answers" ON public.special_question_answers FOR SELECT USING (auth.uid() = user_id);
-- 2. Users can read others' answers ONLY IF the deadline has passed
CREATE POLICY "Users can read others answers after deadline" ON public.special_question_answers FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.special_questions sq 
        WHERE sq.id = question_id AND sq.deadline <= now()
    )
);
-- 3. Users can insert/update their own answers ONLY IF deadline has NOT passed
CREATE POLICY "Users can insert own answers before deadline" ON public.special_question_answers FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.special_questions sq 
        WHERE sq.id = question_id AND sq.deadline > now()
    )
);
CREATE POLICY "Users can update own answers before deadline" ON public.special_question_answers FOR UPDATE USING (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.special_questions sq 
        WHERE sq.id = question_id AND sq.deadline > now()
    )
);

-- Admin Policies: Admins have full access to everything
-- Helper function to check admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins have full access to tournaments" ON public.tournaments USING (public.is_admin());
CREATE POLICY "Admins have full access to teams" ON public.teams USING (public.is_admin());
CREATE POLICY "Admins have full access to groups" ON public.groups USING (public.is_admin());
CREATE POLICY "Admins have full access to group_teams" ON public.group_teams USING (public.is_admin());
CREATE POLICY "Admins have full access to stages" ON public.stages USING (public.is_admin());
CREATE POLICY "Admins have full access to matches" ON public.matches USING (public.is_admin());
CREATE POLICY "Admins have full access to match_predictions" ON public.match_predictions USING (public.is_admin());
CREATE POLICY "Admins have full access to special_questions" ON public.special_questions USING (public.is_admin());
CREATE POLICY "Admins have full access to special_question_answers" ON public.special_question_answers USING (public.is_admin());
