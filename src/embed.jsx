import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import SupaChatbot from './components/SupaChatbot'
import EmailServicesPage from './components/EmailServicesPage'
import ScheduleMeeting from './components/ScheduleMeeting'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'

/**
 * Initialize Troika Chatbot in embed mode
 * This function is called by the loader script after the bundle loads
 *
 * @param {Object} config - Configuration object
 * @param {string} config.chatbotId - The chatbot ID
 * @param {string} config.apiBase - The API base URL
 * @param {string} config.containerId - The container element ID to mount into
 * @param {string} config.streamRoute - Custom stream route (optional, defaults to '/troika/conversation/stream')
 */
function initTroikaChatbot(config) {
  const { chatbotId, apiBase, containerId = 'troika-chatbot-fullscreen', streamRoute } = config;

  if (!chatbotId) {
    console.error('❌ Troika Chatbot: chatbotId is required');
    return;
  }

  if (!apiBase) {
    console.error('❌ Troika Chatbot: apiBase is required');
    return;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Troika Chatbot: Container with id "${containerId}" not found`);
    return;
  }

  console.log('🚀 Initializing Troika Chatbot:', { chatbotId, apiBase, containerId });

  // Create root and render
  const root = createRoot(container);
  
  root.render(
    <StrictMode>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <AuthProvider apiBase={apiBase}>
            <Routes>
              {/* Main chatbot routes - all render SupaChatbot */}
              <Route path="/" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/chat" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/new-chat" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/home" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/who-is-troika" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/what-is-ai-agent" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/how-it-works" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/use-case-for-me" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/pricing-setup" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/ai-websites" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/ai-calling" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/ai-whatsapp" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/ai-telegram" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/industry-use-cases" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/social-media" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/pricing" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/sales" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/marketing" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/about" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/features" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/roi" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/ai-agent" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/ai-calling-agent" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/get-quote" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              <Route path="/book-call" element={<SupaChatbot chatbotId={chatbotId} apiBase={apiBase} streamRoute={streamRoute} />} />
              
              {/* Special routes that render different components */}
              <Route path="/email-services" element={<EmailServicesPage chatbotId={chatbotId} apiBase={apiBase} />} />
              <Route path="/schedule-meeting" element={<ScheduleMeeting chatbotId={chatbotId} apiBase={apiBase} />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    </StrictMode>
  );

  console.log('✅ Troika Chatbot initialized successfully');
}

// Expose function on window immediately (this runs when bundle loads)
if (typeof window !== 'undefined') {
  window.initTroikaChatbot = initTroikaChatbot;
}

// Export as default for UMD bundle
export default initTroikaChatbot;

