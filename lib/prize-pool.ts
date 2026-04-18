import { getNetAmount } from './charity';

interface PrizePoolSplit {
  total: number;
  fiveMatchPool: number;
  fourMatchPool: number;
  threeMatchPool: number;
}

/**
 * Calculates the prize pool based on active subscribers and split percentages.
 * Split defaults to 40/35/25 as per requirements.
 */
export function calculatePrizePool(
  activeSubscriberCount: number,
  subscriptionPrice: number,
  charityPercentage: number = 10,
  splitConfig = { five: 40, four: 35, three: 25 }
): PrizePoolSplit {
  // 1. Calculate Gross Total
  const grossTotal = activeSubscriberCount * subscriptionPrice;

  // 2. Calculate Net Pool after Charity Deduction
  const totalNetPool = getNetAmount(grossTotal, charityPercentage);

  // 3. Split the remaining pool
  return {
    total: totalNetPool,
    fiveMatchPool: (totalNetPool * splitConfig.five) / 100,
    fourMatchPool: (totalNetPool * splitConfig.four) / 100,
    threeMatchPool: (totalNetPool * splitConfig.three) / 100,
  };
}
