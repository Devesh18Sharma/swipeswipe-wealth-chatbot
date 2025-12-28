/**
 * Google Docs Export Service
 * Creates beautiful, branded wealth projection reports in Google Docs
 * Uses proper Google Docs API formatting for professional appearance
 */

import { WealthProjection, UserFinancialData } from '../types';
import { formatCurrency } from '../utils/calculations';

// Google API configuration
const SCOPES = 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOCS = [
  'https://docs.googleapis.com/$discovery/rest?version=v1',
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

// SwipeSwipe Links
const SWIPESWIPE_WEBSITE = 'https://swipeswipe.co/';
const CHROME_EXTENSION_LINK = 'https://chromewebstore.google.com/detail/swipeswipe/jmephhldhjnmcmmnmgoiibamhgeoolbl?utm_source=ext_app_menu';

// 11% return rate constant
const ANNUAL_RETURN_RATE = 11;

// SwipeSwipe Brand Colors (from THEME.md)
const COLORS = {
  primary: { red: 0.161, green: 0.227, blue: 0.376 },      // #293A60 - Deep Blue
  primaryLight: { red: 0.871, green: 0.937, blue: 0.949 }, // #DEEFF2 - Light Blue
  accent: { red: 0.984, green: 0.788, blue: 0.314 },       // #FBC950 - Swipe Yellow
  accentLight: { red: 1.0, green: 0.929, blue: 0.808 },    // #FFEDCE - Light Yellow
  success: { red: 0.098, green: 0.714, blue: 0.0 },        // #19B600 - Success Green
  successLight: { red: 0.831, green: 0.980, blue: 0.808 }, // #D4FACE - Light Green
  white: { red: 1.0, green: 1.0, blue: 1.0 },
  lightGray: { red: 0.973, green: 0.965, blue: 0.953 },    // #F9F7F3 - Off-white
  textSecondary: { red: 0.529, green: 0.612, blue: 0.659 }, // #879CA8
};

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

let gapiInitialized = false;
let tokenClient: any = null;

/**
 * Initialize Google API client
 */
export async function initializeGoogleAPI(clientId: string, apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: DISCOVERY_DOCS,
          });
          gapiInitialized = true;

          const gisScript = document.createElement('script');
          gisScript.src = 'https://accounts.google.com/gsi/client';
          gisScript.onload = () => {
            tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: SCOPES,
              callback: '',
            });
            resolve();
          };
          gisScript.onerror = reject;
          document.body.appendChild(gisScript);
        } catch (error) {
          reject(error);
        }
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

/**
 * Request user authorization
 */
export function requestAuthorization(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Google API not initialized'));
      return;
    }

    tokenClient.callback = (response: any) => {
      if (response.error) {
        reject(new Error(response.error));
        return;
      }
      resolve();
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
}

/**
 * Check if user is signed in
 */
export function isSignedIn(): boolean {
  return gapiInitialized && window.gapi?.client?.getToken() !== null;
}

/**
 * Sign out user
 */
export function signOut(): void {
  const token = window.gapi.client.getToken();
  if (token !== null) {
    window.google.accounts.oauth2.revoke(token.access_token);
    window.gapi.client.setToken(null);
  }
}

/**
 * Create a wealth projection document in Google Docs with beautiful formatting
 */
export async function createWealthProjectionDoc(
  projection: WealthProjection,
  userData: UserFinancialData,
  companyName: string = 'SwipeSwipe'
): Promise<string> {
  if (!isSignedIn()) {
    await requestAuthorization();
  }

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate years based on 88 life expectancy
  const LIFE_EXPECTANCY = 88;
  const yearsToShow = Math.min(35, Math.max(5, LIFE_EXPECTANCY - userData.age));
  const milestoneYear = [5, 10, 15, 20, 25, 30, 35].reduce((prev, curr) =>
    Math.abs(curr - yearsToShow) < Math.abs(prev - yearsToShow) ? curr : prev
  );

  const finalWealth = projection.withSwipeSwipe[milestoneYear];
  const swipeContribution = projection.swipeswipeContribution[milestoneYear];
  const wealthWithoutSS = projection.withoutSwipeSwipe[milestoneYear];
  const isMillionaire = finalWealth >= 1000000;
  const totalMonthly = userData.monthlyInvestment + userData.swipeswipeSavings;

  // Create the document
  const createResponse = await window.gapi.client.docs.documents.create({
    title: `${companyName} Wealth Projection - ${today}`,
  });

  const documentId = createResponse.result.documentId;

  // Build document content and formatting requests
  const requests: any[] = [];
  let currentIndex = 1;

  // Helper function to add text and track index
  const addText = (text: string) => {
    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: text,
      },
    });
    const startIndex = currentIndex;
    currentIndex += text.length;
    return { startIndex, endIndex: currentIndex };
  };

  // Helper function to format text
  const formatText = (startIndex: number, endIndex: number, style: any) => {
    requests.push({
      updateTextStyle: {
        range: { startIndex, endIndex },
        textStyle: style,
        fields: Object.keys(style).join(','),
      },
    });
  };

  // Helper function to format paragraph
  const formatParagraph = (startIndex: number, endIndex: number, style: any) => {
    requests.push({
      updateParagraphStyle: {
        range: { startIndex, endIndex },
        paragraphStyle: style,
        fields: Object.keys(style).join(','),
      },
    });
  };

  // ============================================================================
  // HEADER SECTION
  // ============================================================================

  // Brand name
  const headerRange = addText('SWIPESWIPE\n');
  formatText(headerRange.startIndex, headerRange.endIndex - 1, {
    bold: true,
    fontSize: { magnitude: 28, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(headerRange.startIndex, headerRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 6, unit: 'PT' },
  });

  // Tagline
  const taglineRange = addText('Your Partner in Building Wealth\n');
  formatText(taglineRange.startIndex, taglineRange.endIndex - 1, {
    fontSize: { magnitude: 12, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });
  formatParagraph(taglineRange.startIndex, taglineRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 4, unit: 'PT' },
  });

  // Website link
  const websiteRange = addText(`${SWIPESWIPE_WEBSITE}\n`);
  formatText(websiteRange.startIndex, websiteRange.endIndex - 1, {
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.accent } },
    link: { url: SWIPESWIPE_WEBSITE },
    underline: true,
  });
  formatParagraph(websiteRange.startIndex, websiteRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 20, unit: 'PT' },
  });

  // Divider line
  const divider1 = addText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
  formatText(divider1.startIndex, divider1.endIndex - 2, {
    foregroundColor: { color: { rgbColor: COLORS.accent } },
  });
  formatParagraph(divider1.startIndex, divider1.endIndex, {
    alignment: 'CENTER',
  });

  // ============================================================================
  // TITLE SECTION
  // ============================================================================

  const titleRange = addText('PERSONALIZED WEALTH PROJECTION REPORT\n');
  formatText(titleRange.startIndex, titleRange.endIndex - 1, {
    bold: true,
    fontSize: { magnitude: 18, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(titleRange.startIndex, titleRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 8, unit: 'PT' },
  });

  const dateRange = addText(`Generated: ${today}\n\n`);
  formatText(dateRange.startIndex, dateRange.endIndex - 2, {
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });
  formatParagraph(dateRange.startIndex, dateRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 24, unit: 'PT' },
  });

  // ============================================================================
  // HERO WEALTH SECTION
  // ============================================================================

  const heroTitleRange = addText('💰  YOUR FUTURE WEALTH  💰\n\n');
  formatText(heroTitleRange.startIndex, heroTitleRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 16, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(heroTitleRange.startIndex, heroTitleRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 12, unit: 'PT' },
  });

  // Giant wealth number
  const wealthRange = addText(`${formatCurrency(finalWealth)}\n`);
  formatText(wealthRange.startIndex, wealthRange.endIndex - 1, {
    bold: true,
    fontSize: { magnitude: 48, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.success } },
  });
  formatParagraph(wealthRange.startIndex, wealthRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 8, unit: 'PT' },
  });

  // Timeline text
  const timelineRange = addText(`In ${milestoneYear} years, at age ${userData.age + milestoneYear}\n\n`);
  formatText(timelineRange.startIndex, timelineRange.endIndex - 2, {
    fontSize: { magnitude: 14, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });
  formatParagraph(timelineRange.startIndex, timelineRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 16, unit: 'PT' },
  });

  // Millionaire celebration
  if (isMillionaire) {
    const celebrationRange = addText('🎉  CONGRATULATIONS! You could become a MILLIONAIRE!  🎉\n\n');
    formatText(celebrationRange.startIndex, celebrationRange.endIndex - 2, {
      bold: true,
      fontSize: { magnitude: 14, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.accent } },
      backgroundColor: { color: { rgbColor: COLORS.primary } },
    });
    formatParagraph(celebrationRange.startIndex, celebrationRange.endIndex, {
      alignment: 'CENTER',
      spaceBelow: { magnitude: 20, unit: 'PT' },
    });
  }

  // ============================================================================
  // SWIPESWIPE IMPACT SECTION
  // ============================================================================

  const impactHeaderRange = addText('⭐  SWIPESWIPE IMPACT  ⭐\n\n');
  formatText(impactHeaderRange.startIndex, impactHeaderRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 16, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(impactHeaderRange.startIndex, impactHeaderRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 12, unit: 'PT' },
  });

  // Impact comparison - using styled text blocks
  const withoutSSRange = addText(`Without ${companyName}:    `);
  formatText(withoutSSRange.startIndex, withoutSSRange.endIndex, {
    fontSize: { magnitude: 12, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });

  const withoutSSValueRange = addText(`${formatCurrency(wealthWithoutSS)}\n`);
  formatText(withoutSSValueRange.startIndex, withoutSSValueRange.endIndex - 1, {
    bold: true,
    fontSize: { magnitude: 14, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const withSSRange = addText(`With ${companyName}:          `);
  formatText(withSSRange.startIndex, withSSRange.endIndex, {
    fontSize: { magnitude: 12, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });

  const withSSValueRange = addText(`${formatCurrency(finalWealth)}\n\n`);
  formatText(withSSValueRange.startIndex, withSSValueRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 14, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.success } },
  });

  // Highlight the contribution
  const bonusLabelRange = addText(`${companyName.toUpperCase()} ADDS:   `);
  formatText(bonusLabelRange.startIndex, bonusLabelRange.endIndex, {
    bold: true,
    fontSize: { magnitude: 14, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.accent } },
  });

  const bonusValueRange = addText(`+${formatCurrency(swipeContribution)}\n\n`);
  formatText(bonusValueRange.startIndex, bonusValueRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 18, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.success } },
  });

  formatParagraph(withoutSSRange.startIndex, bonusValueRange.endIndex, {
    alignment: 'CENTER',
    lineSpacing: 150,
  });

  const impactNoteRange = addText(`That's an extra ${formatCurrency(swipeContribution)} in your pocket by controlling impulse spending with ${companyName}!\n\n`);
  formatText(impactNoteRange.startIndex, impactNoteRange.endIndex - 2, {
    italic: true,
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });
  formatParagraph(impactNoteRange.startIndex, impactNoteRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 24, unit: 'PT' },
  });

  // ============================================================================
  // YOUR PROFILE SECTION
  // ============================================================================

  const profileHeaderRange = addText('📊  YOUR PROFILE\n\n');
  formatText(profileHeaderRange.startIndex, profileHeaderRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 16, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(profileHeaderRange.startIndex, profileHeaderRange.endIndex, {
    alignment: 'START',
    spaceBelow: { magnitude: 8, unit: 'PT' },
  });

  // Profile details as formatted list
  const profileItems = [
    ['Current Age', `${userData.age} years`],
    ['Annual Income', formatCurrency(userData.annualIncome)],
    ['Current Savings', formatCurrency(userData.currentSavings)],
    ['Your Monthly Investment', formatCurrency(userData.monthlyInvestment)],
    [`${companyName} Monthly Savings`, formatCurrency(userData.swipeswipeSavings)],
    ['TOTAL MONTHLY', formatCurrency(totalMonthly)],
  ];

  for (let i = 0; i < profileItems.length; i++) {
    const [label, value] = profileItems[i];
    const isTotal = i === profileItems.length - 1;

    const labelRange = addText(`${label}:  `);
    formatText(labelRange.startIndex, labelRange.endIndex, {
      fontSize: { magnitude: isTotal ? 12 : 11, unit: 'PT' },
      foregroundColor: { color: { rgbColor: isTotal ? COLORS.primary : COLORS.textSecondary } },
      bold: isTotal,
    });

    const valueRange = addText(`${value}\n`);
    formatText(valueRange.startIndex, valueRange.endIndex - 1, {
      fontSize: { magnitude: isTotal ? 14 : 12, unit: 'PT' },
      foregroundColor: { color: { rgbColor: isTotal ? COLORS.success : COLORS.primary } },
      bold: isTotal,
    });

    formatParagraph(labelRange.startIndex, valueRange.endIndex, {
      indentFirstLine: { magnitude: 36, unit: 'PT' },
      lineSpacing: isTotal ? 200 : 150,
    });
  }

  addText('\n');

  // ============================================================================
  // WEALTH GROWTH TABLE SECTION
  // ============================================================================

  const tableHeaderRange = addText(`📈  WEALTH GROWTH OVER TIME (${ANNUAL_RETURN_RATE}% Annual Return)\n\n`);
  formatText(tableHeaderRange.startIndex, tableHeaderRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 16, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(tableHeaderRange.startIndex, tableHeaderRange.endIndex, {
    alignment: 'START',
    spaceBelow: { magnitude: 12, unit: 'PT' },
  });

  // Milestone years for projection breakdown
  const years = [5, 10, 15, 20, 25, 30, 35];

  // Create a beautiful styled table with proper formatting

  // Table header
  const tHeaderRow = addText(`  YEAR     WITHOUT ${companyName.toUpperCase().substring(0, 10)}     WITH ${companyName.toUpperCase().substring(0, 10)}       ${companyName.toUpperCase()} BONUS\n`);
  formatText(tHeaderRow.startIndex, tHeaderRow.endIndex - 1, {
    bold: true,
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.white } },
    backgroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(tHeaderRow.startIndex, tHeaderRow.endIndex, {
    lineSpacing: 150,
  });

  // Table separator
  const tSep = addText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  formatText(tSep.startIndex, tSep.endIndex - 1, {
    foregroundColor: { color: { rgbColor: COLORS.primary } },
    fontSize: { magnitude: 8, unit: 'PT' },
  });

  // Table rows
  years.forEach((year, idx) => {
    const withoutSS = formatCurrency(projection.withoutSwipeSwipe[year]).padStart(14);
    const withSS = formatCurrency(projection.withSwipeSwipe[year]).padStart(14);
    const bonus = `+${formatCurrency(projection.swipeswipeContribution[year])}`.padStart(16);

    const rowText = `  Year ${year.toString().padEnd(4)}  ${withoutSS}      ${withSS}     ${bonus}\n`;
    const rowRange = addText(rowText);

    const isEven = idx % 2 === 0;
    formatText(rowRange.startIndex, rowRange.endIndex - 1, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.primary } },
      backgroundColor: { color: { rgbColor: isEven ? COLORS.lightGray : COLORS.white } },
    });
    formatParagraph(rowRange.startIndex, rowRange.endIndex, {
      lineSpacing: 150,
    });
  });

  // Bottom border
  const tBottomBorder = addText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
  formatText(tBottomBorder.startIndex, tBottomBorder.endIndex - 2, {
    foregroundColor: { color: { rgbColor: COLORS.primary } },
    fontSize: { magnitude: 8, unit: 'PT' },
  });

  // ============================================================================
  // KEY INSIGHTS SECTION
  // ============================================================================

  const insightsHeaderRange = addText('💡  KEY INSIGHTS\n\n');
  formatText(insightsHeaderRange.startIndex, insightsHeaderRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 16, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(insightsHeaderRange.startIndex, insightsHeaderRange.endIndex, {
    alignment: 'START',
    spaceBelow: { magnitude: 8, unit: 'PT' },
  });

  const insights = [
    `By investing ${formatCurrency(totalMonthly)}/month consistently, your money grows to ${formatCurrency(finalWealth)} through compound interest!`,
    `${companyName} helps you save an extra ${formatCurrency(userData.swipeswipeSavings)}/month by controlling impulse purchases - that adds ${formatCurrency(swipeContribution)} to your wealth over ${milestoneYear} years!`,
    `The earlier you start, the more time your money has to compound. Every dollar saved today is worth much more in the future!`,
    `Small, consistent savings add up to BIG results. You don't need to be rich to become wealthy - you need consistency!`,
  ];

  insights.forEach(insight => {
    const checkRange = addText('✓  ');
    formatText(checkRange.startIndex, checkRange.endIndex, {
      fontSize: { magnitude: 12, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.success } },
      bold: true,
    });

    const insightRange = addText(`${insight}\n\n`);
    formatText(insightRange.startIndex, insightRange.endIndex - 2, {
      fontSize: { magnitude: 11, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.primary } },
    });
    formatParagraph(checkRange.startIndex, insightRange.endIndex, {
      indentFirstLine: { magnitude: 18, unit: 'PT' },
      indentStart: { magnitude: 36, unit: 'PT' },
      lineSpacing: 120,
    });
  });

  // ============================================================================
  // CALL TO ACTION SECTION
  // ============================================================================

  const ctaHeaderRange = addText('🚀  TAKE ACTION NOW\n\n');
  formatText(ctaHeaderRange.startIndex, ctaHeaderRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 16, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(ctaHeaderRange.startIndex, ctaHeaderRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 12, unit: 'PT' },
  });

  const ctaTextRange = addText('Download SwipeSwipe Chrome Extension\n');
  formatText(ctaTextRange.startIndex, ctaTextRange.endIndex - 1, {
    bold: true,
    fontSize: { magnitude: 14, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.white } },
    backgroundColor: { color: { rgbColor: COLORS.accent } },
  });
  formatParagraph(ctaTextRange.startIndex, ctaTextRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 8, unit: 'PT' },
  });

  const ctaLinkRange = addText(`${CHROME_EXTENSION_LINK}\n\n`);
  formatText(ctaLinkRange.startIndex, ctaLinkRange.endIndex - 2, {
    fontSize: { magnitude: 9, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
    link: { url: CHROME_EXTENSION_LINK },
    underline: true,
  });
  formatParagraph(ctaLinkRange.startIndex, ctaLinkRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 8, unit: 'PT' },
  });

  const ctaNoteRange = addText('Start controlling your spending and building wealth TODAY!\n\n');
  formatText(ctaNoteRange.startIndex, ctaNoteRange.endIndex - 2, {
    italic: true,
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });
  formatParagraph(ctaNoteRange.startIndex, ctaNoteRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 24, unit: 'PT' },
  });

  // ============================================================================
  // ASSUMPTIONS SECTION
  // ============================================================================

  const assumptionsHeaderRange = addText('ASSUMPTIONS\n\n');
  formatText(assumptionsHeaderRange.startIndex, assumptionsHeaderRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 12, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const assumptions = [
    `Annual Return Rate: ${ANNUAL_RETURN_RATE}% (based on historical S&P 500 average)`,
    'Compounding: Monthly',
    'Contributions: Consistent monthly investments',
    'Life Expectancy: 88 years',
    'Inflation: Not adjusted (nominal values shown)',
  ];

  assumptions.forEach(assumption => {
    const bulletRange = addText('•  ');
    formatText(bulletRange.startIndex, bulletRange.endIndex, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    });

    const assumptionRange = addText(`${assumption}\n`);
    formatText(assumptionRange.startIndex, assumptionRange.endIndex - 1, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    });
    formatParagraph(bulletRange.startIndex, assumptionRange.endIndex, {
      indentFirstLine: { magnitude: 18, unit: 'PT' },
      indentStart: { magnitude: 36, unit: 'PT' },
    });
  });

  addText('\n');

  // ============================================================================
  // DISCLAIMER SECTION
  // ============================================================================

  const disclaimerHeaderRange = addText('⚠️  DISCLAIMER\n\n');
  formatText(disclaimerHeaderRange.startIndex, disclaimerHeaderRange.endIndex - 2, {
    bold: true,
    fontSize: { magnitude: 12, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const disclaimerTextRange = addText(`This projection is for educational purposes only and does not constitute financial advice. Actual investment returns may vary significantly. The ${ANNUAL_RETURN_RATE}% annual return is based on historical S&P 500 averages, but past performance does not guarantee future results. Please consult with a qualified financial advisor for personalized investment advice.\n\n`);
  formatText(disclaimerTextRange.startIndex, disclaimerTextRange.endIndex - 2, {
    fontSize: { magnitude: 9, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    italic: true,
  });
  formatParagraph(disclaimerTextRange.startIndex, disclaimerTextRange.endIndex, {
    lineSpacing: 120,
  });

  // ============================================================================
  // FOOTER SECTION
  // ============================================================================

  const footerDivider = addText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
  formatText(footerDivider.startIndex, footerDivider.endIndex - 2, {
    foregroundColor: { color: { rgbColor: COLORS.accent } },
  });
  formatParagraph(footerDivider.startIndex, footerDivider.endIndex, {
    alignment: 'CENTER',
  });

  const footerBrandRange = addText('Powered by SwipeSwipe\n');
  formatText(footerBrandRange.startIndex, footerBrandRange.endIndex - 1, {
    bold: true,
    fontSize: { magnitude: 14, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  formatParagraph(footerBrandRange.startIndex, footerBrandRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 4, unit: 'PT' },
  });

  const footerLinkRange = addText(`${SWIPESWIPE_WEBSITE}\n\n`);
  formatText(footerLinkRange.startIndex, footerLinkRange.endIndex - 2, {
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.accent } },
    link: { url: SWIPESWIPE_WEBSITE },
    underline: true,
  });
  formatParagraph(footerLinkRange.startIndex, footerLinkRange.endIndex, {
    alignment: 'CENTER',
    spaceBelow: { magnitude: 8, unit: 'PT' },
  });

  const footerTaglineRange = addText('"Helping average Americans build wealth through consistent saving and smart spending."\n');
  formatText(footerTaglineRange.startIndex, footerTaglineRange.endIndex - 1, {
    italic: true,
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });
  formatParagraph(footerTaglineRange.startIndex, footerTaglineRange.endIndex, {
    alignment: 'CENTER',
  });

  // ============================================================================
  // EXECUTE ALL REQUESTS
  // ============================================================================

  // Execute batch update with all formatting requests
  await window.gapi.client.docs.documents.batchUpdate({
    documentId: documentId,
    requests: requests,
  });

  // Return the document URL
  return `https://docs.google.com/document/d/${documentId}/edit`;
}

/**
 * Export projection to Google Docs and open in new tab
 */
export async function exportToGoogleDocs(
  projection: WealthProjection,
  userData: UserFinancialData,
  companyName: string = 'SwipeSwipe'
): Promise<string> {
  try {
    const docUrl = await createWealthProjectionDoc(projection, userData, companyName);
    window.open(docUrl, '_blank');
    return docUrl;
  } catch (error: any) {
    console.error('Error exporting to Google Docs:', error);
    throw new Error(error.message || 'Failed to create Google Doc');
  }
}

export default {
  initializeGoogleAPI,
  requestAuthorization,
  isSignedIn,
  signOut,
  createWealthProjectionDoc,
  exportToGoogleDocs,
};
