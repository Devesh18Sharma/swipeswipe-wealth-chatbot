/**
 * SwipeSwipe Wealth Planning Chatbot
 * 
 * A production-ready AI chatbot for financial planning and wealth projection
 * Built with React + TypeScript, with comprehensive guardrails and edge case handling
 * 
 * @author SwipeSwipe Team
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WealthProjection, UserFinancialData, ChatMessage } from '../types';
import { calculateWealthProjection } from '../utils/calculations';
import { checkGuardrails, generateAIResponse, isOnTopic, ALLOWED_TOPICS, AIProvider } from '../utils/guardrails';
import { SYSTEM_PROMPT } from '../constants';
import { parseInputWithContext } from '../utils/inputParser';
import { calculateSwipeSwipeSavings, getSwipeSwipeSavingsExplanation } from '../utils/swipeswipeCalculator';
import { WealthChart } from './WealthChart';
import { HeroWealthDisplay } from './HeroWealthDisplay';
import { initializeGoogleAPI, exportToGoogleDocs } from '../services/googleDocsService';
import './WealthChatbot.css';

// SwipeSwipe Brand Colors
const SWIPESWIPE_COLORS = {
  primary: '#293A60',
  accent: '#FBC950',
  success: '#19B600',
};

// ============================================================================
// COMPONENT PROPS & INTERFACES
// ============================================================================

interface WealthChatbotProps {
  apiKey?: string;
  geminiApiKey?: string;
  aiProvider?: AIProvider;
  onProjectionComplete?: (projection: WealthProjection) => void;
  brandColor?: string;
  companyName?: string;
  // Google Docs Export
  googleClientId?: string;
  googleApiKey?: string;
}

interface ConversationState {
  stage: 'greeting' | 'age' | 'income' | 'currentSavings' | 'monthlyInvestment' | 'projection' | 'freeChat';
  userData: Partial<UserFinancialData>;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WealthChatbot: React.FC<WealthChatbotProps> = ({
  apiKey,
  geminiApiKey,
  aiProvider = 'gemini', // Default to Gemini as per requirements
  onProjectionComplete,
  brandColor = SWIPESWIPE_COLORS.primary,
  companyName = 'SwipeSwipe',
  googleClientId,
  googleApiKey,
}) => {
  // Determine which API key to use based on provider
  const activeApiKey = aiProvider === 'gemini' ? geminiApiKey : apiKey;
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    stage: 'greeting',
    userData: {}
  });
  const [projection, setProjection] = useState<WealthProjection | null>(null);
  const [finalUserData, setFinalUserData] = useState<UserFinancialData | null>(null);

  // Google Docs Export state
  const [isExporting, setIsExporting] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // GUARDRAILS - Professional off-topic handling
  // ============================================================================

  const handleOffTopicQuestion = useCallback((userMessage: string): string => {
    const offTopicResponses: Record<string, string> = {
      programming: `I appreciate your curiosity! However, I'm specifically designed to help you with financial planning and wealth projection through ${companyName}. Questions about programming languages like Python are outside my expertise here. Is there anything about your savings goals or investment planning I can help you with instead?`,
      
      weather: `Great question, but I'm your financial planning assistant, not a weather service! I'm here to help you understand how your savings and investments can grow over time. Would you like to explore how ${companyName} can help you save more?`,
      
      sports: `While I'd love to chat about sports, my specialty is helping you build wealth! I'm here to project how your savings can grow and show you the impact of ${companyName} savings. What would you like to know about your financial future?`,
      
      politics: `I focus exclusively on personal finance and wealth building. Political topics are outside my area of expertise. Let me help you with something I'm great at - projecting your wealth growth! Would you like to see how much you could save?`,
      
      general: `That's an interesting question, but I'm a specialized financial planning assistant for ${companyName}. My expertise is in helping you understand your wealth-building potential and how our savings tools can help you reach your goals faster. Is there anything about saving money, investing, or financial planning I can help you with?`
    };

    // Detect category of off-topic question
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('python') || lowerMessage.includes('javascript') || 
        lowerMessage.includes('code') || lowerMessage.includes('programming') ||
        lowerMessage.includes('java') || lowerMessage.includes('react')) {
      return offTopicResponses.programming;
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || 
        lowerMessage.includes('sunny') || lowerMessage.includes('temperature')) {
      return offTopicResponses.weather;
    }
    
    if (lowerMessage.includes('game') || lowerMessage.includes('score') || 
        lowerMessage.includes('team') || lowerMessage.includes('player') ||
        lowerMessage.includes('sports') || lowerMessage.includes('football')) {
      return offTopicResponses.sports;
    }
    
    if (lowerMessage.includes('president') || lowerMessage.includes('election') || 
        lowerMessage.includes('government') || lowerMessage.includes('politics') ||
        lowerMessage.includes('democrat') || lowerMessage.includes('republican')) {
      return offTopicResponses.politics;
    }
    
    return offTopicResponses.general;
  }, [companyName]);

  // ============================================================================
  // CONVERSATION FLOW HANDLERS
  // ============================================================================

  // ============================================================================
  // MESSAGE HANDLERS (Must be defined before processUserInput)
  // ============================================================================

  const addBotMessage = useCallback((content: string, isProjection: boolean = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      isProjection
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const getStagePrompt = useCallback((stage: ConversationState['stage']): string => {
    const prompts: Record<ConversationState['stage'], string> = {
      greeting: `Welcome to ${companyName}'s Wealth Planning Assistant! 🚀\n\nI'm here to show you how wealthy you could become through consistent saving and investing. Let's create your personalized projection!\n\nTo get started, what's your current age?`,
      
      age: "What's your current age?",
      
      income: "Great! What's your annual income? (You can say something like 'around $50,000' or just '50000')",
      
      currentSavings: "How much do you currently have saved and invested? (You can say 'I have about $10,000' or just '10000')",
      
      monthlyInvestment: "How much do you invest each month? (This includes retirement accounts, stocks, etc. You can say 'I invest around $500 per month' or just '500')",
      
      projection: "Calculating your wealth projection...",
      
      freeChat: "Feel free to ask me anything about your financial projection or how to improve your wealth-building strategy!"
    };
    
    return prompts[stage];
  }, [companyName]);

  const updateConversation = useCallback((nextStage: ConversationState['stage'], newData: Partial<UserFinancialData>) => {
    setConversationState(prev => ({
      stage: nextStage,
      userData: { ...prev.userData, ...newData }
    }));
    
    // Add the next stage prompt
    setTimeout(() => {
      addBotMessage(getStagePrompt(nextStage));
    }, 500);
  }, [addBotMessage, getStagePrompt]);

  const displayProjection = useCallback((_proj: WealthProjection, userData: UserFinancialData) => {
    // Save user data for HeroWealthDisplay
    setFinalUserData(userData);

    // First, show the hero wealth display (the main attraction!)
    setMessages(prev => [...prev, {
      id: `hero-${Date.now()}`,
      role: 'assistant',
      content: 'HERO_COMPONENT',
      timestamp: new Date(),
      isProjection: true
    }]);

    // Add chart component after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `chart-${Date.now()}`,
        role: 'assistant',
        content: 'CHART_COMPONENT',
        timestamp: new Date(),
        isProjection: true
      }]);
    }, 2500);

    // Add a simple follow-up message after chart
    setTimeout(() => {
      addBotMessage(`Feel free to ask me any questions about your projection or how to improve your wealth-building strategy! You can also export your detailed report to Google Docs.`);
    }, 3500);
  }, [addBotMessage]);

  const generateLocalResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Financial planning related responses
    if (lowerMessage.includes('retire') || lowerMessage.includes('retirement')) {
      return `Great question about retirement! Based on your projection, if you maintain your savings rate with ${companyName}, you could have substantial retirement savings. The general rule is to have 25x your annual expenses saved. Would you like me to calculate a specific retirement target for you?`;
    }
    
    if (lowerMessage.includes('invest') || lowerMessage.includes('stock') || lowerMessage.includes('market')) {
      return `Investing is crucial for wealth building! In our projection, we assumed a 7% annual return, which is a conservative estimate based on historical stock market averages. Diversification across stocks, bonds, and other assets is key. Remember, ${companyName} helps you have more to invest by reducing impulse spending!`;
    }
    
    if (lowerMessage.includes('save more') || lowerMessage.includes('budget')) {
      return `Excellent mindset! Here are some tips:\n\n1. **Use ${companyName}** to control impulse purchases\n2. **Automate savings** - pay yourself first\n3. **50/30/20 rule** - 50% needs, 30% wants, 20% savings\n4. **Track every expense** for a month to find leaks\n\nWould you like to recalculate your projection with higher savings?`;
    }
    
    if (lowerMessage.includes('compound') || lowerMessage.includes('interest')) {
      return `Compound interest is the "eighth wonder of the world" - attributed to Einstein! It means your money earns returns, and those returns earn returns. In your projection, we use compound interest to show how your wealth grows exponentially over time. That's why starting early is so powerful!`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('fund')) {
      return `An emergency fund is essential! Financial experts recommend 3-6 months of expenses. This should be in a high-yield savings account for easy access. Once you have this safety net, you can invest more aggressively for long-term growth.`;
    }
    
    if (lowerMessage.includes('start over') || lowerMessage.includes('recalculate') || lowerMessage.includes('new projection')) {
      setConversationState({ stage: 'age', userData: {} });
      return "Let's create a new projection! What's your current age?";
    }
    
    return `That's a great question about financial planning! While I can provide general guidance, for specific advice tailored to your situation, consider consulting with a certified financial planner. Is there anything specific about your wealth projection I can help clarify?`;
  };

  const handleFreeChatMessage = useCallback(async (message: string) => {
    // Check if message is on-topic
    if (!isOnTopic(message, ALLOWED_TOPICS)) {
      addBotMessage(handleOffTopicQuestion(message));
      return;
    }

    // Check guardrails
    const guardrailResult = checkGuardrails(message);
    if (!guardrailResult.allowed) {
      addBotMessage(guardrailResult.response);
      return;
    }

    // If we have an API key, use the configured AI provider for intelligent responses
    if (activeApiKey) {
      setIsLoading(true);
      try {
        // Use unified AI response function with configured provider
        const response = await generateAIResponse(
          message,
          SYSTEM_PROMPT,
          activeApiKey,
          projection,
          messages,
          aiProvider
        );
        addBotMessage(response);
      } catch (error: any) {
        console.error('AI API Error:', error);

        // Better error messages based on error type
        let errorMessage = "I apologize, but I'm having trouble processing your request.";

        if (error.message?.includes('timeout')) {
          errorMessage = "The request took too long. Please try again in a moment.";
        } else if (error.message?.includes('Rate limit') || error.message?.includes('quota')) {
          errorMessage = "I'm receiving too many requests. Please wait a moment and try again.";
        } else if (error.message?.includes('Invalid') || error.message?.includes('API key')) {
          errorMessage = "There's an issue with the API configuration. Please contact support.";
        } else if (error.message?.includes('Failed to get response')) {
          errorMessage = "I'm having trouble connecting. Please check your internet and try again.";
        }

        addBotMessage(errorMessage);

        // Fallback to local response
        addBotMessage(generateLocalResponse(message));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback to predefined responses
      addBotMessage(generateLocalResponse(message));
    }
  }, [activeApiKey, aiProvider, projection, messages, addBotMessage, handleOffTopicQuestion]);

  const processUserInput = useCallback((input: string): void => {
    const { stage, userData } = conversationState;
    
    // Use enhanced input parser
    let parseResult;
    
    switch (stage) {
      case 'greeting':
      case 'age': {
        parseResult = parseInputWithContext(input, 'age');
        if (!parseResult.isValid) {
          addBotMessage(parseResult.error || "Please enter a valid age between 18 and 100.");
          return;
        }
        updateConversation('income', { age: parseResult.value! });
        break;
      }
      
      case 'income': {
        parseResult = parseInputWithContext(input, 'income');
        if (!parseResult.isValid) {
          addBotMessage(parseResult.error || "Please enter a valid income amount.");
          return;
        }
        const income = parseResult.value!;
        // Auto-calculate SwipeSwipe savings based on income
        const swipeswipeSavings = calculateSwipeSwipeSavings(income);
        const explanation = getSwipeSwipeSavingsExplanation(income);
        addBotMessage(`Perfect! ${explanation}`);
        updateConversation('currentSavings', { 
          annualIncome: income,
          swipeswipeSavings: swipeswipeSavings
        });
        break;
      }
      
      case 'currentSavings': {
        parseResult = parseInputWithContext(input, 'savings');
        if (!parseResult.isValid) {
          addBotMessage(parseResult.error || "Please enter a valid amount for your current savings.");
          return;
        }
        updateConversation('monthlyInvestment', { currentSavings: parseResult.value! });
        break;
      }
      
      case 'monthlyInvestment': {
        parseResult = parseInputWithContext(input, 'investment');
        if (!parseResult.isValid) {
          addBotMessage(parseResult.error || "Please enter a valid monthly investment amount.");
          return;
        }
        const investment = parseResult.value!;
        
        // Prepare final data with auto-calculated SwipeSwipe savings
        const finalData: UserFinancialData = {
          age: userData.age!,
          annualIncome: userData.annualIncome!,
          currentSavings: userData.currentSavings!,
          monthlySavings: 0, // Simplified - not asking for this
          monthlyInvestment: investment,
          increasePercentage: 0, // Simplified - not asking for this
          swipeswipeSavings: userData.swipeswipeSavings || calculateSwipeSwipeSavings(userData.annualIncome || 0)
        };
        
        // Calculate and display projection
        const projectionResult = calculateWealthProjection(finalData);
        setProjection(projectionResult);
        onProjectionComplete?.(projectionResult);
        
        updateConversation('freeChat', {});
        displayProjection(projectionResult, finalData);
        break;
      }
      
      case 'freeChat': {
        handleFreeChatMessage(input);
        break;
      }
      
      default:
        break;
    }
  }, [conversationState, onProjectionComplete, addBotMessage, updateConversation, displayProjection, handleFreeChatMessage]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userInput = inputValue.trim();
    setInputValue('');
    addUserMessage(userInput);
    
    // Process after a small delay for natural feel
    setTimeout(() => {
      processUserInput(userInput);
    }, 300);
  }, [inputValue, isLoading, addUserMessage, processUserInput]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  // ============================================================================
  // GOOGLE DOCS EXPORT HANDLER
  // ============================================================================

  const handleExportToGoogleDocs = useCallback(async () => {
    if (!projection || !finalUserData) {
      setExportError('No projection data available to export');
      return;
    }

    if (!googleClientId || !googleApiKey) {
      setExportError('Google API credentials not configured');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      // Initialize Google API if not already done
      if (!googleInitialized) {
        await initializeGoogleAPI(googleClientId, googleApiKey);
        setGoogleInitialized(true);
      }

      // Export to Google Docs
      const docUrl = await exportToGoogleDocs(projection, finalUserData, companyName);

      addBotMessage(`Your wealth projection report has been exported to Google Docs! You can view and edit it here: ${docUrl}`);
    } catch (error: any) {
      console.error('Google Docs export error:', error);
      setExportError(error.message || 'Failed to export to Google Docs');
      addBotMessage(`Sorry, I couldn't export to Google Docs: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  }, [projection, finalUserData, googleClientId, googleApiKey, googleInitialized, companyName, addBotMessage]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Initialize Google API on mount if credentials provided
  useEffect(() => {
    if (googleClientId && googleApiKey && !googleInitialized) {
      initializeGoogleAPI(googleClientId, googleApiKey)
        .then(() => setGoogleInitialized(true))
        .catch((error) => console.warn('Google API initialization deferred:', error));
    }
  }, [googleClientId, googleApiKey, googleInitialized]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(getStagePrompt('greeting'));
      setConversationState(prev => ({ ...prev, stage: 'age' }));
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [conversationState.stage]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="wealth-chatbot" style={{ '--brand-color': brandColor } as React.CSSProperties}>
      <div className="chatbot-header">
        <div className="chatbot-logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="chatbot-title">
          <h2>{companyName} Wealth Advisor</h2>
          <span className="status-badge">
            <span className="status-dot"></span>
            Online
          </span>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.role} ${message.isProjection ? 'projection' : ''}`}
          >
            <div className="message-content">
              {message.role === 'assistant' && (
                <div className="bot-avatar">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                    <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
              )}
              <div className="message-bubble">
                {message.content === 'HERO_COMPONENT' && projection && finalUserData ? (
                  (() => {
                    // Calculate years based on 88 years life expectancy, capped at 35
                    const LIFE_EXPECTANCY = 88;
                    const yearsToShow = Math.min(35, Math.max(5, LIFE_EXPECTANCY - finalUserData.age));
                    // Round to nearest milestone year (5, 10, 15, 20, 25, 30, 35)
                    const milestoneYear = [5, 10, 15, 20, 25, 30, 35].reduce((prev, curr) =>
                      Math.abs(curr - yearsToShow) < Math.abs(prev - yearsToShow) ? curr : prev
                    );
                    return (
                      <HeroWealthDisplay
                        targetAmount={projection.withSwipeSwipe[milestoneYear]}
                        yearsToRetirement={milestoneYear}
                        retirementAge={finalUserData.age + milestoneYear}
                        swipeswipeContribution={projection.swipeswipeContribution[milestoneYear]}
                        monthlyInvestment={finalUserData.monthlyInvestment + finalUserData.swipeswipeSavings}
                      />
                    );
                  })()
                ) : message.content === 'CHART_COMPONENT' && projection ? (
                  <WealthChart projection={projection} companyName={companyName} userAge={finalUserData?.age} />
                ) : (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                )}
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="bot-avatar">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                  <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div className="message-bubble typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Export Actions - shown after projection is available */}
      {projection && finalUserData && googleClientId && googleApiKey && (
        <div className="export-actions">
          <button
            className="export-button google-docs"
            onClick={handleExportToGoogleDocs}
            disabled={isExporting}
            title="Export your wealth projection to Google Docs"
          >
            {isExporting ? (
              <>
                <span className="export-spinner"></span>
                Exporting...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="export-icon">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Export to Google Docs
              </>
            )}
          </button>
          {exportError && (
            <span className="export-error">{exportError}</span>
          )}
        </div>
      )}

      <form className="chatbot-input" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={conversationState.stage === 'freeChat' 
            ? "Ask about your financial future..." 
            : "Type your answer..."}
          disabled={isLoading}
          aria-label="Chat input"
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>

      <div className="chatbot-footer">
        <p>Powered by {companyName} • For educational purposes only</p>
      </div>
    </div>
  );
};

export default WealthChatbot;
