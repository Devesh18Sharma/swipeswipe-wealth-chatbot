/**
 * SwipeSwipe Wealth Chatbot
 *
 * AI-powered wealth planning chatbot using Google Gemini
 */

import { WealthChatbot } from './index';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
      background: '#f8fafc'
    }}>
      <WealthChatbot
        geminiApiKey={import.meta.env.VITE_GEMINI_API_KEY}
        aiProvider="gemini"
        companyName="SwipeSwipe"
        brandColor="#293A60"
        googleClientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        googleApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
      />
    </div>
  );
}
