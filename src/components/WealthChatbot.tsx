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
import { WealthProjection, UserFinancialData, ChatMessage, GuardrailResult } from '../types';
import { calculateWealthProjection, formatCurrency } from '../utils/calculations';
import { checkGuardrails, generateBotResponse, isOnTopic, ALLOWED_TOPICS } from '../utils/guardrails';
import { SYSTEM_PROMPT, DISCLAIMER } from '../constants';
import './WealthChatbot.css';

// ============================================================================
// COMPONENT PROPS & INTERFACES
// ============================================================================

interface WealthChatbotProps {
  apiKey?: string;
  onProjectionComplete?: (projection: WealthProjection) => void;
  brandColor?: string;
  companyName?: string;
}

interface ConversationState {
  stage: 'greeting' | 'age' | 'income' | 'currentSavings' | 'monthlySavings' | 
         'monthlyInvestment' | 'increaseGoal' | 'swipeswipeSavings' | 'projection' | 'freeChat';
  userData: Partial<UserFinancialData>;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WealthChatbot: React.FC<WealthChatbotProps> = ({
  apiKey,
  onProjectionComplete,
  brandColor = '#6366f1',
  companyName = 'SwipeSwipe'
}) => {
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    stage: 'greeting',
    userData: {}
  });
  const [projection, setProjection] = useState<WealthProjection | null>(null);
  
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

  const getStagePrompt = useCallback((stage: ConversationState['stage']): string => {
    const prompts: Record<ConversationState['stage'], string> = {
      greeting: `Welcome to ${companyName}'s Wealth Planning Assistant! 🚀\n\nI'm here to help you discover how wealthy you could become. Let's create a personalized projection together.\n\nTo get started, what's your current age?`,
      
      age: "What's your current age?",
      
      income: "Great! Now, what's your annual income? (You can enter an approximate amount)",
      
      currentSavings: "How much do you currently have saved and invested in total?",
      
      monthlySavings: "How much do you save each month? (money set aside for emergencies, goals, etc.)",
      
      monthlyInvestment: "And how much do you invest each month? (retirement accounts, stocks, etc.)",
      
      increaseGoal: "By what percentage would you like to increase your monthly savings and investments? (e.g., 10, 20, 50)",
      
      swipeswipeSavings: `Excellent! Now let's factor in ${companyName}. On average, our users save an additional $150-500/month by controlling impulse purchases.\n\nHow much do you think ${companyName} could help you save per month? (Enter your estimate)`,
      
      projection: "Calculating your wealth projection...",
      
      freeChat: "Feel free to ask me anything about your financial projection or how to improve your wealth-building strategy!"
    };
    
    return prompts[stage];
  }, [companyName]);

  const processUserInput = useCallback((input: string): void => {
    const { stage, userData } = conversationState;
    
    // Parse numeric input
    const numericValue = parseFloat(input.replace(/[$,]/g, ''));
    
    // Validate based on current stage
    switch (stage) {
      case 'greeting':
      case 'age': {
        if (isNaN(numericValue) || numericValue < 18 || numericValue > 100) {
          addBotMessage("Please enter a valid age between 18 and 100.");
          return;
        }
        updateConversation('income', { age: numericValue });
        break;
      }
      
      case 'income': {
        if (isNaN(numericValue) || numericValue < 0) {
          addBotMessage("Please enter a valid income amount (can be 0 if you're not currently earning).");
          return;
        }
        updateConversation('currentSavings', { annualIncome: numericValue });
        break;
      }
      
      case 'currentSavings': {
        if (isNaN(numericValue) || numericValue < 0) {
          addBotMessage("Please enter a valid amount for your current savings (can be 0).");
          return;
        }
        updateConversation('monthlySavings', { currentSavings: numericValue });
        break;
      }
      
      case 'monthlySavings': {
        if (isNaN(numericValue) || numericValue < 0) {
          addBotMessage("Please enter a valid monthly savings amount (can be 0).");
          return;
        }
        updateConversation('monthlyInvestment', { monthlySavings: numericValue });
        break;
      }
      
      case 'monthlyInvestment': {
        if (isNaN(numericValue) || numericValue < 0) {
          addBotMessage("Please enter a valid monthly investment amount (can be 0).");
          return;
        }
        updateConversation('increaseGoal', { monthlyInvestment: numericValue });
        break;
      }
      
      case 'increaseGoal': {
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 500) {
          addBotMessage("Please enter a reasonable percentage increase (0-500%).");
          return;
        }
        updateConversation('swipeswipeSavings', { increasePercentage: numericValue });
        break;
      }
      
      case 'swipeswipeSavings': {
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 10000) {
          addBotMessage("Please enter a reasonable monthly savings estimate from SwipeSwipe (e.g., 100, 200, 500).");
          return;
        }
        const finalData: UserFinancialData = {
          ...userData as UserFinancialData,
          swipeswipeSavings: numericValue
        };
        
        // Calculate and display projection
        const projectionResult = calculateWealthProjection(finalData);
        setProjection(projectionResult);
        onProjectionComplete?.(projectionResult);
        
        updateConversation('freeChat', { swipeswipeSavings: numericValue });
        displayProjection(projectionResult, finalData);
        break;
      }
      
      case 'freeChat': {
        handleFreeChatMessage(input);
        break;
      }
    }
  }, [conversationState, onProjectionComplete]);

  // ============================================================================
  // MESSAGE HANDLERS
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

  const displayProjection = useCallback((proj: WealthProjection, userData: UserFinancialData) => {
    const projectionMessage = `
🎉 **Your Wealth Projection Results**

Based on your inputs:
• Age: ${userData.age}
• Annual Income: ${formatCurrency(userData.annualIncome)}
• Current Savings: ${formatCurrency(userData.currentSavings)}
• Monthly Savings: ${formatCurrency(userData.monthlySavings)}
• Monthly Investment: ${formatCurrency(userData.monthlyInvestment)}
• Planned Increase: ${userData.increasePercentage}%
• ${companyName} Contribution: ${formatCurrency(userData.swipeswipeSavings)}/month

---

📊 **Projected Wealth Over Time** (7% annual return assumed)

| Years | Without ${companyName} | With ${companyName} | ${companyName} Contribution |
|-------|---------------------|-------------------|---------------------------|
| 5 yrs | ${formatCurrency(proj.withoutSwipeSwipe[5])} | ${formatCurrency(proj.withSwipeSwipe[5])} | +${formatCurrency(proj.swipeswipeContribution[5])} |
| 10 yrs | ${formatCurrency(proj.withoutSwipeSwipe[10])} | ${formatCurrency(proj.withSwipeSwipe[10])} | +${formatCurrency(proj.swipeswipeContribution[10])} |
| 15 yrs | ${formatCurrency(proj.withoutSwipeSwipe[15])} | ${formatCurrency(proj.withSwipeSwipe[15])} | +${formatCurrency(proj.swipeswipeContribution[15])} |
| 20 yrs | ${formatCurrency(proj.withoutSwipeSwipe[20])} | ${formatCurrency(proj.withSwipeSwipe[20])} | +${formatCurrency(proj.swipeswipeContribution[20])} |
| 25 yrs | ${formatCurrency(proj.withoutSwipeSwipe[25])} | ${formatCurrency(proj.withSwipeSwipe[25])} | +${formatCurrency(proj.swipeswipeContribution[25])} |
| 30 yrs | ${formatCurrency(proj.withoutSwipeSwipe[30])} | ${formatCurrency(proj.withSwipeSwipe[30])} | +${formatCurrency(proj.swipeswipeContribution[30])} |
| 35 yrs | ${formatCurrency(proj.withoutSwipeSwipe[35])} | ${formatCurrency(proj.withSwipeSwipe[35])} | +${formatCurrency(proj.swipeswipeContribution[35])} |

---

💡 **Key Insight**: By using ${companyName}, you could accumulate an additional **${formatCurrency(proj.swipeswipeContribution[30])}** over 30 years!

${DISCLAIMER}

Feel free to ask me any questions about your projection or how to improve your wealth-building strategy!
    `;
    
    addBotMessage(projectionMessage, true);
  }, [addBotMessage, companyName]);

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
    
    // If we have an API key, use OpenAI for intelligent responses
    if (apiKey) {
      setIsLoading(true);
      try {
        // Pass conversation history to API for context
        const response = await generateBotResponse(
          message, 
          SYSTEM_PROMPT, 
          apiKey, 
          projection,
          messages // Pass conversation history
        );
        addBotMessage(response);
      } catch (error: any) {
        console.error('API Error:', error);
        
        // Better error messages based on error type
        let errorMessage = "I apologize, but I'm having trouble processing your request.";
        
        if (error.message?.includes('timeout')) {
          errorMessage = "The request took too long. Please try again in a moment.";
        } else if (error.message?.includes('Rate limit')) {
          errorMessage = "I'm receiving too many requests. Please wait a moment and try again.";
        } else if (error.message?.includes('Invalid API key')) {
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
  }, [apiKey, projection, messages, addBotMessage, handleOffTopicQuestion]);

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
  // EFFECTS
  // ============================================================================

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
                <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
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
