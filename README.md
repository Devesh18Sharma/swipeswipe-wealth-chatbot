# SwipeSwipe Wealth Planning Chatbot

A production-ready, AI-powered wealth planning chatbot built with React + TypeScript. Shows average Americans they can become wealthy through consistent saving and investing.

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Hero Wealth Display**: Giant animated number with celebration confetti
- **Interactive Charts**: Recharts-powered visualization with tooltips and glow effects
- **Dual AI Support**: Google Gemini (default) or OpenAI integration
- **SwipeSwipe Theme**: Deep Blue (#293A60) + Yellow (#FBC950) branding
- **Wealth Projections**: 5, 10, 15, 20, 25, 30, 35 year projections
- **11% Return Rate**: Based on historical S&P 500 average
- **88-Year Life Expectancy**: Dynamic projection based on user age
- **Google Docs Export**: Beautiful branded wealth projection reports
- **Professional Guardrails**: Keeps conversations on-topic

## Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and add your API keys:

```env
# Gemini API (Required)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Google Docs Export (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key

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
      googleClientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      googleApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
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
| `googleClientId` | `string` | - | Google OAuth Client ID |
| `googleApiKey` | `string` | - | Google API Key |
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

## Key Configuration

- **Annual Return Rate**: 11% (S&P 500 historical average)
- **Life Expectancy**: 88 years
- **Compounding**: Monthly
- **Projection Years**: 5, 10, 15, 20, 25, 30, 35

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
│   ├── geminiService.ts       # Gemini AI integration
│   └── googleDocsService.ts   # Google Docs export
├── utils/
│   ├── calculations.ts        # Financial math (11% return)
│   ├── guardrails.ts          # Topic filters + AI
│   ├── animations.ts          # Confetti celebrations
│   └── swipeswipeCalculator.ts # Income-based savings
├── types/
│   └── index.ts               # TypeScript definitions
└── constants/
    └── index.ts               # Prompts, config
```

## Google Docs Export

The export creates a beautiful branded report with:
- SwipeSwipe header with website link
- Chrome extension download link
- Giant wealth number display
- ASCII chart visualization
- Detailed year-by-year breakdown table
- Key insights section
- Assumptions and disclaimer

## Documentation

- [GAME_PLAN.md](./GAME_PLAN.md) - Implementation roadmap and architecture
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

## Recent Changes (v3.0)

- Removed detailed breakdown from chatbot output (shows Hero + Chart only)
- Updated return rate from 7% to 11%
- Added 88-year life expectancy calculation
- Enhanced WealthChart with glow effects and impact highlight
- Redesigned Google Docs export with stunning formatting
- Added Chrome extension download link in exports

## License

MIT License

---

Built with love for SwipeSwipe

**Core Message**: Show average Americans they can become wealthy through consistent saving & investing - it's simple, not complex.
