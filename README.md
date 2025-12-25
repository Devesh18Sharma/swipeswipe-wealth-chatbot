# SwipeSwipe Wealth Planning Chatbot

A production-ready, AI-powered wealth planning chatbot built with React + TypeScript. Shows average Americans they can become wealthy through consistent saving and investing.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Hero Wealth Display**: Giant animated number with celebration confetti
- **Interactive Charts**: Recharts-powered visualization with tooltips
- **Dual AI Support**: Google Gemini (default) or OpenAI integration
- **SwipeSwipe Theme**: Deep Blue (#293A60) + Yellow (#FBC950) branding
- **Wealth Projections**: 5, 10, 15, 20, 25, 30, 35 year projections
- **Auto-Calculated Savings**: Income-based SwipeSwipe contribution
- **Professional Guardrails**: Keeps conversations on-topic

## Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and add your API keys:

```env
# Gemini API (Recommended)
VITE_GEMINI_API_KEY=your_gemini_api_key

# OpenAI API (Legacy fallback)
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Usage

```tsx
import { WealthChatbot } from 'swipeswipe-wealth-chatbot';

function App() {
  return (
    <WealthChatbot
      geminiApiKey={import.meta.env.VITE_GEMINI_API_KEY}
      aiProvider="gemini"
      companyName="SwipeSwipe"
      onProjectionComplete={(projection) => {
        console.log('30-year wealth:', projection.withSwipeSwipe[30]);
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `geminiApiKey` | `string` | - | Google Gemini API key |
| `apiKey` | `string` | - | OpenAI API key (legacy) |
| `aiProvider` | `'gemini' \| 'openai'` | `'gemini'` | AI provider to use |
| `companyName` | `string` | `'SwipeSwipe'` | Your company name |
| `brandColor` | `string` | `'#293A60'` | Primary brand color |
| `onProjectionComplete` | `function` | - | Callback with projection data |

## SwipeSwipe Savings by Income

| Annual Income | Monthly SwipeSwipe Savings |
|---------------|----------------------------|
| < $50,000 | $75/month |
| $50K - $75K | $125/month |
| $75K - $100K | $175/month |
| $100K - $150K | $250/month |
| $150K - $200K | $350/month |
| $200K - $300K | $450/month |
| > $300K | $500/month |

## Theme Colors

```css
--brand-primary: #293A60;      /* Deep Blue */
--brand-accent: #FBC950;       /* Swipe Yellow */
--color-success: #19B600;      /* Success Green */
--color-danger: #DD2A11;       /* Danger Red */
```

See [THEME.md](./THEME.md) for the complete design system.

## Architecture

```
src/
├── components/
│   ├── WealthChatbot.tsx      # Main chatbot
│   ├── WealthChatbot.css      # SwipeSwipe themed styles
│   ├── HeroWealthDisplay.tsx  # Animated wealth display
│   ├── WealthChart.tsx        # Recharts visualization
│   └── AnimatedNumber.tsx     # Number animation utility
├── services/
│   └── geminiService.ts       # Gemini AI integration
├── utils/
│   ├── calculations.ts        # Financial math
│   ├── guardrails.ts          # Topic filters + AI
│   ├── animations.ts          # Confetti celebrations
│   └── swipeswipeCalculator.ts # Income-based savings
├── types/
│   └── index.ts               # TypeScript definitions
└── constants/
    └── index.ts               # Prompts, config
```

## Documentation

- [GAME_PLAN.md](./GAME_PLAN.md) - Implementation roadmap and phases
- [THEME.md](./THEME.md) - Complete design system
- [Claude_code_instructions.md](./Claude_code_instructions.md) - Development guidelines

## Testing

```bash
npm test
npm test -- --coverage
```

## Security

- API keys are never exposed in frontend code
- No PII storage - chatbot doesn't persist sensitive data
- Jailbreak protection built-in
- Input validation on all user inputs

## License

MIT License

---

Built with love for SwipeSwipe

**Core Message**: Show average Americans they can become wealthy through consistent saving & investing - it's simple, not complex.
