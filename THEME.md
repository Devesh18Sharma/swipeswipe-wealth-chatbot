# Swipe Theme Documentation

This document outlines the comprehensive theme and design system used across the Swipe web application and browser extension.

## Overview

The Swipe application uses a cohesive color palette centered around a deep blue primary color (`#293A60`) with supporting colors for success, warning, danger, and accent states. The theme emphasizes clarity, accessibility, and a modern financial application aesthetic.

---

## Color Palette

### Primary Colors

**Primary Blue**
- **Main**: `#293A60` - Deep navy blue, used for primary actions, text, and brand elements
- **Light Variant 100**: `#DEEFF2` - Very light blue, used for backgrounds and subtle highlights
- **Light Variant 200**: `#BDE5F6` - Light blue, used for hover states and secondary backgrounds
- **Main Info**: `#23A6F0` - Bright blue, used for informational elements and links
- **Light Info**: `#B2DFF2` - Light info blue, used for info backgrounds

**Usage**: Primary color is the main brand color used for:
- Primary buttons and CTAs
- Main text content
- Navigation elements
- Brand logos and icons
- Key interactive elements

---

### Secondary Colors

**Secondary Gray**
- **Main**: `#F3F6F9` - Light gray-blue, used for secondary backgrounds
- **Contrast Text**: `#949EAB` - Medium gray, used for secondary text and disabled states
- **Text Secondary**: `#879CA8` - Muted blue-gray, used for less prominent text

**Usage**: Secondary colors are used for:
- Secondary buttons
- Background sections
- Disabled states
- Secondary text and labels

---

### Tertiary Colors

**Neutral/Default Palette**
- **100**: `#F9F7F3` - Warm off-white, used for subtle backgrounds
- **200**: `#f1f1f1` - Light gray, used for dividers and borders
- **300**: `#bab9b9` - Medium gray, used for borders
- **400**: `#A6A4A3` - Medium-dark gray
- **500**: `#879CA8` - Blue-gray, used for secondary text

**Usage**: Tertiary colors provide:
- Neutral backgrounds
- Borders and dividers
- Subtle UI elements
- Base layer for cards and containers

---

## Semantic Colors

### Success (Green)

**Success Palette**
- **Main**: `#19B600` - Vibrant green, used for success states and positive actions
- **Light**: `#D4FACE` - Light green, used for success backgrounds
- **Alternative Light 100**: `#DDF2D9` - Softer light green
- **Alternative Light 200**: `#C7E5C2` - Medium-light green
- **Dark**: `#179304` - Dark green, used for emphasis

**Usage**: Success colors indicate:
- Successful transactions
- Positive financial indicators
- Confirmation states
- Achievement badges
- Savings goals progress

---

### Warning (Yellow/Orange)

**Warning Palette**
- **Main**: `#FBC950` - Bright yellow, used for warnings and highlights
- **Light**: `#FFEDCE` - Light yellow, used for warning backgrounds
- **Dark**: `#F4B545` - Darker yellow, used for emphasis
- **Alternative Light 100**: `#F9E9CE` - Warm light yellow
- **Alternative Light 200**: `#F3D58A` - Medium-light yellow
- **Dark Alternative**: `#C27D0F` - Dark orange-brown

**Usage**: Warning colors indicate:
- Caution states
- Budget warnings
- Important notifications
- Pending actions

---

### Danger/Error (Red/Pink)

**Danger Palette**
- **Main Red**: `#DD2A11` - Bright red, used for errors and critical actions
- **Pink Main**: `#EF5DA8` - Pink, used for danger states
- **Light 100**: `#FCDDEC` - Light pink, used for error backgrounds
- **Light 200**: `#f387be` - Medium-light pink

**Usage**: Danger colors indicate:
- Errors and failures
- Critical warnings
- Delete actions
- Budget exceeded states
- Negative financial indicators

---

### Orange (Accent)

**Orange Palette**
- **Main**: `#F5692B` - Vibrant orange, used for accent actions
- **Light**: `#FADBC9` - Light orange, used for orange backgrounds
- **Dark**: `rgba(245, 105, 43, 0.9)` - Semi-transparent dark orange

**Usage**: Orange colors are used for:
- Accent buttons
- Special highlights
- Secondary CTAs
- Progress indicators (medium state)

---

### Accent (Purple)

**Accent Palette**
- **100**: `#CDCDFF` - Light purple, used for subtle accents
- **200**: `#8a8ce6` - Medium purple
- **300**: `#5D5FEF` - Vibrant purple, used for accent elements

**Usage**: Accent colors provide:
- Special highlights
- Feature badges
- Premium indicators
- Visual variety

---

## Brand-Specific Colors

### Swipe Yellow
- **Color**: `#fbc950` - The signature Swipe brand color
- **Usage**: Used for:
  - Brand highlights
  - Special features
  - Logo elements
  - Key UI highlights

---

## Background Colors

### Surface Colors

**Web Application**
- **Default Background**: `#FAFAFA` - Light gray, main application background
- **Card Background**: `#FFFFFF` - White, used for cards and elevated surfaces
- **AppBar Background**: `#FAFAFA` - Matches default background

**Extension**
- **Surface A**: `#ffffff` - Primary surface (white)
- **Surface B**: `#f8f9fa` - Secondary surface (very light gray)
- **Surface C**: `#e9ecef` - Tertiary surface (light gray)
- **Surface Ground**: `#eff3f8` - Ground surface (light blue-gray)
- **Surface Section**: `#ffffff` - Section background
- **Surface Card**: `#ffffff` - Card background
- **Surface Overlay**: `#ffffff` - Overlay background

---

## Text Colors

### Primary Text
- **Color**: `#293A60` - Deep blue, matches primary color
- **Usage**: Main content text, headings, important labels

### Secondary Text
- **Color**: `#879CA8` - Muted blue-gray
- **Usage**: Supporting text, descriptions, less important information

### Tertiary Text
- **Color**: `#949EAB` - Medium gray
- **Usage**: Disabled text, placeholders, subtle labels

---

## Gradients

### Primary Gradient
```css
linear-gradient(180deg, #F9F7F3 23.56%, #E5F0F5 100%)
```
- **Usage**: Background gradients for hero sections, cards, and special containers

### Success Gradient
```css
linear-gradient(180deg, #F9F7F3 23.56%, #DDF2D9 100%)
```
- **Usage**: Success-themed sections, achievement cards, positive indicators

---

## Typography

### Font Family
- **Primary Font**: `Libre Franklin`
- **Fallback**: System fonts (`-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif`)

### Font Files
- **Location**: `swipe-extension/src/assets/fonts/LibreFranklin-Medium.ttf`
- **Weight**: Medium (500)

---

## Component-Specific Colors

### Buttons

**Primary Button**
- Background: `#293A60` (Primary Blue)
- Text: `#FFFFFF` (White)

**Secondary Button**
- Background: `#F3F6F9` (Secondary Gray)
- Text: `#949EAB` (Contrast Text)

**Info Button (Outlined Filled)**
- Background: `#B2DFF2` (Info Light)
- Border: `#23A6F0` (Info Main)
- Text: `#293A60` (Primary)

**Success Button (Outlined Filled)**
- Background: `#D4FACE` (Success Light)
- Border: `#19B600` (Success Main)
- Text: `#293A60` (Primary)

**Warning Button (Outlined Filled)**
- Background: `#FFEDCE` (Warning Light)
- Border: `#FBC950` (Warning Main)
- Text: `#293A60` (Primary)

**Orange Button**
- Background: `#F5692B` (Orange Main)
- Text: `#FFFFFF` (White)

---

### Form Elements

**Select Background**
- Color: `#D4EDF8` - Light blue background for select inputs

**Progress Bar**
- Background: `#DEEFF2` - Light blue for progress bar track
- Height: `10px`
- Border Radius: `5px`

---

## Color Utilities

### Color Enums (TypeScript)

Both applications use consistent color enums:

```typescript
export enum Colors {
    Blue = '#293A60',
    LightBlue = '#DEEFF2',
    Green = '#19B600',
    LightOrange = '#FADBC9',
    Orange = '#F5692B',
    Red = '#DD2A11',
    Gray = '#EAEAEA',
    White = '#FFFFFF',
    SecondGray = '#949EAB',
}
```

### Color Functions

**Percentage-Based Colors**
- High threshold (≥80%): Red (`#DD2A11`)
- Medium threshold (50-80%): Orange (`#F5692B`)
- Low threshold (<50%): Green (`#19B600`)

**Depletion-Based Colors**
- Low remaining (≤20%): Red
- Medium remaining (20-50%): Orange
- High remaining (>50%): Green

---

## CSS Variables

### Web Application Variables

Located in `swipe-web-application/src/index.css`:

```css
--color-dark: #293A60
--color-primary-100: #DEEFF2
--color-primary-200: #BDE5F6
--color-primary-300: #23A6F0
--color-success-100: #DDF2D9
--color-success-200: #C7E5C2
--color-success-300: #179304
--color-danger-100: #FCDDEC
--color-danger-200: #f387be
--color-danger-300: #EF5DA8
--color-warning-100: #F9E9CE
--color-warning-200: #F3D58A
--color-warning-300: #C27D0F
--color-accent-100: #CDCDFF
--color-accent-200: #8a8ce6
--color-accent-300: #5D5FEF
--color-swipe: #fbc950
```

### Extension Variables

Located in `swipe-extension/src/assets/theme.css`:

```css
--primary-color: #293a60
--text-color: #293a60
--text-color-secondary: #949eab
--surface-a: #ffffff
--surface-b: #f8f9fa
--surface-ground: #eff3f8
```

---

## Material-UI Theme Configuration

The web application uses Material-UI (MUI) with a custom theme configuration:

**Location**: `swipe-web-application/src/theme/AppTheme.tsx`

**Key Configuration**:
- Mode: `light`
- Primary: `#293A60`
- Secondary: `#F3F6F9` with contrast text `#949EAB`
- Background: `#FAFAFA`
- Custom color: `orange` (`#F5692B`)

---

## Design Principles

### Color Usage Guidelines

1. **Primary Blue (`#293A60`)** should be used for:
   - Main brand elements
   - Primary actions
   - Important text
   - Navigation

2. **Success Green (`#19B600`)** should be used for:
   - Positive financial indicators
   - Successful transactions
   - Achievement states
   - Savings progress

3. **Warning Yellow (`#FBC950`)** should be used for:
   - Budget warnings
   - Important notifications
   - Pending states
   - Caution indicators

4. **Danger Red/Pink** should be used for:
   - Errors
   - Critical warnings
   - Delete actions
   - Budget exceeded

5. **Orange (`#F5692B`)** should be used for:
   - Accent actions
   - Secondary CTAs
   - Medium-priority indicators

6. **Neutral Grays** should be used for:
   - Backgrounds
   - Borders
   - Disabled states
   - Secondary information

---

## Accessibility Considerations

- **Contrast Ratios**: All text colors meet WCAG AA standards when used with their designated backgrounds
- **Color Blindness**: The palette uses both color and visual patterns (icons, shapes) to convey information
- **Focus States**: Interactive elements have clear focus indicators using primary or accent colors

---

## Implementation Notes

### Web Application (`swipe-web-application`)
- Uses Material-UI theme system
- CSS variables defined in `src/index.css`
- Color utilities in `src/utilites/colorUtils.ts`
- Theme configuration in `src/theme/` directory

### Extension (`swipe-extension`)
- Uses PrimeReact theme system
- CSS variables in `src/assets/theme.css` and `src/assets/prime-theme.css`
- Color utilities in `src/common/utilities/color.utils.ts`
- Styled components support

---

## Quick Reference

| Category | Color | Hex Code | Usage |
|----------|-------|----------|-------|
| **Primary** | Deep Blue | `#293A60` | Main brand, primary actions |
| **Secondary** | Light Gray | `#F3F6F9` | Secondary backgrounds |
| **Tertiary** | Off-White | `#F9F7F3` | Subtle backgrounds |
| **Success** | Green | `#19B600` | Positive states |
| **Warning** | Yellow | `#FBC950` | Warnings, highlights |
| **Danger** | Red | `#DD2A11` | Errors, critical |
| **Orange** | Orange | `#F5692B` | Accent actions |
| **Info** | Blue | `#23A6F0` | Information, links |
| **Swipe** | Yellow | `#fbc950` | Brand highlight |
| **Text Primary** | Deep Blue | `#293A60` | Main text |
| **Text Secondary** | Blue-Gray | `#879CA8` | Secondary text |
| **Background** | Light Gray | `#FAFAFA` | Main background |

---

*Last Updated: Based on codebase analysis of swipe-web-application and swipe-extension*

