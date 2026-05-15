/* ===========================================
   TypeScript Types for MM Ennustus '26
   =========================================== */

// --- Database Row Types ---

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  preferred_language: 'et' | 'en';
  is_admin: boolean;
  created_at: string;
}

export interface Tournament {
  id: string;
  name_et: string;
  name_en: string;
  year: number;
  status: 'upcoming' | 'active' | 'completed';
  created_at: string;
}

export interface Team {
  id: string;
  name_et: string;
  name_en: string;
  code: string; // 3-letter FIFA code
  flag_emoji: string;
  created_at: string;
}

export interface Group {
  id: string;
  tournament_id: string;
  name: string; // "A", "B", ..., "L"
  sort_order: number;
}

export interface GroupTeam {
  id: string;
  group_id: string;
  team_id: string;
  // Calculated fields from group standings
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goals_for?: number;
  goals_against?: number;
  goal_difference?: number;
  points?: number;
}

export interface Stage {
  id: string;
  tournament_id: string;
  name_et: string;
  name_en: string;
  slug: string; // 'group_stage', 'round_of_32', 'round_of_16', etc.
  is_open: boolean;
  sort_order: number;
}

export type MatchStatus = 'upcoming' | 'live' | 'finished';

export interface Match {
  id: string;
  tournament_id: string;
  stage_id: string;
  group_id: string | null;
  home_team_id: string;
  away_team_id: string;
  match_datetime: string;
  venue: string | null;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  is_result_confirmed: boolean;
  external_match_id: string | null;
  created_at: string;
}

export interface MatchPrediction {
  id: string;
  user_id: string;
  match_id: string;
  predicted_home_score: number;
  predicted_away_score: number;
  points_earned: number | null;
  created_at: string;
  updated_at: string;
}

export interface SpecialQuestion {
  id: string;
  tournament_id: string;
  question_et: string;
  question_en: string;
  max_points: number;
  deadline: string;
  is_resolved: boolean;
  correct_answer: string | null;
  created_at: string;
}

export interface SpecialQuestionAnswer {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  points_earned: number | null;
  is_reviewed: boolean;
  created_at: string;
}

// --- Joined / Enriched Types ---

export interface MatchWithTeams extends Match {
  home_team: Team;
  away_team: Team;
  group?: Group;
  stage: Stage;
}

export interface MatchWithPrediction extends MatchWithTeams {
  user_prediction: MatchPrediction | null;
}

export interface MatchWithAllPredictions extends MatchWithTeams {
  predictions: (MatchPrediction & { profile: Profile })[];
}

export interface GroupWithTeams extends Group {
  teams: (GroupTeam & { team: Team })[];
}

export interface SpecialQuestionWithAnswer extends SpecialQuestion {
  user_answer: SpecialQuestionAnswer | null;
}

export interface SpecialQuestionWithAllAnswers extends SpecialQuestion {
  answers: (SpecialQuestionAnswer & { profile: Profile })[];
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  match_points: number;
  question_points: number;
  total_points: number;
  predictions_count: number;
  exact_scores: number;
  rank: number;
}

// --- Scoring Types ---

export interface ScoringResult {
  points: number;
  type: 'exact' | 'difference' | 'outcome' | 'miss';
}

// --- i18n ---

export type Locale = 'et' | 'en';

export interface LocalizedString {
  et: string;
  en: string;
}

// --- API Response Types ---

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
