/**
 * SwipeSwipe Wealth Chatbot
 * 
 * A production-ready AI chatbot for financial planning and wealth projection
 * 
 * @example
 * ```tsx
 * import { WealthChatbot } from 'swipeswipe-wealth-chatbot';
 * 
 * function App() {
 *   return (
 *     <WealthChatbot 
 *       apiKey={process.env.OPENAI_API_KEY}
 *       companyName="SwipeSwipe"
 *       onProjectionComplete={(projection) => console.log(projection)}
 *     />
 *   );
 * }
 * ```
 */

// Main Component
export { default as WealthChatbot } from './components/WealthChatbot';

// Types
export type {
  UserFinancialData,
  WealthProjection,
  YearlyProjection,
  ChatMessage,
  GuardrailResult,
  WealthChatbotProps,
  ProjectionAssumptions,
  ChatbotConfig
} from './types';

// Utilities (for advanced usage)
export {
  calculateFutureValue,
  calculateWealthProjection,
  formatCurrency,
  parseCurrency,
  validateUserData,
  yearsToReachGoal,
  monthlyContributionForGoal,
  adjustForInflation
} from './utils/calculations';

// Guardrails (for customization)
export {
  checkGuardrails,
  isOnTopic,
  classifyIntent,
  ALLOWED_TOPICS
} from './utils/guardrails';

// Constants (for customization)
export {
  SYSTEM_PROMPT,
  DISCLAIMER,
  CONFIG,
  ERROR_MESSAGES,
  PREDEFINED_RESPONSES
} from './constants';
