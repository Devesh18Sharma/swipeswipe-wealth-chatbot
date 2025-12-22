# SwipeSwipe Wealth Planning Chatbot 🚀💰

A production-ready, AI-powered wealth planning chatbot built with React + TypeScript. Helps users project their financial future and demonstrates the value of SwipeSwipe savings.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **Guided Wealth Projection**: Collects user financial data and calculates projections for 5-35 years
- **SwipeSwipe Integration**: Shows additional wealth accumulation from SwipeSwipe savings
- **AI-Powered Conversations**: Optional OpenAI integration for intelligent follow-up discussions
- **Professional Guardrails**: Handles off-topic questions gracefully without embarrassing your brand
- **Production-Ready**: Comprehensive test coverage, TypeScript strict mode, accessibility support
- **Customizable**: Brandable colors, company name, and behavior

## 📸 Preview

```
┌──────────────────────────────────────────┐
│  🔷 SwipeSwipe Wealth Advisor    🟢 Online │
├──────────────────────────────────────────┤
│                                          │
│  🤖 Welcome! I'm here to help you        │
│     discover how wealthy you could       │
│     become. Let's create a personalized  │
│     projection together.                 │
│                                          │
│     What's your current age?             │
│                                          │
│                           30 ────────────│
│                                          │
│  🤖 Great! Now, what's your annual       │
│     income?                              │
│                                          │
├──────────────────────────────────────────┤
│  [ Type your answer...           ] [➤]   │
├──────────────────────────────────────────┤
│     Powered by SwipeSwipe                │
└──────────────────────────────────────────┘
```

## 🚀 Quick Start

### Installation

```bash
npm install swipeswipe-wealth-chatbot
# or
yarn add swipeswipe-wealth-chatbot
```

### Basic Usage

```tsx
import { WealthChatbot } from 'swipeswipe-wealth-chatbot';

function App() {
  return (
    <WealthChatbot 
      companyName="SwipeSwipe"
      brandColor="#6366f1"
    />
  );
}
```

### With OpenAI Integration

```tsx
import { WealthChatbot } from 'swipeswipe-wealth-chatbot';

function App() {
  return (
    <WealthChatbot 
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      companyName="SwipeSwipe"
      brandColor="#6366f1"
      onProjectionComplete={(projection) => {
        console.log('30-year wealth:', projection.withSwipeSwipe[30]);
      }}
    />
  );
}
```

## 📖 Documentation

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | `string` | - | OpenAI API key for AI responses |
| `companyName` | `string` | `"SwipeSwipe"` | Your company/product name |
| `brandColor` | `string` | `"#6366f1"` | Primary brand color (hex) |
| `onProjectionComplete` | `function` | - | Callback when projection is calculated |

### Projection Data Structure

```typescript
interface WealthProjection {
  withoutSwipeSwipe: Record<number, number>;  // Values at 5, 10, 15, 20, 25, 30, 35 years
  withSwipeSwipe: Record<number, number>;      // Same milestones with SS savings
  swipeswipeContribution: Record<number, number>; // Difference (SS value-add)
  yearByYear: YearlyProjection[];              // Detailed year-by-year breakdown
  assumptions: ProjectionAssumptions;          // 7% return rate, etc.
}
```

## 🛡️ Guardrails

The chatbot includes comprehensive guardrails to maintain professionalism:

### Off-Topic Handling

When users ask off-topic questions, the chatbot responds professionally:

```
User: "What is Python?"

Bot: "That's an interesting question! However, I'm specifically designed 
     to help you with financial planning and wealth projection. I'd love 
     to help you understand how your savings can grow over time. Is there 
     anything about your financial future you'd like to explore?"
```

### Protected Against

- ✅ Programming/coding questions
- ✅ Weather inquiries
- ✅ Sports discussions
- ✅ Political topics
- ✅ Entertainment requests
- ✅ Jailbreak attempts
- ✅ PII requests
- ✅ Inappropriate content

## 🧪 Testing

Built with TDD/BDD principles and comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage Goals

- **Calculations**: 95%+ coverage
- **Guardrails**: 90%+ coverage
- **Edge Cases**: Comprehensive handling

## 🏗️ Architecture

```
src/
├── components/
│   ├── WealthChatbot.tsx      # Main chatbot component
│   └── WealthChatbot.css      # Styles
├── utils/
│   ├── calculations.ts        # Financial math
│   └── guardrails.ts          # Topic/safety filters
├── types/
│   └── index.ts               # TypeScript definitions
├── constants/
│   └── index.ts               # Prompts, config, messages
├── __tests__/
│   ├── calculations.test.ts   # Calculation tests
│   └── guardrails.test.ts     # Guardrail tests
└── index.ts                   # Public exports
```

## 🎨 Customization

### Custom Styling

The component uses CSS variables for easy theming:

```css
.wealth-chatbot {
  --brand-color: #6366f1;
  --brand-color-dark: #4f46e5;
  --bg-primary: #ffffff;
  --text-primary: #1e293b;
  /* ... more variables */
}
```

### Custom System Prompt

```typescript
import { SYSTEM_PROMPT } from 'swipeswipe-wealth-chatbot';

// Extend or modify the system prompt
const customPrompt = `${SYSTEM_PROMPT}

Additional instructions specific to your use case...
`;
```

## 📊 Financial Calculations

The chatbot uses industry-standard compound interest formulas:

```
FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]

Where:
- P = Principal (initial savings)
- r = Annual interest rate (default 7%)
- n = Compounding frequency (12 for monthly)
- t = Time in years
- PMT = Monthly contribution
```

**Default Assumptions:**
- 7% annual return (historical S&P 500 average)
- Monthly compounding
- 2.5% inflation rate for real value calculations

## 🔒 Security Considerations

1. **Never expose API keys in frontend code** - Use a backend proxy
2. **No PII storage** - Chatbot doesn't persist sensitive data
3. **Jailbreak protection** - Built-in detection and blocking
4. **Input sanitization** - All user inputs are validated

### Recommended Backend Proxy

```typescript
// Example Next.js API route
// pages/api/chat.ts
export default async function handler(req, res) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙋 FAQ

### Why 7% annual return?

The 7% rate is a conservative estimate based on historical S&P 500 returns (approximately 10% nominal, 7% inflation-adjusted). We use the more conservative figure to avoid overpromising.

### Can I use this without OpenAI?

Yes! The chatbot works fully offline for the guided projection flow. OpenAI is only needed for free-form follow-up questions.

### How do I change the conversation flow?

The conversation stages are defined in `ConversationState`. You can modify `getStagePrompt()` and `processUserInput()` in `WealthChatbot.tsx`.

### Is this financial advice?

No. This tool is for educational purposes only. Users should consult qualified financial advisors for personalized advice.

---

Built with ❤️ for SwipeSwipe

**Questions?** Open an issue or contact the team.
