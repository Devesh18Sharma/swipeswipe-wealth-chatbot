/**
 * SwipeSwipe Savings Calculator
 * Auto-calculates SwipeSwipe monthly savings based on income brackets
 */

/**
 * Calculate SwipeSwipe monthly savings based on annual income
 * 
 * Income brackets:
 * - < $50,000: $75/month
 * - $50,000 - $100,000: $100/month
 * - $100,000 - $150,000: $150/month
 * - $150,000 - $200,000: $200/month
 * - $200,000 - $300,000: $350/month
 * - $300,000+: $500/month
 */
export function calculateSwipeSwipeSavings(annualIncome: number): number {
  if (annualIncome < 50000) {
    return 75;
  } else if (annualIncome < 100000) {
    return 100;
  } else if (annualIncome < 150000) {
    return 150;
  } else if (annualIncome < 200000) {
    return 200;
  } else if (annualIncome < 300000) {
    return 350;
  } else {
    return 500;
  }
}

/**
 * Get explanation text for the calculated savings
 */
export function getSwipeSwipeSavingsExplanation(annualIncome: number): string {
  const savings = calculateSwipeSwipeSavings(annualIncome);
  return `Based on your income level, SwipeSwipe users typically save an additional $${savings}/month.`;
}
