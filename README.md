# How Rich Can You Get - Powered by SwipeSwipe

A production-ready, AI-powered wealth planning chatbot built with React + TypeScript. Shows average Americans they can become wealthy through consistent saving and investing.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-4.4-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Last Updated:** January 2026

## Features

- **Hero Wealth Display**: Giant animated number with celebration confetti and golden yellow SwipeSwipe contribution badge
- **Stacked Area Chart**: Deep Blue base investment + Golden Yellow SwipeSwipe contribution stacked on top (using Recharts)
- **Google Gemini AI**: Powered by Gemini 1.5 Flash for intelligent, cost-efficient responses
- **SwipeSwipe Theme**: Deep Blue (#293A60) + Golden Yellow (#FBC950) consistent branding
- **Two-Phase Financial Model**: 11% return before age 70, 6% conservative return after retirement
- **Age 90 Projections**: Chart starts from current age and projects until age 90
- **Google Docs Export**: Beautiful branded reports with clickable website & Chrome extension links
- **Professional Guardrails**: Jailbreak detection, off-topic filtering (40+ keywords), PII protection
- **Dark Mode Support**: Automatic dark mode based on system preference
- **Smart Input Parsing**: Natural language support ("around 50k", "roughly $75,000", "fifty thousand")
- **Millionaire Celebrations**: Special confetti effects when projections exceed $1M
- **6-Stage Conversation Flow**: Greeting → Age → Income → Savings → Investment → Projection/Chat

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
| Pre-Retirement | Until 70 | 11% (S&P 500 historical avg) | Work savings + SwipeSwipe |
| Post-Retirement | 70+ | 6% (Conservative allocation) | SwipeSwipe only |

- **Life Expectancy**: 90 years (all projections extend to age 90)
- **Compounding**: Monthly (12x per year)
- **Milestone Years**: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70 (starts from year 0)
- **Max Projection**: 70 years (dynamic based on user age to reach 90)
- **Retirement Age**: 70 (transition point for return rate change)

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
├── App.tsx                    # Main app entry (renders WealthChatbot)
├── main.tsx                   # React DOM entry point
├── index.ts                   # Library exports (public API)
├── index.css                  # Global styles
├── components/
│   ├── WealthChatbot.tsx      # Main chatbot component (757 lines)
│   ├── WealthChatbot.css      # SwipeSwipe themed styles + dark mode
│   ├── HeroWealthDisplay.tsx  # Animated wealth display with confetti
│   ├── WealthChart.tsx        # Stacked area chart visualization (Recharts)
│   ├── WealthProjectionChart.tsx # Alternative SVG chart component
│   └── AnimatedNumber.tsx     # Reusable number animation utility
├── services/
│   ├── geminiService.ts       # Google Gemini AI integration (1.5 Flash)
│   └── googleDocsService.ts   # Google Docs export with OAuth 2.0
├── utils/
│   ├── calculations.ts        # Two-phase financial calculations (451 lines)
│   ├── guardrails.ts          # Topic filters + AI safety (506 lines)
│   ├── inputParser.ts         # Natural language input parsing
│   ├── animations.ts          # Confetti celebrations + easing functions
│   └── swipeswipeCalculator.ts # Income-based savings calculator
├── types/
│   └── index.ts               # TypeScript definitions (230 lines)
├── constants/
│   └── index.ts               # System prompt, config, error messages
└── __tests__/
    ├── calculations.test.ts   # Financial calculation tests
    └── guardrails.test.ts     # Content filtering tests
```

## Conversation Flow (6 Stages)

| Stage | Name | Description |
|-------|------|-------------|
| 1 | **greeting** | "How rich can you get powered by SwipeSwipe" |
| 2 | **age** | Collect user's current age (18-100) |
| 3 | **income** | Auto-calculate SwipeSwipe savings based on income bracket |
| 4 | **currentSavings** | Collect existing savings/investments |
| 5 | **monthlyInvestment** | How much they invest monthly |
| 6 | **projection/freeChat** | Display results + AI-powered Q&A |

**Projection Display includes:**
- Stacked Area Chart (Deep Blue + Golden Yellow)
- Hero Wealth Display (animated, confetti celebration)
- SwipeSwipe contribution badge with monthly breakdown
- Special millionaire celebration for $1M+ projections

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
npm test                    # Run Jest tests
npm test -- --watch        # Watch mode for development
npm test -- --coverage     # Generate coverage report
```

### Test Configuration
- **Framework**: Jest with ts-jest preset
- **Environment**: jsdom (browser simulation)
- **Coverage Threshold**: 80% (branches, functions, lines, statements)
- **Test Location**: `src/__tests__/`

### Test Suites
- `calculations.test.ts` - Financial calculation tests (5 Whys methodology, BDD format)
- `guardrails.test.ts` - Comprehensive content filtering and safety tests

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

## Security & Guardrails

### Safety Features
- **Jailbreak Detection**: 10 regex patterns to catch prompt injection attempts
- **PII Protection**: Detects requests for SSN, bank details, passwords
- **Inappropriate Content**: Blocks profanity, violence, illegal activities
- **Off-topic Detection**: 40+ keywords for redirecting non-financial discussions

### Security Measures
- API keys loaded via environment variables (never exposed in frontend)
- No PII storage - chatbot doesn't persist sensitive data
- Input validation on all user entries with context-specific rules
- 30-second API timeout with 3-retry logic
- Safe AI generation config with built-in content filtering

### Allowed Topics
Savings, investing, retirement, wealth building, budgeting, SwipeSwipe features, projections, debt management, income growth, financial education, recalculation requests

### Blocked Topics
Programming/code, weather, sports, entertainment, politics, medical/legal advice, specific stock picks

## Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| `@google/generative-ai` | ^0.24.1 | Google Gemini AI integration |
| `canvas-confetti` | ^1.9.4 | Celebration animations |
| `framer-motion` | ^12.23.26 | Motion animations |
| `gapi-script` | ^1.2.0 | Google API loader (Docs export) |
| `recharts` | ^3.6.0 | Interactive stacked area charts |
| `react` | >=18.0.0 | UI framework |
| `react-dom` | >=18.0.0 | React DOM rendering |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^4.4.0 | Build tool with HMR |
| `typescript` | ^5.1.0 | Type checking (strict mode) |
| `@vitejs/plugin-react` | ^4.0.0 | React plugin for Vite |
| `jest` | ^29.6.0 | Testing framework |
| `@testing-library/react` | ^14.0.0 | React testing utilities |
| `eslint` | ^8.45.0 | Code linting |
| `prettier` | ^3.0.0 | Code formatting |
| `husky` | ^8.0.0 | Git hooks |
| `lint-staged` | ^14.0.0 | Staged file linting |

### Build Strategy
Code splitting configured in Vite for optimal loading:
- `vendor` chunk: react, react-dom
- `charts` chunk: recharts
- `ai` chunk: @google/generative-ai

## License

MIT License

---

Built with love for SwipeSwipe

**Core Message**: Show average Americans they can become wealthy through consistent saving & investing - it's simple, not complex.
