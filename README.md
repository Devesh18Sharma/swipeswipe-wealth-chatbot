# How Rich Can You Get - Powered by SwipeSwipe

A production-ready, AI-powered wealth planning chatbot built with React + TypeScript. Shows average Americans they can become wealthy through consistent saving and investing.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Hero Wealth Display**: Giant animated number with celebration confetti and golden yellow SwipeSwipe contribution badge
- **Stacked Area Chart**: Deep Blue base investment + Golden Yellow SwipeSwipe contribution stacked on top
- **Google Gemini AI**: Powered by Gemini 1.5 Flash for intelligent responses
- **SwipeSwipe Theme**: Deep Blue (#293A60) + Golden Yellow (#FBC950) branding
- **Two-Phase Financial Model**: 11% return before 70, 6% after retirement
- **Age 90 Projections**: Chart starts from current age and projects until age 90
- **Google Docs Export**: Beautiful branded reports with clickable website & extension links
- **Professional Guardrails**: Keeps conversations on-topic
- **Dark Mode Support**: Automatic dark mode based on system preference

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
| $50K - $100K | $100/month |
| $100K - $150K | $150/month |
| $150K - $200K | $200/month |
| $200K - $300K | $350/month |
| > $300K | $500/month |

## Key Configuration

### Two-Phase Financial Model

| Phase | Age Range | Annual Return | Contributions |
|-------|-----------|---------------|---------------|
| Pre-Retirement | Until 70 | 11% | Work + SwipeSwipe |
| Post-Retirement | 70+ | 6% | SwipeSwipe only |

- **Life Expectancy**: 90 years (all projections go to age 90)
- **Compounding**: Monthly
- **Milestone Years**: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70 (starts from current age)

## Chart Design

The wealth chart uses a **stacked area design**:
- **Deep Blue (#293A60)**: "Your Investment" - base investment growth without SwipeSwipe
- **Golden Yellow (#FBC950)**: "SwipeSwipe Adds" - the contribution stacked on top

This visual design clearly shows the value SwipeSwipe adds to your wealth over time.

## Theme Colors

```css
--brand-primary: #293A60;      /* Deep Blue - base investment */
--brand-primary-light: #DEEFF2; /* Light Blue - Key Insight box */
--brand-accent: #FBC950;       /* Golden Yellow - SwipeSwipe contribution */
--brand-accent-dark: #F4B545;  /* Darker yellow */
--color-success: #19B600;      /* Success Green */
--color-danger: #DD2A11;       /* Danger Red */
--color-info: #23A6F0;         /* Info Blue */
```

See [THEME.md](./THEME.md) for the complete design system.

## Architecture

```
src/
├── components/
│   ├── WealthChatbot.tsx      # Main chatbot component
│   ├── WealthChatbot.css      # SwipeSwipe themed styles
│   ├── HeroWealthDisplay.tsx  # Animated wealth display with confetti
│   ├── WealthChart.tsx        # Stacked area chart visualization
│   └── AnimatedNumber.tsx     # Number animation utility
├── services/
│   ├── geminiService.ts       # Google Gemini AI integration
│   └── googleDocsService.ts   # Google Docs export
├── utils/
│   ├── calculations.ts        # Two-phase financial calculations
│   ├── guardrails.ts          # Topic filters + AI safety
│   ├── inputParser.ts         # Natural language input parsing
│   ├── animations.ts          # Confetti celebrations
│   └── swipeswipeCalculator.ts # Income-based savings
├── types/
│   └── index.ts               # TypeScript definitions
└── constants/
    └── index.ts               # Prompts, config
```

## Conversation Flow

1. **Greeting** - "How rich can you get powered by SwipeSwipe"
2. **Age** - Collect user's current age
3. **Income** - Auto-calculate SwipeSwipe savings based on income bracket
4. **Current Savings** - Collect existing savings/investments
5. **Monthly Investment** - How much they invest monthly
6. **Projection Display**:
   - Stacked Area Chart (Deep Blue + Golden Yellow)
   - Hero Wealth Display (animated, confetti celebration)
   - SwipeSwipe contribution badge
7. **Free Chat** - AI-powered Q&A about their projection

## Google Docs Export

The export creates a beautiful branded report with:
- "How rich can you get - powered by SwipeSwipe" header
- Clickable website link (https://swipeswipe.co/)
- Chrome extension download link
- Giant wealth number display
- Year-by-year breakdown table
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

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint source files |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run type-check` | TypeScript type checking |
| `npm run format` | Format code with Prettier |

## Security

- API keys are never exposed in frontend code
- No PII storage - chatbot doesn't persist sensitive data
- Jailbreak protection built-in
- Input validation on all user inputs
- Comprehensive guardrails for topic filtering

## Dependencies

### Production
- `@google/generative-ai` - Google Gemini AI
- `canvas-confetti` - Celebration animations
- `framer-motion` - Motion animations
- `gapi-script` - Google API loader
- `recharts` - Interactive charts

### Development
- TypeScript 5.1
- Jest + Testing Library
- ESLint + Prettier
- Vite (build tool)
- Husky + lint-staged

## License

MIT License

---

Built with love for SwipeSwipe

**Core Message**: Show average Americans they can become wealthy through consistent saving & investing - it's simple, not complex.
