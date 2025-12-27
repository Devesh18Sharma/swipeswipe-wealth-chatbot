/**
 * Google Docs Export Service
 * Creates branded wealth projection reports in Google Docs
 */

import { WealthProjection, UserFinancialData } from '../types';
import { formatCurrency } from '../utils/calculations';

// Google API configuration
const SCOPES = 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOCS = [
  'https://docs.googleapis.com/$discovery/rest?version=v1',
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

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
    // Load the Google API script
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

          // Load Google Identity Services
          const gisScript = document.createElement('script');
          gisScript.src = 'https://accounts.google.com/gsi/client';
          gisScript.onload = () => {
            tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: SCOPES,
              callback: '', // Will be set during sign-in
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

    // Check if we already have a token
    if (window.gapi.client.getToken() === null) {
      // Prompt for consent
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip consent if already authorized
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
 * Create a wealth projection document in Google Docs
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

  const finalWealth = projection.withSwipeSwipe[30];
  const swipeContribution = projection.swipeswipeContribution[30];
  const isMillionaire = finalWealth >= 1000000;

  // Create the document
  const createResponse = await window.gapi.client.docs.documents.create({
    title: `${companyName} Wealth Projection - ${today}`,
  });

  const documentId = createResponse.result.documentId;

  // Build the full document content as a single text block
  const documentContent = `
${companyName.toUpperCase()} WEALTH PROJECTION REPORT

Generated: ${today}

═══════════════════════════════════════════════════════════════

YOUR 30-YEAR WEALTH PROJECTION

${formatCurrency(finalWealth)}
${isMillionaire ? '🎉 CONGRATULATIONS! You could become a MILLIONAIRE! 🎉' : ''}

═══════════════════════════════════════════════════════════════

YOUR INFORMATION

• Current Age: ${userData.age}
• Annual Income: ${formatCurrency(userData.annualIncome)}
• Current Savings: ${formatCurrency(userData.currentSavings)}
• Monthly Investment: ${formatCurrency(userData.monthlyInvestment)}
• ${companyName} Monthly Savings: ${formatCurrency(userData.swipeswipeSavings)}
• Total Monthly Contribution: ${formatCurrency(userData.monthlyInvestment + userData.swipeswipeSavings)}

═══════════════════════════════════════════════════════════════

WEALTH GROWTH TIMELINE (7% Annual Return)

Years    Without ${companyName}    With ${companyName}    ${companyName} Bonus
─────    ──────────────────    ─────────────────    ────────────────
5 yrs    ${formatCurrency(projection.withoutSwipeSwipe[5]).padEnd(18)}    ${formatCurrency(projection.withSwipeSwipe[5]).padEnd(17)}    +${formatCurrency(projection.swipeswipeContribution[5])}
10 yrs   ${formatCurrency(projection.withoutSwipeSwipe[10]).padEnd(18)}    ${formatCurrency(projection.withSwipeSwipe[10]).padEnd(17)}    +${formatCurrency(projection.swipeswipeContribution[10])}
15 yrs   ${formatCurrency(projection.withoutSwipeSwipe[15]).padEnd(18)}    ${formatCurrency(projection.withSwipeSwipe[15]).padEnd(17)}    +${formatCurrency(projection.swipeswipeContribution[15])}
20 yrs   ${formatCurrency(projection.withoutSwipeSwipe[20]).padEnd(18)}    ${formatCurrency(projection.withSwipeSwipe[20]).padEnd(17)}    +${formatCurrency(projection.swipeswipeContribution[20])}
25 yrs   ${formatCurrency(projection.withoutSwipeSwipe[25]).padEnd(18)}    ${formatCurrency(projection.withSwipeSwipe[25]).padEnd(17)}    +${formatCurrency(projection.swipeswipeContribution[25])}
30 yrs   ${formatCurrency(projection.withoutSwipeSwipe[30]).padEnd(18)}    ${formatCurrency(projection.withSwipeSwipe[30]).padEnd(17)}    +${formatCurrency(projection.swipeswipeContribution[30])}
35 yrs   ${formatCurrency(projection.withoutSwipeSwipe[35]).padEnd(18)}    ${formatCurrency(projection.withSwipeSwipe[35]).padEnd(17)}    +${formatCurrency(projection.swipeswipeContribution[35])}

═══════════════════════════════════════════════════════════════

KEY INSIGHTS

💡 By using ${companyName}, you could accumulate an additional ${formatCurrency(swipeContribution)} over 30 years!

💡 Your total monthly contribution of ${formatCurrency(userData.monthlyInvestment + userData.swipeswipeSavings)} grows to ${formatCurrency(finalWealth)} through the power of compound interest.

💡 ${companyName} helps you save ${formatCurrency(userData.swipeswipeSavings)}/month automatically, turning small savings into significant wealth.

═══════════════════════════════════════════════════════════════

ASSUMPTIONS

• Annual Return Rate: 7% (historical S&P 500 average)
• Compounding: Monthly
• Contributions: Consistent monthly investments
• Inflation: Not adjusted (nominal values shown)

═══════════════════════════════════════════════════════════════

DISCLAIMER

This projection is for educational purposes only and does not constitute financial advice. Actual investment returns may vary. Past performance does not guarantee future results. Please consult with a qualified financial advisor for personalized advice.

═══════════════════════════════════════════════════════════════

Powered by ${companyName}
www.swipeswipe.com

"Helping average Americans build wealth through consistent saving and investing."
`;

  // Update document with content
  await window.gapi.client.docs.documents.batchUpdate({
    documentId: documentId,
    requests: [
      {
        insertText: {
          location: { index: 1 },
          text: documentContent,
        },
      },
    ],
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

    // Open the document in a new tab
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
