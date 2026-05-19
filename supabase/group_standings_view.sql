-- ==========================================
-- Group Standings View
-- ==========================================
-- See vaade arvutab alagruppide tabeliseisu dünaamiliselt otse lõppenud mängude tulemuste pealt

DROP VIEW IF EXISTS public.group_standings;

CREATE OR REPLACE VIEW public.group_standings AS
WITH team_stats AS (
    SELECT 
        gt.group_id,
        gt.team_id,
        COUNT(m.id) AS played,
        COUNT(CASE 
            WHEN m.home_team_id = gt.team_id AND m.home_score > m.away_score THEN 1 
            WHEN m.away_team_id = gt.team_id AND m.away_score > m.home_score THEN 1 
        END) AS won,
        COUNT(CASE 
            WHEN (m.home_team_id = gt.team_id OR m.away_team_id = gt.team_id) AND m.home_score = m.away_score THEN 1 
        END) AS drawn,
        COUNT(CASE 
            WHEN m.home_team_id = gt.team_id AND m.home_score < m.away_score THEN 1 
            WHEN m.away_team_id = gt.team_id AND m.away_score < m.home_score THEN 1 
        END) AS lost,
        COALESCE(SUM(CASE 
            WHEN m.home_team_id = gt.team_id THEN m.home_score 
            WHEN m.away_team_id = gt.team_id THEN m.away_score 
            ELSE 0 
        END), 0) AS goals_for,
        COALESCE(SUM(CASE 
            WHEN m.home_team_id = gt.team_id THEN m.away_score 
            WHEN m.away_team_id = gt.team_id THEN m.home_score 
            ELSE 0 
        END), 0) AS goals_against
    FROM 
        public.group_teams gt
    LEFT JOIN 
        public.matches m ON m.status = 'finished' AND (m.home_team_id = gt.team_id OR m.away_team_id = gt.team_id) AND m.group_id = gt.group_id
    GROUP BY 
        gt.group_id, gt.team_id
)
SELECT 
    ts.group_id,
    ts.team_id,
    ts.played,
    ts.won,
    ts.drawn,
    ts.lost,
    ts.goals_for,
    ts.goals_against,
    (ts.goals_for - ts.goals_against) AS goal_difference,
    (ts.won * 3 + ts.drawn) AS points
FROM 
    team_stats ts;
