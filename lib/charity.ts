/**
 * Calculates the charity contribution from a subscription amount.
 * Default is 10%, but can be user-adjustable.
 */
export function calculateCharityContribution(
  subscriptionAmount: number,
  percentage: number = 10
): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }
  return (subscriptionAmount * percentage) / 100;
}

/**
 * Gets the net amount after charity deduction.
 */
export function getNetAmount(
  subscriptionAmount: number,
  charityPercentage: number = 10
): number {
  const contribution = calculateCharityContribution(subscriptionAmount, charityPercentage);
  return subscriptionAmount - contribution;
}
