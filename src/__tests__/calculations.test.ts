/**
 * SwipeSwipe Wealth Chatbot - Calculation Tests
 * 
 * BDD/TDD test suite for financial calculations
 * Following the 5 Whys principle for comprehensive testing
 */

import {
  calculateFutureValue,
  calculateCompoundInterest,
  calculateWealthProjection,
  formatCurrency,
  parseCurrency,
  validateUserData,
  yearsToReachGoal,
  monthlyContributionForGoal,
  adjustForInflation
} from '../utils/calculations';
import { UserFinancialData } from '../types';

// ============================================================================
// TEST DATA - Following 5 Whys principle
// ============================================================================

/*
 * 5 Whys Analysis for Test Cases:
 * 
 * WHY #1: Why do we need these calculations?
 * - Users want to see how wealthy they can become
 * 
 * WHY #2: Why do users want to see wealth projections?
 * - To motivate them to save more and use SwipeSwipe
 * 
 * WHY #3: Why would accurate projections motivate them?
 * - Because seeing tangible future value creates emotional connection to goals
 * 
 * WHY #4: Why is emotional connection important?
 * - Users are more likely to change behavior when they see the long-term impact
 * 
 * WHY #5: Why must calculations be accurate?
 * - Inaccurate projections would damage trust and credibility
 * - Unrealistic numbers could lead to poor financial decisions
 */

const sampleUserData: UserFinancialData = {
  age: 30,
  annualIncome: 75000,
  currentSavings: 25000,
  monthlySavings: 500,
  monthlyInvestment: 300,
  increasePercentage: 20,
  swipeswipeSavings: 200
};

// ============================================================================
// DESCRIBE: Future Value Calculations
// ============================================================================

describe('calculateFutureValue', () => {
  // BDD Feature: As a user, I want to see how my money grows over time
  
  describe('GIVEN a principal amount with no contributions', () => {
    it('WHEN calculated over 10 years at 7% THEN should show compound growth', () => {
      const result = calculateFutureValue(10000, 0, 0.07, 10);
      
      // $10,000 at 7% for 10 years should be approximately $19,671
      expect(result).toBeGreaterThan(19000);
      expect(result).toBeLessThan(20500);
    });

    it('WHEN calculated over 30 years at 7% THEN should show exponential growth', () => {
      const result = calculateFutureValue(10000, 0, 0.07, 30);
      
      // $10,000 at 7% for 30 years should be approximately $76,123
      expect(result).toBeGreaterThan(75000);
      expect(result).toBeLessThan(78000);
    });
  });

  describe('GIVEN monthly contributions', () => {
    it('WHEN $500/month is added for 10 years THEN should accumulate significantly', () => {
      const result = calculateFutureValue(0, 500, 0.07, 10);
      
      // $500/month for 10 years at 7% should be approximately $86,000
      expect(result).toBeGreaterThan(80000);
      expect(result).toBeLessThan(92000);
    });

    it('WHEN $500/month is added for 30 years THEN should show power of time', () => {
      const result = calculateFutureValue(0, 500, 0.07, 30);
      
      // $500/month for 30 years at 7% should be approximately $610,000
      expect(result).toBeGreaterThan(580000);
      expect(result).toBeLessThan(650000);
    });
  });

  describe('GIVEN both principal and monthly contributions', () => {
    it('WHEN combined THEN should add both components', () => {
      const principalOnly = calculateFutureValue(25000, 0, 0.07, 20);
      const contributionsOnly = calculateFutureValue(0, 800, 0.07, 20);
      const combined = calculateFutureValue(25000, 800, 0.07, 20);
      
      // Combined should equal sum of both (within rounding)
      expect(combined).toBeCloseTo(principalOnly + contributionsOnly, -2);
    });
  });

  describe('Edge Cases - Following 5 Whys robustness principle', () => {
    it('WHEN rate is 0 THEN should just accumulate contributions', () => {
      const result = calculateFutureValue(10000, 100, 0, 10);
      
      // $10,000 + ($100 * 12 * 10) = $22,000
      expect(result).toBeCloseTo(22000, 0);
    });

    it('WHEN years is 0 THEN should return principal only', () => {
      const result = calculateFutureValue(10000, 500, 0.07, 0);
      
      expect(result).toBe(10000);
    });

    it('WHEN contributions are 0 THEN should only grow principal', () => {
      const result = calculateFutureValue(50000, 0, 0.07, 5);
      const expected = 50000 * Math.pow(1 + 0.07/12, 12 * 5);
      
      expect(result).toBeCloseTo(expected, 0);
    });
  });
});

// ============================================================================
// DESCRIBE: Wealth Projection
// ============================================================================

describe('calculateWealthProjection', () => {
  // BDD Feature: As a user, I want to see my wealth at key milestones
  
  describe('GIVEN complete user financial data', () => {
    let projection: ReturnType<typeof calculateWealthProjection>;
    
    beforeEach(() => {
      projection = calculateWealthProjection(sampleUserData);
    });

    it('WHEN projection is calculated THEN should have all milestone years', () => {
      const expectedYears = [5, 10, 15, 20, 25, 30, 35];
      
      expectedYears.forEach(year => {
        expect(projection.withoutSwipeSwipe[year]).toBeDefined();
        expect(projection.withSwipeSwipe[year]).toBeDefined();
        expect(projection.swipeswipeContribution[year]).toBeDefined();
      });
    });

    it('WHEN projection is calculated THEN withSwipeSwipe should always be higher', () => {
      const years = [5, 10, 15, 20, 25, 30, 35];
      
      years.forEach(year => {
        expect(projection.withSwipeSwipe[year]).toBeGreaterThan(
          projection.withoutSwipeSwipe[year]
        );
      });
    });

    it('WHEN projection is calculated THEN swipeswipeContribution should equal the difference', () => {
      const years = [5, 10, 15, 20, 25, 30, 35];
      
      years.forEach(year => {
        const expectedContribution = projection.withSwipeSwipe[year] - projection.withoutSwipeSwipe[year];
        expect(projection.swipeswipeContribution[year]).toBeCloseTo(expectedContribution, 0);
      });
    });

    it('WHEN projection is calculated THEN values should increase over time', () => {
      const years = [5, 10, 15, 20, 25, 30, 35];
      
      for (let i = 1; i < years.length; i++) {
        expect(projection.withSwipeSwipe[years[i]]).toBeGreaterThan(
          projection.withSwipeSwipe[years[i - 1]]
        );
      }
    });

    it('WHEN yearByYear is generated THEN should have 35 entries', () => {
      expect(projection.yearByYear).toHaveLength(35);
    });

    it('WHEN yearByYear is generated THEN age should increment correctly', () => {
      projection.yearByYear.forEach((entry, index) => {
        expect(entry.age).toBe(sampleUserData.age + index + 1);
        expect(entry.year).toBe(index + 1);
      });
    });
  });

  describe('GIVEN user with zero SwipeSwipe savings', () => {
    it('WHEN projection is calculated THEN swipeswipeContribution should be 0', () => {
      const dataWithoutSS: UserFinancialData = {
        ...sampleUserData,
        swipeswipeSavings: 0
      };
      
      const projection = calculateWealthProjection(dataWithoutSS);
      
      expect(projection.swipeswipeContribution[30]).toBe(0);
      expect(projection.withSwipeSwipe[30]).toBe(projection.withoutSwipeSwipe[30]);
    });
  });
});

// ============================================================================
// DESCRIBE: Currency Formatting
// ============================================================================

describe('formatCurrency', () => {
  // BDD Feature: As a user, I want numbers displayed in readable format
  
  it('WHEN formatting whole numbers THEN should display with $ and commas', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000');
    expect(formatCurrency(500)).toBe('$500');
    expect(formatCurrency(0)).toBe('$0');
  });

  it('WHEN formatting with decimals THEN should respect decimal parameter', () => {
    expect(formatCurrency(1234.567, 2)).toBe('$1,234.57');
    expect(formatCurrency(1234.567, 0)).toBe('$1,235');
  });

  it('WHEN formatting large numbers THEN should be readable', () => {
    expect(formatCurrency(1234567890)).toBe('$1,234,567,890');
  });
});

describe('parseCurrency', () => {
  // BDD Feature: As a user, I want to enter amounts in various formats
  
  it('WHEN parsing with dollar sign THEN should extract number', () => {
    expect(parseCurrency('$1,000')).toBe(1000);
    expect(parseCurrency('$50,000.50')).toBe(50000.5);
  });

  it('WHEN parsing plain number THEN should work correctly', () => {
    expect(parseCurrency('5000')).toBe(5000);
    expect(parseCurrency('100.50')).toBe(100.5);
  });

  it('WHEN parsing invalid input THEN should return 0', () => {
    expect(parseCurrency('abc')).toBe(0);
    expect(parseCurrency('')).toBe(0);
  });
});

// ============================================================================
// DESCRIBE: Input Validation
// ============================================================================

describe('validateUserData', () => {
  // BDD Feature: As a system, I must validate user inputs to prevent errors
  
  describe('GIVEN valid user data', () => {
    it('WHEN all fields are within bounds THEN should be valid', () => {
      const result = validateUserData(sampleUserData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('GIVEN invalid age', () => {
    it('WHEN age is below 18 THEN should be invalid', () => {
      const result = validateUserData({ age: 15 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Age must be between 18 and 100');
    });

    it('WHEN age is above 100 THEN should be invalid', () => {
      const result = validateUserData({ age: 105 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Age must be between 18 and 100');
    });
  });

  describe('GIVEN negative values', () => {
    it('WHEN income is negative THEN should be invalid', () => {
      const result = validateUserData({ annualIncome: -50000 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Annual income cannot be negative');
    });

    it('WHEN savings is negative THEN should be invalid', () => {
      const result = validateUserData({ currentSavings: -1000 });
      
      expect(result.isValid).toBe(false);
    });
  });

  describe('GIVEN unrealistic values', () => {
    it('WHEN income is extremely high THEN should be invalid', () => {
      const result = validateUserData({ annualIncome: 500000000 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a realistic annual income');
    });

    it('WHEN SwipeSwipe savings is unrealistic THEN should be invalid', () => {
      const result = validateUserData({ swipeswipeSavings: 15000 });
      
      expect(result.isValid).toBe(false);
    });
  });
});

// ============================================================================
// DESCRIBE: Additional Financial Utilities
// ============================================================================

describe('yearsToReachGoal', () => {
  // BDD Feature: As a user, I want to know when I'll reach my goal
  
  it('WHEN given realistic inputs THEN should return reasonable timeframe', () => {
    const years = yearsToReachGoal(10000, 1000, 500000, 0.07);
    
    // Should take roughly 20-25 years to reach $500k from $10k + $1k/month
    expect(years).toBeGreaterThan(15);
    expect(years).toBeLessThan(30);
  });

  it('WHEN goal is already met THEN should return 0', () => {
    const years = yearsToReachGoal(1000000, 0, 500000, 0.07);
    
    expect(years).toBe(0);
  });
});

describe('monthlyContributionForGoal', () => {
  // BDD Feature: As a user, I want to know how much to save monthly
  
  it('WHEN given a goal and timeframe THEN should calculate required contribution', () => {
    const monthly = monthlyContributionForGoal(10000, 500000, 20, 0.07);
    
    // Verify by calculating forward
    const projectedValue = calculateFutureValue(10000, monthly, 0.07, 20);
    expect(projectedValue).toBeCloseTo(500000, -3);
  });

  it('WHEN goal is already met with principal THEN should return 0', () => {
    const monthly = monthlyContributionForGoal(1000000, 500000, 20, 0.07);
    
    expect(monthly).toBe(0);
  });
});

describe('adjustForInflation', () => {
  // BDD Feature: As a user, I want to understand real purchasing power
  
  it('WHEN adjusting for inflation THEN should reduce future value', () => {
    const futureValue = 1000000;
    const adjustedValue = adjustForInflation(futureValue, 30, 0.025);
    
    // After 30 years of 2.5% inflation, $1M has less purchasing power
    expect(adjustedValue).toBeLessThan(futureValue);
    expect(adjustedValue).toBeGreaterThan(400000); // Rough sanity check
  });

  it('WHEN no inflation THEN should return same value', () => {
    const futureValue = 1000000;
    const adjustedValue = adjustForInflation(futureValue, 30, 0);
    
    expect(adjustedValue).toBe(futureValue);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('End-to-End Projection Scenarios', () => {
  // BDD Feature: As a user, I want accurate projections for my specific situation
  
  describe('SCENARIO: Young professional starting early', () => {
    const youngProfessional: UserFinancialData = {
      age: 25,
      annualIncome: 60000,
      currentSavings: 10000,
      monthlySavings: 400,
      monthlyInvestment: 200,
      increasePercentage: 25,
      swipeswipeSavings: 250
    };

    it('THEN should show significant wealth by retirement age', () => {
      const projection = calculateWealthProjection(youngProfessional);
      
      // By 35 years (age 60), should have substantial savings
      expect(projection.withSwipeSwipe[35]).toBeGreaterThan(1000000);
    });

    it('THEN SwipeSwipe contribution should be significant', () => {
      const projection = calculateWealthProjection(youngProfessional);
      
      // SwipeSwipe contribution over 35 years should be meaningful
      expect(projection.swipeswipeContribution[35]).toBeGreaterThan(200000);
    });
  });

  describe('SCENARIO: Mid-career with existing savings', () => {
    const midCareer: UserFinancialData = {
      age: 40,
      annualIncome: 100000,
      currentSavings: 150000,
      monthlySavings: 1000,
      monthlyInvestment: 1500,
      increasePercentage: 10,
      swipeswipeSavings: 300
    };

    it('THEN should show strong growth over 25 years', () => {
      const projection = calculateWealthProjection(midCareer);
      
      // By retirement (25 years), should have substantial wealth
      expect(projection.withSwipeSwipe[25]).toBeGreaterThan(2000000);
    });
  });

  describe('SCENARIO: Late starter with aggressive savings', () => {
    const lateStarter: UserFinancialData = {
      age: 50,
      annualIncome: 120000,
      currentSavings: 100000,
      monthlySavings: 2000,
      monthlyInvestment: 2000,
      increasePercentage: 30,
      swipeswipeSavings: 500
    };

    it('THEN should still accumulate meaningful wealth in 15 years', () => {
      const projection = calculateWealthProjection(lateStarter);
      
      expect(projection.withSwipeSwipe[15]).toBeGreaterThan(1000000);
    });
  });
});
