/**
 * Gemini AI Service
 * Provides AI-powered responses using Google's Gemini API
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ChatMessage, WealthProjection } from '../types';
import { SYSTEM_PROMPT } from '../constants';

// Initialize the Gemini AI client
let genAI: GoogleGenerativeAI | null = null;

const initializeClient = (apiKey: string): GoogleGenerativeAI => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

// Safety settings for appropriate financial guidance
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Generation config for conversational responses
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 500,
};

/**
 * Convert conversation history to Gemini format
 */
const convertHistoryToGeminiFormat = (messages: ChatMessage[]) => {
  return messages
    .filter(msg => msg.content !== 'CHART_COMPONENT' && msg.content !== 'HERO_COMPONENT')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
};

/**
 * Create context string from projection data
 */
const createProjectionContext = (projection: WealthProjection | null): string => {
  if (!projection) return '';

  return `
Current User Projection Data:
- 5-Year Wealth (with SwipeSwipe): $${projection.withSwipeSwipe[5]?.toLocaleString() || 'N/A'}
- 10-Year Wealth (with SwipeSwipe): $${projection.withSwipeSwipe[10]?.toLocaleString() || 'N/A'}
- 20-Year Wealth (with SwipeSwipe): $${projection.withSwipeSwipe[20]?.toLocaleString() || 'N/A'}
- 30-Year Wealth (with SwipeSwipe): $${projection.withSwipeSwipe[30]?.toLocaleString() || 'N/A'}
- SwipeSwipe 30-Year Contribution: $${projection.swipeswipeContribution[30]?.toLocaleString() || 'N/A'}
`;
};

/**
 * Generate a bot response using Gemini
 */
export async function generateGeminiResponse(
  message: string,
  apiKey: string,
  projection: WealthProjection | null = null,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const client = initializeClient(apiKey);
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
      generationConfig,
    });

    // Build the full system context
    const projectionContext = createProjectionContext(projection);
    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n${projectionContext}`;

    // Convert history for Gemini
    const history = convertHistoryToGeminiFormat(conversationHistory);

    // Start chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'You are a financial assistant. Please follow these instructions:' }],
        },
        {
          role: 'model',
          parts: [{ text: fullSystemPrompt }],
        },
        ...history,
      ],
    });

    // Send the user's message
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return text || "I'm here to help with your financial questions. What would you like to know about your wealth projection?";
  } catch (error: any) {
    console.error('Gemini API Error:', error);

    // Handle specific error types
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid Gemini API key. Please check your configuration.');
    }
    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    if (error.message?.includes('blocked')) {
      return "I can only help with financial planning and wealth-building topics. Is there something about your savings or investment strategy I can assist with?";
    }

    throw new Error('Failed to get response from AI. Please try again.');
  }
}

/**
 * Generate a simple response without conversation history (for quick queries)
 */
export async function generateSimpleGeminiResponse(
  prompt: string,
  apiKey: string
): Promise<string> {
  try {
    const client = initializeClient(apiKey);
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
      generationConfig: {
        ...generationConfig,
        maxOutputTokens: 300,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini Simple Response Error:', error);
    throw error;
  }
}

/**
 * Check if Gemini API key is valid
 */
export async function validateGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Try a simple request to validate the key
    await model.generateContent('Hello');
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  generateGeminiResponse,
  generateSimpleGeminiResponse,
  validateGeminiApiKey,
};
