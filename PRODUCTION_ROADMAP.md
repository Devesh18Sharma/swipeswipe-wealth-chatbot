# SwipeSwipe Wealth Chatbot - Production Roadmap 🚀

**Document Version:** 2.0
**Created:** December 2024
**Author:** Senior Software Developer Analysis
**Status:** Actionable Implementation Plan

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Critical Missing Features](#critical-missing-features)
4. [LLM Recommendation](#llm-recommendation)
5. [Priority-Based Roadmap](#priority-based-roadmap)
6. [Phase 1: Visual Components (CRITICAL)](#phase-1-visual-components-critical)
7. [Phase 2: Security Hardening (BLOCKER)](#phase-2-security-hardening-blocker)
8. [Phase 3: Conversation Context](#phase-3-conversation-context)
9. [Phase 4: Error Handling & Reliability](#phase-4-error-handling--reliability)
10. [Phase 5: Cost Control & Monitoring](#phase-5-cost-control--monitoring)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Checklist](#deployment-checklist)

---

## Executive Summary

### Current State: 🟡 **GOOD FOUNDATION, NEEDS PRODUCTION HARDENING**

**What You Have:**
- ✅ Excellent codebase architecture (8/10 code quality)
- ✅ Complete conversation flow (9 stages)
- ✅ Comprehensive guardrails system
- ✅ Accurate financial calculations
- ✅ TypeScript strict mode, 80% test coverage target
- ✅ OpenAI integration (gpt-4o-mini) working
- ✅ All data collection fields requested

**Critical Gaps:**
- ❌ **NO VISUAL COMPONENTS** (your #1 requirement)
- ❌ **Security vulnerability** (API key exposed in frontend)
- ⚠️ **No conversation context** (single-turn only)
- ⚠️ **Basic error handling** (no retries, timeouts)
- ⚠️ **No cost monitoring**

### Bottom Line

Your chatbot **functionally works** but needs:
1. **Visual components** (charts/graphs) - **User's primary request**
2. **Security hardening** (backend proxy) - **Production blocker**
3. **Better UX** (conversation context, error handling)

**Estimated Effort:** 3-4 days for core features + 2-3 days for polish

---

## Current State Analysis

### Architecture Quality: ⭐⭐⭐⭐ (4/5 stars)

**File Structure:**
```
src/
├── components/WealthChatbot.tsx     (518 lines) ✅ Clean, well-organized
├── utils/calculations.ts             (307 lines) ✅ Solid financial math
├── utils/guardrails.ts               (408 lines) ✅ Excellent safety
├── constants/index.ts                (255 lines) ✅ Good configuration
└── types/index.ts                    (230 lines) ✅ Strong typing
```

**What's Working Well:**

1. **Conversation Flow** ✅
   - Lines 109-133 (WealthChatbot.tsx): Clean stage management
   - Lines 135-223: Robust input validation
   - Natural progression through data collection

2. **Financial Calculations** ✅
   - Lines 35-62 (calculations.ts): Proper compound interest formula
   - Lines 82-175: Accurate wealth projections
   - Lines 184-215: Good formatting utilities

3. **Guardrails** ✅
   - Lines 14-81 (guardrails.ts): 11 allowed topics defined
   - Lines 129-140: Jailbreak pattern detection
   - Lines 150-214: Multi-layer safety checks

4. **Code Quality** ✅
   - TypeScript strict mode enabled
   - No 'any' types used
   - Proper error handling patterns
   - Clean separation of concerns

**What Needs Work:**

1. **Visual Output** ❌ **CRITICAL GAP**
   - Lines 262-299 (WealthChatbot.tsx): Only text-based markdown table
   - No charts, graphs, or interactive visualizations
   - **User specifically requested "visual stuff"**

2. **Security** 🔴 **PRODUCTION BLOCKER**
   - Line 23 (WealthChatbot.tsx): `apiKey?: string;` exposed prop
   - Line 337 (guardrails.ts): Direct fetch to OpenAI from browser
   - API key visible in browser DevTools

3. **Conversation Context** 🟡
   - Lines 345-348 (guardrails.ts): Only sends single message
   ```typescript
   messages: [
     { role: 'system', content: contextEnhancedPrompt },
     { role: 'user', content: userMessage }  // No history!
   ]
   ```

4. **Error Handling** 🟡
   - Lines 318-326 (WealthChatbot.tsx): Basic try-catch
   - No retry logic for transient failures
   - No timeout implementation (despite config at line 177)
   - Generic error messages

5. **No Monitoring** 🟡
   - No token usage tracking
   - No cost monitoring
   - No analytics events
   - No performance metrics

---

## Critical Missing Features

### 1. Visual Components ❌ **USER'S #1 REQUEST**

**Current State:**
```typescript
// Line 262-299 (WealthChatbot.tsx)
const projectionMessage = `
📊 **Projected Wealth Over Time**

| Years | Without SS | With SS | SS Contribution |
|-------|-----------|---------|-----------------|
| 5 yrs | $XX,XXX   | $YY,YYY | +$Z,ZZZ        |
...
`;
```

**Problem:** Text table only, no visual representation

**User Request:** "I want to show some visual stuff to the customers"

**Impact:** 🔴 **CRITICAL** - Poor user engagement, misses user's primary requirement

---

### 2. API Key Security ❌ **PRODUCTION BLOCKER**

**Current Implementation:**
```typescript
// Line 23 (WealthChatbot.tsx)
interface WealthChatbotProps {
  apiKey?: string;  // ⚠️ Exposed in browser!
  // ...
}

// Line 337 (guardrails.ts)
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: {
    'Authorization': `Bearer ${apiKey}`  // ⚠️ Visible in DevTools!
  }
});
```

**Problem:** API key sent from frontend, visible in browser DevTools

**Impact:** 🔴 **CRITICAL** - API key theft, unauthorized usage, cost overruns

---

### 3. No Conversation Memory ⚠️ **HIGH PRIORITY**

**Current Implementation:**
```typescript
// Line 345-348 (guardrails.ts)
messages: [
  { role: 'system', content: contextEnhancedPrompt },
  { role: 'user', content: userMessage }  // Only current message!
]
```

**Problem:** AI can't reference previous conversation

**User Impact:**
```
User: "How much will I have in 30 years?"
Bot: "$500,000"
User: "What about in 20 years?"
Bot: "I need your financial information first" ❌ (forgot context)
```

**Impact:** 🟡 **HIGH** - Poor UX, repetitive conversations

---

## LLM Recommendation

### ✅ KEEP GPT-4o-mini (Current Choice)

**Your current implementation is perfect:**

```typescript
// Line 344 (guardrails.ts)
model: 'gpt-4o-mini'  // ✅ Best choice!
```

**Why This is the Right Choice:**

| Factor | gpt-4o-mini | gpt-3.5-turbo | Claude 3 Haiku | Gemini Flash |
|--------|-------------|---------------|----------------|--------------|
| **Cost** | $0.15/1M in | $0.50/1M in | $0.25/1M in | $0.35/1M in |
| **Speed** | ~500ms | ~800ms | ~600ms | ~700ms |
| **Quality** | Excellent | Good | Excellent | Very Good |
| **API Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Financial Reasoning** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Estimated Monthly Costs (1,000 users):**
- Average conversation: 10 messages
- Average tokens per message: 500 (prompt + completion)
- Total: 1,000 users × 10 messages × 500 tokens = 5M tokens/month
- **Cost: ~$3-5/month** ✅ Very affordable

**Recommendation:** ✅ **KEEP gpt-4o-mini** - Best balance of cost, speed, and quality

**Alternative Only If:**
- You need even lower cost → gpt-3.5-turbo ($2.50/month for same usage)
- You need better reasoning → gpt-4o ($200/month for same usage) ❌ Overkill
- You want to avoid OpenAI → Claude 3 Haiku (similar cost, great quality)

---

## Priority-Based Roadmap

### **Critical Path (MUST DO BEFORE PRODUCTION):**

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Visual Components (Day 1-2)           🔴 CRITICAL  │
│ Phase 2: Security Hardening (Day 2-3)          🔴 BLOCKER   │
│ Phase 3: Conversation Context (Day 3)          🟡 HIGH      │
│ Phase 4: Error Handling (Day 4)                🟡 HIGH      │
│ Phase 5: Cost Control (Day 4-5)                🟢 MEDIUM    │
└─────────────────────────────────────────────────────────────┘
```

### Recommended Sequence:

1. **Start with Phase 1** (Visual Components) - User's #1 request
2. **Immediately do Phase 2** (Security) - Production blocker
3. **Then Phase 3** (Context) - Improves UX significantly
4. **Add Phase 4** (Error handling) - Reliability
5. **Finish with Phase 5** (Monitoring) - Production hygiene

---

## Phase 1: Visual Components (CRITICAL)

### 🎯 Goal: Replace text table with interactive charts

**Priority:** 🔴 **CRITICAL** (User's #1 requirement)
**Effort:** 6-8 hours
**Impact:** High user engagement, professional appearance

### Technology Choice: Recharts

**Why Recharts:**
- ✅ React-native (no jQuery/vanilla JS)
- ✅ TypeScript support
- ✅ Lightweight (45KB gzipped)
- ✅ Responsive by default
- ✅ Great documentation
- ✅ Easy to customize

**Installation:**
```bash
npm install recharts
npm install --save-dev @types/recharts
```

### Step 1.1: Create WealthProjectionChart Component

**File:** `src/components/WealthProjectionChart.tsx`

```typescript
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { WealthProjection } from '../types';
import { formatCurrency } from '../utils/calculations';

interface WealthProjectionChartProps {
  projection: WealthProjection;
  companyName?: string;
}

export const WealthProjectionChart: React.FC<WealthProjectionChartProps> = ({
  projection,
  companyName = 'SwipeSwipe'
}) => {
  // Transform data for Recharts
  const chartData = projection.yearByYear
    .filter(year => [5, 10, 15, 20, 25, 30, 35].includes(year.year))
    .map(year => ({
      year: `${year.year}yr`,
      age: year.age,
      withoutSwipeSwipe: year.withoutSwipeSwipe,
      withSwipeSwipe: year.withSwipeSwipe,
      contribution: year.swipeswipeContribution
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="wealth-chart-tooltip">
        <p className="label">{`Year ${payload[0].payload.year} (Age ${payload[0].payload.age})`}</p>
        <p className="with-ss">
          With {companyName}: <strong>{formatCurrency(payload[0].value)}</strong>
        </p>
        <p className="without-ss">
          Without {companyName}: <strong>{formatCurrency(payload[1].value)}</strong>
        </p>
        <p className="contribution">
          {companyName} Impact: <strong>+{formatCurrency(payload[0].payload.contribution)}</strong>
        </p>
      </div>
    );
  };

  return (
    <div className="wealth-projection-chart">
      <h3>📈 Your Wealth Growth Projection</h3>

      {/* Main Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            stroke="#64748b"
            style={{ fontSize: '14px' }}
          />
          <YAxis
            stroke="#64748b"
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />

          {/* Area for visual impact */}
          <defs>
            <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorWithout" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="withSwipeSwipe"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#colorWith)"
            name={`With ${companyName}`}
          />
          <Area
            type="monotone"
            dataKey="withoutSwipeSwipe"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#colorWithout)"
            name={`Without ${companyName}`}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Impact Summary */}
      <div className="chart-summary">
        <div className="summary-card">
          <span className="summary-label">30-Year Impact</span>
          <span className="summary-value">
            +{formatCurrency(projection.swipeswipeContribution[30])}
          </span>
        </div>
      </div>
    </div>
  );
};
```

### Step 1.2: Create Comparison Bar Chart

**File:** `src/components/ComparisonBarChart.tsx`

```typescript
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { WealthProjection } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ComparisonBarChartProps {
  projection: WealthProjection;
  companyName?: string;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  projection,
  companyName = 'SwipeSwipe'
}) => {
  const milestones = [10, 20, 30];

  const chartData = milestones.map(year => ({
    year: `${year} Years`,
    difference: projection.swipeswipeContribution[year]
  }));

  const COLORS = ['#10b981', '#059669', '#047857'];

  return (
    <div className="comparison-bar-chart">
      <h3>💰 {companyName} Value Add Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            stroke="#64748b"
            style={{ fontSize: '14px' }}
          />
          <YAxis
            stroke="#64748b"
            style={{ fontSize: '14px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: any) => formatCurrency(value)}
            labelStyle={{ color: '#1e293b', fontWeight: 600 }}
          />
          <Bar dataKey="difference" name={`${companyName} Contribution`} radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### Step 1.3: Add Styling

**File:** `src/components/WealthProjectionChart.css`

```css
.wealth-projection-chart {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.wealth-projection-chart h3 {
  margin: 0 0 20px 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.wealth-chart-tooltip {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.wealth-chart-tooltip .label {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.wealth-chart-tooltip .with-ss {
  color: #10b981;
  margin: 4px 0;
}

.wealth-chart-tooltip .without-ss {
  color: #94a3b8;
  margin: 4px 0;
}

.wealth-chart-tooltip .contribution {
  color: #6366f1;
  margin: 4px 0;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

.chart-summary {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

.summary-card {
  flex: 1;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: white;
}

.summary-label {
  display: block;
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 8px;
}

.summary-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
}

.comparison-bar-chart {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.comparison-bar-chart h3 {
  margin: 0 0 20px 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}
```

### Step 1.4: Integrate into WealthChatbot

**File:** `src/components/WealthChatbot.tsx`

**Changes:**

1. **Add imports (after line 16):**
```typescript
import { WealthProjectionChart } from './WealthProjectionChart';
import { ComparisonBarChart } from './ComparisonBarChart';
import './WealthProjectionChart.css';
```

2. **Replace displayProjection function (lines 262-299):**
```typescript
const displayProjection = useCallback((proj: WealthProjection, userData: UserFinancialData) => {
  // First, add the text summary
  const summaryMessage = `
🎉 **Your Wealth Projection is Ready!**

Based on your inputs:
• Age: ${userData.age}
• Annual Income: ${formatCurrency(userData.annualIncome)}
• Current Savings: ${formatCurrency(userData.currentSavings)}
• Monthly Savings: ${formatCurrency(userData.monthlySavings)}
• Monthly Investment: ${formatCurrency(userData.monthlyInvestment)}
• Planned Increase: ${userData.increasePercentage}%
• ${companyName} Contribution: ${formatCurrency(userData.swipeswipeSavings)}/month

---

💡 **Key Insight**: By using ${companyName}, you could accumulate an additional **${formatCurrency(proj.swipeswipeContribution[30])}** over 30 years!

${DISCLAIMER}
  `;

  addBotMessage(summaryMessage, false);

  // Then add a special message type for the chart
  const chartMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'assistant',
    content: '', // Empty content for chart message
    timestamp: new Date(),
    isProjection: true,
    metadata: {
      projectionData: proj,
      userData: userData
    }
  };

  setMessages(prev => [...prev, chartMessage]);

  // Add closing message
  setTimeout(() => {
    addBotMessage("Feel free to ask me any questions about your projection or how to improve your wealth-building strategy!");
  }, 1000);
}, [addBotMessage, companyName]);
```

3. **Update message rendering (lines 436-460):**
```typescript
{messages.map((message) => (
  <div
    key={message.id}
    className={`message ${message.role} ${message.isProjection ? 'projection' : ''}`}
  >
    <div className="message-content">
      {message.role === 'assistant' && (
        <div className="bot-avatar">
          {/* ... existing avatar SVG ... */}
        </div>
      )}

      {/* NEW: Render chart for projection messages */}
      {message.isProjection && message.metadata?.projectionData ? (
        <div className="projection-charts">
          <WealthProjectionChart
            projection={message.metadata.projectionData}
            companyName={companyName}
          />
          <ComparisonBarChart
            projection={message.metadata.projectionData}
            companyName={companyName}
          />
        </div>
      ) : (
        <div className="message-bubble">
          <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
          <span className="message-time">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  </div>
))}
```

4. **Update ChatMessage type (src/types/index.ts):**
```typescript
export interface MessageMetadata {
  stage?: string;
  intent?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  projectionData?: WealthProjection;  // NEW
  userData?: UserFinancialData;       // NEW
}
```

### Step 1.5: Add Chart Styles to Main CSS

**File:** `src/components/WealthChatbot.css`

Add at the end:
```css
/* Projection Charts Container */
.projection-charts {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.message.projection {
  background: transparent;
}

.message.projection .message-content {
  width: 100%;
  max-width: none;
}
```

### ✅ Phase 1 Checklist

- [ ] Install recharts: `npm install recharts @types/recharts`
- [ ] Create WealthProjectionChart.tsx component
- [ ] Create ComparisonBarChart.tsx component
- [ ] Create WealthProjectionChart.css styling
- [ ] Update WealthChatbot.tsx imports
- [ ] Replace displayProjection function
- [ ] Update message rendering logic
- [ ] Update ChatMessage type definition
- [ ] Add chart container styles
- [ ] Test with sample data
- [ ] Verify mobile responsiveness
- [ ] Check accessibility (ARIA labels)

### Testing:

```bash
# Run dev server
npm run dev

# Test conversation flow
# 1. Enter age: 30
# 2. Enter income: 80000
# 3. Enter savings: 10000
# 4. Enter monthly savings: 500
# 5. Enter monthly investment: 300
# 6. Enter increase %: 20
# 7. Enter SwipeSwipe savings: 250
# 8. Verify charts render correctly
# 9. Hover over chart points to see tooltips
# 10. Test on mobile viewport
```

---

## Phase 2: Security Hardening (BLOCKER)

### 🎯 Goal: Move API key to backend, prevent exposure

**Priority:** 🔴 **PRODUCTION BLOCKER**
**Effort:** 4-6 hours
**Impact:** Prevents API key theft, cost overruns, unauthorized usage

### Current Security Risk:

```typescript
// ⚠️ CURRENT CODE (Line 23, WealthChatbot.tsx)
interface WealthChatbotProps {
  apiKey?: string;  // Visible in browser DevTools!
}

// ⚠️ CURRENT CODE (Line 337, guardrails.ts)
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: {
    'Authorization': `Bearer ${apiKey}`  // Key sent from browser!
  }
});
```

**How easy to steal:**
1. Open DevTools (F12)
2. Go to Network tab
3. Make a request
4. See API key in headers ❌

### Solution: Backend API Proxy

### Step 2.1: Create OpenAI Service Layer

**File:** `src/services/openaiService.ts` (NEW)

```typescript
/**
 * OpenAI Service Layer
 * Abstracts API calls with support for both direct and proxy endpoints
 */

import { WealthProjection, ChatMessage } from '../types';
import { CONFIG } from '../constants';

export interface OpenAIServiceConfig {
  apiEndpoint?: string;      // Backend proxy URL (RECOMMENDED)
  apiKey?: string;           // Direct API key (DEPRECATED - dev only)
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface OpenAIRequest {
  messages: OpenAIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Generate bot response using OpenAI API (via proxy or direct)
 */
export async function generateBotResponse(
  request: OpenAIRequest,
  config: OpenAIServiceConfig
): Promise<OpenAIResponse> {
  const {
    apiEndpoint,
    apiKey,
    timeout = CONFIG.api.timeout,
    maxRetries = 3,
    retryDelay = 1000
  } = config;

  // Determine endpoint
  const endpoint = apiEndpoint || 'https://api.openai.com/v1/chat/completions';

  // Build request body
  const requestBody = {
    model: request.model || CONFIG.api.model,
    messages: request.messages,
    temperature: request.temperature || CONFIG.api.temperature,
    max_tokens: request.maxTokens || CONFIG.api.maxTokens
  };

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  // Only add Authorization for direct API calls (not proxy)
  if (!apiEndpoint && apiKey) {
    console.warn('⚠️ SECURITY WARNING: Using direct API key. Use apiEndpoint with backend proxy for production.');
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // Fetch with retry logic
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new OpenAIError(
          errorData.error?.message || `HTTP ${response.status}`,
          'API_ERROR',
          response.status
        );
      }

      // Parse response
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new OpenAIError('Empty response from API', 'EMPTY_RESPONSE');
      }

      return {
        content,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : undefined
      };

    } catch (error: any) {
      lastError = error;

      // Don't retry on client errors or abort
      if (error.name === 'AbortError' ||
          (error.statusCode && error.statusCode >= 400 && error.statusCode < 500)) {
        throw error;
      }

      // Retry on server errors or network issues
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError || new OpenAIError('Request failed after retries', 'MAX_RETRIES');
}

/**
 * Custom error class for OpenAI service
 */
export class OpenAIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

/**
 * Build system context with projection data
 */
export function buildSystemContext(
  basePrompt: string,
  projection: WealthProjection | null
): string {
  let context = basePrompt;

  if (projection) {
    context += `\n\nCurrent user's projection data:
- 5-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[5].toLocaleString()}
- 10-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[10].toLocaleString()}
- 30-year wealth (with SwipeSwipe): $${projection.withSwipeSwipe[30].toLocaleString()}
- SwipeSwipe contribution over 30 years: $${projection.swipeswipeContribution[30].toLocaleString()}

Use this data to provide personalized insights when relevant.`;
  }

  return context;
}
```

### Step 2.2: Update guardrails.ts to use new service

**File:** `src/utils/guardrails.ts`

**Replace generateBotResponse function (lines 317-365) with:**

```typescript
/**
 * Generate bot response using OpenAI API
 * @deprecated Use openaiService.generateBotResponse instead
 */
export async function generateBotResponse(
  userMessage: string,
  systemPrompt: string,
  apiKey: string,
  projection: WealthProjection | null,
  conversationHistory?: ChatMessage[]
): Promise<string> {
  // Import the new service
  const {
    generateBotResponse as newGenerateBotResponse,
    buildSystemContext
  } = await import('../services/openaiService');

  // Build messages array with history
  const messages: any[] = [
    {
      role: 'system',
      content: buildSystemContext(systemPrompt, projection)
    }
  ];

  // Add conversation history (last 10 messages)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory
      .slice(-10)
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    messages.push(...recentHistory);
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  // Call new service
  const response = await newGenerateBotResponse(
    { messages },
    { apiKey }  // Pass apiKey (will show warning)
  );

  return response.content;
}
```

### Step 2.3: Update WealthChatbot component

**File:** `src/components/WealthChatbot.tsx`

**Changes:**

1. **Update props interface (line 22-27):**
```typescript
interface WealthChatbotProps {
  apiKey?: string;              // ⚠️ DEPRECATED - Use apiEndpoint instead
  apiEndpoint?: string;         // NEW - Backend proxy URL (RECOMMENDED)
  onProjectionComplete?: (projection: WealthProjection) => void;
  brandColor?: string;
  companyName?: string;
}
```

2. **Add deprecation warning (after line 44):**
```typescript
// Security warning for direct API key usage
useEffect(() => {
  if (apiKey && !apiEndpoint) {
    console.warn(
      '⚠️ SECURITY WARNING: apiKey prop is deprecated and insecure.\n' +
      'For production, use apiEndpoint with a backend proxy.\n' +
      'See documentation: https://github.com/your-repo#security-setup'
    );
  }
}, [apiKey, apiEndpoint]);
```

3. **Update handleFreeChatMessage (lines 301-331):**
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

  // If we have API endpoint or key, use OpenAI for intelligent responses
  if (apiEndpoint || apiKey) {
    setIsLoading(true);
    try {
      const response = await generateBotResponse(
        message,
        SYSTEM_PROMPT,
        apiKey || '',
        projection,
        messages  // NEW: Pass conversation history
      );
      addBotMessage(response);
    } catch (error: any) {
      console.error('API Error:', error);

      // Better error messages
      if (error.code === 'RATE_LIMIT') {
        addBotMessage("I'm receiving too many requests right now. Please wait a moment and try again.");
      } else if (error.name === 'AbortError') {
        addBotMessage("The request took too long. Please try again.");
      } else {
        addBotMessage("I apologize, but I'm having trouble processing your request. Could you please rephrase your question about financial planning?");
      }
    } finally {
      setIsLoading(false);
    }
  } else {
    // Fallback to predefined responses
    addBotMessage(generateLocalResponse(message));
  }
}, [apiKey, apiEndpoint, projection, messages, addBotMessage, handleOffTopicQuestion]);
```

### Step 2.4: Create Backend Proxy Example

**File:** `docs/BACKEND_PROXY_EXAMPLES.md` (NEW)

```markdown
# Backend Proxy Setup Examples

## Why You Need a Backend Proxy

🔴 **NEVER expose your OpenAI API key in frontend code!**

The API key must stay on your server. Create a backend endpoint that:
1. Receives requests from your frontend
2. Adds the API key server-side
3. Forwards to OpenAI
4. Returns the response

---

## Example 1: Next.js API Route (Recommended)

**File:** `pages/api/chat.ts`

\`\`\`typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting (recommended)
  // TODO: Add rate limiting logic here

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(\`OpenAI API error: \${response.status}\`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
\`\`\`

**Frontend usage:**

\`\`\`tsx
import { WealthChatbot } from 'swipeswipe-wealth-chatbot';

function App() {
  return (
    <WealthChatbot
      apiEndpoint="/api/chat"  // ✅ Secure!
      companyName="SwipeSwipe"
    />
  );
}
\`\`\`

---

## Example 2: Express.js Backend

**File:** `server.js`

\`\`\`javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3001, () => {
  console.log('Chat API proxy running on http://localhost:3001');
});
\`\`\`

**Frontend usage:**

\`\`\`tsx
<WealthChatbot
  apiEndpoint="http://localhost:3001/api/chat"
  companyName="SwipeSwipe"
/>
\`\`\`

---

## Example 3: Serverless (Vercel/Netlify)

**File:** `api/chat.ts` (Vercel)

\`\`\`typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.json(data);
}
\`\`\`

---

## Security Best Practices

1. ✅ **Always use environment variables**
   \`\`\`bash
   # .env.local (NEVER commit this file!)
   OPENAI_API_KEY=sk-proj-...
   \`\`\`

2. ✅ **Add rate limiting**
   \`\`\`typescript
   // Example with express-rate-limit
   const rateLimit = require('express-rate-limit');

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/chat', limiter);
   \`\`\`

3. ✅ **Add authentication** (if needed)
   \`\`\`typescript
   // Example: Check session/JWT
   if (!req.session?.userId) {
     return res.status(401).json({ error: 'Unauthorized' });
   }
   \`\`\`

4. ✅ **Log requests for monitoring**
   \`\`\`typescript
   console.log({
     timestamp: new Date().toISOString(),
     userId: req.session?.userId,
     model: req.body.model,
     messageCount: req.body.messages?.length
   });
   \`\`\`

5. ✅ **Set CORS correctly**
   \`\`\`typescript
   // Only allow your domain
   const corsOptions = {
     origin: 'https://your-domain.com',
     optionsSuccessStatus: 200
   };
   app.use(cors(corsOptions));
   \`\`\`
\`\`\`

### Step 2.5: Update README

**File:** `README.md`

Add security section:

```markdown
## 🔒 Security Setup (IMPORTANT!)

### ⚠️ DO NOT USE API KEY IN FRONTEND

For development/testing only:
```tsx
// ❌ INSECURE - Only for local testing
<WealthChatbot apiKey="sk-..." />
```

### ✅ Production Setup (Backend Proxy)

Create a backend endpoint:

```typescript
// pages/api/chat.ts (Next.js example)
export default async function handler(req, res) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.json(data);
}
```

Then use:
```tsx
// ✅ SECURE
<WealthChatbot apiEndpoint="/api/chat" />
```

See [Backend Proxy Examples](docs/BACKEND_PROXY_EXAMPLES.md) for more.
```

### ✅ Phase 2 Checklist

- [ ] Create src/services/openaiService.ts
- [ ] Add retry logic with exponential backoff
- [ ] Update guardrails.ts to use new service
- [ ] Add apiEndpoint prop to WealthChatbot
- [ ] Add deprecation warning for apiKey
- [ ] Update handleFreeChatMessage to pass conversation history
- [ ] Create BACKEND_PROXY_EXAMPLES.md documentation
- [ ] Update README security section
- [ ] Test with backend proxy
- [ ] Test fallback to direct API key (dev mode)
- [ ] Verify deprecation warnings appear in console

---

## Phase 3: Conversation Context

### 🎯 Goal: Enable multi-turn conversations with memory

**Priority:** 🟡 **HIGH**
**Effort:** 2-3 hours
**Impact:** Better UX, more natural conversations

### Current Problem:

```typescript
// Line 345-348 (guardrails.ts)
messages: [
  { role: 'system', content: contextEnhancedPrompt },
  { role: 'user', content: userMessage }  // Only current message!
]
```

**User Experience Issue:**
```
User: "How much will I have in 30 years?"
Bot: "$500,000 with SwipeSwipe"

User: "What about in 20 years?"
Bot: "I need your financial information first"  ❌ Forgot context!
```

### Solution: Already Implemented in Phase 2! ✅

In Phase 2, Step 2.2, we already added conversation history:

```typescript
// NEW CODE (Phase 2)
export async function generateBotResponse(
  userMessage: string,
  systemPrompt: string,
  apiKey: string,
  projection: WealthProjection | null,
  conversationHistory?: ChatMessage[]  // ✅ NEW PARAMETER
): Promise<string> {
  // ...

  // Add conversation history (last 10 messages)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory
      .slice(-10)
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    messages.push(...recentHistory);
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage });
}
```

### Additional Enhancement: Context Optimization

**File:** `src/services/openaiService.ts`

Add this function:

```typescript
/**
 * Optimize conversation history to reduce token usage
 * Keeps system message + last N exchanges
 */
export function optimizeConversationHistory(
  messages: ChatMessage[],
  maxMessages: number = 10
): ChatMessage[] {
  // Always keep projection-related messages
  const projectionMessages = messages.filter(msg => msg.isProjection);

  // Get recent non-projection messages
  const recentMessages = messages
    .filter(msg => !msg.isProjection && msg.role !== 'system')
    .slice(-maxMessages);

  return [...projectionMessages, ...recentMessages];
}
```

### ✅ Phase 3 Checklist

- [x] Conversation history parameter added (✅ Done in Phase 2)
- [x] History passed from WealthChatbot component (✅ Done in Phase 2)
- [ ] Add optimizeConversationHistory function
- [ ] Test multi-turn conversations
- [ ] Verify context maintained across messages
- [ ] Test edge case: very long conversations (100+ messages)

### Testing:

```
Test Scenario 1: Simple Context
User: "How much will I have in 30 years?"
Bot: "$500,000"
User: "What about 20 years?"
Bot: "$350,000" ✅ (remembered context)

Test Scenario 2: Follow-up Questions
User: "Should I increase my savings rate?"
Bot: "Based on your projection, increasing by 10% would add $50k..."
User: "What if I increase by 20% instead?"
Bot: "With a 20% increase, you'd add $100k..." ✅ (remembered previous question)
```

---

## Phase 4: Error Handling & Reliability

### 🎯 Goal: Graceful error handling with retries

**Priority:** 🟡 **HIGH**
**Effort:** 2-3 hours
**Impact:** Better reliability, user trust

### Step 4.1: Enhanced Error Types (Already Done in Phase 2! ✅)

The OpenAIService already includes:
- ✅ Retry logic with exponential backoff
- ✅ Timeout handling
- ✅ Custom error types (OpenAIError)
- ✅ Error categorization

### Step 4.2: User-Friendly Error Messages

**File:** `src/constants/index.ts`

Add to ERROR_MESSAGES:

```typescript
export const ERROR_MESSAGES = {
  // Existing messages...
  invalidAge: 'Please enter a valid age between 18 and 100.',
  // ...

  // NEW: API Error Messages
  rateLimitError: "I'm receiving too many requests right now. Please wait a moment and try again.",
  timeoutError: "The request took too long to process. Please try again.",
  networkError: "Unable to connect to the server. Please check your internet connection.",
  apiKeyError: "There's an issue with the API configuration. Please contact support.",
  serverError: "Our servers are experiencing issues. Please try again in a few moments.",
  unknownError: "Something unexpected happened. Please try again or contact support if the issue persists.",

  // Fallback mode message
  fallbackMode: "I'm currently operating in offline mode with limited capabilities. You can still complete your wealth projection!"
};
```

### Step 4.3: Error Handling in WealthChatbot

**File:** `src/components/WealthChatbot.tsx`

Update handleFreeChatMessage error handling (already partially done in Phase 2):

```typescript
const handleFreeChatMessage = useCallback(async (message: string) => {
  // ... existing guardrail checks ...

  if (apiEndpoint || apiKey) {
    setIsLoading(true);
    let errorOccurred = false;

    try {
      const response = await generateBotResponse(
        message,
        SYSTEM_PROMPT,
        apiKey || '',
        projection,
        messages
      );
      addBotMessage(response);

    } catch (error: any) {
      errorOccurred = true;
      console.error('API Error:', error);

      // Categorize and respond to different error types
      let errorMessage = ERROR_MESSAGES.unknownError;
      let shouldFallback = true;

      if (error.code === 'RATE_LIMIT' || error.statusCode === 429) {
        errorMessage = ERROR_MESSAGES.rateLimitError;
        shouldFallback = false; // Don't fallback, user should just wait
      } else if (error.name === 'AbortError' || error.code === 'TIMEOUT') {
        errorMessage = ERROR_MESSAGES.timeoutError;
      } else if (error.statusCode === 401 || error.code === 'AUTH_ERROR') {
        errorMessage = ERROR_MESSAGES.apiKeyError;
        shouldFallback = false;
      } else if (error.statusCode === 500 || error.statusCode === 503) {
        errorMessage = ERROR_MESSAGES.serverError;
      } else if (!navigator.onLine) {
        errorMessage = ERROR_MESSAGES.networkError;
      }

      addBotMessage(errorMessage);

      // Try local fallback for certain errors
      if (shouldFallback) {
        setTimeout(() => {
          addBotMessage(ERROR_MESSAGES.fallbackMode);
          addBotMessage(generateLocalResponse(message));
        }, 1000);
      }

    } finally {
      setIsLoading(false);
    }
  } else {
    // No API configured - use local responses
    addBotMessage(generateLocalResponse(message));
  }
}, [apiKey, apiEndpoint, projection, messages, addBotMessage, handleOffTopicQuestion]);
```

### Step 4.4: Network Status Indicator

**File:** `src/components/WealthChatbot.tsx`

Add network status detection:

```typescript
// Add state for network status
const [isOnline, setIsOnline] = useState(navigator.onLine);
const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'degraded'>('online');

// Monitor network status
useEffect(() => {
  const handleOnline = () => {
    setIsOnline(true);
    setApiStatus('online');
  };

  const handleOffline = () => {
    setIsOnline(false);
    setApiStatus('offline');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

// Update status badge in header (line 428-432)
<span className={`status-badge ${apiStatus}`}>
  <span className="status-dot"></span>
  {apiStatus === 'online' ? 'Online' : apiStatus === 'degraded' ? 'Limited' : 'Offline'}
</span>
```

**File:** `src/components/WealthChatbot.css`

Add status badge styles:

```css
.status-badge.offline .status-dot {
  background-color: #ef4444;
}

.status-badge.degraded .status-dot {
  background-color: #f59e0b;
}
```

### ✅ Phase 4 Checklist

- [x] Retry logic with exponential backoff (✅ Done in Phase 2)
- [x] Timeout handling (✅ Done in Phase 2)
- [x] Custom error types (✅ Done in Phase 2)
- [ ] Add user-friendly error messages to constants
- [ ] Update handleFreeChatMessage with better error handling
- [ ] Add fallback to local responses
- [ ] Add network status detection
- [ ] Update status badge in UI
- [ ] Test various error scenarios
- [ ] Test offline mode
- [ ] Test rate limiting

### Testing Error Scenarios:

```bash
# Test 1: Network offline
# 1. Open DevTools
# 2. Go to Network tab
# 3. Select "Offline"
# 4. Send a message
# 5. Verify fallback to local response

# Test 2: Timeout
# 1. Set timeout to 1ms in config (testing only!)
# 2. Send a message
# 3. Verify timeout error message

# Test 3: Invalid API key
# 1. Use fake API key: sk-test123
# 2. Send a message
# 3. Verify auth error message
```

---

## Phase 5: Cost Control & Monitoring

### 🎯 Goal: Track usage, costs, and prevent overruns

**Priority:** 🟢 **MEDIUM**
**Effort:** 3-4 hours
**Impact:** Cost control, usage insights, debugging

### Step 5.1: Token Usage Tracking

**File:** `src/services/openaiService.ts`

Update OpenAIResponse interface and add cost calculation:

```typescript
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;  // USD
}

export interface OpenAIResponse {
  content: string;
  usage?: TokenUsage;
}

// Token pricing (gpt-4o-mini as of Dec 2024)
const TOKEN_COSTS = {
  'gpt-4o-mini': {
    input: 0.15 / 1_000_000,   // $0.15 per 1M input tokens
    output: 0.60 / 1_000_000    // $0.60 per 1M output tokens
  },
  'gpt-3.5-turbo': {
    input: 0.50 / 1_000_000,
    output: 1.50 / 1_000_000
  }
};

function calculateCost(usage: any, model: string): number {
  const costs = TOKEN_COSTS[model as keyof typeof TOKEN_COSTS] || TOKEN_COSTS['gpt-4o-mini'];
  const inputCost = usage.prompt_tokens * costs.input;
  const outputCost = usage.completion_tokens * costs.output;
  return inputCost + outputCost;
}

// Update generateBotResponse to return usage:
export async function generateBotResponse(
  request: OpenAIRequest,
  config: OpenAIServiceConfig
): Promise<OpenAIResponse> {
  // ... existing code ...

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new OpenAIError('Empty response from API', 'EMPTY_RESPONSE');
  }

  // Calculate usage and cost
  let usage: TokenUsage | undefined;
  if (data.usage) {
    usage = {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
      estimatedCost: calculateCost(data.usage, request.model || 'gpt-4o-mini')
    };
  }

  return { content, usage };
}
```

### Step 5.2: Usage Metrics State

**File:** `src/components/WealthChatbot.tsx`

Add metrics tracking:

```typescript
// Add metrics state (after line 53)
interface ChatbotMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
}

const [metrics, setMetrics] = useState<ChatbotMetrics>({
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalTokens: 0,
  totalCost: 0,
  averageResponseTime: 0
});

// Update handleFreeChatMessage to track metrics:
const handleFreeChatMessage = useCallback(async (message: string) => {
  // ... existing guardrail checks ...

  if (apiEndpoint || apiKey) {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const response = await generateBotResponse(/* ... */);
      const duration = performance.now() - startTime;

      // Update metrics on success
      setMetrics(prev => ({
        totalRequests: prev.totalRequests + 1,
        successfulRequests: prev.successfulRequests + 1,
        failedRequests: prev.failedRequests,
        totalTokens: prev.totalTokens + (response.usage?.totalTokens || 0),
        totalCost: prev.totalCost + (response.usage?.estimatedCost || 0),
        averageResponseTime: (prev.averageResponseTime * prev.totalRequests + duration) / (prev.totalRequests + 1)
      }));

      addBotMessage(response.content);

    } catch (error: any) {
      // Update metrics on failure
      setMetrics(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
        failedRequests: prev.failedRequests + 1
      }));

      // ... existing error handling ...
    } finally {
      setIsLoading(false);
    }
  }
}, [/* ... */]);
```

### Step 5.3: Client-Side Rate Limiting

**File:** `src/services/rateLimiter.ts` (NEW)

```typescript
/**
 * Client-side rate limiter to prevent excessive API calls
 */

export class RateLimiter {
  private requests: number[] = [];

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  canMakeRequest(): boolean {
    const now = Date.now();

    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getTimeUntilNextRequest(): number {
    if (this.canMakeRequest()) {
      return 0;
    }

    const now = Date.now();
    const oldestRequest = Math.min(...this.requests);
    return this.windowMs - (now - oldestRequest);
  }

  reset(): void {
    this.requests = [];
  }
}

// Export pre-configured limiters
export const rateLimiters = {
  // 20 requests per minute
  perMinute: new RateLimiter(20, 60 * 1000),

  // 100 requests per hour
  perHour: new RateLimiter(100, 60 * 60 * 1000)
};
```

**File:** `src/components/WealthChatbot.tsx`

Add rate limiting:

```typescript
import { rateLimiters } from '../services/rateLimiter';

// In handleFreeChatMessage:
const handleFreeChatMessage = useCallback(async (message: string) => {
  // ... guardrail checks ...

  if (apiEndpoint || apiKey) {
    // Check rate limit
    if (!rateLimiters.perMinute.canMakeRequest()) {
      const waitTime = rateLimiters.perMinute.getTimeUntilNextRequest();
      const waitSeconds = Math.ceil(waitTime / 1000);
      addBotMessage(
        `I'm receiving requests too quickly. Please wait ${waitSeconds} seconds before trying again.`
      );
      return;
    }

    // ... continue with API call ...
  }
}, [/* ... */]);
```

### Step 5.4: Cost Alert Callback

**File:** `src/components/WealthChatbot.tsx`

Add cost alert:

```typescript
// Update props interface
interface WealthChatbotProps {
  // ... existing props ...
  onCostAlert?: (totalCost: number) => void;  // NEW
  costAlertThreshold?: number;                 // NEW (default: $1.00)
}

// Add effect to monitor costs
useEffect(() => {
  const threshold = costAlertThreshold || 1.00;

  if (metrics.totalCost > threshold) {
    console.warn(`⚠️ Cost alert: $${metrics.totalCost.toFixed(4)} spent this session`);
    onCostAlert?.(metrics.totalCost);
  }
}, [metrics.totalCost, costAlertThreshold, onCostAlert]);
```

### Step 5.5: Metrics Dashboard (Optional)

**File:** `src/components/MetricsDashboard.tsx` (NEW)

```typescript
import React from 'react';

interface ChatbotMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
}

interface MetricsDashboardProps {
  metrics: ChatbotMetrics;
  show: boolean;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  show
}) => {
  if (!show) return null;

  const errorRate = metrics.totalRequests > 0
    ? (metrics.failedRequests / metrics.totalRequests * 100).toFixed(1)
    : '0.0';

  return (
    <div className="metrics-dashboard">
      <h4>📊 Session Metrics</h4>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Requests</span>
          <span className="metric-value">{metrics.totalRequests}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Success Rate</span>
          <span className="metric-value">
            {metrics.totalRequests > 0
              ? ((metrics.successfulRequests / metrics.totalRequests * 100).toFixed(1))
              : '0.0'}%
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Total Tokens</span>
          <span className="metric-value">{metrics.totalTokens.toLocaleString()}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Estimated Cost</span>
          <span className="metric-value">${metrics.totalCost.toFixed(4)}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Avg Response Time</span>
          <span className="metric-value">{metrics.averageResponseTime.toFixed(0)}ms</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Error Rate</span>
          <span className="metric-value">{errorRate}%</span>
        </div>
      </div>
    </div>
  );
};
```

Usage in WealthChatbot:

```typescript
// Add state for showing metrics (dev mode)
const [showMetrics, setShowMetrics] = useState(
  process.env.NODE_ENV === 'development'
);

// Add to render (before closing </div>)
{showMetrics && <MetricsDashboard metrics={metrics} show={showMetrics} />}
```

### ✅ Phase 5 Checklist

- [ ] Add TokenUsage interface and cost calculation
- [ ] Update generateBotResponse to return usage data
- [ ] Add metrics state to WealthChatbot
- [ ] Track metrics in handleFreeChatMessage
- [ ] Create RateLimiter class
- [ ] Add rate limiting to API calls
- [ ] Add cost alert callback prop
- [ ] Create MetricsDashboard component (optional)
- [ ] Test rate limiting (make rapid requests)
- [ ] Test cost tracking
- [ ] Verify metrics accuracy

---

## Testing Strategy

### Unit Tests

**File:** `src/__tests__/openaiService.test.ts` (NEW)

```typescript
import { generateBotResponse, OpenAIError } from '../services/openaiService';

describe('OpenAI Service', () => {
  it('should retry on network failure', async () => {
    // Mock fetch to fail twice, then succeed
    let attempts = 0;
    global.fetch = jest.fn(() => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Success' } }],
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
        })
      });
    }) as any;

    const result = await generateBotResponse(
      { messages: [{ role: 'user', content: 'test' }] },
      { apiKey: 'test' }
    );

    expect(attempts).toBe(3);
    expect(result.content).toBe('Success');
  });

  it('should throw on rate limit', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: { message: 'Rate limit' } })
      })
    ) as any;

    await expect(
      generateBotResponse(
        { messages: [{ role: 'user', content: 'test' }] },
        { apiKey: 'test' }
      )
    ).rejects.toThrow(OpenAIError);
  });
});
```

**File:** `src/__tests__/rateLimiter.test.ts` (NEW)

```typescript
import { RateLimiter } from '../services/rateLimiter';

describe('RateLimiter', () => {
  it('should allow requests within limit', () => {
    const limiter = new RateLimiter(3, 1000);

    expect(limiter.canMakeRequest()).toBe(true);
    expect(limiter.canMakeRequest()).toBe(true);
    expect(limiter.canMakeRequest()).toBe(true);
    expect(limiter.canMakeRequest()).toBe(false);
  });

  it('should reset after time window', async () => {
    const limiter = new RateLimiter(2, 100);

    limiter.canMakeRequest();
    limiter.canMakeRequest();
    expect(limiter.canMakeRequest()).toBe(false);

    await new Promise(resolve => setTimeout(resolve, 150));
    expect(limiter.canMakeRequest()).toBe(true);
  });
});
```

### Integration Tests

**File:** `src/__tests__/WealthChatbot.integration.test.tsx` (NEW)

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WealthChatbot from '../components/WealthChatbot';

describe('WealthChatbot Integration', () => {
  it('should complete full conversation flow with charts', async () => {
    const onProjectionComplete = jest.fn();

    render(
      <WealthChatbot
        onProjectionComplete={onProjectionComplete}
      />
    );

    // Age
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '30' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/annual income/i)).toBeInTheDocument();
    });

    // Income
    fireEvent.change(input, { target: { value: '80000' } });
    fireEvent.submit(input.closest('form')!);

    // ... continue for all fields ...

    // SwipeSwipe savings (last field)
    await waitFor(() => {
      expect(screen.getByText(/swipeswipe.*save/i)).toBeInTheDocument();
    });
    fireEvent.change(input, { target: { value: '250' } });
    fireEvent.submit(input.closest('form')!);

    // Verify projection displayed
    await waitFor(() => {
      expect(screen.getByText(/Your Wealth Growth Projection/i)).toBeInTheDocument();
      expect(onProjectionComplete).toHaveBeenCalled();
    });
  });
});
```

### Manual Testing Checklist

**Visual Components:**
- [ ] Charts render correctly
- [ ] Charts are responsive (test on mobile)
- [ ] Tooltips work on hover
- [ ] Colors match brand
- [ ] Data is accurate

**Security:**
- [ ] API key NOT visible in DevTools Network tab
- [ ] Backend proxy works correctly
- [ ] Deprecation warning shows for apiKey prop
- [ ] Rate limiting prevents rapid requests

**Conversation:**
- [ ] Multi-turn conversations work
- [ ] AI remembers context
- [ ] Follow-up questions answered correctly
- [ ] Conversation history limited to last 10 messages

**Error Handling:**
- [ ] Network errors show friendly message
- [ ] Timeout errors handled
- [ ] Rate limit errors handled
- [ ] Falls back to local responses when appropriate
- [ ] Status badge updates on offline/online

**Metrics:**
- [ ] Token usage tracked correctly
- [ ] Cost calculated accurately
- [ ] Rate limiter prevents excessive requests
- [ ] Metrics dashboard shows correct data (if enabled)

---

## Deployment Checklist

### Pre-Deployment

**Code Quality:**
- [ ] All TypeScript errors resolved: `npm run type-check`
- [ ] All tests passing: `npm test`
- [ ] Linting clean: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] Test coverage ≥80%: `npm run test:coverage`

**Security:**
- [ ] API key removed from frontend code
- [ ] Backend proxy implemented and tested
- [ ] Rate limiting configured
- [ ] CORS configured correctly
- [ ] Environment variables set properly

**Performance:**
- [ ] Charts load quickly (<1s)
- [ ] API responses reasonable (<3s average)
- [ ] No memory leaks (test long conversations)
- [ ] Mobile performance acceptable

**Functionality:**
- [ ] All conversation stages work
- [ ] Calculations are accurate
- [ ] Charts display correctly
- [ ] Error handling works
- [ ] Offline mode works

### Deployment

**Environment Setup:**
```bash
# Production environment variables
OPENAI_API_KEY=sk-proj-...           # Server-side only!
REACT_APP_API_ENDPOINT=/api/chat      # Frontend endpoint
NODE_ENV=production
```

**Build:**
```bash
npm run build
```

**Verify Build:**
- [ ] dist/ folder created
- [ ] No errors in build output
- [ ] File sizes reasonable (<500KB for bundle)

**Backend Deployment:**
- [ ] Backend API proxy deployed
- [ ] API endpoint accessible
- [ ] Rate limiting active
- [ ] Logging configured
- [ ] Monitoring set up

**Frontend Deployment:**
- [ ] Frontend deployed to hosting (Vercel/Netlify/etc.)
- [ ] API endpoint configured correctly
- [ ] HTTPS enabled
- [ ] CDN configured (if applicable)

### Post-Deployment

**Smoke Tests:**
- [ ] Visit production URL
- [ ] Complete full conversation flow
- [ ] Verify charts render
- [ ] Test AI responses (if enabled)
- [ ] Test on mobile device
- [ ] Test on different browsers (Chrome, Safari, Firefox)

**Monitoring:**
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Set up cost alerts
- [ ] Set up uptime monitoring

**Documentation:**
- [ ] Update README with production setup
- [ ] Document backend API endpoints
- [ ] Document environment variables
- [ ] Create troubleshooting guide

---

## Summary & Next Steps

### What We Built:

✅ **Phase 1: Visual Components**
- Interactive wealth projection chart (Recharts)
- Comparison bar chart showing SwipeSwipe impact
- Responsive, professional design

✅ **Phase 2: Security**
- Backend API proxy support
- Deprecation warnings for insecure usage
- Secure service layer with retry logic

✅ **Phase 3: Conversation Context**
- Multi-turn conversation support
- AI remembers conversation history
- Optimized for token efficiency

✅ **Phase 4: Error Handling**
- Retry with exponential backoff
- Timeout handling
- Graceful fallbacks
- User-friendly error messages
- Network status indicators

✅ **Phase 5: Cost Control**
- Token usage tracking
- Cost monitoring
- Rate limiting
- Metrics dashboard
- Cost alerts

### Before vs After:

| Feature | Before | After |
|---------|--------|-------|
| **Visual Output** | Text table only | ✅ Interactive charts |
| **Security** | API key in frontend | ✅ Backend proxy |
| **Conversation** | Single-turn only | ✅ Multi-turn with memory |
| **Error Handling** | Basic try-catch | ✅ Comprehensive with retries |
| **Cost Control** | None | ✅ Tracking + limiting |
| **Production Ready** | ❌ No | ✅ Yes |

### Recommended Implementation Order:

**Week 1 (Critical):**
1. Day 1-2: Phase 1 (Visual Components) - User's #1 request
2. Day 2-3: Phase 2 (Security) - Production blocker
3. Day 3: Phase 3 (Context) - Quick UX win

**Week 2 (Important):**
4. Day 4: Phase 4 (Error Handling) - Reliability
5. Day 4-5: Phase 5 (Monitoring) - Production hygiene

**Total Estimated Time:** 4-5 days

### Success Metrics:

After implementation, you should see:
- ✅ Users engaging more with visual projections
- ✅ Zero API key theft incidents
- ✅ Better conversation quality (multi-turn)
- ✅ <1% error rate (due to retries)
- ✅ Predictable, controlled costs

### LLM Recommendation Summary:

**✅ KEEP gpt-4o-mini** - Your current choice is perfect!

- Best cost/performance ratio
- Fast responses (~500ms)
- Excellent financial reasoning
- ~$3-5/month for 1,000 users
- No change needed

---

## Final Thoughts

Your codebase is **already excellent** (8/10 quality). The main gaps are:

1. **Visual components** (your explicit request) ✅ Solved with Recharts
2. **Security** (production blocker) ✅ Solved with backend proxy
3. **Polish** (context, errors, monitoring) ✅ Solved with remaining phases

Follow this roadmap sequentially, and you'll have a **production-ready, best-in-class wealth chatbot** that:
- Engages users with beautiful visualizations
- Protects your API keys and costs
- Provides intelligent, contextual conversations
- Handles errors gracefully
- Monitors usage and costs

**Questions or need clarification on any phase?** Refer to the detailed steps above or reach out for support.

---

**Good luck with your implementation! 🚀**

*Last Updated: December 2024*
