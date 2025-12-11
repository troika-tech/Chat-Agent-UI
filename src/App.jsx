import SupaChatbot from "./components/SupaChatbot"
import ScheduleMeeting from "./components/ScheduleMeeting"
import EmailServicesPage from "./components/EmailServicesPage"
import WhatsAppProposalsPage from "./components/WhatsAppProposalsPage"
import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"

// Constants for chatbot configuration
const CHATBOT_ID = "692949c1b8c1bfbed87e7dff"
// const API_BASE = "https://chat-apiv3.0804.in/api"
const API_BASE = "http://localhost:5000/api"

// Development mode - set to true to bypass authentication during development
// COMMENTED OUT: Using inline authentication after 2 bot messages instead of full-screen auth
// const SKIP_AUTH_IN_DEV = true;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '2px solid red', margin: '20px', backgroundColor: 'lightcoral' }}>
          <h2>Error in SupaChatbot Component</h2>
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <p><strong>Stack:</strong> {this.state.error?.stack}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// COMMENTED OUT: Full-screen authentication wrapper - Now using inline auth after 2 bot messages
/* Authentication wrapper component
function AuthenticationGate({ children }) {
  const location = useLocation();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [intendedRoute, setIntendedRoute] = useState(null);

  const {
    isAuthenticated,
    userInfo,
    loading: authLoading,
    error: authError,
    resendCooldown,
    sendOtp,
    verifyOtp,
    resendOtp
  } = useAuthentication(API_BASE);

  // Persist phone from userInfo once authenticated
  useEffect(() => {
    if (isAuthenticated && userInfo && userInfo.phone) {
      try { localStorage.setItem('chatbot_user_phone', String(userInfo.phone)); } catch {}
    }
  }, [isAuthenticated, userInfo]);

  // Save the intended route when user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && !intendedRoute) {
      setIntendedRoute(location.pathname);
    }
  }, [isAuthenticated, location.pathname, intendedRoute]);

  // Handle OTP sending
  const handleSendOtp = async (phone) => {
    try {
      setPhoneNumber(phone);
      await sendOtp(phone);
      setShowOtpModal(true);
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (otp) => {
    try {
      await verifyOtp(otp, phoneNumber);
      setShowOtpModal(false);
      // Route preservation is handled by React Router automatically
    } catch (error) {
      console.error('Failed to verify OTP:', error);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    try {
      await resendOtp(phoneNumber);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  // Skip authentication in development mode
  if (SKIP_AUTH_IN_DEV) {
    return children;
  }

  // Show auth modal if user is not authenticated
  if (!isAuthenticated) {
    return (
      <AuthModal
        onSendOtp={handleSendOtp}
        onVerifyOtp={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        loading={authLoading}
        error={authError}
        resendCooldown={resendCooldown}
        showOtpInput={showOtpModal}
      />
    );
  }

  // User is authenticated; render children
  return children;
} */


function App() {
  return (
    <ThemeProvider>
      <AuthProvider apiBase={API_BASE}>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* All routes are now public - no authentication required */}
              <Route path="/" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/chat" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/new-chat" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/home" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/who-is-troika" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/what-is-ai-agent" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/how-it-works" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/use-case-for-me" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/pricing-setup" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/ai-websites" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/ai-calling" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/ai-whatsapp" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/ai-telegram" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/industry-use-cases" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/social-media" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/pricing" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/sales" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/marketing" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/about" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/features" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/roi" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/ai-agent" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/ai-calling-agent" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/get-quote" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/schedule-meeting" element={<ScheduleMeeting chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/email-services" element={<EmailServicesPage chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/whatsapp-proposals" element={<WhatsAppProposalsPage chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
              <Route path="/book-call" element={<SupaChatbot chatbotId={CHATBOT_ID} apiBase={API_BASE} />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
