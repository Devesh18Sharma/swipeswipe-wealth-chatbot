# How Rich Can You Get - Implementation Game Plan

**Version:** 1.0.0
**Last Updated:** January 2026
**Status:** Production Ready
**Branch:** develop

---

## Executive Summary

"How Rich Can You Get" powered by SwipeSwipe is a production-ready, AI-powered wealth visualization tool that inspires average Americans to believe they can become wealthy through consistent saving and investing.

### Core Vision
> "Show average Americans they can become wealthy through consistent saving & investing over time - make it simple, not complex."

### Key Features (Implemented)
1. **Prominent Wealth Number** - Giant animated hero display with confetti celebration
2. **Stacked Area Chart** - Deep Blue base + Golden Yellow SwipeSwipe contribution on top
3. **SwipeSwipe Brand Theme** - Deep Blue (#293A60) + Golden Yellow (#FBC950)
4. **Gemini AI Integration** - Google Gemini 1.5 Flash for intelligent responses
5. **Google Docs Export** - Beautiful branded reports with clickable website & extension links
6. **Age 90 Projections** - Chart starts from current age and projects until age 90
7. **Two-Phase Financial Model** - 11% pre-retirement, 6% post-retirement returns
8. **Delightful Animations** - Confetti, counting animations, and celebrations
9. **Dark Mode Support** - Automatic theme based on system preference

---

## Technical Stack

```
React 18.2 + TypeScript 5.1
├── Vite 4.4 (build tool with code splitting)
├── Google Gemini API (@google/generative-ai ^0.24.1)
├── Recharts 3.6 (stacked area charts)
├── Framer Motion 12.23 (animations)
├── canvas-confetti 1.9 (celebrations)
├── Google Docs API via gapi-script (export)
└── CSS Variables (SwipeSwipe theme + dark mode)
```

### Build Optimization
- **Code Splitting**: Vendor/charts/AI chunks for optimal loading
- **Source Maps**: Disabled in production
- **Dev Server**: Port 5173 with auto-open

### Key Configuration

**Two-Phase Financial Model:**
| Phase | Age Range | Return Rate | Contributions |
|-------|-----------|-------------|---------------|
| Pre-Retirement | Until 70 | 11% | Work + SwipeSwipe |
| Post-Retirement | 70+ | 6% | SwipeSwipe only |

- **Life Expectancy:** 90 years (all projections go to age 90)
- **Compounding:** Monthly
- **Milestone Years:** 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70 (starts from year 0)
- **Max Projection:** 70 years (dynamic based on user age to reach 90)

---

## Component Architecture

### Core Components

```
src/
├── App.tsx                         # Main app entry (renders WealthChatbot)
├── main.tsx                        # React DOM entry point
├── index.ts                        # Library exports (public API)
├── index.css                       # Global styles
├── components/
│   ├── WealthChatbot.tsx           # Main chatbot (757 lines) - 6-stage flow
│   ├── WealthChatbot.css           # SwipeSwipe themed styles + dark mode
│   ├── HeroWealthDisplay.tsx       # Giant animated wealth number + confetti
│   ├── WealthChart.tsx             # Stacked area chart (Blue + Yellow)
│   ├── WealthProjectionChart.tsx   # Alternative SVG chart component
│   └── AnimatedNumber.tsx          # Reusable number counting animation
├── services/
│   ├── geminiService.ts            # Google Gemini AI (186 lines)
│   └── googleDocsService.ts        # Google Docs export (746 lines)
├── utils/
│   ├── calculations.ts             # Two-phase financial calculations (451 lines)
│   ├── guardrails.ts               # Topic filters + AI safety (506 lines)
│   ├── inputParser.ts              # Natural language input parsing
│   ├── animations.ts               # Confetti celebrations + easing functions
│   └── swipeswipeCalculator.ts     # Income-based savings calculator
├── types/
│   └── index.ts                    # TypeScript definitions (230 lines)
├── constants/
│   └── index.ts                    # System prompt, config, error messages
└── __tests__/
    ├── calculations.test.ts        # Financial calculation tests
    └── guardrails.test.ts          # Content filtering tests
```

---

## Color System

### Chart Colors (Stacked Area Design)
```css
/* Base Investment Area */
--chart-base: #293A60;           /* Deep Blue - Your Investment */

/* SwipeSwipe Contribution Area (stacked on top) */
--chart-contribution: #FBC950;   /* Golden Yellow - SwipeSwipe Adds */
```

### UI Colors
```css
:root {
  /* Primary Brand Colors */
  --brand-primary: #293A60;        /* Deep Blue - main brand */
  --brand-primary-dark: #1a2640;   /* Darker shade */
  --brand-primary-light: #DEEFF2;  /* Light blue - Key Insight box */

  /* Accent Colors */
  --brand-accent: #FBC950;         /* Golden Yellow - SwipeSwipe contribution */
  --brand-accent-dark: #F4B545;    /* Darker yellow */
  --brand-accent-light: #FEF3D9;   /* Light golden for backgrounds */

  /* Semantic Colors */
  --color-success: #19B600;        /* Positive states */
  --color-success-light: #D4FACE;
  --color-warning: #FBC950;
  --color-danger: #DD2A11;
  --color-info: #23A6F0;
  --color-info-light: #B2DFF2;

  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --bg-tertiary: #F3F6F9;

  /* Text Colors */
  --text-primary: #293A60;
  --text-secondary: #879CA8;
  --text-muted: #949EAB;
}
```

---

## Chart Visual Design

The wealth chart uses a **stacked area design** inspired by SwipeSwipe's existing calculators:

### Visual Hierarchy
1. **Deep Blue (#293A60)** - "Your Investment" (base layer)
   - Represents investment growth without SwipeSwipe
   - Solid, trustworthy foundation color

2. **Golden Yellow (#FBC950)** - "SwipeSwipe Adds" (stacked on top)
   - Represents the additional value SwipeSwipe contributes
   - Vibrant, attention-grabbing highlight
   - Clearly shows the "bonus" users get

### Chart Elements
- **Legend**: Blue square + Yellow square with labels
- **"SwipeSwipe adds" box**: Golden yellow background with contribution amount
- **"Key Insight" box**: Light blue background (#DEEFF2) - differentiated from yellow
- **Tooltip**: Shows total, base investment, and SwipeSwipe contribution breakdown

---

## SwipeSwipe Savings by Income

| Annual Income | Monthly SwipeSwipe Savings |
|---------------|----------------------------|
| < $50,000     | $75/month                  |
| $50K - $100K  | $100/month                 |
| $100K - $150K | $150/month                 |
| $150K - $200K | $200/month                 |
| $200K - $300K | $350/month                 |
| > $300K       | $500/month                 |

---

## User Flow (6 Stages)

| Stage | State Name | Action |
|-------|------------|--------|
| 1 | `greeting` | "How rich can you get powered by SwipeSwipe" |
| 2 | `age` | Collect user's current age (18-100) |
| 3 | `income` | Auto-calculate SwipeSwipe savings based on income bracket |
| 4 | `currentSavings` | Collect existing savings/investments |
| 5 | `monthlyInvestment` | How much they invest monthly |
| 6 | `projection`/`freeChat` | Display results + AI-powered Q&A |

**Projection Display includes:**
- Stacked Area Chart (Deep Blue base + Golden Yellow contribution)
- Hero Wealth Display (animated, confetti celebration)
- Golden yellow SwipeSwipe contribution badge with monthly breakdown
- Special millionaire celebration for $1M+ projections

---

## Two-Phase Calculation Model

The chatbot uses a sophisticated two-phase calculation that reflects realistic retirement scenarios:

### Phase 1: Pre-Retirement (Age < 70)
- **Return Rate:** 11% (S&P 500 historical average)
- **Contributions:** Work savings + SwipeSwipe savings
- **Compounding:** Monthly

### Phase 2: Post-Retirement (Age 70+)
- **Return Rate:** 6% (Conservative allocation)
- **Contributions:** SwipeSwipe savings only (no work income)
- **Compounding:** Monthly

This model accounts for:
- Higher growth potential during working years
- More conservative allocation after retirement
- Continued SwipeSwipe savings habit even in retirement
- Realistic 90-year life expectancy

---

## Google Docs Export

The export creates a beautiful branded report with:
- "How rich can you get - powered by SwipeSwipe" header
- Clickable website link (https://swipeswipe.co/)
- Chrome extension download link (clickable)
- Giant wealth number display
- Detailed year-by-year breakdown table
- Key insights section
- Assumptions and disclaimer

---

## Environment Variables

```env
# Required: Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional: Google Docs Export
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key

# Legacy: OpenAI (deprecated, kept for fallback)
VITE_OPENAI_API_KEY=your_openai_key
```

---

## Guardrails & Safety

### Allowed Topics (11 categories with keyword + regex patterns)
- Savings & investing
- Retirement planning
- Wealth building
- Budgeting
- SwipeSwipe features
- Projection calculations
- Debt management
- Income growth
- Financial education
- Recalculation requests

### Blocked Topics (40+ off-topic keywords detected)
- Programming/code
- Weather
- Sports
- Entertainment
- Politics
- Medical/legal advice
- Specific stock picks
- Food/cooking
- Travel
- Relationships
- Academics

### Safety Features
| Feature | Implementation |
|---------|----------------|
| **Jailbreak Detection** | 10 regex patterns for prompt injection attempts |
| **PII Protection** | Detects SSN, bank details, password requests |
| **Inappropriate Content** | Blocks profanity, violence, illegal activities |
| **Off-topic Detection** | 40+ keywords with category classification |
| **Input Validation** | Context-specific validation (age 18-100, income up to $100M) |
| **API Safety** | 30-second timeout, 3-retry logic, fallback responses |
| **Gemini Safety Settings** | Blocks harassment, hate speech, explicit, dangerous content |

---

## Testing Checklist

### Visual Testing
- [x] SwipeSwipe blue (#293A60) applied to header and base chart area
- [x] Golden yellow (#FBC950) on SwipeSwipe contribution area
- [x] Hero number is unmissable and animated
- [x] Stacked area chart draws smoothly with tooltips working
- [x] Confetti fires on projection reveal
- [x] Return rate badges visible on chart header
- [x] Key Insight box has light blue background (differentiated)
- [x] SwipeSwipe adds box has golden yellow background
- [x] Responsive on mobile (375px+)
- [x] Dark mode works correctly

### Functional Testing
- [x] 6-stage flow works: greeting → age → income → savings → investment → projection/chat
- [x] SwipeSwipe savings auto-calculated correctly by income bracket
- [x] Chart starts from current age (year 0) to age 90
- [x] Gemini AI responds appropriately with safety settings
- [x] Google Docs export generates correct document with clickable links
- [x] Two-phase calculation works (11% → 6% at age 70)
- [x] Life expectancy calculation works (90 - age)
- [x] Milestone year calculations correct
- [x] Guardrails filter off-topic questions with category detection
- [x] Input parser handles natural language ("around 50k", "roughly $75,000")

### Automated Testing
- **Framework**: Jest with ts-jest preset
- **Environment**: jsdom (browser simulation)
- **Coverage Threshold**: 80% (branches, functions, lines, statements)
- **Test Suites**:
  - `calculations.test.ts` - Financial calculation tests (5 Whys methodology, BDD format)
  - `guardrails.test.ts` - Comprehensive content filtering and safety tests

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to Projection | < 2 minutes |
| User Engagement | 80%+ complete flow |
| Emotional Response | "I can do this!" feeling |
| Export Usage | 30%+ users export results |
| Mobile Experience | Fully functional on phones |

---

## Key Implementation Details

### Chart Data Structure
```typescript
// Stacked area chart data
const chartData = years.map(year => ({
  year,
  base: withoutSwipeSwipe[year],           // Deep Blue area
  swipeswipeContribution: contribution[year], // Golden Yellow area (stacked)
  withSwipeSwipe: base + contribution,      // Total
}));
```

### Input Parsing
- Accepts natural language: "around $50k", "fifty thousand", "50000"
- Context-aware validation based on field type
- Helpful error messages with specific guidance

### Millionaire Celebration
- Extra confetti burst when projection exceeds $1M
- Special gradient styling on wealth amount
- Celebration message in hero display
- Yellow millionaire badge in Key Insight box

### Responsive Design
- Mobile-first approach
- Max width 900px (1000px on large screens)
- Flexbox layout for flexibility
- Custom scrollbar styling
- Message bubbles adapt to screen size

---

## Summary

The SwipeSwipe Wealth Chatbot delivers an inspiring, visually stunning experience that:

1. **Makes the wealth number unmissable** - Giant, animated, celebratory (with millionaire special effects)
2. **Tells a story with the chart** - Stacked areas clearly show SwipeSwipe's impact
3. **Applies SwipeSwipe brand** - Deep blue base + golden yellow contribution throughout
4. **Delights with animations** - Confetti, counting, glow effects (canvas-confetti + framer-motion)
5. **Enables beautiful sharing** - Google Docs with full branding and clickable links
6. **Uses smart AI** - Gemini 1.5 Flash for intelligent, cost-efficient, on-topic responses
7. **Models realistic scenarios** - Two-phase returns (11% → 6%) based on age 70 retirement
8. **Ensures safety** - Comprehensive guardrails with jailbreak/PII/off-topic detection
9. **Parses naturally** - Smart input parsing ("around 50k", "roughly $75,000")

**The goal:** When users see their projection, they feel "Wow, I can actually become wealthy. This is simple and achievable."

---

## Recent Changes

| Commit | Description |
|--------|-------------|
| cb39c72 | Changes to message display and Google Docs export |
| 0ba8f5c | Calculation fixes and documentation updates |
| d50cd80 | UI and production changes |
| a67c198 | UI changes and documentation updates |
| 1fca70a | Add Vite env types for TypeScript |

---

*Last Updated: January 2026*
