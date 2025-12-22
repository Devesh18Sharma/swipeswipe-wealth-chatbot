# OpenAI API Integration - Step-by-Step Implementation Guide 🚀

**For:** SwipeSwipe Team  
**Status:** Ready to Implement  
**Estimated Time:** 2-3 hours for core improvements

---

## 🎯 Quick Start - What We're Building

**Current State:**
- ✅ OpenAI API is connected and working
- ⚠️ Single-turn only (no conversation memory)
- ⚠️ Basic error handling
- ⚠️ No retry logic

**What We'll Improve:**
1. **Conversation Context** - AI remembers previous messages
2. **Better Error Handling** - Retry logic, timeouts, user-friendly errors
3. **Enhanced Prompts** - Better context for AI responses
4. **Token Tracking** - Monitor API usage

---

## 📋 Implementation Checklist

### Step 1: Enhance OpenAI Service (30 mins) ✅
- [ ] Add conversation history support
- [ ] Add retry logic with exponential backoff
- [ ] Add timeout handling
- [ ] Improve error messages

### Step 2: Update Component (20 mins) ✅
- [ ] Pass conversation history to API
- [ ] Better error handling UI
- [ ] Loading states

### Step 3: Test & Verify (10 mins) ✅
- [ ] Test conversation flow
- [ ] Test error scenarios
- [ ] Verify API responses

---

## 🔧 Step 1: Enhance OpenAI Service

### File: `src/utils/guardrails.ts`

**Current Code (lines 317-365):**
```typescript
export async function generateBotResponse(
  userMessage: string,
  systemPrompt: string,
  apiKey: string,
  projection: WealthProjection | null
): Promise<string> {
  // Only sends single message - no history
}
```

**What We'll Change:**
1. Add conversation history parameter
2. Add retry logic
3. Add timeout handling
4. Better error handling

---

## 📝 Detailed Implementation Steps

### Step 1.1: Update Function Signature

**Location:** `src/utils/guardrails.ts` line 317

**Replace:**
```typescript
export async function generateBotResponse(
  userMessage: string,
  systemPrompt: string,
  apiKey: string,
  projection: WealthProjection | null
): Promise<string> {
```

**With:**
```typescript
export async function generateBotResponse(
  userMessage: string,
  systemPrompt: string,
  apiKey: string,
  projection: WealthProjection | null,
  conversationHistory?: ChatMessage[]  // NEW: Add conversation history
): Promise<string> {
```

---

### Step 1.2: Build Conversation Context

**Location:** `src/utils/guardrails.ts` after line 334

**Add this code:**
```typescript
  // Build conversation context from history
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
  
  // Add system prompt with projection context
  let enhancedSystemPrompt = systemPrompt;
  if (projection) {
    enhancedSystemPrompt += `\n\n## USER'S CURRENT PROJECTION
- 5-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[5].toLocaleString()}
- 10-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[10].toLocaleString()}
- 30-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[30].toLocaleString()}
- SwipeSwipe contribution over 30 years: $${projection.swipeswipeContribution[30].toLocaleString()}

Use this data to provide personalized insights when relevant.`;
  }
  
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
```

---

### Step 1.3: Add Retry Logic with Timeout

**Location:** `src/utils/guardrails.ts` replace the try-catch block (lines 336-364)

**Replace:**
```typescript
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: contextEnhancedPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Could you please rephrase your question about financial planning?";
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
```

**With:**
```typescript
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
          model: 'gpt-4o-mini',
          messages: messages, // Use the messages array we built
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
```

---

## 🔧 Step 2: Update Component to Pass Conversation History

### File: `src/components/WealthChatbot.tsx`

### Step 2.1: Update handleFreeChatMessage

**Location:** `src/components/WealthChatbot.tsx` line 301

**Find:**
```typescript
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
        const response = await generateBotResponse(message, SYSTEM_PROMPT, apiKey, projection);
        addBotMessage(response);
      } catch (error) {
        console.error('API Error:', error);
        addBotMessage("I apologize, but I'm having trouble processing your request. Could you please rephrase your question about financial planning?");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback to predefined responses
      addBotMessage(generateLocalResponse(message));
    }
  }, [apiKey, projection, addBotMessage, handleOffTopicQuestion]);
```

**Replace with:**
```typescript
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
        // Pass conversation history to API
        const response = await generateBotResponse(
          message, 
          SYSTEM_PROMPT, 
          apiKey, 
          projection,
          messages // NEW: Pass conversation history
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
```

**Key Changes:**
1. ✅ Added `messages` to dependency array
2. ✅ Pass `messages` to `generateBotResponse`
3. ✅ Better error handling with specific messages
4. ✅ Fallback to local response on error

---

## 🧪 Step 3: Test the Implementation

### Test 1: Conversation Context

1. Start the chatbot
2. Complete the projection flow
3. Ask: "What was my age again?"
4. **Expected:** AI should remember your age from the conversation

### Test 2: Error Handling

1. Temporarily use wrong API key
2. Send a message
3. **Expected:** Clear error message, fallback to local response

### Test 3: Retry Logic

1. Disconnect internet
2. Send a message
3. Reconnect within 30 seconds
4. **Expected:** Should retry and eventually succeed

---

## 📊 Optional: Add Token Usage Tracking

### Step 4: Track API Usage (Optional - 15 mins)

**File:** `src/utils/guardrails.ts`

**Add interface at top:**
```typescript
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number; // USD
}
```

**Update return type:**
```typescript
export async function generateBotResponse(
  // ... parameters
): Promise<{ content: string; usage?: TokenUsage }> {
```

**After getting response:**
```typescript
  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  const usage = data.usage;

  // Calculate cost (gpt-4o-mini pricing)
  const estimatedCost = usage 
    ? (usage.prompt_tokens * 0.15 / 1_000_000) + (usage.completion_tokens * 0.60 / 1_000_000)
    : 0;

  return {
    content: content || "I apologize, but I couldn't generate a response.",
    usage: usage ? {
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      estimatedCost
    } : undefined
  };
```

**Update component to handle new return:**
```typescript
const result = await generateBotResponse(...);
addBotMessage(result.content);

if (result.usage) {
  console.log('Token usage:', result.usage);
  // Optional: Track in state or analytics
}
```

---

## 🎯 Quick Reference: What Changed

### Files Modified:
1. ✅ `src/utils/guardrails.ts`
   - Added conversation history parameter
   - Added retry logic with exponential backoff
   - Added timeout handling
   - Better error messages

2. ✅ `src/components/WealthChatbot.tsx`
   - Pass conversation history to API
   - Better error handling UI
   - Improved error messages

### New Features:
- ✅ **Conversation Memory** - AI remembers previous messages
- ✅ **Retry Logic** - Automatically retries on failures
- ✅ **Timeout Handling** - Prevents hanging requests
- ✅ **Better Errors** - User-friendly error messages
- ✅ **Fallback** - Local responses when API fails

---

## 🚀 Next Steps After This

Once this is working, you can:

1. **Add Visual Components** (Charts/Graphs)
   - Use recharts or chart.js
   - Show projection as line chart
   - Interactive visualizations

2. **Add Rate Limiting**
   - Prevent excessive API calls
   - Client-side throttling

3. **Add Analytics**
   - Track API usage
   - Monitor costs
   - User engagement metrics

4. **Backend Proxy** (For Production)
   - Move API key to backend
   - Add authentication
   - Better security

---

## 📝 Testing Checklist

- [ ] Conversation context works (AI remembers previous messages)
- [ ] Retry logic works (test with network interruption)
- [ ] Timeout works (test with slow network)
- [ ] Error messages are user-friendly
- [ ] Fallback to local responses works
- [ ] No console errors
- [ ] API responses are relevant and helpful

---

## 🆘 Troubleshooting

### Issue: "Invalid API key"
**Solution:** Check your OpenAI API key in the component props

### Issue: "Rate limit exceeded"
**Solution:** Wait a minute and try again, or upgrade OpenAI plan

### Issue: AI doesn't remember conversation
**Solution:** Make sure you're passing `messages` array to `generateBotResponse`

### Issue: Requests timing out
**Solution:** Check internet connection, or increase TIMEOUT value

---

## ✅ Completion Criteria

You're done when:
- ✅ AI remembers conversation context
- ✅ Errors are handled gracefully
- ✅ Retry logic works
- ✅ No console errors
- ✅ User experience is smooth

---

**Ready to implement?** Follow the steps above in order. Each step builds on the previous one.

**Questions?** Check the code comments or refer to the main analysis documents.
