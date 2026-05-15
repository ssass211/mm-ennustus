import { ScoringResult } from './types';

/**
 * Calculate points earned for a match prediction.
 * 
 * Scoring rules:
 * - Exact score: 5 points (e.g., predicted 2:1, result 2:1)
 * - Correct goal difference: 3 points (e.g., predicted 3:1, result 2:0 — difference is +2)
 * - Correct outcome (win/draw/loss): 1 point (e.g., predicted 3:0, result 1:0 — home win)
 * - Wrong: 0 points
 * 
 * Points do NOT stack — only the highest tier is awarded.
 */
export function calculateMatchPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): ScoringResult {
  // Exact score match
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return { points: 5, type: 'exact' };
  }

  // Check goal difference
  const predictedDiff = predictedHome - predictedAway;
  const actualDiff = actualHome - actualAway;

  if (predictedDiff === actualDiff) {
    return { points: 3, type: 'difference' };
  }

  // Check correct outcome (win/draw/loss)
  const predictedOutcome = getOutcome(predictedHome, predictedAway);
  const actualOutcome = getOutcome(actualHome, actualAway);

  if (predictedOutcome === actualOutcome) {
    return { points: 1, type: 'outcome' };
  }

  return { points: 0, type: 'miss' };
}

type Outcome = 'home' | 'draw' | 'away';

function getOutcome(home: number, away: number): Outcome {
  if (home > away) return 'home';
  if (home < away) return 'away';
  return 'draw';
}

/**
 * Get a human-readable label for a scoring result type
 */
export function getScoringLabel(type: ScoringResult['type'], locale: 'et' | 'en'): string {
  const labels: Record<ScoringResult['type'], { et: string; en: string }> = {
    exact: { et: 'Täpne skoor', en: 'Exact score' },
    difference: { et: 'Õige väratavahe', en: 'Correct goal difference' },
    outcome: { et: 'Õige tulemus', en: 'Correct outcome' },
    miss: { et: 'Vale ennustus', en: 'Wrong prediction' },
  };
  return labels[type][locale];
}

/**
 * Get the color class for a scoring result type
 */
export function getScoringColor(type: ScoringResult['type']): string {
  switch (type) {
    case 'exact': return 'badge-gold';
    case 'difference': return 'badge-accent';
    case 'outcome': return 'badge-info';
    case 'miss': return 'badge-error';
  }
}
