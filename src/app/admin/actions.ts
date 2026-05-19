'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateMatchPoints } from '@/lib/scoring';
import { revalidatePath } from 'next/cache';

export async function confirmMatchResultAndCalculatePoints(matchId: string) {
  const supabase = await createClient();

  // 1. Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Get the match details (actual score)
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (matchError || !match) {
    return { success: false, error: 'Match not found' };
  }

  if (match.home_score === null || match.away_score === null) {
    return { success: false, error: 'Match score is not set' };
  }

  // 3. Get all predictions for this match
  const { data: predictions, error: predsError } = await supabase
    .from('match_predictions')
    .select('*')
    .eq('match_id', matchId);

  if (predsError) {
    return { success: false, error: 'Failed to fetch predictions' };
  }

  // 4. Calculate points and update each prediction
  if (predictions && predictions.length > 0) {
    const updates = predictions.map(pred => {
      const result = calculateMatchPoints(
        pred.predicted_home_score,
        pred.predicted_away_score,
        match.home_score!,
        match.away_score!
      );

      return {
        id: pred.id,
        points_earned: result.points
      };
    });

    // Supabase JS doesn't have a bulk update that is easy to use with varying values per row
    // So we'll do them sequentially or in Promise.all
    await Promise.all(updates.map(update => 
      supabase
        .from('match_predictions')
        .update({ points_earned: update.points_earned })
        .eq('id', update.id)
    ));
  }

  // 5. Mark match as confirmed
  const { error: updateMatchError } = await supabase
    .from('matches')
    .update({ is_result_confirmed: true })
    .eq('id', matchId);

  if (updateMatchError) {
    return { success: false, error: 'Failed to confirm match result' };
  }

  revalidatePath('/admin/matches');
  revalidatePath('/matches');
  revalidatePath('/leaderboard');
  
  return { success: true };
}
