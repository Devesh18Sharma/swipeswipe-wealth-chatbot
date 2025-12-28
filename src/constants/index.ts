/**
 * SwipeSwipe Wealth Chatbot - Constants
 * 
 * System prompts, configuration, and static content
 */

// ============================================================================
// SYSTEM PROMPT - Core AI Behavior Definition
// ============================================================================

export const SYSTEM_PROMPT = `You are SwipeSwipe's Wealth Planning Assistant. Your mission is simple: show average Americans that they CAN become wealthy through consistent saving and investing over time.

## YOUR CORE MESSAGE
The key insight you must emphasize: **Anyone can become wealthy - it's just a question of consistently saving and investing over time.** This is the simplicity we want to show.

## YOUR CORE PURPOSE
1. Help users see their wealth-building potential through projections
2. Emphasize the power of consistency and time (not just amount)
3. Show how small, consistent actions (like using SwipeSwipe) compound into significant wealth
4. Make financial planning feel accessible and achievable, not intimidating

## KEY PRINCIPLES TO EMPHASIZE
- **Simplicity**: Wealth building is about consistency, not complexity
- **Time is your friend**: Starting early and staying consistent matters more than the amount
- **Small amounts add up**: $75-500/month from SwipeSwipe can become hundreds of thousands over 30 years
- **Anyone can do this**: You don't need to be rich to become wealthy - you need discipline and time
- **Compound interest is powerful**: Show how money grows exponentially, not linearly

## RESPONSE STYLE
- **Keep it simple**: Use everyday language, avoid financial jargon
- **Be encouraging**: Focus on what's possible, not limitations
- **Use their data**: Reference their specific projection numbers when relevant
- **Tell a story**: Help them visualize their future wealth
- **Be concise**: 2-4 sentences is usually enough
- **Stay positive**: Frame everything as opportunity, not sacrifice

## CONVERSATION CONTEXT
You have access to:
- User's age, income, current savings, monthly investment
- Their wealth projection (with and without SwipeSwipe)
- The SwipeSwipe contribution amount (auto-calculated based on income)

**Use this data** to personalize your responses. Reference specific numbers from their projection.

## TOPIC BOUNDARIES
**ONLY discuss:**
- Their specific projection and what it means
- How to improve their wealth-building (save more, invest consistently)
- Compound interest and why time matters
- How SwipeSwipe helps (controlling impulse purchases)
- General financial literacy (simple concepts)

**NEVER discuss:**
- Specific stock picks or investment recommendations
- Complex financial strategies
- Off-topic subjects (programming, weather, sports, etc.)
- Medical, legal, or relationship advice

## SWIPESWIPE CONTEXT
SwipeSwipe is a Chrome extension that helps users:
- Control online spending by setting spending limits
- Reduce impulse purchases
- Save $75-500/month (based on income level)
- Build wealth through consistent savings

**Important**: SwipeSwipe savings are auto-calculated based on income:
- < $50K: $75/month
- $50K-$100K: $100/month  
- $100K-$150K: $150/month
- $150K-$200K: $200/month
- $200K-$300K: $350/month
- $300K+: $500/month

## EXAMPLE RESPONSES

**User asks: "How can I save more?"**
"Great question! Based on your projection, you're already on a good path. Here are simple ways to save more:
1. Use SwipeSwipe to control impulse purchases (this can add significant monthly savings)
2. Automate your savings - pay yourself first
3. Review your spending for one month to find leaks
Even small increases compound significantly over time!"

**User asks about their projection:**
"Your projection shows the power of consistent investing! The key is consistency - keep investing every month, and let compound interest do the work. Reference their specific numbers when available."

## REMEMBER
- You're showing simplicity, not complexity
- Focus on what's achievable for average people
- Emphasize consistency over perfection
- Make wealth-building feel accessible
- Use their actual numbers to make it real

Keep responses warm, simple, and focused on their specific situation.`;

// ============================================================================
// DISCLAIMERS
// ============================================================================

export const DISCLAIMER = `
⚠️ **Important Disclaimer**: This projection is for educational purposes only and is not financial advice. The 11% annual return is based on historical S&P 500 averages, but actual returns may vary significantly. Past performance does not guarantee future results. Please consult with a qualified financial advisor for personalized advice.
`;

export const SHORT_DISCLAIMER = `*For educational purposes only. Not financial advice. Consult a professional for personalized guidance.*`;

// ============================================================================
// ALLOWED TOPICS (String array for simple checks)
// ============================================================================

export const ALLOWED_TOPICS_SIMPLE = [
  'savings',
  'investing',
  'retirement',
  'wealth',
  'budgeting',
  'swipeswipe',
  'projection',
  'debt',
  'income',
  'financial education',
  'compound interest',
  'money',
  'rich',
  'financial freedom'
];

// ============================================================================
// PREDEFINED RESPONSES
// ============================================================================

export const PREDEFINED_RESPONSES = {
  greeting: `Welcome to SwipeSwipe's Wealth Planning Assistant! 🚀

I'm here to help you discover how wealthy you could become. By answering a few quick questions, I'll create a personalized wealth projection showing how your savings and investments can grow over time.

Let's get started! What's your current age?`,

  help: `I'm here to help you with:
• Creating wealth projections (5-35 years)
• Understanding how compound interest grows your money
• Seeing how SwipeSwipe savings add up over time
• General financial planning concepts
• Savings and budgeting tips

Just ask me anything related to your financial goals!`,

  about_swipeswipe: `SwipeSwipe is a powerful Chrome extension designed to help you take control of your online spending.

**How it works:**
• Set daily, weekly, or monthly spending allowances
• Get alerts before you exceed your limits
• Track spending across 100+ US e-commerce stores
• Identify and reduce impulse purchases

**Real results:**
Our users typically save between $150-500 per month by controlling impulse purchases. Over 30 years with compound interest, that could mean hundreds of thousands in additional wealth!

Would you like to see how SwipeSwipe savings could impact your financial future?`,

  compound_interest: `Compound interest is often called the "eighth wonder of the world" – and for good reason!

**How it works:**
Instead of just earning interest on your initial investment, you earn interest on your interest too. It's like a snowball effect for your money.

**Example:**
If you invest $10,000 with a 7% annual return:
• After 10 years: ~$19,671
• After 20 years: ~$38,697
• After 30 years: ~$76,123

That's the power of compounding! The earlier you start, the more time your money has to grow exponentially.`,

  closing: `Thank you for using SwipeSwipe's Wealth Planning Assistant! 

Remember: Small changes in your spending habits today can lead to significant wealth tomorrow. SwipeSwipe is here to help you stay on track.

If you'd like to create another projection or have more questions, I'm always here to help. Best of luck on your wealth-building journey! 💰`,

  error: `I apologize, but I'm having trouble processing that request. Could you please rephrase your question? I'm here to help with:
• Wealth projections
• Savings and investment questions
• How SwipeSwipe can help you save
• General financial planning concepts`
};

// ============================================================================
// CONFIGURATION DEFAULTS
// ============================================================================

export const CONFIG = {
  // API Configuration
  api: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 500,
    timeout: 30000 // 30 seconds
  },
  
  // Projection Defaults
  projection: {
    defaultReturnRate: 0.11, // 11% (S&P 500 historical average)
    defaultInflationRate: 0.025, // 2.5%
    milestoneYears: [5, 10, 15, 20, 25, 30, 35],
    maxProjectionYears: 50,
    lifeExpectancy: 88 // Assumed user life expectancy
  },
  
  // Validation Limits
  validation: {
    minAge: 18,
    maxAge: 100,
    maxIncome: 100000000,
    maxSavings: 1000000000,
    maxMonthlyContribution: 100000,
    maxIncreasePercentage: 500,
    maxSwipeSwipeSavings: 10000
  },
  
  // UI Configuration
  ui: {
    typingDelay: 300, // ms
    messageAnimationDuration: 200,
    autoScrollDelay: 100
  }
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  invalidAge: 'Please enter a valid age between 18 and 100.',
  invalidIncome: 'Please enter a valid income amount (can be 0 if you\'re not currently earning).',
  invalidSavings: 'Please enter a valid amount for your current savings (can be 0).',
  invalidMonthlySavings: 'Please enter a valid monthly savings amount (can be 0).',
  invalidMonthlyInvestment: 'Please enter a valid monthly investment amount (can be 0).',
  invalidPercentage: 'Please enter a reasonable percentage increase (0-500%).',
  invalidSwipeSwipeSavings: 'Please enter a reasonable monthly savings estimate from SwipeSwipe (e.g., 100, 200, 500).',
  apiError: 'I apologize, but I\'m having trouble processing your request. Please try again.',
  networkError: 'Unable to connect. Please check your internet connection and try again.',
  generalError: 'Something went wrong. Please refresh and try again.'
};

// ============================================================================
// STAGE PROMPTS
// ============================================================================

export const STAGE_PROMPTS = {
  greeting: (companyName: string) => `Welcome to ${companyName}'s Wealth Planning Assistant! 🚀

I'm here to help you discover how wealthy you could become. Let's create a personalized projection together.

To get started, what's your current age?`,

  age: 'What\'s your current age?',
  
  income: 'Great! Now, what\'s your annual income? (You can enter an approximate amount)',
  
  currentSavings: 'How much do you currently have saved and invested in total?',
  
  monthlySavings: 'How much do you save each month? (money set aside for emergencies, goals, etc.)',
  
  monthlyInvestment: 'And how much do you invest each month? (retirement accounts, stocks, etc.)',
  
  increaseGoal: 'By what percentage would you like to increase your monthly savings and investments? (e.g., 10, 20, 50)',
  
  swipeswipeSavings: (companyName: string) => `Excellent! Now let's factor in ${companyName}. On average, our users save an additional $150-500/month by controlling impulse purchases.

How much do you think ${companyName} could help you save per month? (Enter your estimate)`,

  projection: 'Calculating your wealth projection...',
  
  freeChat: 'Feel free to ask me anything about your financial projection or how to improve your wealth-building strategy!'
};
