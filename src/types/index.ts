/**
 * SwipeSwipe Wealth Chatbot - Type Definitions
 * 
 * Comprehensive type definitions for the wealth planning chatbot
 */

// ============================================================================
// USER DATA TYPES
// ============================================================================

export interface UserFinancialData {
  age: number;
  annualIncome: number;
  currentSavings: number;
  monthlySavings: number;
  monthlyInvestment: number;
  increasePercentage: number;
  swipeswipeSavings: number;
}

export interface PartialUserFinancialData {
  age?: number;
  annualIncome?: number;
  currentSavings?: number;
  monthlySavings?: number;
  monthlyInvestment?: number;
  increasePercentage?: number;
  swipeswipeSavings?: number;
}

// ============================================================================
// PROJECTION TYPES
// ============================================================================

export interface WealthProjection {
  // Key milestones: 5, 10, 15, 20, 25, 30, 35 years
  withoutSwipeSwipe: Record<number, number>;
  withSwipeSwipe: Record<number, number>;
  swipeswipeContribution: Record<number, number>;
  yearByYear: YearlyProjection[];
  assumptions: ProjectionAssumptions;
}

export interface YearlyProjection {
  year: number;
  age: number;
  withoutSwipeSwipe: number;
  withSwipeSwipe: number;
  totalContributions: number;
  totalEarnings: number;
  swipeswipeContribution: number;
}

export interface ProjectionAssumptions {
  annualReturnRate: number;
  inflationRate: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
}

// ============================================================================
// CHAT TYPES
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isProjection?: boolean;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  stage?: string;
  intent?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
}

export type ConversationStage = 
  | 'greeting'
  | 'age'
  | 'income'
  | 'currentSavings'
  | 'monthlySavings'
  | 'monthlyInvestment'
  | 'increaseGoal'
  | 'swipeswipeSavings'
  | 'projection'
  | 'freeChat';

// ============================================================================
// GUARDRAIL TYPES
// ============================================================================

export interface GuardrailResult {
  allowed: boolean;
  reason?: string;
  response: string;
  category?: GuardrailCategory;
  severity?: 'low' | 'medium' | 'high';
}

export type GuardrailCategory = 
  | 'off-topic'
  | 'inappropriate'
  | 'jailbreak-attempt'
  | 'pii-request'
  | 'financial-advice'
  | 'allowed';

export interface TopicDefinition {
  name: string;
  keywords: string[];
  patterns: RegExp[];
  priority: number;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatbotConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface WealthChatbotProps {
  apiKey?: string;
  onProjectionComplete?: (projection: WealthProjection) => void;
  onMessageSent?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  brandColor?: string;
  companyName?: string;
  customStyles?: React.CSSProperties;
  disclaimerText?: string;
  assumedReturnRate?: number;
}

export interface ProjectionChartProps {
  projection: WealthProjection;
  showLegend?: boolean;
  animationDuration?: number;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
  onRetry?: () => void;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string | number;
}

export interface FieldValidation {
  field: keyof UserFinancialData;
  min?: number;
  max?: number;
  required?: boolean;
  customValidator?: (value: any) => ValidationResult;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface ChatbotEvent {
  type: ChatbotEventType;
  payload: any;
  timestamp: Date;
}

export type ChatbotEventType = 
  | 'message_sent'
  | 'message_received'
  | 'projection_complete'
  | 'error'
  | 'stage_change'
  | 'guardrail_triggered';

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
