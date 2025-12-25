/**
 * SwipeSwipe Wealth Chatbot - Guardrails
 * 
 * Comprehensive guardrails for keeping the chatbot on-topic,
 * handling edge cases professionally, and preventing misuse
 */

import { GuardrailResult, TopicDefinition, WealthProjection, ChatMessage } from '../types';

// ============================================================================
// ALLOWED TOPICS DEFINITION
// ============================================================================

export const ALLOWED_TOPICS: TopicDefinition[] = [
  {
    name: 'savings',
    keywords: ['save', 'saving', 'savings', 'emergency fund', 'rainy day', 'put away', 'set aside'],
    patterns: [/how\s+(?:much|can|do|should)\s+(?:i|we)\s+save/i, /saving\s+(?:money|rate|goal)/i],
    priority: 1
  },
  {
    name: 'investing',
    keywords: ['invest', 'investment', 'portfolio', 'stocks', 'bonds', 'etf', '401k', 'ira', 'roth', 'index fund', 'mutual fund', 'compound interest', 'returns', 'market'],
    patterns: [/(?:how|where|should)\s+(?:i|we)\s+invest/i, /investment\s+(?:strategy|advice|tip)/i],
    priority: 1
  },
  {
    name: 'retirement',
    keywords: ['retire', 'retirement', 'pension', 'social security', 'nest egg', 'golden years'],
    patterns: [/(?:when|how)\s+(?:can|will|should)\s+(?:i|we)\s+retire/i, /retirement\s+(?:age|plan|goal|savings)/i],
    priority: 1
  },
  {
    name: 'wealth',
    keywords: ['wealth', 'rich', 'wealthy', 'net worth', 'millionaire', 'financial freedom', 'fire', 'financial independence'],
    patterns: [/how\s+(?:rich|wealthy)\s+(?:can|will)\s+(?:i|we)/i, /(?:build|grow|accumulate)\s+wealth/i],
    priority: 1
  },
  {
    name: 'budgeting',
    keywords: ['budget', 'budgeting', 'spending', 'expenses', 'cost', 'money management', 'track', 'spending habits'],
    patterns: [/(?:create|make|help\s+with)\s+(?:a\s+)?budget/i, /(?:reduce|cut|lower)\s+(?:spending|expenses)/i],
    priority: 1
  },
  {
    name: 'swipeswipe',
    keywords: ['swipeswipe', 'swipe swipe', 'impulse', 'control spending', 'overspending', 'online shopping', 'extension'],
    patterns: [/(?:how|what)\s+(?:does|is)\s+swipeswipe/i, /swipeswipe\s+(?:help|save|work)/i],
    priority: 1
  },
  {
    name: 'projection',
    keywords: ['projection', 'forecast', 'predict', 'calculate', 'estimate', 'future', 'growth', 'years'],
    patterns: [/(?:how|what)\s+(?:much|will)\s+(?:i|my\s+money)\s+(?:have|grow|be)/i, /(?:5|10|15|20|25|30|35)\s+years/i],
    priority: 1
  },
  {
    name: 'debt',
    keywords: ['debt', 'loan', 'mortgage', 'credit card', 'interest rate', 'pay off', 'owe'],
    patterns: [/pay\s+off\s+(?:debt|loan|credit)/i, /(?:reduce|eliminate)\s+debt/i],
    priority: 2
  },
  {
    name: 'income',
    keywords: ['income', 'salary', 'wage', 'paycheck', 'raise', 'bonus', 'side hustle', 'passive income'],
    patterns: [/(?:increase|grow|boost)\s+income/i, /(?:how|where)\s+(?:to|can)\s+(?:make|earn)\s+(?:more\s+)?money/i],
    priority: 2
  },
  {
    name: 'financial_education',
    keywords: ['learn', 'understand', 'explain', 'what is', 'how does', 'financial literacy', 'money basics'],
    patterns: [/(?:what|how)\s+(?:is|does|are)\s+(?:compound\s+interest|investing|stocks|bonds|diversification)/i],
    priority: 2
  },
  {
    name: 'recalculate',
    keywords: ['start over', 'new projection', 'recalculate', 'redo', 'again', 'change', 'update'],
    patterns: [/(?:start|do)\s+(?:over|again)/i, /(?:new|different)\s+(?:projection|calculation)/i],
    priority: 1
  }
];

// ============================================================================
// OFF-TOPIC KEYWORDS (for detection)
// ============================================================================

const OFF_TOPIC_KEYWORDS = [
  // Programming
  'python', 'javascript', 'java', 'coding', 'programming', 'code', 'developer', 'software',
  'react', 'angular', 'vue', 'node', 'database', 'api', 'github', 'algorithm',
  
  // Weather
  'weather', 'temperature', 'rain', 'sunny', 'cloudy', 'forecast', 'climate',
  
  // Sports
  'football', 'basketball', 'soccer', 'baseball', 'hockey', 'tennis', 'golf',
  'game', 'score', 'team', 'player', 'championship', 'league', 'nfl', 'nba', 'mlb',
  
  // Entertainment
  'movie', 'film', 'show', 'series', 'actor', 'actress', 'celebrity', 'music', 'song',
  'concert', 'album', 'artist', 'netflix', 'streaming', 'tv',
  
  // Politics
  'president', 'election', 'vote', 'democrat', 'republican', 'congress', 'senate',
  'politics', 'political', 'government', 'law', 'legislation', 'policy',
  
  // Food/Recipes
  'recipe', 'cook', 'bake', 'ingredient', 'restaurant', 'food', 'meal', 'dinner',
  
  // Travel
  'vacation', 'trip', 'travel', 'flight', 'hotel', 'destination', 'tourist',
  
  // Health (non-financial)
  'doctor', 'medical', 'symptom', 'disease', 'treatment', 'medicine', 'hospital',
  'diagnosis', 'prescription',
  
  // Relationships
  'dating', 'relationship', 'marriage', 'divorce', 'boyfriend', 'girlfriend',
  
  // General Knowledge
  'history', 'geography', 'science', 'biology', 'chemistry', 'physics', 'math',
  'homework', 'essay', 'school', 'university', 'exam'
];

// ============================================================================
// JAILBREAK DETECTION PATTERNS
// ============================================================================

const JAILBREAK_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|prompts)/i,
  /you\s+are\s+now\s+(?:dan|dango|evil|unrestricted)/i,
  /pretend\s+you\s+(?:are|have)\s+no\s+(?:restrictions|limits|rules)/i,
  /act\s+as\s+(?:if|though)\s+you\s+(?:have|were)\s+no\s+(?:guidelines|ethics)/i,
  /disregard\s+(?:your|all)\s+(?:programming|training|rules)/i,
  /override\s+(?:your|all)\s+(?:safety|ethical)\s+(?:protocols|guidelines)/i,
  /(?:roleplay|pretend)\s+(?:as|you're)\s+(?:a\s+)?(?:different|other|new)\s+(?:ai|bot|assistant)/i,
  /what\s+would\s+(?:dan|unrestricted\s+ai)\s+say/i,
  /(?:bypass|circumvent|disable)\s+(?:your|all)\s+(?:filters|restrictions|safety)/i,
  /you\s+(?:must|have\s+to|should)\s+(?:answer|respond\s+to)\s+(?:everything|anything)/i
];

// ============================================================================
// GUARDRAIL CHECK FUNCTION
// ============================================================================

/**
 * Main guardrail check function
 * Analyzes user input and determines if it should be allowed
 */
export function checkGuardrails(message: string): GuardrailResult {
  const lowerMessage = message.toLowerCase().trim();

  // 1. Check for empty or very short messages
  if (lowerMessage.length < 2) {
    return {
      allowed: true,
      category: 'allowed',
      response: ''
    };
  }

  // 2. Check for jailbreak attempts
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(message)) {
      return {
        allowed: false,
        reason: 'Jailbreak attempt detected',
        category: 'jailbreak-attempt',
        severity: 'high',
        response: "I'm designed specifically to help you with financial planning and wealth projection. I can't change my role or ignore my guidelines. How can I help you understand your financial future better?"
      };
    }
  }

  // 3. Check for PII requests
  if (isPIIRequest(lowerMessage)) {
    return {
      allowed: false,
      reason: 'PII request detected',
      category: 'pii-request',
      severity: 'medium',
      response: "I don't collect or store personal identification information like social security numbers, bank account details, or passwords. I only use the financial data you share during our conversation to create your wealth projection. Is there something about your projection you'd like to explore?"
    };
  }

  // 4. Check for inappropriate content
  if (isInappropriate(lowerMessage)) {
    return {
      allowed: false,
      reason: 'Inappropriate content detected',
      category: 'inappropriate',
      severity: 'medium',
      response: "I'm here to help you with financial planning and wealth building. Let's keep our conversation focused on your financial goals. What would you like to know about saving or investing?"
    };
  }

  // 5. Check if asking for actual financial advice (we should clarify we're educational)
  if (isFinancialAdviceRequest(lowerMessage)) {
    return {
      allowed: true,
      reason: 'Financial advice request - add disclaimer',
      category: 'financial-advice',
      severity: 'low',
      response: '' // Allow but the response should include disclaimer
    };
  }

  // 6. All checks passed
  return {
    allowed: true,
    category: 'allowed',
    response: ''
  };
}

// ============================================================================
// TOPIC DETECTION FUNCTION
// ============================================================================

/**
 * Check if a message is on-topic for financial planning
 */
export function isOnTopic(message: string, allowedTopics: TopicDefinition[]): boolean {
  const lowerMessage = message.toLowerCase();
  
  // Very short messages are usually on-topic (numbers, simple responses)
  if (message.length < 10) {
    return true;
  }

  // Check if it contains primarily off-topic keywords
  const offTopicCount = OFF_TOPIC_KEYWORDS.filter(keyword => 
    lowerMessage.includes(keyword)
  ).length;

  // Check if it matches any allowed topic
  let onTopicScore = 0;
  
  for (const topic of allowedTopics) {
    // Check keywords
    for (const keyword of topic.keywords) {
      if (lowerMessage.includes(keyword)) {
        onTopicScore += topic.priority;
      }
    }
    
    // Check patterns
    for (const pattern of topic.patterns) {
      if (pattern.test(message)) {
        onTopicScore += topic.priority * 2;
      }
    }
  }

  // Financial-related words that indicate on-topic
  const financialIndicators = [
    'money', 'dollar', 'save', 'invest', 'rich', 'wealth', 'retire',
    'income', 'budget', 'spend', 'projection', 'calculate', 'year',
    'percent', '%', 'growth', 'return', 'interest', 'compound'
  ];
  
  for (const indicator of financialIndicators) {
    if (lowerMessage.includes(indicator)) {
      onTopicScore += 1;
    }
  }

  // Decision: if on-topic score is significantly higher than off-topic, allow
  // Or if off-topic count is 0
  return onTopicScore > offTopicCount * 2 || offTopicCount === 0;
}

// ============================================================================
// HELPER DETECTION FUNCTIONS
// ============================================================================

function isPIIRequest(message: string): boolean {
  const piiPatterns = [
    /(?:what\s+is|give\s+me|share|tell\s+me)\s+(?:your|my)\s+(?:ssn|social\s+security)/i,
    /(?:bank|credit\s+card)\s+(?:number|account|details)/i,
    /(?:password|pin|security\s+code)/i,
    /(?:mother'?s?\s+maiden|birthplace|first\s+pet)/i
  ];
  
  return piiPatterns.some(pattern => pattern.test(message));
}

function isInappropriate(message: string): boolean {
  // Basic inappropriate content detection
  const inappropriatePatterns = [
    /\b(?:fuck|shit|ass|damn|bitch|bastard)\b/i,
    /\b(?:kill|murder|suicide|harm)\b/i,
    /\b(?:illegal|drugs|weapon)\b/i
  ];
  
  return inappropriatePatterns.some(pattern => pattern.test(message));
}

function isFinancialAdviceRequest(message: string): boolean {
  const advicePatterns = [
    /should\s+i\s+(?:buy|sell|invest|put)/i,
    /(?:what|which)\s+stock(?:s)?\s+(?:should|to)\s+(?:buy|invest)/i,
    /(?:recommend|suggest)\s+(?:a|any)\s+(?:stock|investment|fund)/i,
    /is\s+(?:this|it)\s+a\s+good\s+(?:time|idea)\s+to\s+(?:buy|sell|invest)/i
  ];
  
  return advicePatterns.some(pattern => pattern.test(message));
}

// ============================================================================
// OPENAI API INTEGRATION
// ============================================================================

/**
 * Generate bot response using OpenAI API
 * Enhanced with conversation history, retry logic, and timeout handling
 */
export async function generateBotResponse(
  userMessage: string,
  systemPrompt: string,
  apiKey: string,
  projection: WealthProjection | null,
  conversationHistory?: ChatMessage[]
): Promise<string> {
  // Build enhanced system prompt with projection context
  let enhancedSystemPrompt = systemPrompt;
  
  if (projection) {
    enhancedSystemPrompt += `\n\n## USER'S CURRENT PROJECTION
- 5-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[5].toLocaleString()}
- 10-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[10].toLocaleString()}
- 30-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[30].toLocaleString()}
- SwipeSwipe contribution over 30 years: $${projection.swipeswipeContribution[30].toLocaleString()}

Use this data to provide personalized insights when relevant.`;
  }

  // Build conversation context from history
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
  
  // Add system prompt
  messages.push({ role: 'system', content: enhancedSystemPrompt });
  
  // Add conversation history (last 10 messages to stay within token limits)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-10); // Last 10 messages
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }
  }
  
  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second base delay
  const TIMEOUT = 30000; // 30 seconds

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Cost-effective model
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        throw new Error(`API error: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return content;

    } catch (error: any) {
      lastError = error;

      // Don't retry on timeout or client errors
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }

      if (error.message?.includes('Invalid API key') || 
          error.message?.includes('Rate limit')) {
        throw error; // Don't retry these
      }

      // Retry with exponential backoff
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, attempt); // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  // If all retries failed
  throw lastError || new Error('Failed to get response from OpenAI after multiple attempts.');
}

// ============================================================================
// UNIFIED AI RESPONSE (OpenAI or Gemini)
// ============================================================================

export type AIProvider = 'openai' | 'gemini';

/**
 * Generate bot response using either OpenAI or Gemini
 * This allows easy switching between providers
 */
export async function generateAIResponse(
  userMessage: string,
  systemPrompt: string,
  apiKey: string,
  projection: WealthProjection | null,
  conversationHistory: ChatMessage[] = [],
  provider: AIProvider = 'openai'
): Promise<string> {
  if (provider === 'gemini') {
    // Dynamic import to avoid loading Gemini SDK if not needed
    const { generateGeminiResponse } = await import('../services/geminiService');
    return generateGeminiResponse(userMessage, apiKey, projection, conversationHistory);
  }

  // Default to OpenAI
  return generateBotResponse(userMessage, systemPrompt, apiKey, projection, conversationHistory);
}

// ============================================================================
// INTENT CLASSIFICATION
// ============================================================================

export function classifyIntent(message: string): string {
  if (/(?:start\s+over|new\s+projection|recalculate)/i.test(message)) {
    return 'restart';
  }
  
  if (/(?:how|what)\s+(?:does|is)\s+(?:swipeswipe|this)/i.test(message)) {
    return 'product_info';
  }
  
  if (/(?:what|how)\s+(?:is|does)\s+(?:compound|interest)/i.test(message)) {
    return 'education';
  }
  
  if (/(?:retire|retirement)/i.test(message)) {
    return 'retirement';
  }
  
  if (/(?:save|saving|budget)/i.test(message)) {
    return 'savings_tips';
  }
  
  if (/(?:invest|stock|market|portfolio)/i.test(message)) {
    return 'investment';
  }
  
  if (/(?:thank|thanks|bye|goodbye)/i.test(message)) {
    return 'closing';
  }
  
  if (/(?:help|assist|support)/i.test(message)) {
    return 'help';
  }
  
  return 'general';
}
