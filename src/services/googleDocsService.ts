/**
 * Google Docs Export Service
 * Creates beautiful, branded wealth projection reports in Google Docs
 * EXACTLY matches the visual design from the reference image
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
const SWIPESWIPE_WEBSITE = 'swipeswipe.co';
const CHROME_EXTENSION_LINK = 'https://chromewebstore.google.com/detail/swipeswipe/jmephhldhjnmcmmnmgoiibamhgeoolbl?utm_source=ext_app_menu';

// Return rate constants
const PRE_RETIREMENT_RETURN_RATE = 11;
const POST_RETIREMENT_RETURN_RATE = 6;

// SwipeSwipe Brand Colors (RGB values 0-1)
const COLORS = {
  primary: { red: 0.161, green: 0.227, blue: 0.376 },       // #293A60
  primaryLight: { red: 0.871, green: 0.937, blue: 0.949 },  // #DEEFF2
  success: { red: 0.098, green: 0.714, blue: 0.0 },         // #19B600
  successLight: { red: 0.831, green: 0.941, blue: 0.808 },  // #D4F0CE
  successBg: { red: 0.878, green: 0.941, blue: 0.867 },     // #E0F0DD - lighter green bg
  white: { red: 1.0, green: 1.0, blue: 1.0 },
  lightGray: { red: 0.95, green: 0.95, blue: 0.95 },        // #F2F2F2
  cardBg: { red: 0.96, green: 0.965, blue: 0.97 },          // #F5F7F8
  textSecondary: { red: 0.529, green: 0.612, blue: 0.659 }, // #879CA8
  heroBg: { red: 0.227, green: 0.376, blue: 0.267 },        // Green hero background
};

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

let gapiInitialized = false;
let tokenClient: any = null;

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

export function isSignedIn(): boolean {
  return gapiInitialized && window.gapi?.client?.getToken() !== null;
}

export function signOut(): void {
  const token = window.gapi.client.getToken();
  if (token !== null) {
    window.google.accounts.oauth2.revoke(token.access_token);
    window.gapi.client.setToken(null);
  }
}

/**
 * Create wealth projection document matching the reference image EXACTLY
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

  // Calculate projection values
  const LIFE_EXPECTANCY = 90;
  const yearsToShow = Math.min(45, Math.max(5, LIFE_EXPECTANCY - userData.age));
  const milestoneYear = [5, 10, 15, 20, 25, 30, 35].reduce((prev, curr) =>
    Math.abs(curr - yearsToShow) < Math.abs(prev - yearsToShow) ? curr : prev
  );

  const finalWealth = projection.withSwipeSwipe[milestoneYear];
  const swipeContribution = projection.swipeswipeContribution[milestoneYear];
  const wealthWithoutSS = projection.withoutSwipeSwipe[milestoneYear];
  const finalAge = userData.age + milestoneYear;

  // Create document
  const createResponse = await window.gapi.client.docs.documents.create({
    title: `${companyName} Wealth Projection - ${today}`,
  });
  const documentId = createResponse.result.documentId;

  const requests: any[] = [];
  let idx = 1;

  // Helper to add text
  const addText = (text: string) => {
    requests.push({ insertText: { location: { index: idx }, text } });
    const start = idx;
    idx += text.length;
    return { start, end: idx };
  };

  // Helper to format text
  const fmt = (start: number, end: number, style: any) => {
    requests.push({
      updateTextStyle: {
        range: { startIndex: start, endIndex: end },
        textStyle: style,
        fields: Object.keys(style).join(','),
      },
    });
  };

  // Helper to format paragraph
  const para = (start: number, end: number, style: any) => {
    requests.push({
      updateParagraphStyle: {
        range: { startIndex: start, endIndex: end },
        paragraphStyle: style,
        fields: Object.keys(style).join(','),
      },
    });
  };

  // ══════════════════════════════════════════════════════════════════════════
  // HEADER: "SwipeSwipe Wealth Projection" + "swipeswipe.co"
  // ══════════════════════════════════════════════════════════════════════════

  const h1 = addText(`${companyName} `);
  fmt(h1.start, h1.end, {
    bold: true,
    fontSize: { magnitude: 24, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const h2 = addText('Wealth Projection');
  fmt(h2.start, h2.end, {
    fontSize: { magnitude: 24, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  // Website on the right (using tabs for spacing)
  const web = addText(`\t\t\t\t\t${SWIPESWIPE_WEBSITE}\n`);
  fmt(web.start + 5, web.end - 1, {
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });

  // Tagline
  const tag = addText('A simple, realistic view of what consistency can build.\n\n');
  fmt(tag.start, tag.end - 2, {
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    italic: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PERSONALIZED WEALTH PROJECTION CARD
  // ══════════════════════════════════════════════════════════════════════════

  const pwp = addText('Personalized Wealth Projection\n');
  fmt(pwp.start, pwp.end - 1, {
    bold: true,
    fontSize: { magnitude: 13, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const gen = addText(`Generated: ${today}\n`);
  fmt(gen.start, gen.end - 1, {
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });

  const forYou = addText('For: You\n\n');
  fmt(forYou.start, forYou.end - 2, {
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });

  // ══════════════════════════════════════════════════════════════════════════
  // HERO SECTION - Green Banner with Net Worth
  // ══════════════════════════════════════════════════════════════════════════

  // Top green border
  const greenTop = addText('█████████████████████████████████████████████████████████████████████\n');
  fmt(greenTop.start, greenTop.end - 1, {
    foregroundColor: { color: { rgbColor: COLORS.success } },
    fontSize: { magnitude: 4, unit: 'PT' },
  });

  // Hero label
  const heroLbl = addText(`Estimated Net Worth at Age ${finalAge}\n`);
  fmt(heroLbl.start, heroLbl.end - 1, {
    fontSize: { magnitude: 13, unit: 'PT' },
    foregroundColor: { color: { rgbColor: { red: 0.18, green: 0.45, blue: 0.22 } } },
  });
  para(heroLbl.start, heroLbl.end, { alignment: 'CENTER', spaceAbove: { magnitude: 8, unit: 'PT' } });

  // BIG WEALTH NUMBER
  const bigNum = addText(`${formatCurrency(finalWealth)}\n`);
  fmt(bigNum.start, bigNum.end - 1, {
    bold: true,
    fontSize: { magnitude: 48, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  para(bigNum.start, bigNum.end, { alignment: 'CENTER' });

  // Subtitle
  const heroSub = addText('You are on a path to financial independence.\n');
  fmt(heroSub.start, heroSub.end - 1, {
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: { red: 0.18, green: 0.45, blue: 0.22 } } },
    italic: true,
  });
  para(heroSub.start, heroSub.end, { alignment: 'CENTER', spaceBelow: { magnitude: 8, unit: 'PT' } });

  // Bottom green border
  const greenBot = addText('█████████████████████████████████████████████████████████████████████\n\n');
  fmt(greenBot.start, greenBot.end - 2, {
    foregroundColor: { color: { rgbColor: COLORS.success } },
    fontSize: { magnitude: 4, unit: 'PT' },
  });

  // ══════════════════════════════════════════════════════════════════════════
  // THE SWIPESWIPE DIFFERENCE
  // ══════════════════════════════════════════════════════════════════════════

  const diffHdr = addText(`The ${companyName} Difference\n\n`);
  fmt(diffHdr.start, diffHdr.end - 2, {
    bold: true,
    fontSize: { magnitude: 13, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  // Without SwipeSwipe column
  const withoutLbl = addText('Without ');
  fmt(withoutLbl.start, withoutLbl.end, {
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });

  const withoutBold = addText(`${companyName}`);
  fmt(withoutBold.start, withoutBold.end, {
    bold: true,
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const spacer1 = addText('\t\t\t\t\t\tWith ');
  fmt(spacer1.start + 6, spacer1.end, {
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });

  const withBold = addText(`${companyName}\n`);
  fmt(withBold.start, withBold.end - 1, {
    bold: true,
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.success } },
  });

  // Values
  const val1 = addText(`${formatCurrency(wealthWithoutSS)}`);
  fmt(val1.start, val1.end, {
    bold: true,
    fontSize: { magnitude: 20, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  addText('\t\t\t\t\t\t');

  const val2 = addText(`${formatCurrency(finalWealth)}\n\n`);
  fmt(val2.start, val2.end - 2, {
    bold: true,
    fontSize: { magnitude: 20, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.success } },
  });

  // SwipeSwipe Impact centered
  const impLbl = addText(`${companyName} Impact\n`);
  fmt(impLbl.start, impLbl.end - 1, {
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });
  para(impLbl.start, impLbl.end, { alignment: 'CENTER' });

  const impVal = addText(`+${formatCurrency(swipeContribution)}\n`);
  fmt(impVal.start, impVal.end - 1, {
    bold: true,
    fontSize: { magnitude: 26, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.success } },
  });
  para(impVal.start, impVal.end, { alignment: 'CENTER' });

  const impNote = addText('The long term value of controlling impulse spending.\n\n');
  fmt(impNote.start, impNote.end - 2, {
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    italic: true,
  });
  para(impNote.start, impNote.end, { alignment: 'CENTER', spaceBelow: { magnitude: 12, unit: 'PT' } });

  // ══════════════════════════════════════════════════════════════════════════
  // YOUR STARTING PROFILE
  // ══════════════════════════════════════════════════════════════════════════

  const profHdr = addText('Your Starting Profile\n\n');
  fmt(profHdr.start, profHdr.end - 2, {
    bold: true,
    fontSize: { magnitude: 13, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  // Labels row
  const profLbls = addText('Current Age\t\t\t\tAnnual Income\t\t\t\tCurrent Savings\n');
  fmt(profLbls.start, profLbls.end - 1, {
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });
  para(profLbls.start, profLbls.end, { alignment: 'CENTER' });

  // Values row
  const profVals = addText(`${userData.age}\t\t\t\t${formatCurrency(userData.annualIncome)}\t\t\t\t${formatCurrency(userData.currentSavings)}\n\n`);
  fmt(profVals.start, profVals.end - 2, {
    bold: true,
    fontSize: { magnitude: 16, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });
  para(profVals.start, profVals.end, { alignment: 'CENTER' });

  // ══════════════════════════════════════════════════════════════════════════
  // MONTHLY CONTRIBUTIONS TABLE
  // ══════════════════════════════════════════════════════════════════════════

  const tblHdr = addText('Monthly Contributions\n\n');
  fmt(tblHdr.start, tblHdr.end - 2, {
    bold: true,
    fontSize: { magnitude: 13, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  // Table header row
  const colHdr = addText(`Year\t\tWithout ${companyName}\t\tWith ${companyName}\t\t${companyName} Added Value\n`);
  fmt(colHdr.start, colHdr.end - 1, {
    bold: true,
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
  });

  // Separator
  const sep = addText('─────────────────────────────────────────────────────────────────────\n');
  fmt(sep.start, sep.end - 1, {
    fontSize: { magnitude: 8, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.lightGray } },
  });

  // Data rows
  const years = [5, 10, 15, 20, 25, 30, 35];
  years.forEach((year) => {
    const withoutSS = formatCurrency(projection.withoutSwipeSwipe[year]);
    const withSS = formatCurrency(projection.withSwipeSwipe[year]);
    const bonus = `+${formatCurrency(projection.swipeswipeContribution[year])}`;

    const rowYear = addText(`Year ${year}\t\t`);
    fmt(rowYear.start, rowYear.end, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.primary } },
    });

    const rowWithout = addText(`${withoutSS}\t\t`);
    fmt(rowWithout.start, rowWithout.end, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    });

    const rowWith = addText(`${withSS}\t\t`);
    fmt(rowWith.start, rowWith.end, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.success } },
      bold: true,
    });

    const rowBonus = addText(`${bonus}\n`);
    fmt(rowBonus.start, rowBonus.end - 1, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.success } },
      italic: true,
    });
  });

  addText('\n');

  // ══════════════════════════════════════════════════════════════════════════
  // WHAT THIS MEANS FOR YOU
  // ══════════════════════════════════════════════════════════════════════════

  const meansHdr = addText('What This Means for You\n\n');
  fmt(meansHdr.start, meansHdr.end - 2, {
    bold: true,
    fontSize: { magnitude: 13, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const insights = [
    'Small savings can grow into significant wealth',
    'Consistency matters more than timing the market',
    `${companyName} helps reduce impulsive spending`,
  ];

  insights.forEach(insight => {
    const bullet = addText('•  ');
    fmt(bullet.start, bullet.end, {
      fontSize: { magnitude: 11, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.primary } },
    });
    const txt = addText(`${insight}\n`);
    fmt(txt.start, txt.end - 1, {
      fontSize: { magnitude: 11, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.primary } },
    });
  });

  addText('\n');

  // ══════════════════════════════════════════════════════════════════════════
  // AFTER RETIREMENT BOX
  // ══════════════════════════════════════════════════════════════════════════

  const retHdr = addText('After Retirement\n\n');
  fmt(retHdr.start, retHdr.end - 2, {
    bold: true,
    fontSize: { magnitude: 14, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const retPoints = [
    'Conservative Investment Mix',
    `${POST_RETIREMENT_RETURN_RATE}% Average Annual Growth`,
    'Designed for Long Term Income',
  ];

  retPoints.forEach(point => {
    const check = addText('✓  ');
    fmt(check.start, check.end, {
      fontSize: { magnitude: 11, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.success } },
      bold: true,
    });
    const ptxt = addText(`${point}\n`);
    fmt(ptxt.start, ptxt.end - 1, {
      fontSize: { magnitude: 11, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.primary } },
    });
  });

  addText('\n');

  // ══════════════════════════════════════════════════════════════════════════
  // ASSUMPTIONS USED
  // ══════════════════════════════════════════════════════════════════════════

  const assHdr = addText('Assumptions Used\n\n');
  fmt(assHdr.start, assHdr.end - 2, {
    bold: true,
    fontSize: { magnitude: 13, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.primary } },
  });

  const assumptions = [
    `${PRE_RETIREMENT_RETURN_RATE}% Annual Return (Pre-Retirement)`,
    `${POST_RETIREMENT_RETURN_RATE}% Annual Return (Post-Retirement)`,
    'Consistent Monthly Contributions',
    'Nominal Values Shown',
  ];

  assumptions.forEach(ass => {
    const chk = addText('✓  ');
    fmt(chk.start, chk.end, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.success } },
    });
    const atxt = addText(`${ass}\n`);
    fmt(atxt.start, atxt.end - 1, {
      fontSize: { magnitude: 10, unit: 'PT' },
      foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    });
  });

  addText('\n');

  // ══════════════════════════════════════════════════════════════════════════
  // CTA BUTTON
  // ══════════════════════════════════════════════════════════════════════════

  const cta = addText(`Install ${companyName} Chrome Extension\n`);
  fmt(cta.start, cta.end - 1, {
    bold: true,
    fontSize: { magnitude: 12, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.white } },
    backgroundColor: { color: { rgbColor: COLORS.success } },
    link: { url: CHROME_EXTENSION_LINK },
  });
  para(cta.start, cta.end, { alignment: 'CENTER', spaceAbove: { magnitude: 8, unit: 'PT' } });

  const ctaLink = addText(`${SWIPESWIPE_WEBSITE}/chrome\n\n`);
  fmt(ctaLink.start, ctaLink.end - 2, {
    fontSize: { magnitude: 10, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    link: { url: CHROME_EXTENSION_LINK },
  });
  para(ctaLink.start, ctaLink.end, { alignment: 'CENTER' });

  // ══════════════════════════════════════════════════════════════════════════
  // DISCLAIMER
  // ══════════════════════════════════════════════════════════════════════════

  const disc = addText(`This projection is for educational purposes only. The ${PRE_RETIREMENT_RETURN_RATE}% pre-retirement and ${POST_RETIREMENT_RETURN_RATE}% post-retirement returns are based on historical averages. Past performance does not guarantee future results. Please consult a financial advisor.\n`);
  fmt(disc.start, disc.end - 1, {
    fontSize: { magnitude: 8, unit: 'PT' },
    foregroundColor: { color: { rgbColor: COLORS.textSecondary } },
    italic: true,
  });
  para(disc.start, disc.end, { alignment: 'CENTER', spaceAbove: { magnitude: 16, unit: 'PT' } });

  // Execute batch update
  await window.gapi.client.docs.documents.batchUpdate({
    documentId: documentId,
    requests: requests,
  });

  return `https://docs.google.com/document/d/${documentId}/edit`;
}

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
