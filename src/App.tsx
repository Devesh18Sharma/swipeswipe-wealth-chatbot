/**
 * Example Usage - SwipeSwipe Wealth Chatbot
 * 
 * This file demonstrates how to integrate the WealthChatbot component
 * into your React application
 */

import { useState } from 'react';
import { WealthChatbot } from './index';
import { WealthProjection } from './types';

// ============================================================================
// BASIC USAGE EXAMPLE
// ============================================================================

/**
 * Basic integration - drop in the component with minimal configuration
 */
export function BasicExample() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
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

// ============================================================================
// WITH OPENAI API INTEGRATION
// ============================================================================

/**
 * Full AI integration with OpenAI API
 * Note: Never expose your API key in frontend code in production!
 * Use a backend proxy instead.
 */
export function OpenAIExample() {
  const [projection, setProjection] = useState<WealthProjection | null>(null);

  const handleProjectionComplete = (proj: WealthProjection) => {
    setProjection(proj);
    console.log('Projection completed:', proj);
    
    // You could send this to analytics, save to user profile, etc.
    // trackEvent('wealth_projection_completed', {
    //   thirtyYearWealth: proj.withSwipeSwipe[30],
    //   swipeswipeContribution: proj.swipeswipeContribution[30]
    // });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px',
      gap: '20px'
    }}>
      <WealthChatbot
        apiKey={import.meta.env.VITE_OPENAI_API_KEY}
        aiProvider="openai"
        companyName="SwipeSwipe"
        brandColor="#293A60"
        onProjectionComplete={handleProjectionComplete}
        googleClientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        googleApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
      />
      
      {projection && (
        <div style={{ 
          padding: '20px', 
          background: '#f0f9ff', 
          borderRadius: '12px',
          maxWidth: '480px'
        }}>
          <h3>Projection Summary</h3>
          <p>30-Year Wealth: ${projection.withSwipeSwipe[30].toLocaleString()}</p>
          <p>SwipeSwipe Contribution: ${projection.swipeswipeContribution[30].toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CUSTOMIZED BRANDING EXAMPLE
// ============================================================================

/**
 * Example with custom branding
 */
export function CustomBrandingExample() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '20px',
      background: '#1a1a1a'
    }}>
      <WealthChatbot 
        companyName="YourBrand"
        brandColor="#10b981" // Green theme
      />
    </div>
  );
}

// ============================================================================
// EMBEDDED IN PAGE EXAMPLE
// ============================================================================

/**
 * Example of chatbot embedded in a landing page
 */
export function LandingPageExample() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Hero Section */}
      <header style={{ 
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>
          Discover Your Wealth Potential
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          Use our AI-powered chatbot to see how wealthy you could become 
          and how SwipeSwipe can help you get there faster.
        </p>
      </header>

      {/* Chatbot Section */}
      <main style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '60px 20px',
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
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        background: '#1e293b',
        color: '#94a3b8'
      }}>
        <p>© 2024 SwipeSwipe. All rights reserved.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
          Projections are for educational purposes only and are not financial advice.
        </p>
      </footer>
    </div>
  );
}

// ============================================================================
// FULL APP EXAMPLE
// ============================================================================

/**
 * Complete application example with routing-like behavior
 */
export default function App() {
  const [view, setView] = useState<'basic' | 'openai' | 'branded' | 'landing'>('landing');

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      {/* Navigation */}
      <nav style={{ 
        padding: '16px 20px', 
        background: '#fff', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        gap: '16px',
        justifyContent: 'center'
      }}>
        <button 
          onClick={() => setView('landing')}
          style={{ 
            padding: '8px 16px', 
            background: view === 'landing' ? '#6366f1' : '#f1f5f9',
            color: view === 'landing' ? 'white' : '#1e293b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Landing Page
        </button>
        <button 
          onClick={() => setView('basic')}
          style={{ 
            padding: '8px 16px', 
            background: view === 'basic' ? '#6366f1' : '#f1f5f9',
            color: view === 'basic' ? 'white' : '#1e293b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Basic
        </button>
        <button 
          onClick={() => setView('openai')}
          style={{ 
            padding: '8px 16px', 
            background: view === 'openai' ? '#6366f1' : '#f1f5f9',
            color: view === 'openai' ? 'white' : '#1e293b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          With OpenAI
        </button>
        <button 
          onClick={() => setView('branded')}
          style={{ 
            padding: '8px 16px', 
            background: view === 'branded' ? '#6366f1' : '#f1f5f9',
            color: view === 'branded' ? 'white' : '#1e293b',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Custom Brand
        </button>
      </nav>

      {/* Content */}
      {view === 'landing' && <LandingPageExample />}
      {view === 'basic' && <BasicExample />}
      {view === 'openai' && <OpenAIExample />}
      {view === 'branded' && <CustomBrandingExample />}
    </div>
  );
}
