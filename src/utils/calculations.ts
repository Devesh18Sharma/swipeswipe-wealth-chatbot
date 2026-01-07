/**
 * SwipeSwipe Wealth Chatbot - Financial Calculations
 * 
 * Core financial calculation utilities for wealth projection
 * Using compound interest formulas with monthly contributions
 */

import { UserFinancialData, WealthProjection, YearlyProjection, ProjectionAssumptions } from '../types';

// ============================================================================
// CONSTANTS
// ============================================================================

const PRE_RETIREMENT_RETURN_RATE = 0.11; // 11% average market return (S&P 500 historical average)
const POST_RETIREMENT_RETURN_RATE = 0.06; // 6% conservative return after retirement
const DEFAULT_ANNUAL_RETURN_RATE = PRE_RETIREMENT_RETURN_RATE; // For backward compatibility
const DEFAULT_INFLATION_RATE = 0.025; // 2.5% inflation
const COMPOUNDING_PERIODS_PER_YEAR = 12; // Monthly compounding
const RETIREMENT_AGE = 70; // Age when work contributions stop
const LIFE_EXPECTANCY = 90; // Assumed life expectancy - all projections go to age 90
// Extended projection years to support projecting until age 90 for all users
// Includes year 0 to show starting point on chart
const PROJECTION_YEARS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate future value with regular monthly contributions
 * Uses the compound interest formula with regular contributions:
 * FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
 * 
 * Where:
 * - P = Principal (initial amount)
 * - r = Annual interest rate (decimal)
 * - n = Number of times interest compounds per year
 * - t = Number of years
 * - PMT = Monthly contribution
 */
export function calculateFutureValue(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number = COMPOUNDING_PERIODS_PER_YEAR
): number {
  const n = compoundingFrequency;
  const r = annualRate;
  const t = years;
  
  // Future value of principal
  const principalFV = principal * Math.pow(1 + r / n, n * t);
  
  // Future value of monthly contributions (annuity)
  // Adjusted for monthly payments with monthly compounding
  const periodicRate = r / n;
  const totalPeriods = n * t;
  
  let contributionFV = 0;
  if (periodicRate > 0) {
    contributionFV = monthlyContribution * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
  } else {
    contributionFV = monthlyContribution * totalPeriods;
  }
  
  return principalFV + contributionFV;
}

/**
 * Calculate compound interest only (without principal)
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number = COMPOUNDING_PERIODS_PER_YEAR
): number {
  const amount = principal * Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency * years);
  return amount - principal;
}

/**
 * Calculate future value with two-phase returns
 * Phase 1 (before age 70): 11% return with full contributions
 * Phase 2 (after age 70): 6% return with SwipeSwipe only
 */
function calculateTwoPhaseValue(
  principal: number,
  monthlyWorkContribution: number,
  monthlySwipeSwipeContribution: number,
  currentAge: number,
  targetYear: number,
  includeSwipeSwipe: boolean
): number {
  let value = principal;

  // Calculate year by year to handle phase transition
  for (let year = 1; year <= targetYear; year++) {
    const ageAtYear = currentAge + year;

    // Determine return rate based on age
    const returnRate = ageAtYear <= RETIREMENT_AGE
      ? PRE_RETIREMENT_RETURN_RATE
      : POST_RETIREMENT_RETURN_RATE;

    // Determine monthly contribution based on age
    let monthlyContribution: number;
    if (ageAtYear <= RETIREMENT_AGE) {
      // Before retirement: work contributions + SwipeSwipe (if applicable)
      monthlyContribution = includeSwipeSwipe
        ? monthlyWorkContribution + monthlySwipeSwipeContribution
        : monthlyWorkContribution;
    } else {
      // After retirement: SwipeSwipe only (if applicable)
      monthlyContribution = includeSwipeSwipe ? monthlySwipeSwipeContribution : 0;
    }

    // Apply compound growth for this year
    const monthlyRate = returnRate / 12;
    for (let month = 1; month <= 12; month++) {
      value = value * (1 + monthlyRate) + monthlyContribution;
    }
  }

  return value;
}

/**
 * Main wealth projection calculation
 * Two-phase model:
 * - Before age 70: 11% return with full contributions (work + SwipeSwipe)
 * - After age 70: 6% return with SwipeSwipe contributions only
 * - Life expectancy: 90 years
 */
export function calculateWealthProjection(
  userData: UserFinancialData,
  _annualReturnRate: number = DEFAULT_ANNUAL_RETURN_RATE // Kept for backward compatibility
): WealthProjection {
  const {
    currentSavings,
    monthlySavings,
    monthlyInvestment,
    increasePercentage,
    swipeswipeSavings
  } = userData;

  // Calculate base monthly contribution (savings + investment)
  const baseMonthly = monthlySavings + monthlyInvestment;

  // Calculate increased monthly contribution based on user's goal
  const workMonthlyContribution = baseMonthly * (1 + increasePercentage / 100);

  // Initialize projection objects
  const withoutSwipeSwipe: Record<number, number> = {};
  const withSwipeSwipe: Record<number, number> = {};
  const swipeswipeContribution: Record<number, number> = {};
  const yearByYear: YearlyProjection[] = [];

  // Calculate maximum years to project (until life expectancy of 90)
  // All users project until age 90, no cap
  const maxYears = Math.max(5, LIFE_EXPECTANCY - userData.age);

  // Build the list of years to calculate
  // Include all milestone years that fit, PLUS the exact year to reach age 90
  let yearsToCalculate = PROJECTION_YEARS.filter(y => y <= maxYears);
  if (maxYears > 0 && !yearsToCalculate.includes(maxYears)) {
    yearsToCalculate = [...yearsToCalculate, maxYears];
  }

  // Calculate for each year
  yearsToCalculate.forEach(years => {
    // Year 0 is the starting point (current savings)
    if (years === 0) {
      withoutSwipeSwipe[0] = Math.round(currentSavings);
      withSwipeSwipe[0] = Math.round(currentSavings);
      swipeswipeContribution[0] = 0;
      return;
    }

    // Without SwipeSwipe
    const valueWithoutSS = calculateTwoPhaseValue(
      currentSavings,
      workMonthlyContribution,
      0,
      userData.age,
      years,
      false
    );

    // With SwipeSwipe
    const valueWithSS = calculateTwoPhaseValue(
      currentSavings,
      workMonthlyContribution,
      swipeswipeSavings,
      userData.age,
      years,
      true
    );

    withoutSwipeSwipe[years] = Math.round(valueWithoutSS);
    withSwipeSwipe[years] = Math.round(valueWithSS);
    swipeswipeContribution[years] = Math.round(valueWithSS - valueWithoutSS);
  });

  // Calculate year-by-year breakdown
  let totalContribsWithSS = currentSavings;
  let totalContribsWithoutSS = currentSavings;

  for (let year = 1; year <= maxYears; year++) {
    const ageAtYear = userData.age + year;

    // Track contributions based on phase
    if (ageAtYear <= RETIREMENT_AGE) {
      totalContribsWithSS += (workMonthlyContribution + swipeswipeSavings) * 12;
      totalContribsWithoutSS += workMonthlyContribution * 12;
    } else {
      totalContribsWithSS += swipeswipeSavings * 12;
      // No work contributions after retirement for without SS
    }

    const valueWithoutSS = calculateTwoPhaseValue(
      currentSavings,
      workMonthlyContribution,
      0,
      userData.age,
      year,
      false
    );

    const valueWithSS = calculateTwoPhaseValue(
      currentSavings,
      workMonthlyContribution,
      swipeswipeSavings,
      userData.age,
      year,
      true
    );

    yearByYear.push({
      year,
      age: ageAtYear,
      withoutSwipeSwipe: Math.round(valueWithoutSS),
      withSwipeSwipe: Math.round(valueWithSS),
      totalContributions: Math.round(totalContribsWithSS),
      totalEarnings: Math.round(valueWithSS - totalContribsWithSS),
      swipeswipeContribution: Math.round(valueWithSS - valueWithoutSS)
    });
  }

  const assumptions: ProjectionAssumptions = {
    annualReturnRate: PRE_RETIREMENT_RETURN_RATE,
    inflationRate: DEFAULT_INFLATION_RATE,
    compoundingFrequency: 'monthly'
  };

  return {
    withoutSwipeSwipe,
    withSwipeSwipe,
    swipeswipeContribution,
    yearByYear,
    assumptions
  };
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format number as currency (USD)
 */
export function formatCurrency(amount: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate user financial data
 */
export function validateUserData(data: Partial<UserFinancialData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (data.age !== undefined) {
    if (data.age < 18 || data.age > 100) {
      errors.push('Age must be between 18 and 100');
    }
  }

  if (data.annualIncome !== undefined) {
    if (data.annualIncome < 0) {
      errors.push('Annual income cannot be negative');
    }
    if (data.annualIncome > 100000000) {
      errors.push('Please enter a realistic annual income');
    }
  }

  if (data.currentSavings !== undefined) {
    if (data.currentSavings < 0) {
      errors.push('Current savings cannot be negative');
    }
  }

  if (data.monthlySavings !== undefined) {
    if (data.monthlySavings < 0) {
      errors.push('Monthly savings cannot be negative');
    }
  }

  if (data.monthlyInvestment !== undefined) {
    if (data.monthlyInvestment < 0) {
      errors.push('Monthly investment cannot be negative');
    }
  }

  if (data.increasePercentage !== undefined) {
    if (data.increasePercentage < 0 || data.increasePercentage > 500) {
      errors.push('Increase percentage must be between 0 and 500');
    }
  }

  if (data.swipeswipeSavings !== undefined) {
    if (data.swipeswipeSavings < 0) {
      errors.push('SwipeSwipe savings cannot be negative');
    }
    if (data.swipeswipeSavings > 10000) {
      errors.push('Please enter a realistic SwipeSwipe savings estimate');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// ADDITIONAL FINANCIAL UTILITIES
// ============================================================================

/**
 * Calculate years to reach a financial goal
 */
export function yearsToReachGoal(
  principal: number,
  monthlyContribution: number,
  goal: number,
  annualRate: number = DEFAULT_ANNUAL_RETURN_RATE
): number {
  let currentValue = principal;
  let years = 0;
  const maxYears = 100;

  while (currentValue < goal && years < maxYears) {
    currentValue = calculateFutureValue(principal, monthlyContribution, annualRate, years + 1);
    years++;
  }

  return years;
}

/**
 * Calculate monthly contribution needed to reach a goal
 */
export function monthlyContributionForGoal(
  principal: number,
  goal: number,
  years: number,
  annualRate: number = DEFAULT_ANNUAL_RETURN_RATE
): number {
  const n = COMPOUNDING_PERIODS_PER_YEAR;
  const r = annualRate;
  const t = years;
  
  // Future value of principal
  const principalFV = principal * Math.pow(1 + r / n, n * t);
  
  // Remaining amount needed
  const remainingGoal = goal - principalFV;
  
  if (remainingGoal <= 0) return 0;
  
  // Calculate monthly contribution needed
  const periodicRate = r / n;
  const totalPeriods = n * t;
  
  if (periodicRate === 0) {
    return remainingGoal / totalPeriods;
  }
  
  const monthlyNeeded = remainingGoal * periodicRate / (Math.pow(1 + periodicRate, totalPeriods) - 1);
  
  return Math.max(0, monthlyNeeded);
}

/**
 * Calculate inflation-adjusted value
 */
export function adjustForInflation(
  futureValue: number,
  years: number,
  inflationRate: number = DEFAULT_INFLATION_RATE
): number {
  return futureValue / Math.pow(1 + inflationRate, years);
}

/**
 * Calculate real return rate (after inflation)
 */
export function realReturnRate(
  nominalRate: number,
  inflationRate: number = DEFAULT_INFLATION_RATE
): number {
  return (1 + nominalRate) / (1 + inflationRate) - 1;
}
