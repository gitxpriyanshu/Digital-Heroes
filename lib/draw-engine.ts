import { getServiceRoleClient } from './supabase-server';

export interface DrawSimulation {
  winningNumbers: number[];
  winners: {
    fiveMatch: string[];
    fourMatch: string[];
    threeMatch: string[];
  };
  prizes: {
    fiveMatchAmount: number;
    fourMatchAmount: number;
    threeMatchAmount: number;
  };
}

/**
 * Generates 5 unique random numbers between 1 and 45.
 */
export function generateRandomDraw(): number[] {
  const numbers: Set<number> = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Generates 5 numbers based on score frequencies.
 */
export function generateAlgorithmicDraw(allScores: number[], mode: 'most_frequent' | 'least_frequent' = 'most_frequent'): number[] {
  const counts: Record<number, number> = {};
  allScores.forEach(s => counts[s] = (counts[s] || 0) + 1);

  const sorted = Object.entries(counts)
    .sort(([, a], [, b]) => mode === 'most_frequent' ? b - a : a - b)
    .map(([num]) => parseInt(num));

  // If we don't have enough distinct scores, fill with randoms
  const results = sorted.slice(0, 5);
  while (results.length < 5) {
    const rand = Math.floor(Math.random() * 45) + 1;
    if (!results.includes(rand)) results.push(rand);
  }

  return results.sort((a, b) => a - b);
}

/**
 * Compares two sets of numbers and returns the match count.
 */
export function matchNumbers(userNumbers: number[], winningNumbers: number[]): number {
  return userNumbers.filter(n => winningNumbers.includes(n)).length;
}

/**
 * Queries all eligible users, gathers their 5 scores, and calculates winners.
 */
export async function calculateWinners(winningNumbers: number[]) {
  const supabase = getServiceRoleClient();

  // 1. Get all users who have exactly 5 scores
  const { data: userScores, error } = await supabase
    .from('scores')
    .select('user_id, score');

  if (error) throw error;

  // 2. Group scores by user
  const grouped: Record<string, number[]> = {};
  userScores.forEach(s => {
    if (!grouped[s.user_id]) grouped[s.user_id] = [];
    grouped[s.user_id].push(s.score);
  });

  const finalists = {
    fiveMatch: [] as string[],
    fourMatch: [] as string[],
    threeMatch: [] as string[],
  };

  // 3. Filter for exactly 5 and match
  Object.entries(grouped).forEach(([userId, numbers]) => {
    if (numbers.length === 5) {
      const matchCount = matchNumbers(numbers, winningNumbers);
      if (matchCount === 5) finalists.fiveMatch.push(userId);
      else if (matchCount === 4) finalists.fourMatch.push(userId);
      else if (matchCount === 3) finalists.threeMatch.push(userId);
    }
  });

  return finalists;
}

/**
 * Calculates prize amounts for each winner in each tier.
 */
export function calculatePrizes(prizePool: { five: number, four: number, three: number }, winners: any) {
  return {
    fiveMatchAmount: winners.fiveMatch.length > 0 ? prizePool.five / winners.fiveMatch.length : 0,
    fourMatchAmount: winners.fourMatch.length > 0 ? prizePool.four / winners.fourMatch.length : 0,
    threeMatchAmount: winners.threeMatch.length > 0 ? prizePool.three / winners.threeMatch.length : 0,
  };
}

/**
 * Carries forward unclaimed 5-match jackpot to the next month's draft draw.
 */
export async function handleJackpotRollover(
  currentDrawMonth: string,
  unclaimedAmount: number
) {
  const supabase = getServiceRoleClient();

  const nextMonthDate = new Date(currentDrawMonth);
  if (isNaN(nextMonthDate.getTime())) return;

  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const nextMonth = nextMonthDate.toISOString().split('T')[0];

  // Try to find next draw
  const { data: existingDraws } = await supabase
    .from('draws')
    .select('*')
    .eq('draw_month', nextMonth);

  if (existingDraws && existingDraws.length > 0) {
    const nextDraw = existingDraws[0];

    await supabase
      .from('draws')
      .update({
        jackpot_carried: (nextDraw.jackpot_carried || 0) + unclaimedAmount,
      })
      .eq('id', nextDraw.id);
  } else {
    // Create new draft draw if not exists
    await supabase
      .from('draws')
      .insert({
        draw_month: nextMonth,
        status: 'draft',
        jackpot_carried: unclaimedAmount,
        prize_pool_total: 0, // Initial pool for new cycle
        draw_logic: 'random' // Default logic
      });
  }
}


