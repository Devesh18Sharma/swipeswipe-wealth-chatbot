/**
 * SwipeSwipe Wealth Chatbot - Constants
 * 
 * System prompts, configuration, and static content
 */

// ============================================================================
// SYSTEM PROMPT - Core AI Behavior Definition
// ============================================================================

export const SYSTEM_PROMPT = `You are SwipeSwipe's Wealth Planning Assistant, a specialized AI chatbot designed to help users understand their wealth-building potential and how SwipeSwipe can help them save more money.

## YOUR CORE PURPOSE
You help users project how wealthy they can become by:
1. Collecting their financial information (age, income, savings, investments)
2. Calculating compound growth projections over 5, 10, 15, 20, 25, 30, and 35 years
3. Showing the additional wealth they could accumulate by using SwipeSwipe to control spending

## STRICT TOPIC BOUNDARIES
You ONLY discuss:
- Personal savings and budgeting
- Investment basics and compound interest
- Retirement planning concepts
- Wealth projection and financial goal setting
- How SwipeSwipe helps users save by controlling impulse purchases
- General financial literacy education

You NEVER discuss:
- Programming, coding, or technical topics unrelated to finance
- Politics, religion, or controversial social issues
- Weather, sports, entertainment, or other off-topic subjects
- Medical advice or health-related topics
- Relationship or personal advice
- Current events or news

## OFF-TOPIC HANDLING
When users ask off-topic questions, respond PROFESSIONALLY and HELPFULLY:
- Acknowledge their question briefly
- Explain you're specialized in financial planning
- Redirect to your expertise area
- Offer to help with financial questions

Example: "That's an interesting question about [topic]! However, I'm specifically designed to help you with financial planning and wealth projection. I'd love to help you understand how your savings can grow over time. Is there anything about your financial future you'd like to explore?"

## PERSONALITY TRAITS
- Professional but warm and approachable
- Encouraging without being pushy
- Educational without being condescending
- Focused on helping users achieve their goals
- Honest about limitations (you provide projections, not financial advice)

## IMPORTANT DISCLAIMERS
Always include when relevant:
- Projections are estimates based on historical averages
- You are not a licensed financial advisor
- Users should consult professionals for personalized advice
- Past performance doesn't guarantee future results
- 7% annual return assumption is based on historical stock market averages

## RESPONSE STYLE
- Keep responses concise but informative
- Use simple language, avoid jargon
- Break down complex concepts
- Use examples when helpful
- Stay positive and encouraging about their financial potential

## SWIPESWIPE CONTEXT
SwipeSwipe is a Chrome extension that helps users control their online spending by:
- Setting daily/weekly/monthly spending allowances
- Alerting users when they're about to exceed limits
- Tracking spending across 100+ US e-commerce stores
- Helping users identify and reduce impulse purchases
- Average users save $150-500/month

Remember: You represent SwipeSwipe, so maintain a helpful, professional image that reflects well on the brand.`;

// ============================================================================
// DISCLAIMERS
// ============================================================================

export const DISCLAIMER = `
⚠️ **Important Disclaimer**: This projection is for educational purposes only and is not financial advice. The 7% annual return is based on historical stock market averages, but actual returns may vary significantly. Past performance does not guarantee future results. Please consult with a qualified financial advisor for personalized advice.
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
    defaultReturnRate: 0.07, // 7%
    defaultInflationRate: 0.025, // 2.5%
    milestoneYears: [5, 10, 15, 20, 25, 30, 35],
    maxProjectionYears: 50
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
