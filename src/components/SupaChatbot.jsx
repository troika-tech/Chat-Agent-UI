import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";

// Import components
import DeviceFrameComponent from "./DeviceFrame";
import ChatHeader from "./ChatHeader";
import MessageBubbleComponent from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import VoiceInputIndicatorComponent from "./VoiceInputIndicator";
import WelcomeSection from "./WelcomeSection";
import Confetti from "./Confetti";
import ServiceSelectionButtons from "./ServiceSelectionButtons";
import ServiceSelection from "./ServiceSelection";
import Sidebar from "./Sidebar";
import SocialFeedPanel from "./SocialFeedPanel";
// import InlineAuth from "./InlineAuth";
// COMMENTED OUT: Not using full-screen modals, using inline message bubbles instead
// import OtpVerification from "./OtpVerification";
// import InlineAuth from "./InlineAuth";
// import AuthModal from "./AuthModal";
// import OtpModal from "./OtpModal";

// Using inline message bubble components for authentication
import AuthMessageBubble from "./AuthMessageBubble";
import OtpMessageBubble from "./OtpMessageBubble";
import StreamingMessage from "./StreamingMessage";
import InputArea from "./InputArea";

// Import styles
import { Wrapper, Overlay, AnimatedBlob, Chatbox, ChatContainer, MessagesContainer, MessagesInnerContainer, MainContentArea } from "../styles/MainStyles";
import GlobalStyle from "../styles/GlobalStyles";

// Import theme
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

// Import hooks
import { useBattery } from "../hooks/useBattery";
import { useClock } from "../hooks/useClock";
import { useAudio } from "../hooks/useAudio";
import { useVoiceRecording } from "../hooks/useVoiceRecording";
import useAuthentication from "../hooks/useAuthentication";
import useStreamingChat from "../hooks/useStreamingChat";

// Import utils
import { getTimeBasedGreeting } from "../utils/timeUtils";
import { isMobileDevice, getDeviceInfo, hapticFeedback, debounce } from "../utils/mobileUtils";

// Import services
import frontendInactivityManager from "../services/frontendInactivityManager";

const SupaChatbotInner = ({ chatbotId, apiBase }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [showChat, setShowChat] = useState(true);
  const [phone, setPhone] = useState(""); // Phone number will be set during authentication
  const [otpSent, setOtpSent] = useState(false);
  const [isPageRefresh, setIsPageRefresh] = useState(true); // Track if this is a page refresh
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(true);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [resendIntervalId, setResendIntervalId] = useState(null);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [requireAuthText, setRequireAuthText] = useState(
    "Verify yourself to continue chat"
  );
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [botMessageCount, setBotMessageCount] = useState(0);
  const [showInlineAuth, setShowInlineAuth] = useState(false);
  const [showInlineAuthInput, setShowInlineAuthInput] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [currentAuthValue, setCurrentAuthValue] = useState('');
  const [chatbotLogo, setChatbotLogo] = useState(
    "https://raw.githubusercontent.com/troika-tech/Asset/refs/heads/main/Supa%20Agent%20new.png"
  );
  const [finalGreetingReady, setFinalGreetingReady] = useState(false);
  const [ttsGenerationInProgress, setTtsGenerationInProgress] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(getTimeBasedGreeting());
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Removed activePage state - now using React Router
  const [socialFeedOpen, setSocialFeedOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  // Removed showSuggestions state - no longer needed
  // Removed "I'm interested" functionality
  // const [hasShownInterestResponse, setHasShownInterestResponse] = useState(false);
  // const [prefetchedThankYouTTS, setPrefetchedThankYouTTS] = useState(null);
  // const [isPrefetchingTTS, setIsPrefetchingTTS] = useState(false);
  // Removed greetingAudioReady state - no longer needed without autoplay

  // User collection flow states
  const [userCollectionState, setUserCollectionState] = useState('INITIAL');
  // States: INITIAL, ASKING_NAME, ASKING_PHONE, COLLECTED, SKIPPED
  const [userName, setUserName] = useState(null);
  const [userPhone, setUserPhone] = useState(null);

  // Refs
  const ttsGenerationTimeout = useRef(null);
  const lastGeneratedGreeting = useRef(null);
  const overlayRef = useRef(null);
  const chatboxRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasMounted = useRef(false);
  const greetingAutoPlayed = useRef(false);
  const pendingGreetingAudio = useRef(null);
  const languageMessageShown = useRef(false);
  const greetingAddedRef = useRef(false);
  // Refs for demo authentication flow
  const pendingAuthAfterTTS = useRef(false);
  const pendingMessageAfterAuth = useRef(null);
  const skipAddingUserMessage = useRef(false);
  const authenticatedPhoneRef = useRef(null); // Store authenticated phone for immediate use

  // Callback to handle auth screen display after TTS completes
  const handleAudioEnded = useCallback((messageIndex) => {

    // COMMENTED OUT: No automatic auth - only triggered by "demo" keyword
  }, []);

  // Custom hooks
  const { batteryLevel, isCharging } = useBattery();
  const currentTime = useClock();
  // TEMPORARILY DISABLED TTS - providing stub functions
  // const { playAudio, stopAudio, currentlyPlaying, audioObject, toggleMuteForCurrentAudio, muteCurrentAudio, ensureAudioMuted } = useAudio(isMuted, hasUserInteracted, handleAudioEnded);
  const playAudio = () => {}; // Stub function
  const stopAudio = () => {}; // Stub function
  const currentlyPlaying = null; // Stub value
  const audioObject = null; // Stub value
  const toggleMuteForCurrentAudio = () => {}; // Stub function
  const muteCurrentAudio = () => {}; // Stub function
  const ensureAudioMuted = () => {}; // Stub function
  const { isRecording, startRecording, stopRecording } = useVoiceRecording(apiBase);
  
  // Authentication and streaming hooks
  const {
    isAuthenticated,
    authToken,
    userInfo,
    loading: authLoading,
    error: authError,
    resendCooldown,
    sendOtp,
    verifyOtp,
    logout,
    resendOtp
  } = useAuthentication(apiBase);

  // State for tracking the currently streaming message
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState(null);

  // State for tracking which tab the user sent the message from
  const [messageOriginTab, setMessageOriginTab] = useState(null);

  // State for manual streaming response (for demo auth flow)
  const [manualStreamingResponse, setManualStreamingResponse] = useState('');

  // Streaming hook with proper options
  const {
    streamingResponse,
    isStreaming,
    error: streamingError,
    audioPlaying,
    metrics,
    sendMessage: sendStreamingMessage,
    stopStreaming,
    retry,
    pauseAudio,
    resumeAudio,
    getAudioState,
  } = useStreamingChat({
    apiBase,
    chatbotId,
    sessionId,
    phone: authenticatedPhoneRef.current || userInfo?.phone || phone || userPhone,
    name: userName,
    enableTTS: false, // TEMPORARILY DISABLED TTS
    isMuted,
    onComplete: (data) => {

      // Add the final message to chat history
      const targetTab = messageOriginTab || getCurrentTab();

      const botMessage = {
        sender: "bot",
        text: data.fullAnswer,
        timestamp: new Date(),
        metadata: data.metadata, // Include metadata for special actions like Calendly
      };


      addMessageToTab(targetTab, botMessage);
      setCurrentStreamingMessageId(null);
      setIsTyping(false);

      // Increment bot message count
      incrementBotMessageCount();

      // Clear the message origin tab after bot response
      setMessageOriginTab(null);

      // ===== SMART USER COLLECTION: Ask for phone after 3rd message =====
      // Get current message count from localStorage (since state updates are async)
      let currentMessageCount = userMessageCount;
      if (sessionId && chatbotId) {
        try {
          const key = `supa_user_message_count:${chatbotId}:${sessionId}`;
          const stored = localStorage.getItem(key);
          if (stored) {
            currentMessageCount = parseInt(stored, 10);
          }
        } catch (error) {
          // Fallback to state value
        }
      }
      
      // Ask for phone ONLY after the 3rd user message (if we have name but not phone)
      if (currentMessageCount === 3 && userName && !userPhone) {
        // Transition to ASKING_PHONE state if not already
        if (userCollectionState !== 'ASKING_PHONE') {
          setUserCollectionState('ASKING_PHONE');
        }
        setTimeout(() => {
          const phonePrompt = {
            sender: "bot",
            text: USER_COLLECTION_PROMPTS.thankName(userName),
            timestamp: new Date()
          };
          addMessageToTab(targetTab, phonePrompt);
        }, 800);
      }

      // Scroll to bottom after message is added
      setTimeout(() => {
        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }
      }, 100);
    },
    onError: (error) => {
      console.error('❌ Streaming error:', error);
      setCurrentStreamingMessageId(null);
      setIsTyping(false);
      toast.error('Failed to get response. Please try again.');
    },
  });

  // Constants
  const AUTH_GATE_KEY = (sid, bot) => `supa_auth_gate:${bot}:${sid}`;
  const SESSION_STORE_KEY = "chatbot_user_phone";
  const USER_MESSAGE_COUNT_KEY = (sid, bot) => `supa_user_message_count:${bot}:${sid}`;

  // Route-based tab detection
  const getCurrentTab = useCallback(() => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    return path.substring(1); // Remove leading slash
  }, [location.pathname]);

  // Tab-specific chat history helper functions
  const getTabHistoryKey = useCallback((tabId) => {
    return `chatHistory_${tabId}`;
  }, []);

  // Utility function to ensure message has proper timestamp
  const ensureMessageTimestamp = useCallback((message) => {
    return {
      ...message,
      timestamp: message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp || Date.now())
    };
  }, []);

  const loadTabHistory = useCallback((tabId) => {
    const key = getTabHistoryKey(tabId);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const history = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        return history.map(message => ensureMessageTimestamp(message));
      }
      return [];
    } catch (error) {
      console.error('Error loading tab history:', error);
      return [];
    }
  }, [getTabHistoryKey]);

  const saveTabHistory = useCallback((tabId, history) => {
    const key = getTabHistoryKey(tabId);
    try {
      localStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving tab history:', error);
    }
  }, [getTabHistoryKey]);

  const addMessageToTab = useCallback((tabId, message) => {
    const currentHistory = loadTabHistory(tabId);
    const messageWithProperTimestamp = ensureMessageTimestamp(message);
    const newHistory = [...currentHistory, messageWithProperTimestamp];
    saveTabHistory(tabId, newHistory);
    
    // Update current chat history if this is the active tab
    if (tabId === getCurrentTab()) {
      setChatHistory(newHistory);
    }
  }, [loadTabHistory, saveTabHistory, getCurrentTab, ensureMessageTimestamp]);

  const clearTabHistory = useCallback((tabId) => {
    const key = getTabHistoryKey(tabId);
    localStorage.removeItem(key);
    
    // Clear current chat history if this is the active tab
    if (tabId === getCurrentTab()) {
      setChatHistory([]);
    }
  }, [getTabHistoryKey, getCurrentTab]);

  const clearAllTabHistories = useCallback(() => {
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('chatHistory_')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // Handle Calendly booking confirmation
  const handleCalendlyBooking = useCallback(async (eventDetails) => {

    const confirmationText = "Great! Your meeting has been booked successfully! You'll receive a confirmation email shortly with all the details.\n\nIn the meantime, feel free to ask me anything about our services, pricing, or how we can help transform your business!";

    const confirmationMessage = {
      sender: "bot",
      text: confirmationText,
      timestamp: new Date()
    };

    const currentTab = getCurrentTab();
    const currentHistory = loadTabHistory(currentTab);
    const newMessageIndex = currentHistory.length;

    addMessageToTab(currentTab, confirmationMessage);

    // Generate and play TTS for confirmation message
    if (apiBase) {
      try {
        const response = await axios.post(`${apiBase}/text-to-speech`, {
          text: confirmationText,
        });

        if (response.data.audio) {
          const base64Data = response.data.audio.replace("data:audio/mpeg;base64,", "");
          const byteArray = Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          const audioData = {
            data: byteArray,
            contentType: "audio/mpeg"
          };

          playAudio(audioData, newMessageIndex);
        }
      } catch (error) {
        console.error('Failed to generate TTS for booking confirmation:', error);
      }
    }

    // Auto-scroll to show confirmation (within chat container, not full page)
    setTimeout(() => {
      if (endOfMessagesRef.current) {
        endOfMessagesRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }, 100);
  }, [getCurrentTab, addMessageToTab, loadTabHistory, apiBase, playAudio]);

  // Handle route changes and load appropriate chat history
  useEffect(() => {
    const currentTab = getCurrentTab();
    
    // If this is a page refresh, clear ALL tab histories and show welcome screen
    if (isPageRefresh) {
      setShowWelcome(true);
      setChatHistory([]);
      
      // Clear all tab histories from localStorage
      clearAllTabHistories();
      
      setIsPageRefresh(false); // Reset the flag
      return;
    }
    
    // For navigation (not refresh), load chat history
    const tabHistory = loadTabHistory(currentTab);
    
    if (tabHistory.length === 0) {
      setShowWelcome(true);
      setChatHistory([]);
    } else {
      setShowWelcome(false);
      // Ensure all messages have proper timestamps before setting
      const historyWithProperTimestamps = tabHistory.map(message => ensureMessageTimestamp(message));
      setChatHistory(historyWithProperTimestamps);
    }
  }, [location.pathname, getCurrentTab, loadTabHistory, ensureMessageTimestamp, isPageRefresh, clearAllTabHistories]);

  // Handle navigation between tabs (not refresh)
  const handleTabNavigation = useCallback((tabId) => {

    // Block navigation if authentication is required
    if (showInlineAuth && !verified) {
      toast.warning('Please complete authentication before navigating to other pages');
      return;
    }

    setIsPageRefresh(false); // This is navigation, not refresh
    sessionStorage.setItem('hasNavigated', 'true'); // Mark as navigation
    
    // Clear message origin tab when navigating (but only if not currently streaming)
    if (!isStreaming && !isTyping) {
      setMessageOriginTab(null);
    } else {
    }
    
    // If currently streaming/typing, stop the response when navigating away
    if (isStreaming || isTyping) {
      
      // Save the current streaming response to the origin tab before stopping
      if (messageOriginTab && streamingResponse && streamingResponse.trim()) {
        const partialBotMessage = {
          sender: "bot",
          text: streamingResponse,
          timestamp: new Date(),
        };
        addMessageToTab(messageOriginTab, partialBotMessage);
      }
      
      if (isStreaming) {
        stopStreaming();
      }
      setIsTyping(false);
      setCurrentStreamingMessageId(null);
      setMessageOriginTab(null);
    }
    
    // Special handling for "new-chat" - clear all history and go to home
    if (tabId === 'new-chat') {

      // If user is in the middle of authentication, prevent new chat action
      if (showInlineAuth && (showInlineAuthInput || showOtpInput)) {
        toast.warning('Please complete authentication before starting a new chat');
        return;
      }

      // Stop any ongoing audio/TTS immediately
      stopAudio();

      // Stop streaming audio specifically
      pauseAudio();

      // Stop any streaming response
      if (isStreaming) {
        stopStreaming();
      }

      // Clear all states
      setIsTyping(false);
      setCurrentStreamingMessageId(null);
      setMessageOriginTab(null);

      // Clear all chat history
      setChatHistory([]);
      setShowWelcome(true);

      // Clear all tab histories from localStorage
      clearAllTabHistories();

      // Clear user message count
      if (sessionId && chatbotId) {
        try {
          const key = `supa_user_message_count:${chatbotId}:${sessionId}`;
          localStorage.removeItem(key);
        } catch (error) {
          console.error("Error clearing user message count:", error);
        }
      }

      // Clear bot message count as well
      setBotMessageCount(0);

      // Generate new session ID for fresh start
      const newSessionId = crypto.randomUUID();
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);

      // Reset authentication states for new chat ONLY if user is authenticated
      // This prevents closing the modal if user hasn't verified yet
      if (isAuthenticated) {
        setVerified(false);
        setNeedsAuth(false);
        setShowInlineAuth(false);
        setShowInlineAuthInput(false);
        setShowOtpInput(false);
        setCurrentAuthValue('');
      }

      // Navigate to home and replace the current URL
      navigate('/', { replace: true });
      return;
    }
    
    navigate(`/${tabId}`);
  }, [navigate, sessionId, chatbotId, clearAllTabHistories, messageOriginTab, isStreaming, isTyping, stopStreaming, streamingResponse, addMessageToTab, stopAudio, pauseAudio, showInlineAuth, showInlineAuthInput, showOtpInput, isAuthenticated, verified]);

  // Cleanup effect to reset navigation flag on unmount
  useEffect(() => {
    return () => {
      // Reset the navigation flag when component unmounts
      sessionStorage.removeItem('hasNavigated');
    };
  }, []);

  // Auto-send conversation transcript after 30 seconds of inactivity
  useEffect(() => {

    // Use authenticated phone number if available, otherwise fall back to local phone state
    const effectivePhone = userInfo?.phone || phone;
    const isUserVerified = isAuthenticated || verified;

    // Only start timer if verified and there's chat history
    if (isUserVerified && effectivePhone && sessionId && chatbotId && chatHistory.length > 0) {
      frontendInactivityManager.resetInactivityTimer(
        sessionId,
        effectivePhone,
        chatbotId,
        chatHistory,
        apiBase
      );
    } else {
    }

    // Cleanup timer when component unmounts
    return () => {
      if (sessionId) {
        frontendInactivityManager.clearInactivityTimer(sessionId);
      } else {
      }
    };
  }, [chatHistory, isAuthenticated, verified, phone, userInfo, sessionId, chatbotId, apiBase]);

  // Restore phone from localStorage when authenticated but phone state is empty
  useEffect(() => {
    if (isAuthenticated && !phone) {
      const savedPhone = localStorage.getItem('chatbot_user_phone');
      if (savedPhone) {
        setPhone(savedPhone);
      } else {
      }
    }
  }, [isAuthenticated, phone]);

  // Function to check if user has sent 2 messages and needs auth
  const checkUserMessageCount = useCallback(() => {
    return userMessageCount >= 2;
  }, [userMessageCount]);

  // Function to load user message count from localStorage
  const loadUserMessageCount = useCallback(() => {
    if (!sessionId || !chatbotId) {
      return 0;
    }
    
    try {
      const key = USER_MESSAGE_COUNT_KEY(sessionId, chatbotId);
      const stored = localStorage.getItem(key);
      const count = stored ? parseInt(stored, 10) : 0;
      return count;
    } catch (error) {
      console.error("Error loading user message count:", error);
      return 0;
    }
  }, [sessionId, chatbotId]);

  // Function to increment user message count
  const incrementUserMessageCount = useCallback(() => {
    setUserMessageCount(prev => {
      const newCount = prev + 1;
      // Persist to localStorage
      if (sessionId && chatbotId) {
        try {
          const key = `supa_user_message_count:${chatbotId}:${sessionId}`;
          localStorage.setItem(key, newCount.toString());
        } catch (error) {
          console.error("Error saving user message count:", error);
        }
      } else {
      }
      return newCount;
    });
  }, [sessionId, chatbotId, userMessageCount]);

  // Function to increment bot message count
  const incrementBotMessageCount = useCallback(() => {
    setBotMessageCount(prev => {
      const newCount = prev + 1;

      // COMMENTED OUT: No automatic auth after 2 messages
      // Auth now only triggers when user types "demo" keyword
      /* if (!isAuthenticated && newCount >= 2) {
        pendingAuthAfterTTS.current = true;
      } */

      return newCount;
    });
  }, [sessionId, chatbotId, botMessageCount, isAuthenticated]);

  // Function to generate TTS for greeting message
  const generateGreetingTTS = useCallback(
    async (greetingText, retryCount = 0) => {
      if (!apiBase || ttsGenerationInProgress) return null;

      setTtsGenerationInProgress(true);

      try {
        const response = await axios.post(`${apiBase}/text-to-speech`, {
          text: greetingText,
        });

        if (response.data.audio) {
          const base64Data = response.data.audio.replace(
            "data:audio/mpeg;base64,",
            ""
          );
          const byteArray = Array.from(atob(base64Data), (c) =>
            c.charCodeAt(0)
          );

          return {
            data: byteArray,
            contentType: "audio/mpeg",
          };
        } else {
        }
      } catch (error) {
        console.error("Failed to generate greeting TTS:", error);

        if (retryCount < 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (retryCount + 1))
          );
          return generateGreetingTTS(greetingText, retryCount + 1);
        }
      } finally {
        setTtsGenerationInProgress(false);
      }
      return null;
    },
    [apiBase, ttsGenerationInProgress]
  );

  // Removed prefetchThankYouTTS function - no longer needed

  // Function to ensure greeting TTS is generated and updated in chat history
  const ensureGreetingTTS = useCallback(
    async (greetingText, forceUpdate = false) => {
      if (!apiBase || !greetingText) return;

      if (!forceUpdate && lastGeneratedGreeting.current === greetingText) {
        return;
      }

      if (ttsGenerationTimeout.current) {
        clearTimeout(ttsGenerationTimeout.current);
      }

      ttsGenerationTimeout.current = setTimeout(async () => {
        const greetingAudio = await generateGreetingTTS(greetingText);
        if (greetingAudio) {
          lastGeneratedGreeting.current = greetingText;

          setChatHistory((prev) => {
            if (prev.length === 0) {
              return [
                {
                  sender: "bot",
                  text: greetingText,
                  audio: greetingAudio,
                  timestamp: new Date(),
                },
              ];
            } else {
              return prev.map((msg, index) => {
                if (index === 0 && msg.sender === "bot") {
                  return { ...msg, text: greetingText, audio: greetingAudio, timestamp: new Date() };
                }
                return msg;
              });
            }
          });

          // Store the greeting audio for manual playback only
          if (showChat && !greetingAutoPlayed.current) {
            pendingGreetingAudio.current = greetingAudio;
            // No autoplay - user must click play button
          }
        }
      }, 500);
    },
    [apiBase, generateGreetingTTS, showChat]
  );

  // Handle user interaction (simplified - no audio enable needed)
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  }, [hasUserInteracted]);

  // Load chatbot configuration
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(
          `${apiBase}/chatbot/${chatbotId}/config`
        );
        if (cancelled) return;
        
        const cfg = data || {};
        const configuredAuthMethod = (cfg.auth_method || "whatsapp").toLowerCase();
        if (configuredAuthMethod !== "whatsapp") {
          console.warn(`Unsupported auth method "${configuredAuthMethod}" detected. Defaulting to WhatsApp authentication.`);
        }
        setRequireAuthText(
          cfg.require_auth_text || "Verify yourself to continue chat"
        );

        if (cfg.require_auth_from_start) {
          setNeedsAuth(true);
          setShowInlineAuth(true);
          setShowAuthScreen(false);
        }

        if (cfg.immediate_auth_required || cfg.require_auth) {
          setNeedsAuth(true);
          setShowInlineAuth(true);
          setShowAuthScreen(false);
        }

        // Check for existing session using the new authentication system
        // The useAuthentication hook already handles session validation on mount
        // No need to show toast notifications here - auth is now handled upfront
        if (isAuthenticated && userInfo?.phone) {
          setPhone(userInfo.phone);
          setVerified(true);
          setNeedsAuth(false);
          setShowAuthScreen(false);
          setShowInlineAuth(false);
          setFinalGreetingReady(true);
        }
      } catch {
        // Default to WhatsApp auth if configuration fetch fails
        console.warn('Failed to load chatbot configuration. Falling back to WhatsApp authentication.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase, chatbotId, isAuthenticated, userInfo]);

  // Generate TTS for initial greeting message
  useEffect(() => {
    const generateInitialGreetingTTS = async () => {
      if (
        chatbotId &&
        apiBase &&
        chatHistory.length === 1 &&
        chatHistory[0].sender === "bot" &&
        !chatHistory[0].audio
      ) {
        const greetingText = chatHistory[0].text;
        setTimeout(() => {
          ensureGreetingTTS(greetingText);
        }, 200);
      }
    };

    generateInitialGreetingTTS();
  }, [chatbotId, apiBase, ensureGreetingTTS]);

  // Removed prefetch Thank you TTS useEffect - no longer needed

  // Initialize session - Always generate new session ID on page refresh
  useEffect(() => {
    // Check if this is a page refresh by looking for a session flag
    const isRefresh = !sessionStorage.getItem('hasNavigated');
    setIsPageRefresh(isRefresh);
    
    // Set flag to indicate navigation has occurred
    sessionStorage.setItem('hasNavigated', 'true');
    
    // Always generate a new session ID
    const id = crypto.randomUUID();
    localStorage.setItem("sessionId", id);
    setSessionId(id);
    
    // Only reset auth states on page refresh, not on navigation
    if (isRefresh) {
      // Set verified state to true to bypass auth UI while sending default phone
      setVerified(true);
      setNeedsAuth(false);
      setShowInlineAuth(false);
      setShowAuthScreen(false);
      
      // Clear any existing auth data from localStorage
      try {
        localStorage.removeItem(AUTH_GATE_KEY(id, chatbotId));
        localStorage.removeItem(SESSION_STORE_KEY);
      } catch (error) {
      }
    }
  }, []);

  // Load user collection data from localStorage on mount
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('chatbot_user_name');
      const savedPhone = localStorage.getItem('chatbot_user_phone');
      const savedState = localStorage.getItem('chatbot_user_collection_state');

      // Load name and phone from localStorage regardless of state
      if (savedName) {
        setUserName(savedName);
        console.log('✅ Loaded name from localStorage:', savedName);
      }
      if (savedPhone) {
        setUserPhone(savedPhone);
        console.log('✅ Loaded phone from localStorage:', savedPhone);
      }

      // Set the collection state
      if (savedState === 'COLLECTED') {
        setUserCollectionState('COLLECTED');
      } else if (savedState === 'ASKING_PHONE' && savedName) {
        // User provided name but not phone yet
        setUserCollectionState('ASKING_PHONE');
      } else {
        // New user or hasn't started collection
        setUserCollectionState('INITIAL');
      }
    } catch (error) {
      console.error('Error loading user collection data:', error);
      setUserCollectionState('INITIAL');
    }
  }, []);

  // Load user message count when sessionId and chatbotId are available
  useEffect(() => {
    if (sessionId && chatbotId) {
      const key = `supa_user_message_count:${chatbotId}:${sessionId}`;
      const stored = localStorage.getItem(key);
      const savedCount = stored ? parseInt(stored, 10) : 0;
      setUserMessageCount(savedCount);
      
      // Only trigger auth if user has sent 2+ messages and is not verified
      // This will be handled by the other useEffect that watches userMessageCount and verified
    }
  }, [sessionId, chatbotId]);

  // Check if user needs auth based on message count when component mounts or verified state changes
  // COMMENTED OUT - Auth is now controlled by backend configuration only
  /* useEffect(() => {
    
    if (userMessageCount >= 2 && !verified) {
      setNeedsAuth(true);
      setShowInlineAuth(true);
    } else if (verified) {
      setNeedsAuth(false);
      setShowInlineAuth(false);
    }
  }, [userMessageCount, verified]); */

  // Set initial greeting - DISABLED (user doesn't want initial greeting)
  /* useEffect(() => {
    // Only add greeting if:
    // 1. Not resetting
    // 2. Not already added (check ref)
    // 3. showWelcome is true
    // 4. chatbotId exists
    // 5. finalGreetingReady is false
    if (!isResetting && !greetingAddedRef.current && showWelcome && chatbotId && !finalGreetingReady) {
      greetingAddedRef.current = true; // Mark as added IMMEDIATELY
      
      setChatHistory([
        {
          sender: "bot",
          text: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
      setFinalGreetingReady(true);
      
      if (apiBase) {
        ensureGreetingTTS(welcomeMessage);
      }
    }
  }, [chatbotId, finalGreetingReady, welcomeMessage, apiBase, ensureGreetingTTS, showWelcome, isResetting]); */


  // Update welcome message periodically - DISABLED (not needed)
  /* useEffect(() => {
    const updateWelcomeMessage = () => {
      setWelcomeMessage(getTimeBasedGreeting());
    };

    updateWelcomeMessage();
    const interval = setInterval(updateWelcomeMessage, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); */




  // Debug effect to track authentication state (removed to prevent infinite loop)
  // useEffect(() => {
  //     verified,
  //     needsAuth,
  //     showInlineAuth,
  //     showInlineAuthInput,
  //     userMessageCount
  //   });
  // }, [verified, needsAuth, showInlineAuth, showInlineAuthInput, userMessageCount]);

  // Note: Removed autoplay functionality - greeting TTS now only plays on manual user interaction

  // Auto-scroll when new messages are added or typing starts
  useEffect(() => {
    if ((chatHistory.length > 0 || isTyping) && !showWelcome) {
      const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
          });
        } else if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      };
      
      // Immediate scroll
      scrollToBottom();
      
      // Additional scroll after a short delay
      const timeoutId = setTimeout(scrollToBottom, 100);
      
      // Extra scroll after content is fully rendered
      const extraTimeoutId = setTimeout(scrollToBottom, 300);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(extraTimeoutId);
      };
    }
  }, [chatHistory.length, isTyping, showWelcome]);

  // Auto-scroll when typing indicator appears (with user scroll detection)
  useEffect(() => {
    if (isTyping && !showWelcome) {
      let userHasScrolled = false;

      // Detect if user is manually scrolling
      const handleScroll = () => {
        if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

          // If user scrolls away from bottom, stop auto-scrolling
          if (!isNearBottom) {
            userHasScrolled = true;
          } else {
            userHasScrolled = false;
          }
        }
      };

      // Immediate scroll to end of messages (only if user hasn't scrolled)
      const scrollToBottom = () => {
        if (userHasScrolled) return; // Don't auto-scroll if user has manually scrolled up

        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        } else if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      };

      // Add scroll listener
      if (messagesContainerRef.current) {
        messagesContainerRef.current.addEventListener('scroll', handleScroll);
      }

      // Immediate scroll
      scrollToBottom();

      // Additional scroll after a short delay
      const timeoutId = setTimeout(scrollToBottom, 50);

      // Extra scroll after content is rendered
      const extraTimeoutId = setTimeout(scrollToBottom, 200);

      // Gentle continuous scroll during typing (only if user hasn't scrolled)
      const intervalId = setInterval(() => {
        if (isTyping && !showWelcome && !userHasScrolled) {
          scrollToBottom();
        }
      }, 500); // Reduced frequency from 200ms to 500ms

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(extraTimeoutId);
        clearInterval(intervalId);
        if (messagesContainerRef.current) {
          messagesContainerRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [isTyping, showWelcome]);

  // Auto-scroll when typing stops (message is complete)
  useEffect(() => {
    if (!isTyping && chatHistory.length > 0 && !showWelcome) {
      const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
          });
        } else if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      };
      
      // Immediate scroll when typing stops
      scrollToBottom();
      
      // Additional scroll after content is fully rendered
      const timeoutId = setTimeout(scrollToBottom, 100);
      
      // Extra scroll to ensure final message is visible
      const extraTimeoutId = setTimeout(scrollToBottom, 300);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(extraTimeoutId);
      };
    }
  }, [isTyping, chatHistory.length, showWelcome]);

  // Auto-scroll when switching from welcome to chat
  useEffect(() => {
    if (!showWelcome && chatHistory.length > 0) {
      const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
          });
        } else if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      };
      
      // Scroll when switching to chat view
      const timeoutId = setTimeout(scrollToBottom, 100);
      const extraTimeoutId = setTimeout(scrollToBottom, 300);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(extraTimeoutId);
      };
    }
  }, [showWelcome, chatHistory.length]);

  // Auto-scroll when phone input appears (authentication required)
  useEffect(() => {
    if (showInlineAuth && !showWelcome) {
      const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
          });
        } else if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      };
      
      // Scroll when phone input appears
      const timeoutId = setTimeout(scrollToBottom, 100);
      const extraTimeoutId = setTimeout(scrollToBottom, 300);
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(extraTimeoutId);
      };
    }
  }, [showInlineAuth, showWelcome]);

  // UNCOMMENTED: Handle inline auth input display after 2 messages
  useEffect(() => {

    if (
      showInlineAuth &&
      !verified &&
      !isTyping &&
      !otpSent
    ) {
      // Show auth input immediately if user has sent 2+ messages (page refresh scenario)
      if (userMessageCount >= 2) {
        setShowInlineAuthInput(true);
      } else {
        // For new messages, show auth input after a short delay regardless of animation
        const delayTimer = setTimeout(() => {
          setShowInlineAuthInput(true);
        }, 1000); // Reduced from 2000ms to 1000ms
        return () => clearTimeout(delayTimer);
      }
    } else {
      setShowInlineAuthInput(false);
    }
  }, [
    showInlineAuth,
    verified,
    isTyping,
    otpSent,
    userMessageCount,
  ]);

  // Handle OTP input display after animation completes - commented out for default auth state
  /* useEffect(() => {
    if (
      otpSent &&
      !verified &&
      !isTyping &&
      animatedMessageIdx === chatHistory.length - 1
    ) {
      setShowOtpInput(true);
    } else {
      setShowOtpInput(false);
    }
  }, [otpSent, verified, isTyping, animatedMessageIdx]); */

  // Check auth gate - commented out for default auth state
  /* useEffect(() => {
    if (!sessionId || verified || !authMethod) return;
    try {
      const shouldGate =
        localStorage.getItem(AUTH_GATE_KEY(sessionId, chatbotId)) === "1";
      if (shouldGate) {
        setNeedsAuth(true);
        setShowInlineAuth(true);
      }
    } catch {}
  }, [sessionId, verified, chatbotId, authMethod]); */

  // Handle resend timeout
  useEffect(() => {
    const saved = localStorage.getItem("resend_otp_start");
    if (saved) {
      const elapsed = Math.floor((Date.now() - parseInt(saved, 10)) / 1000);
      const remaining = 60 - elapsed;
      if (remaining > 0) {
        setResendTimeout(remaining);
        let countdown = remaining;
        const timer = setInterval(() => {
          countdown--;
          setResendTimeout(countdown);
          if (countdown <= 0) {
            clearInterval(timer);
            localStorage.removeItem("resend_otp_start");
          }
        }, 1000);
        setResendIntervalId(timer);
      }
    }
    return () => {
      if (resendIntervalId) clearInterval(resendIntervalId);
    };
  }, []);

  // Reset OTP when phone changes
  useEffect(() => {
    setOtpSent(false);
    setOtp("");
    setResendTimeout(0);
    localStorage.removeItem("resend_otp_start");
  }, [phone]);

  // Check mobile - Enhanced detection using utility
  useEffect(() => {
    const checkMobile = () => {
      const deviceInfo = getDeviceInfo();
      setIsMobile(deviceInfo.isMobile);
      
      // Log for debugging
    };

    checkMobile();
    
    // Add resize listener with debouncing for better performance
    const debouncedCheckMobile = debounce(checkMobile, 100);
    
    window.addEventListener("resize", debouncedCheckMobile);
    window.addEventListener("orientationchange", checkMobile); // Handle orientation changes
    
    return () => {
      window.removeEventListener("resize", debouncedCheckMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  // Add user interaction listeners - Enhanced for mobile
  useEffect(() => {
    const handleInteraction = () => {
      handleUserInteraction();
    };

    // Add multiple event listeners to catch different types of user interaction
    // Enhanced for better mobile touch support
    const events = [
      'click', 
      'touchstart', 
      'touchend', 
      'keydown', 
      'mousedown',
      'touchmove', // Add touchmove for better mobile detection
      'gesturestart', // iOS gesture support
      'gesturechange'
    ];
    
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { 
        once: true,
        passive: true, // Better performance on mobile
        capture: false
      });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [handleUserInteraction]);

  // Reset component when chatbot changes
  useEffect(() => {
    // Only reset if this is not the initial load
    if (hasMounted.current) {
      setVerified(false);
      setNeedsAuth(false);
      setShowAuthScreen(false);
      setOtpSent(false);
      setOtp("");
      setResendTimeout(0);
      setUserMessageCount(0);
      setShowInlineAuth(false);
      setShowInlineAuthInput(false);
      setShowOtpInput(false);
      lastGeneratedGreeting.current = null;
      localStorage.removeItem("resend_otp_start");
      greetingAutoPlayed.current = false;
      setChatHistory([]);
      setFinalGreetingReady(false);
      // Removed setHasShownInterestResponse - no longer needed
      languageMessageShown.current = false;
      
      // Clear user message count from localStorage
      if (sessionId) {
        try {
          const key = `supa_user_message_count:${chatbotId}:${sessionId}`;
          localStorage.removeItem(key);
        } catch (error) {
          console.error("Error clearing user message count:", error);
        }
      }
    } else {
      hasMounted.current = true;
    }

    // COMMENTED OUT - Auth gate logic disabled for backend-controlled auth
    /* if (sessionId) {
      try {
        const shouldGate =
          localStorage.getItem(AUTH_GATE_KEY(sessionId, chatbotId)) === "1";
        if (shouldGate) {
          setNeedsAuth(true);
          setShowInlineAuth(true);
        }
      } catch {}
    } */
  }, [chatbotId, sessionId, apiBase]);

  // OTP handling functions - commented out for default auth state
  /* const handleSendOtp = async () => {
    if (resendTimeout > 0 || !authMethod) return;
    try {
      setLoadingOtp(true);

      if (authMethod === "email") {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!ok) return toast.error("Enter a valid email address");
        await axios.post(`${apiBase}/otp/request-otp`, { email, chatbotId });
        toast.success("OTP sent to your email!");
      } else {
        const ok = /^[6-9]\d{9}$/.test(phone);
        if (!ok) return toast.error("Enter a valid 10-digit WhatsApp number");
        await axios.post(`${apiBase}/whatsapp-otp/send`, { phone, chatbotId });
        toast.success("OTP sent to your WhatsApp number!");
      }

      setOtpSent(true);

      const now = Date.now();
      localStorage.setItem("resend_otp_start", now.toString());
      setResendTimeout(60);
      let countdown = 60;
      const timer = setInterval(() => {
        countdown--;
        setResendTimeout(countdown);
        if (countdown <= 0) {
          clearInterval(timer);
          localStorage.removeItem("resend_otp_start");
        }
      }, 1000);
      setResendIntervalId(timer);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  }; */

  /* const handleVerifyOtp = async () => {
    try {
      if (otp.length !== 6)
        return toast.error("Please enter the complete 6-digit code");
      setLoadingVerify(true);

      let res;
      if (authMethod === "email") {
        res = await axios.post(`${apiBase}/otp/verify-otp`, {
          email,
          otp,
          chatbotId,
        });
      } else {
        res = await axios.post(`${apiBase}/whatsapp-otp/verify`, {
          phone,
          otp,
          chatbotId,
        });
      }

      if (res.data.success) {
        localStorage.setItem(
          SESSION_STORE_KEY(authMethod),
          authMethod === "email" ? email : phone
        );
        setVerified(true);
        setNeedsAuth(false);
        setShowAuthScreen(false);
        setShowInlineAuth(false);
        setShowInlineAuthInput(false);
        setShowOtpInput(false);

        try {
          const sid = sessionId || localStorage.getItem("sessionId");
          if (sid) {
            localStorage.removeItem(AUTH_GATE_KEY(sid, chatbotId));
            const key = `supa_user_message_count:${chatbotId}:${sid}`;
            localStorage.removeItem(key);
            setUserMessageCount(0);
          }
        } catch {}

        toast.success(
          "✅ Verified successfully! You can now continue chatting."
        );
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch {
      toast.error("An error occurred during verification.");
    } finally {
      setLoadingVerify(false);
    }
  }; */

  const toggleMute = () => {
    const newMutedState = !isMuted;
    
    // Update the state first
    setIsMuted(newMutedState);
    
    // Then apply the mute state to currently playing audio
    if (currentlyPlaying !== null) {
      muteCurrentAudio(newMutedState);
    } else {
    }
  };

  // Removed handleSuggestionClick function - no longer needed



  // New authentication functions using the authentication hook
  const handleSendOtpNew = async (phoneNumber) => {
    try {
      setCurrentAuthValue(phoneNumber);
      await sendOtp(phoneNumber);
      setShowInlineAuthInput(false);
      setShowOtpInput(true);
      toast.success('OTP sent to your WhatsApp!');
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtpNew = async (otpCode) => {
    try {
      const authResult = await verifyOtp(otpCode, currentAuthValue);
      // Set phone state for transcript functionality
      setPhone(currentAuthValue);
      // Store authenticated phone in ref for immediate use
      authenticatedPhoneRef.current = currentAuthValue;
      setShowOtpInput(false);
      setShowInlineAuth(false);
      toast.success('Authentication successful!');

      // Send pending message if user had tried to send one before auth
      if (pendingMessageAfterAuth.current) {
        const messageToSend = pendingMessageAfterAuth.current;
        pendingMessageAfterAuth.current = null;

        // IMPORTANT: Clear manual streaming response FIRST to prevent showing old content
        console.log('🧹 STEP 1: Clearing old streaming states');
        console.log('   - Current manualStreamingResponse:', manualStreamingResponse);
        console.log('   - Current currentStreamingMessageId:', currentStreamingMessageId);

        setManualStreamingResponse('');
        setCurrentStreamingMessageId(null); // Clear any previous streaming ID

        console.log('⏳ STEP 2: Waiting 50ms for state to clear...');

        // Small delay to ensure state clears before starting new stream
        setTimeout(() => {
          console.log('🚀 STEP 3: Starting new stream');
          console.log('   - manualStreamingResponse after clear:', manualStreamingResponse);
          console.log('   - Phone being sent:', currentAuthValue);
          // Send directly to backend with authenticated phone
          // We can't use sendStreamingMessage because the hook hasn't re-rendered with new phone yet
          const streamUrl = `${apiBase}/troika/intelligent-chat/stream`;
          const requestData = {
            chatbotId,
            query: messageToSend,
            sessionId,
            enableTTS: false,
            phone: currentAuthValue, // Use the authenticated phone directly
          };

          // Track which tab this message was sent from
          const currentTab = getCurrentTab();
          setMessageOriginTab(currentTab);

          // Set typing and streaming state
          setIsTyping(true);
          const messageId = `streaming-${Date.now()}`;
          console.log('🆔 STEP 4: Setting new streaming ID:', messageId);
          setCurrentStreamingMessageId(messageId);

          // Make the API call directly using fetch
          fetch(streamUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to send message');
            }
            return response.body;
          })
          .then(body => {
            const reader = body.getReader();
            const decoder = new TextDecoder();
            let fullAnswer = '';

            // Read the stream
            let isComplete = false;
            function readStream() {
              reader.read().then(({ done, value }) => {
                if (done || isComplete) {
                  // Stream complete - add final message to chat
                  console.log('✅ Stream done, adding final message');
                  if (fullAnswer) {
                    const botMessage = {
                      sender: "bot",
                      text: fullAnswer,
                      timestamp: new Date(),
                    };
                    addMessageToTab(currentTab, botMessage);
                  }
                  setIsTyping(false);
                  setCurrentStreamingMessageId(null);
                  setManualStreamingResponse('');
                  setMessageOriginTab(null);
                  // Reset the skip flag so next user message is added properly
                  skipAddingUserMessage.current = false;
                  return;
                }

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                  // Check for event type
                  if (line.startsWith('event: complete') || line.startsWith('event: close')) {
                    console.log('🎉 STEP 6: Stream completion detected');
                    isComplete = true;
                  }

                  if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (data && data !== '[DONE]') {
                      try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                          fullAnswer += parsed.content;
                          // Update the manual streaming response for live display
                          setManualStreamingResponse(fullAnswer);
                          if (fullAnswer.length < 50) {
                            console.log('📝 STEP 5: First token received, fullAnswer:', fullAnswer);
                          }
                        }
                      } catch (e) {
                        // Ignore parse errors
                      }
                    }
                  }
                }

                // Continue reading if not complete
                if (!isComplete) {
                  readStream();
                } else {
                  // Manually trigger completion
                  console.log('✅ STEP 7: Completing stream and adding final message');
                  if (fullAnswer) {
                    const botMessage = {
                      sender: "bot",
                      text: fullAnswer,
                      timestamp: new Date(),
                    };
                    addMessageToTab(currentTab, botMessage);
                  }
                  console.log('🧹 STEP 8: Clearing streaming states');
                  setIsTyping(false);
                  setCurrentStreamingMessageId(null);
                  setManualStreamingResponse('');
                  setMessageOriginTab(null);
                  // Reset the skip flag so next user message is added properly
                  skipAddingUserMessage.current = false;
                }
              });
            }

            readStream();
          })
          .catch(error => {
            console.error('Error sending message:', error);
            setIsTyping(false);
            setCurrentStreamingMessageId(null);
            setManualStreamingResponse('');
            toast.error('Failed to send message. Please try again.');
          });
        }, 50); // 50ms delay to allow state to clear
      }
    } catch (error) {
      toast.error(error.message || 'Invalid OTP');
    }
  };

  const handleResendOtpNew = async () => {
    try {
      if (!currentAuthValue) {
        toast.error('Enter your WhatsApp number first.');
        return;
      }
      await resendOtp(currentAuthValue);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };

  // shouldShowAuth is now controlled by showInlineAuth state, not by message count
  // This allows the send button to remain enabled until user actually tries to send
  const shouldShowAuth = false;

  // ===== USER COLLECTION UTILITY FUNCTIONS =====

  /**
   * Extract and validate user's name from message
   */
  const extractAndValidateName = (message) => {
    const cleaned = message.trim();

    // Check for skip keywords
    if (/^(skip|no|cancel|later|next)$/i.test(cleaned)) {
      return { valid: false, skipped: true };
    }

    // Try to extract name from common patterns
    let extractedName = cleaned;

    // Pattern: "Call me X" or "You can call me X"
    const callMeMatch = cleaned.match(/(?:you can )?call me (.+)/i);
    if (callMeMatch) {
      extractedName = callMeMatch[1].trim();
    }

    // Pattern: "My name is X" or "I'm X" or "I am X"
    const nameIsMatch = cleaned.match(/(?:my name is|i'm|i am) (.+)/i);
    if (nameIsMatch) {
      extractedName = nameIsMatch[1].trim();
    }

    // Pattern: "It's X" or "This is X"
    const itsMatch = cleaned.match(/(?:it's|this is) (.+)/i);
    if (itsMatch) {
      extractedName = itsMatch[1].trim();
    }

    // Clean up common trailing words
    extractedName = extractedName.replace(/\s+(here|please|thanks?|thank you)$/i, '').trim();

    // Validate extracted name: 2-50 characters
    if (extractedName.length >= 2 && extractedName.length <= 50) {
      return { valid: true, name: extractedName, skipped: false };
    }

    return { valid: false, skipped: false };
  };

  /**
   * Extract and validate phone number from message
   */
  const extractAndValidatePhone = (message) => {
    const cleaned = message.trim();

    // Check for skip keywords
    if (/^(skip|no|cancel|later|next)$/i.test(cleaned)) {
      return { valid: false, skipped: true };
    }

    // Extract phone number (supports various formats)
    // +91 9834699858, 9834699858, +919834699858, 91-9834699858
    const phoneRegex = /(?:\+?91[-\s]?)?([6-9]\d{9})/;
    const match = cleaned.match(phoneRegex);

    if (match) {
      const phone = match[1]; // Get just the 10 digits
      return { valid: true, phone: phone, skipped: false };
    }

    return { valid: false, skipped: false };
  };

  /**
   * Check if message is a question or regular query (not a name/phone response)
   */
  const isRegularQuery = (message) => {
    const lowerMessage = message.toLowerCase().trim();

    // Question indicators
    const questionWords = ['what', 'why', 'how', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does', 'tell me', 'show me', 'explain', 'help'];
    const hasQuestionWord = questionWords.some(word => lowerMessage.startsWith(word) || lowerMessage.includes(` ${word} `));
    const hasQuestionMark = message.includes('?');

    // Service/product related keywords
    const queryKeywords = ['price', 'cost', 'package', 'service', 'product', 'offer', 'demo', 'feature', 'about', 'detail', 'information'];
    const hasQueryKeyword = queryKeywords.some(keyword => lowerMessage.includes(keyword));

    // If message is longer than typical name (>15 chars) and contains question indicators
    const isLongMessage = message.length > 15;

    return (hasQuestionWord || hasQuestionMark || hasQueryKeyword) && isLongMessage;
  };

  /**
   * User collection prompts - Natural, no mention of "skip"
   */
  const USER_COLLECTION_PROMPTS = {
    askName: "By the way, Can you please tell me your name?",

    thankName: (name) => `May I have your phone number to keep you updated?`,

    confirmBoth: (name) => `Thank you, ${name}! How can I assist you today?.`,

    confirmNameOnly: (name) => `Thank you, ${name}!`,

    welcomeBack: (name) => `Welcome back, ${name}! How can I help you today?`
  };

  // ===== END USER COLLECTION UTILITY FUNCTIONS =====

  const handleSendMessage = useCallback(
    async (inputText) => {

      // Hide welcome section when user sends a message
      if (showWelcome) {
        setShowWelcome(false);
      }

      if (!sessionId) {
        return;
      }

      const textToSend = inputText || message;
      if (!textToSend.trim()) return;

      // ===== USER COLLECTION FLOW =====

      const currentTab = getCurrentTab();

      // Handle ASKING_NAME state
      if (userCollectionState === 'ASKING_NAME') {
        // ALWAYS try to extract name from message, even if it's a question
        const nameResult = extractAndValidateName(textToSend);

        // Check if user is asking a question
        const isQuery = isRegularQuery(textToSend);

        if (nameResult.valid) {
          // Found a valid name in the message!
          setUserName(nameResult.name);
          localStorage.setItem('chatbot_user_name', nameResult.name);
          localStorage.setItem('chatbot_user_collection_state', 'ASKING_PHONE');
          setUserCollectionState('ASKING_PHONE');

          // Add user message
          const userMessage = { sender: "user", text: textToSend, timestamp: new Date() };
          addMessageToTab(currentTab, userMessage);
          setMessage("");

          if (isQuery) {
            // User asked a question AND provided name - process query first
            // Fall through to send their question to backend
            // Phone will be asked after 3rd message (handled in onComplete callback)
          } else {
            // Just provided name - acknowledge but don't ask for phone yet
            // Phone will be asked after 3rd message (handled in onComplete callback)
            const botMessage = {
              sender: "bot",
              text: `Nice to meet you, ${nameResult.name}! How can I help you?`,
              timestamp: new Date()
            };
            addMessageToTab(currentTab, botMessage);
            return;
          }
        } else if (isQuery) {
          // It's a question but no valid name found - skip name collection
          setUserCollectionState('SKIPPED');
          // Fall through to process query
        } else {
          // Not a valid name and not a query - skip collection
          setUserCollectionState('SKIPPED');

          // Add user message
          const userMessage = { sender: "user", text: textToSend, timestamp: new Date() };
          addMessageToTab(currentTab, userMessage);
          setMessage("");
          // Fall through
        }
      }

      // Handle ASKING_PHONE state
      if (userCollectionState === 'ASKING_PHONE') {
        // ALWAYS try to extract phone from message, even if it's a question
        const phoneResult = extractAndValidatePhone(textToSend);

        // Check if user is asking a question
        const isQuery = isRegularQuery(textToSend);

        if (phoneResult.valid) {
          // Found a valid phone in the message!
          setUserPhone(phoneResult.phone);
          localStorage.setItem('chatbot_user_phone', phoneResult.phone);
          localStorage.setItem('chatbot_user_collection_state', 'COLLECTED');
          setUserCollectionState('COLLECTED');

          // Add user message
          const userMessage = { sender: "user", text: textToSend, timestamp: new Date() };
          addMessageToTab(currentTab, userMessage);
          setMessage("");

          if (isQuery) {
            // User asked a question AND provided phone - process query first
            // Fall through to send their question to backend
          } else {
            // Just provided phone - subtle confirmation
            const botMessage = {
              sender: "bot",
              text: USER_COLLECTION_PROMPTS.confirmBoth(userName),
              timestamp: new Date()
            };
            addMessageToTab(currentTab, botMessage);
            return;
          }
        } else {
          // No valid phone found - mark as collected with just name
          setUserCollectionState('COLLECTED');
          localStorage.setItem('chatbot_user_collection_state', 'COLLECTED');

          // Add user message
          const userMessage = { sender: "user", text: textToSend, timestamp: new Date() };
          addMessageToTab(currentTab, userMessage);
          setMessage("");
          // Fall through to process as regular query
        }
      }

      // ===== END USER COLLECTION FLOW =====

      // Handle INITIAL state - trigger collection after 1st message (ask for name)
      if (userCollectionState === 'INITIAL') {
        // Calculate new count before incrementing (since state updates are async)
        const newMessageCount = userMessageCount + 1;
        const willAskForName = newMessageCount === 1; // Ask for name after 1st message
        
        // Increment user message count
        incrementUserMessageCount();

        // Stop any currently streaming response
        if (isStreaming) {
          stopStreaming();
        }

        // Properly stop any currently playing audio
        stopAudio();

        // Small delay to ensure audio is fully stopped
        await new Promise(resolve => setTimeout(resolve, 50));

        // Add user message
        const userMessage = { sender: "user", text: textToSend, timestamp: new Date() };
        addMessageToTab(currentTab, userMessage);

        // Track which tab this message was sent from
        setMessageOriginTab(currentTab);

        setMessage("");
        setIsTyping(true);

        // Send the message to backend
        try {
          if (!apiBase) {
            throw new Error('API Base URL is not defined');
          }

          const messageId = `streaming-${Date.now()}`;
          setCurrentStreamingMessageId(messageId);

          // Send message with current user data
          // Check localStorage as fallback in case state hasn't updated yet (React async state updates)
          const currentName = userName || localStorage.getItem('chatbot_user_name') || null;
          const currentPhone = userPhone || localStorage.getItem('chatbot_user_phone') || null;
          await sendStreamingMessage(textToSend, {
            name: currentName,
            phone: currentPhone,
            email: null
          });

          // After bot responds, ask for name if this is the 1st message
          if (willAskForName) {
            setTimeout(() => {
              const botMessage = {
                sender: "bot",
                text: USER_COLLECTION_PROMPTS.askName,
                timestamp: new Date()
              };
              addMessageToTab(currentTab, botMessage);
              setUserCollectionState('ASKING_NAME');
            }, 500);
          }

          return;
        } catch (error) {
          console.error('Error sending message:', error);
          setCurrentStreamingMessageId(null);
          setIsTyping(false);
          toast.error('Failed to send message. Please try again.');
          return;
        }
      }

      // Increment user message count
      incrementUserMessageCount();

      // Stop any currently streaming response
      if (isStreaming) {
        stopStreaming();
      }

      // Properly stop any currently playing audio
      stopAudio();

      // Small delay to ensure audio is fully stopped
      await new Promise(resolve => setTimeout(resolve, 50));

      // Add message to current tab using route-based system (unless we should skip it)
      // Note: currentTab already declared at the top of function

      if (!skipAddingUserMessage.current) {
        const userMessage = { sender: "user", text: textToSend, timestamp: new Date() };
        addMessageToTab(currentTab, userMessage);
      } else {
        skipAddingUserMessage.current = false; // Reset flag
      }

      // Track which tab this message was sent from
      setMessageOriginTab(currentTab);

      setMessage("");
      setIsTyping(true);

      // Scroll immediately when typing starts
      const scrollImmediately = () => {
        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        } else if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      };

      // Immediate scroll
      scrollImmediately();

      // Additional scroll after content is rendered
      setTimeout(scrollImmediately, 100);
      setTimeout(scrollImmediately, 300);

      try {
        // Check if apiBase is defined
        if (!apiBase) {
          throw new Error('API Base URL is not defined');
        }

        // Generate a unique message ID for tracking streaming response
        const messageId = `streaming-${Date.now()}`;
        setCurrentStreamingMessageId(messageId);

        // Start streaming response with current user data
        // Check localStorage as fallback in case state hasn't updated yet (React async state updates)
        const currentName = userName || localStorage.getItem('chatbot_user_name') || null;
        const currentPhone = userPhone || localStorage.getItem('chatbot_user_phone') || null;
        await sendStreamingMessage(textToSend, {
          name: currentName,
          phone: currentPhone,
          email: null
        });

        // Note: The response is handled in the onComplete callback of useStreamingChat
        // The streaming response will be displayed in real-time via StreamingMessage component

      } catch (error) {
        console.error('Error sending message:', error);
        setCurrentStreamingMessageId(null);
        setIsTyping(false);
        toast.error('Failed to send message. Please try again.');
      }
    },
    [
      showWelcome,
      sessionId,
      message,
      stopAudio,
      getCurrentTab,
      addMessageToTab,
      incrementUserMessageCount,
      apiBase,
      chatbotId,
      sendStreamingMessage,
      isStreaming,
      stopStreaming,
      shouldShowAuth,
      authToken,
      userMessageCount
    ]
  );

  const handleServiceSelection = useCallback((serviceName) => {
    
    // Hide service selection buttons
    setShowServiceSelection(false);
    
    // Send pricing request message to backend
    const pricingMessage = `give me pricing of ${serviceName}`;
    handleSendMessage(pricingMessage);
  }, [handleSendMessage]);

  const handleBackToWelcome = useCallback(() => {
    
    // Set resetting flag
    setIsResetting(true);
    
    // Clear audio states
    stopAudio();
    setIsTyping(false);
    setShowServiceSelection(false);
    
    // Clear refs
    lastGeneratedGreeting.current = null;
    greetingAutoPlayed.current = false;
    pendingGreetingAudio.current = null;
    greetingAddedRef.current = false; // Reset this too
    
    // Clear states
    setMessage("");
    setUserMessageCount(0);
    setFinalGreetingReady(false);
    setChatHistory([]);
    navigate('/'); // Navigate to home route
    setShowWelcome(false); // Set to false first
    
    // Clear user message count from localStorage
    if (sessionId && chatbotId) {
      try {
        const key = `supa_user_message_count:${chatbotId}:${sessionId}`;
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error clearing user message count:", error);
      }
    }
    
    // Generate new session ID
    const newSessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", newSessionId);
    setSessionId(newSessionId);
    
    // After delay, enable welcome mode
    setTimeout(() => {
      setShowWelcome(true);
      setIsResetting(false);
    }, 50);
    
  }, [sessionId, chatbotId, stopAudio, navigate]);

  const handleSuggestionClick = useCallback((action) => {
    // Handle navigation actions
    if (typeof action === 'object' && action.type === 'navigation') {
      handleTabNavigation(action.action);
      return;
    }

    // Get current tab and clear its history
    const currentTab = getCurrentTab();
    clearTabHistory(currentTab);
    setShowWelcome(false);

    // Handle conversational flow data
    if (typeof action === 'object' && action.type === 'conversational') {
      setTimeout(() => {
        // Add user message to current tab
        const userMessage = {
          sender: "user",
          text: action.action.replace('telegram-', '').replace('-', ' ').toUpperCase(),
          timestamp: new Date()
        };
        addMessageToTab(currentTab, userMessage);
        
        // Add bot message with conversational content
        setIsTyping(true);
        
        // Scroll immediately when typing starts
        const scrollImmediately = () => {
          if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end' 
            });
          } else if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            });
          }
        };
        
        // Immediate scroll
        scrollImmediately();
        
        // Additional scroll after content is rendered
        setTimeout(scrollImmediately, 100);
        setTimeout(scrollImmediately, 300);
        
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: action.message,
            timestamp: new Date(),
            suggestions: action.suggestions || []
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
          
          // Increment bot message count
          incrementBotMessageCount();
          
          // Force scroll to bottom after message is added
          setTimeout(() => {
            if (endOfMessagesRef.current) {
              endOfMessagesRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end' 
              });
            } else if (messagesContainerRef.current) {
              const container = messagesContainerRef.current;
              container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
              });
            }
          }, 100);
        }, 500);
      }, 50);
      return;
    }

    // Check if action is HTML content (starts with <div)
    if (typeof action === 'string' && action.startsWith('<div')) {
      // Use setTimeout to ensure state clearing is complete
      setTimeout(() => {
        // Add user message to current tab
        const userMessage = {
          sender: "user",
          text: "Tell me about AI Calling Agent",
          timestamp: new Date()
        };
        addMessageToTab(currentTab, userMessage);
        
        // Add bot message with HTML content
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: action, // This will be HTML content
            timestamp: new Date(),
            isHTML: true // Flag to indicate this is HTML content
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
        }, 500);
      }, 50); // Small delay to ensure clearing
      return;
    }
    
    // Special handling for pricing - show pricing content
    if (action === 'pricing') {
      setTimeout(() => {
        const userMessage = { 
          sender: "user", 
          text: "What are your pricing plans?", 
          timestamp: new Date() 
        };
        addMessageToTab(currentTab, userMessage);
        
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: staticFAQs["Pricing"],
            timestamp: new Date()
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
        }, 500);
      }, 50);
      return;
    }

    // Special handling for results - show AI Websites results content
    if (action === 'results') {
      setTimeout(() => {
        const userMessage = { 
          sender: "user", 
          text: "Show me the results of AI Websites", 
          timestamp: new Date() 
        };
        addMessageToTab(currentTab, userMessage);
        
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: `<div style='text-align: left; line-height: 1.6; color: #374151; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;'>
              <div style='font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; text-align: center; background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'>🎯 FINAL RESULT</div>
              <div style='background: linear-gradient(135deg, #1f2937, #374151); padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem; color: white; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);'>
                <div style='font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #fbbf24; text-align: center; display: flex; align-items: center; justify-content: center;'>
                  <span style='margin-right: 0.5rem; font-size: 2rem;'>🎯</span>FINAL RESULT
                </div>
                <div style='background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 5px solid #fbbf24; margin-bottom: 1.5rem;'>
                  <div style='font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; color: #fbbf24;'>With Troika AI Website, your business gets:</div>
                  <div style='display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));'>
                    <div style='background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981;'>
                      <div style='font-weight: 600; color: #ffffff; margin-bottom: 0.5rem; display: flex; align-items: center;'>
                        <span style='margin-right: 0.5rem; font-size: 1.2rem;'>✅</span>Professional design & AI-powered automation
                      </div>
                    </div>
                    <div style='background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #3b82f6;'>
                      <div style='font-weight: 600; color: #ffffff; margin-bottom: 0.5rem; display: flex; align-items: center;'>
                        <span style='margin-right: 0.5rem; font-size: 1.2rem;'>✅</span>24×7 chat and response system
                      </div>
                    </div>
                    <div style='background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #8b5cf6;'>
                      <div style='font-weight: 600; color: #ffffff; margin-bottom: 0.5rem; display: flex; align-items: center;'>
                        <span style='margin-right: 0.5rem; font-size: 1.2rem;'>✅</span>Lead tracking and analytics
                      </div>
                    </div>
                    <div style='background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #f59e0b;'>
                      <div style='font-weight: 600; color: #ffffff; margin-bottom: 0.5rem; display: flex; align-items: center;'>
                        <span style='margin-right: 0.5rem; font-size: 1.2rem;'>✅</span>Multilingual reach
                      </div>
                    </div>
                    <div style='background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #ef4444;'>
                      <div style='font-weight: 600; color: #ffffff; margin-bottom: 0.5rem; display: flex; align-items: center;'>
                        <span style='margin-right: 0.5rem; font-size: 1.2rem;'>✅</span>Ongoing support & growth insights
                      </div>
                    </div>
                  </div>
                </div>
                <div style='background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 5px solid #fbbf24; text-align: center;'>
                  <div style='font-size: 1.2rem; font-weight: 600; color: #fbbf24; margin-bottom: 0.5rem; font-style: italic;'>"We don't just design websites  we build digital employees that work for you, every second."</div>
                </div>
              </div>
            </div>`,
            timestamp: new Date(),
            isHTML: true
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
        }, 500);
      }, 50);
      return;
    }

    // Static FAQ responses for AI website questions
    const staticFAQs = {
      "Pricing": `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb; margin-bottom: 20px; font-size: 24px; font-weight: 700;">AI WEBSITE PLANS & PRICING</h2>
        
        <div style="margin: 20px 0; overflow-x: auto; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
          <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <th style="padding: 16px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Plan</th>
                <th style="padding: 16px; text-align: center; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Setup</th>
                <th style="padding: 16px; text-align: center; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Monthly</th>
                <th style="padding: 16px; text-align: center; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Chats/Month</th>
                <th style="padding: 16px; text-align: center; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Languages</th>
                <th style="padding: 16px; text-align: left; font-weight: 600;">Ideal For</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 700; color: #374151; font-size: 16px;">Basic</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #059669; font-weight: 700; font-size: 18px;">₹50,000</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #059669; font-weight: 700; font-size: 18px;">₹5,000</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #4b5563; font-weight: 500;">5,000</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #4b5563; font-weight: 500;">2</td>
                <td style="padding: 16px; color: #4b5563;">Small businesses / institutes starting digital presence</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 700; color: #374151; font-size: 16px;">Advanced</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #059669; font-weight: 700; font-size: 18px;">₹75,000</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #059669; font-weight: 700; font-size: 18px;">₹7,500</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #4b5563; font-weight: 500;">10,000</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #4b5563; font-weight: 500;">3–4</td>
                <td style="padding: 16px; color: #4b5563;">Growing brands needing automation & analytics</td>
              </tr>
              <tr>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 700; color: #374151; font-size: 16px;">Premium</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #059669; font-weight: 700; font-size: 18px;">₹1,00,000</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #059669; font-weight: 700; font-size: 18px;">₹10,000</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #4b5563; font-weight: 500;">15,000</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; text-align: center; color: #4b5563; font-weight: 500;">5+</td>
                <td style="padding: 16px; color: #4b5563;">Enterprises seeking full-scale AI + multilingual setup</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #0c4a6e;">🕒 Timeline: 7 Days to go live</p>
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #0c4a6e;">💬 Support: AI Agent + Human monitoring</p>
          <p style="margin: 0; font-weight: 600; color: #0c4a6e;">📊 Includes: Chat handling • Knowledgebase management • Lead capture • Analytics dashboard • Response optimization</p>
        </div>

        <h3 style="color: #dc2626; margin: 30px 0 15px 0; font-size: 20px; font-weight: 700;">PRICE JUSTIFICATION</h3>
        
        <div style="margin: 20px 0; overflow-x: auto; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
          <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 12px; overflow: hidden;">
            <thead>
              <tr style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white;">
                <th style="padding: 16px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Component</th>
                <th style="padding: 16px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Purpose</th>
                <th style="padding: 16px; text-align: center; font-weight: 600;">Included In</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 600; color: #374151;">AI Design & Development</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; color: #4b5563;">Responsive, mobile-first WordPress build with Troika AI interface</td>
                <td style="padding: 16px; text-align: center; color: #059669; font-weight: 600;">Setup</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Knowledgebase Creation</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; color: #4b5563;">Business data, FAQs, and chatbot training</td>
                <td style="padding: 16px; text-align: center; color: #059669; font-weight: 600;">Setup</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 600; color: #374151;">AI Chat Integration</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; color: #4b5563;">Smart lead capture + multilingual AI response system</td>
                <td style="padding: 16px; text-align: center; color: #059669; font-weight: 600;">Setup</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Analytics & Dashboard Setup</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; color: #4b5563;">Google Analytics, heatmaps, and conversion tracking</td>
                <td style="padding: 16px; text-align: center; color: #059669; font-weight: 600;">Setup</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Monthly Hosting & Maintenance</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; color: #4b5563;">Server, SSL, backups, plugin updates</td>
                <td style="padding: 16px; text-align: center; color: #dc2626; font-weight: 600;">Monthly</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Lead & Chat Management</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; color: #4b5563;">Real-time chat handling and response improvement</td>
                <td style="padding: 16px; text-align: center; color: #dc2626; font-weight: 600;">Monthly</td>
              </tr>
              <tr>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Reports & Insights</td>
                <td style="padding: 16px; border-right: 1px solid #e5e7eb; color: #4b5563;">Monthly analytics + optimization suggestions</td>
                <td style="padding: 16px; text-align: center; color: #dc2626; font-weight: 600;">Monthly</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h4 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">✅ Result:</h4>
          <p style="margin: 0 0 10px 0; font-size: 16px;">Your business gets a full digital ecosystem not just a website.</p>
          <p style="margin: 0; font-size: 16px;">It captures leads, answers customers, tracks performance, and improves continuously.</p>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 700;">⚡ WHAT YOU GET IN EVERY PLAN</h4>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            <li style="margin-bottom: 8px;">100% Responsive, fast, Business-ready website</li>
            <li style="margin-bottom: 8px;">AI chat agent integrated (Supa Agent)</li>
            <li style="margin-bottom: 8px;">Multilingual chat & content</li>
            <li style="margin-bottom: 8px;">Analytics and lead dashboard</li>
            <li style="margin-bottom: 8px;">CRM integration</li>
            <li style="margin-bottom: 8px;">Monthly data reports</li>
            <li style="margin-bottom: 8px;">Technical support & uptime guarantee</li>
            <li style="margin-bottom: 0;">Optional upgrades: Voice calls, RCS</li>
          </ul>
        </div>
      </div>`,

      "FAQs": `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb; margin-bottom: 30px; font-size: 28px; font-weight: 700; text-align: center;">AI WEBSITES - FREQUENTLY ASKED QUESTIONS</h2>
        
        <div style="margin-bottom: 40px;">
          <h3 style="color: #dc2626; margin-bottom: 20px; font-size: 22px; font-weight: 700; border-bottom: 3px solid #dc2626; padding-bottom: 8px;">General</h3>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q1. What's included in "Monthly Management"?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">We manage your complete digital ecosystem  chat responses, lead handling, analytics tracking, knowledgebase updates, and AI fine-tuning.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q2. Can the website talk in multiple languages?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Yes  depending on your plan, 2 to 5+ languages are supported (English, Hindi, Marathi, Gujarati, etc.).</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q3. How soon can it go live?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Within 7 working days from receiving your business details.</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="color: #7c3aed; margin-bottom: 20px; font-size: 22px; font-weight: 700; border-bottom: 3px solid #7c3aed; padding-bottom: 8px;">Technical</h3>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #8b5cf6;">
            <h4 style="color: #5b21b6; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q4. What platform is used?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Built on WordPress with Troika AI integrations  giving flexibility, security, and performance.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q5. Will I get admin access?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Yes, complete ownership and backend access are provided.</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q6. Is it SEO-friendly?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Yes, it includes keyword-ready structure, Google Analytics setup, and sitemap submission.</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="color: #ea580c; margin-bottom: 20px; font-size: 22px; font-weight: 700; border-bottom: 3px solid #ea580c; padding-bottom: 8px;">Integration & Features</h3>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #f97316;">
            <h4 style="color: #c2410c; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q7. Can I integrate it with other platforms?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Absolutely. All Troika AI Websites come pre-integrated with Supa Agent and optional voice or RCS agents.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q8. Can I track leads?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Yes  every form, chat, and click is logged in your analytics dashboard.</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q9. Can I upgrade my plan later?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Yes  you can move from Basic to Advanced or Premium anytime by paying the difference.</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="color: #059669; margin-bottom: 20px; font-size: 22px; font-weight: 700; border-bottom: 3px solid #059669; padding-bottom: 8px;">Pricing & ROI</h3>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q10. Why is there a monthly cost?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Because your website is now an intelligent system, not a static page  monthly maintenance covers AI hosting, chat management, analytics, and updates.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q11. What is the ROI?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Clients report 2×–6× increase in qualified leads and up to 70% reduction in missed inquiries within the first 60 days.</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
            <h4 style="color: white; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q12. Why Troika Tech?</h4>
            <p style="margin: 0; color: #e0e7ff; font-size: 15px;">Because we deliver complete digital ecosystems  AI Websites + Supa Agent + Analytics  not just templates.</p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-top: 30px;">
          <h4 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">Still have questions?</h4>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Our AI assistant is here to help! Ask any specific questions about your business needs.</p>
        </div>
      </div>`,

      "inbound-calling": `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb; margin-bottom: 30px; font-size: 28px; font-weight: 700; text-align: center;">INBOUND CALLING AGENT</h2>
        
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700;">24×7 Intelligent Call Handling</h3>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your AI agent never sleeps, never takes breaks, and never misses a call.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📞 Call Reception</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Professional greeting in multiple languages</li>
              <li>Instant call routing to appropriate departments</li>
              <li>Caller identification and verification</li>
              <li>Queue management and hold music</li>
            </ul>
          </div>

          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🤖 AI Responses</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Natural conversation flow</li>
              <li>Context-aware responses</li>
              <li>FAQ handling and support</li>
              <li>Appointment scheduling</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📊 Lead Capture</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Automatic lead qualification</li>
              <li>Contact information collection</li>
              <li>CRM integration</li>
              <li>Follow-up scheduling</li>
            </ul>
          </div>

          <div style="background: #fdf2f8; padding: 20px; border-radius: 12px; border-left: 4px solid #ec4899;">
            <h4 style="color: #be185d; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📈 Analytics</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Call duration tracking</li>
              <li>Conversion rate monitoring</li>
              <li>Customer satisfaction scores</li>
              <li>Performance reports</li>
            </ul>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; text-align: center;">
          <h4 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">Ready to Never Miss Another Call?</h4>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Let our AI handle your calls while you focus on growing your business.</p>
        </div>
      </div>`,

      "outbound-calling": `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb; margin-bottom: 30px; font-size: 28px; font-weight: 700; text-align: center;">OUTBOUND CALLING AGENT</h2>
        
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700;">Proactive Customer Engagement</h3>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Turn your contact list into a revenue-generating machine with AI-powered outbound calls.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #dc2626;">
            <h4 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📞 Lead Follow-up</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Automatic follow-up calls</li>
              <li>Appointment reminders</li>
              <li>Payment follow-ups</li>
              <li>Customer satisfaction surveys</li>
            </ul>
          </div>

          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🎯 Sales Calls</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Product/service promotion</li>
              <li>Upselling and cross-selling</li>
              <li>Deal closing assistance</li>
              <li>Objection handling</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📅 Campaign Management</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Bulk calling campaigns</li>
              <li>Time zone optimization</li>
              <li>Call scheduling</li>
              <li>Campaign performance tracking</li>
            </ul>
          </div>

          <div style="background: #fdf2f8; padding: 20px; border-radius: 12px; border-left: 4px solid #ec4899;">
            <h4 style="color: #be185d; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📊 Results Tracking</h4>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Call success rates</li>
              <li>Conversion tracking</li>
              <li>ROI measurement</li>
              <li>Detailed analytics</li>
            </ul>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 25px; border-radius: 12px; text-align: center;">
          <h4 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">Scale Your Sales Efforts</h4>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Let AI make thousands of calls while you focus on closing deals.</p>
        </div>
      </div>`,

      "calling-pricing": `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb; margin-bottom: 30px; font-size: 28px; font-weight: 700; text-align: center;">AI CALLING AGENT PRICING</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; position: relative;">
            <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #f59e0b; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600;">MOST POPULAR</div>
            <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 700;">Basic</h3>
            <div style="font-size: 36px; font-weight: 700; margin: 15px 0;">₹15,000</div>
            <div style="opacity: 0.8; margin-bottom: 25px;">per month</div>
            <ul style="list-style: none; padding: 0; margin: 0; text-align: left;">
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ 1,000 calls/month</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ 2 languages</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ Basic analytics</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ Email support</li>
            </ul>
          </div>

          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 15px; text-align: center;">
            <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 700;">Advanced</h3>
            <div style="font-size: 36px; font-weight: 700; margin: 15px 0;">₹25,000</div>
            <div style="opacity: 0.8; margin-bottom: 25px;">per month</div>
            <ul style="list-style: none; padding: 0; margin: 0; text-align: left;">
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ 5,000 calls/month</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ 5 languages</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ Advanced analytics</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ CRM integration</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ Priority support</li>
            </ul>
          </div>

          <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 30px; border-radius: 15px; text-align: center;">
            <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 700;">Premium</h3>
            <div style="font-size: 36px; font-weight: 700; margin: 15px 0;">₹40,000</div>
            <div style="opacity: 0.8; margin-bottom: 25px;">per month</div>
            <ul style="list-style: none; padding: 0; margin: 0; text-align: left;">
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ Unlimited calls</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ 10+ languages</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ Custom voice training</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ API access</li>
              <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">✓ Dedicated manager</li>
            </ul>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
          <h4 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">What's Included in Every Plan:</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div>✓ 24×7 AI calling agent</div>
            <div>✓ Human-sounding voice</div>
            <div>✓ Lead capture & qualification</div>
            <div>✓ Call recording & analytics</div>
            <div>✓ Multi-language support</div>
            <div>✓ CRM integration</div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 25px; border-radius: 12px; text-align: center;">
          <h4 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">Ready to Get Started?</h4>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Choose your plan and start making AI-powered calls today!</p>
        </div>
      </div>`,

      "calling-faqs": `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb; margin-bottom: 30px; font-size: 28px; font-weight: 700; text-align: center;">AI CALLING AGENT - FAQs</h2>
        
        <div style="margin-bottom: 40px;">
          <h3 style="color: #dc2626; margin-bottom: 20px; font-size: 22px; font-weight: 700; border-bottom: 3px solid #dc2626; padding-bottom: 8px;">General</h3>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q1. How does the AI calling agent work?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Our AI agent uses advanced voice recognition and natural language processing to have human-like conversations, answer questions, and capture leads automatically.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q2. Can it handle multiple languages?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Yes! Depending on your plan, our AI agent can speak 2-10+ languages including English, Hindi, Marathi, Gujarati, and more.</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q3. What's the setup time?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">We can have your AI calling agent up and running within 3-5 business days after receiving your business details and call scripts.</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="color: #7c3aed; margin-bottom: 20px; font-size: 22px; font-weight: 700; border-bottom: 3px solid #7c3aed; padding-bottom: 8px;">Technical</h3>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #8b5cf6;">
            <h4 style="color: #5b21b6; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q4. Can I customize the voice and responses?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Absolutely! We can train the AI with your specific voice, tone, and responses to match your brand perfectly.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q5. How does it integrate with my existing systems?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Our AI agent integrates seamlessly with popular CRMs, phone systems, and analytics platforms through APIs and webhooks.</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q6. What if the AI can't answer a question?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">The AI will politely transfer the call to a human agent or take a message and schedule a callback, ensuring no lead is ever lost.</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="color: #ea580c; margin-bottom: 20px; font-size: 22px; font-weight: 700; border-bottom: 3px solid #ea580c; padding-bottom: 8px;">Pricing & ROI</h3>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #f97316;">
            <h4 style="color: #c2410c; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q7. How much can I save with AI calling?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Most businesses save 60-80% on call center costs while increasing lead conversion by 2-3x compared to traditional methods.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
            <h4 style="color: #047857; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q8. Can I upgrade or downgrade my plan?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Yes! You can change your plan anytime. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Q9. Is there a free trial available?</h4>
            <p style="margin: 0; color: #4b5563; font-size: 15px;">Yes! We offer a 7-day free trial with 100 free calls so you can experience the power of AI calling before committing.</p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 25px; border-radius: 12px; text-align: center;">
          <h4 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">Ready to Transform Your Calling?</h4>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Let our AI handle your calls while you focus on growing your business.</p>
        </div>
      </div>`,

      "Overview": `Troika's AI Websites go far beyond traditional web design, They are designed to attract, engage, and convert visitors automatically.<br>

Each site is powered by intelligent automation built to attract visitors, talk to them, capture leads, analyze performance, and help you grow automatically.<br>

Your website becomes a living system that learns from every chat, visit, and click managed end-to-end by Troika Tech.<br>

From AI Knowledgebase to Lead Management, we handle it all for you.<br><br>

🕓 Delivery Time: 7 Days<br>
💬 Support: AI + Human Hybrid<br>
🌐 Integrations: Supa Agent • RCS • Analytics<br><br>


We combine beautiful design, intelligent automation, and integrated chat agents to turn your website into a lead-generating machine powered by AI, driven by data, and perfected by humans.<br>

<br> PROBLEM → SOLUTION → RESULT

<div style="margin: 20px 0; overflow-x: auto;">
  <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <thead>
      <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <th style="padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">Problem</th>
        <th style="padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.2);">AI Website Solution</th>
        <th style="padding: 15px; text-align: left; font-weight: 600;">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151;">Business has a good product but a weak online presence</td>
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; color: #4b5563;">AI-powered professional website with dynamic content and chat integration</td>
        <td style="padding: 15px; vertical-align: top; color: #059669; font-weight: 600;">Builds trust & credibility instantly</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151;">Visitors browse but don't inquire</td>
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; color: #4b5563;">Built-in AI chat agent captures every lead</td>
        <td style="padding: 15px; vertical-align: top; color: #059669; font-weight: 600;">2×–5× increase in inquiries</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151;">Team spends time replying manually</td>
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; color: #4b5563;">AI handles FAQs & responses automatically</td>
        <td style="padding: 15px; vertical-align: top; color: #059669; font-weight: 600;">Time saved, faster service</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151;">You don't know which campaigns work</td>
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; color: #4b5563;">Integrated analytics & CRM show real performance</td>
        <td style="padding: 15px; vertical-align: top; color: #059669; font-weight: 600;">Data-driven marketing decisions</td>
      </tr>
      <tr>
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; font-weight: 500; color: #374151;">Managing updates is complicated</td>
        <td style="padding: 15px; border-right: 1px solid #e5e7eb; vertical-align: top; color: #4b5563;">Troika maintains everything for you monthly</td>
        <td style="padding: 15px; vertical-align: top; color: #059669; font-weight: 600;">Always fresh, always optimized</td>
      </tr>
    </tbody>
  </table>
</div>

`,

      "Why AI Websites Are the Future?": `Traditional websites:

80% of business sites in India are static, brochure-like, and rarely updated.

They fail to capture, engage, or convert visitors.

Owners spend ₹20K–₹50K upfront and get zero ROI because they don't maintain or optimize the site.

AI Vision:

Over 15 crore SMEs in India are online.

Yet fewer than 5% have lead automation, chat AI, or analytics integrated.

AI websites solve this by combining design + automation + data capture into one system.`,
      
      "What makes AI websites different from traditional websites?": `Unlike static, brochure-style websites, AI websites actively capture leads, engage visitors, and provide data-driven insightsall automatically. They combine smart design, automation, and analytics in a single platform.`,

      "How do AI websites help Indian SMEs?": `Over 15 crore SMEs are online, but less than 5% use automation or analytics. AI websites empower businesses to generate leads, automate responses, and track performancemaximizing ROI without constant manual updates.`,

      "Do AI websites improve customer engagement?": `Yes. AI-powered chatbots, personalized interactions, and real-time data capture ensure your visitors stay engaged, increasing the chances of conversions and repeat business.`
    };

    // Check if it's a static FAQ question
    if (staticFAQs[action]) {
      setTimeout(() => {
        const userMessage = { 
          sender: "user", 
          text: action, 
          timestamp: new Date() 
        };
        addMessageToTab(currentTab, userMessage);
        
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: staticFAQs[action],
            timestamp: new Date()
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
        }, 500);
      }, 50);
      return;
    }

    // Check if it's Features suggestion from About page
    if (action === "Features") {
      setTimeout(() => {
        const userMessage = { 
          sender: "user", 
          text: action, 
          timestamp: new Date() 
        };
        addMessageToTab(currentTab, userMessage);
        
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: `**Features**

AI Created. Human Perfected.

Our AI Website isn't a normal website; it's a conversion engine with:

- Auto Lead Capture via chat, forms, and behaviour tracking

- 24x7 Built-in AI Chat that talks in more than 80 languages

- Dynamic SEO Optimization and auto content refresh

- Integrated Analytics Dashboard (visitors, sources, time spent, etc.)

- Appointment Booking, Live Chat, Blog & Inquiry Tracking

- Custom Industry Tools (e.g., calculators, enquiry forms, quote generators)

> *"We are not selling a website  We are selling a business system that talks, learns, and sells."*`,
            timestamp: new Date()
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
        }, 500);
      }, 50);
      return;
    }

    // Check if it's ROI industry suggestions
    const roiFAQs = {
      "Real Estate": `Replace static property sites with AI that talks to buyers 24x7.

Converts site visitors to verified leads.

Auto-sends property brochures.

📈 **Expected ROI:** 1 sale = ₹5L profit → ₹5K/month is nothing.`,
      
      "Education / Coaching Institutes": `AI Counsellor answers admission queries 24x7.

Collects leads, books demos, and follows up automatically.

📈 **Expected ROI:** Each admission = ₹25K–₹1L; 1 conversion/month pays the yearly fee.`,
      
      "Manufacturing / B2B": `Product inquiry bots handle distributors, dealers, and RFQs.

Auto-replies with catalogues and quote requests.

📈 **Expected ROI:** One converted order = ₹50K+ margin.`,
      
      "Services (Consultants, Lawyers, Hospitals)": `Smart chat captures appointments instantly.

Integrates with email follow-up.

📈 **Expected ROI:** 2–3 extra clients monthly cover the cost.`
    };

    if (roiFAQs[action]) {
      setTimeout(() => {
        const userMessage = { 
          sender: "user", 
          text: action, 
          timestamp: new Date() 
        };
        addMessageToTab(currentTab, userMessage);
        
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: roiFAQs[action],
            timestamp: new Date()
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
        }, 500);
      }, 50);
      return;
    }

    // Check if it's Pricing suggestion
    if (action === "Pricing") {
      setTimeout(() => {
        const userMessage = { 
          sender: "user", 
          text: action, 
          timestamp: new Date() 
        };
        setChatHistory([userMessage]); // Direct set, not append
        
        setIsTyping(true);
      setTimeout(() => {
        const botMessage = {
          sender: "bot",
          text: `

AI Website is built for instant replies, 24×7.<br>

• Manage thousands of enquiries during admission season.<br>
• Handle support for multiple departments (Admissions, Placement, Hostel, Courses).<br>
• It will be compatible with All the Devices, CRM & ERP.<br>
• The Delivery will take minimum 3 days to Maximum 7 days to go live.<br>




<style>
  @media (max-width: 768px) {
    .pricing-grid {
      grid-template-columns: 1fr !important;
      gap: 15px !important;
      margin: 15px 0 !important;
      padding: 0 10px !important;
    }
    .pricing-card {
      padding: 20px !important;
      margin-bottom: 15px !important;
      transform: none !important;
    }
    .pricing-header {
      font-size: 16px !important;
      padding: 12px !important;
    }
    .pricing-price {
      font-size: 28px !important;
    }
    .pricing-monthly {
      font-size: 20px !important;
    }
    .pricing-features {
      font-size: 14px !important;
    }
  }
</style>

<div class="pricing-grid" style="
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 20px; 
  margin: 30px 0; 
  max-width: 1200px; 
  margin-left: auto; 
  margin-right: auto;
  width: 100%;
">

  <div class="pricing-card" style="
    background: linear-gradient(145deg, #f8f9fa, #e9ecef);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    border: 3px solid #28a745;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  ">
    <div class="pricing-header" style="
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 15px;
      margin: -30px -30px 20px -30px;
      text-align: center;
      font-weight: 700;
      font-size: 18px;
    ">💎 BASIC PLAN</div>
    
    <div style="text-align: center; margin-bottom: 25px;">
      <div class="pricing-price" style="font-size: 36px; font-weight: 700; color: #28a745; margin-bottom: 5px;">₹50,000</div>
      <div style="color: #6c757d; font-size: 14px;">One-time Setup</div>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
      <div class="pricing-monthly" style="font-size: 24px; font-weight: 600; color: #495057;">₹5,000<span style="font-size: 14px; color: #6c757d;">/month</span></div>
    </div>
    
    <div class="pricing-features" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
        <span>💬 Chats</span>
        <span style="font-weight: 600;">5,000/month</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
        <span>🌍 Languages</span>
        <span style="font-weight: 600;">2</span>
      </div>
    </div>
    
    <div style="
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 12px;
      border-radius: 10px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
    ">✅ Perfect for small businesses</div>
  </div>

  <div class="pricing-card" style="
    background: linear-gradient(145deg, #f8f9fa, #e9ecef);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
    border: 3px solid #007bff;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    transform: scale(1.05);
  ">
    <div class="pricing-header" style="
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      padding: 15px;
      margin: -30px -30px 20px -30px;
      text-align: center;
      font-weight: 700;
      font-size: 18px;
    ">🚀 ADVANCED PLAN</div>
    
    <div style="text-align: center; margin-bottom: 25px;">
      <div class="pricing-price" style="font-size: 36px; font-weight: 700; color: #007bff; margin-bottom: 5px;">₹75,000</div>
      <div style="color: #6c757d; font-size: 14px;">One-time Setup</div>
    </div>
    
    <div style="background: #e3f2fd; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
      <div class="pricing-monthly" style="font-size: 24px; font-weight: 600; color: #007bff;">₹7,500<span style="font-size: 14px; color: #6c757d;">/month</span></div>
    </div>
    
    <div class="pricing-features" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
        <span>💬 Chats</span>
        <span style="font-weight: 600;">10,000/month</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
        <span>🌍 Languages</span>
        <span style="font-weight: 600;">3-4</span>
      </div>
    </div>
    
    <div style="
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      padding: 12px;
      border-radius: 10px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
    ">✅ Ideal for growing companies</div>
  </div>

  <div class="pricing-card" style="
    background: linear-gradient(145deg, #f8f9fa, #e9ecef);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    border: 3px solid #ffc107;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  ">
    <div class="pricing-header" style="
      background: linear-gradient(135deg, #ffc107, #ff8f00);
      color: white;
      padding: 15px;
      margin: -30px -30px 20px -30px;
      text-align: center;
      font-weight: 700;
      font-size: 18px;
    ">👑 PREMIUM PLAN</div>
    
    <div style="text-align: center; margin-bottom: 25px;">
      <div class="pricing-price" style="font-size: 36px; font-weight: 700; color: #ffc107; margin-bottom: 5px;">₹1,00,000</div>
      <div style="color: #6c757d; font-size: 14px;">One-time Setup</div>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
      <div class="pricing-monthly" style="font-size: 24px; font-weight: 600; color: #ffc107;">₹10,000<span style="font-size: 14px; color: #6c757d;">/month</span></div>
    </div>
    
    <div class="pricing-features" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
        <span>💬 Chats</span>
        <span style="font-weight: 600;">15,000/month</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
        <span>🌍 Languages</span>
        <span style="font-weight: 600;">5+</span>
      </div>
    </div>
    
    <div style="
      background: linear-gradient(135deg, #ffc107, #ff8f00);
      color: white;
      padding: 12px;
      border-radius: 10px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
    ">✅ Best for large enterprises</div>
  </div>

</div>

<div style="
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin: 30px 0;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  color: white;
">
  <h3 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; text-align: center;">📋 What's Included in ₹5,000/month</h3>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
      <div style="font-weight: 600; margin-bottom: 8px;"> AI Chat Hosting - ₹1,500</div>
      <div style="font-size: 14px; opacity: 0.9;">Server + cloud AI infrastructure</div>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
      <div style="font-weight: 600; margin-bottom: 8px;"> Lead Analytics & Dashboard - ₹1,000</div>
      <div style="font-size: 14px; opacity: 0.9;">Behavior tracking + conversion insights</div>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
      <div style="font-weight: 600; margin-bottom: 8px;"> Content Optimization & SEO - ₹1,000</div>
      <div style="font-size: 14px; opacity: 0.9;">Monthly keyword updates + content refresh</div>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
      <div style="font-weight: 600; margin-bottom: 8px;"> Maintenance & Security - ₹500</div>
      <div style="font-size: 14px; opacity: 0.9;">Backups, uptime monitoring, feature updates</div>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
      <div style="font-weight: 600; margin-bottom: 8px;"> Premium Support - ₹1,000</div>
      <div style="font-size: 14px; opacity: 0.9;">Human helpdesk + performance audits</div>
    </div>
  </div>
  
  <div style="
    background: rgba(255,255,255,0.2);
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
    font-weight: 600;
  ">💡 Total Value = ₹5,000+ / month</div>
</div>

<div style="
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  font-style: italic;
  font-size: 16px;
  margin: 20px 0;
  box-shadow: 0 10px 25px rgba(255,107,107,0.3);
">
💬 You're not paying for maintenance; you're paying for 24x7 AI marketing that works while you sleep.
</div>`,
          timestamp: new Date()
        };
        setChatHistory((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
      }, 50);
      return;
    }

    // Check if it's Sales suggestions
    const salesFAQs = {
      "What offer you have?": `<div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        color: white;
        text-align: center;
      ">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700;">🎯 Special Offer Package</h2>
      </div>

      <div style="
        background: linear-gradient(145deg, #f8f9fa, #e9ecef);
        border-radius: 20px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      ">
        <h3 style="color: #495057; margin-bottom: 20px; font-size: 20px;">💰 Pricing</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="background: #e3f2fd; padding: 20px; border-radius: 15px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #1976d2;">₹50,000</div>
            <div style="color: #666; font-size: 14px;">Setup (One-time AI Website)</div>
          </div>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 15px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #2e7d32;">₹5,000/month</div>
            <div style="color: #666; font-size: 14px;">AI System + Maintenance</div>
          </div>
        </div>
      </div>

      <div style="
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        border-radius: 20px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 0 15px 35px rgba(255,107,107,0.3);
        color: white;
      ">
        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">🎁 Bonuses for Closing Deals</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
            <div style="font-weight: 600; margin-bottom: 5px;">1 Month Free</div>
            <div style="font-size: 14px; opacity: 0.9;">AI Premium Subscription</div>
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
            <div style="font-weight: 600; margin-bottom: 5px;">Free Lead Analytics</div>
            <div style="font-size: 14px; opacity: 0.9;">Dashboard</div>
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
            <div style="font-weight: 600; margin-bottom: 5px;">₹2,500 Discount</div>
            <div style="font-size: 14px; opacity: 0.9;">Additional Page/Tab</div>
          </div>
        </div>
      </div>

      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        color: white;
        display: none;
      ">
        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; text-align: center;">💬 Objection Handling</h3>
        
        <div style="display: grid; gap: 15px;">
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
            <div style="font-weight: 600; margin-bottom: 10px; color: #ffeb3b;">"₹5,000 is high"</div>
            <div style="font-size: 14px; opacity: 0.9;">That's ₹166 per day  less than one cup of coffee. It gives you an AI team working 24x7.</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
            <div style="font-weight: 600; margin-bottom: 10px; color: #ffeb3b;">"I already have a website"</div>
            <div style="font-size: 14px; opacity: 0.9;">Perfect  but is it generating daily leads? We'll convert your old site into a live salesperson.</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
            <div style="font-weight: 600; margin-bottom: 10px; color: #ffeb3b;">"We don't need AI"</div>
            <div style="font-size: 14px; opacity: 0.9;">You already use AI daily in email replies, Google Maps, and voice search. Why not use it to grow business?</div>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
            <div style="font-weight: 600; margin-bottom: 10px; color: #ffeb3b;">"We'll think about it later"</div>
            <div style="font-size: 14px; opacity: 0.9;">Every day delayed is a day of lost leads. We can start with a 1-month trial and prove ROI.</div>
          </div>
        </div>
      </div>

      <div style="
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        color: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        margin: 20px 0;
        box-shadow: 0 10px 25px rgba(76,175,80,0.3);
      ">
        🚀 Ready to close the deal?
      </div>`,
      
      "How much discount I can Get?": `<div style="
        background: linear-gradient(135deg, #ff9800, #f57c00);
        border-radius: 20px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 0 20px 40px rgba(255,152,0,0.3);
        color: white;
        text-align: center;
      ">
        <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700;">💸 Discount Information</h2>
        <div style="
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 15px;
          margin: 20px 0;
        ">
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">This information will be provided soon. Please check back later for available discounts and special offers.</p>
        </div>
        <div style="
          background: rgba(255,255,255,0.2);
          padding: 15px;
          border-radius: 10px;
          font-weight: 600;
        ">
          📞 Contact us for personalized discount offers!
        </div>
      </div>`
    };

    if (salesFAQs[action]) {
      setTimeout(() => {
        const userMessage = { 
          sender: "user", 
          text: action, 
          timestamp: new Date() 
        };
        addMessageToTab(currentTab, userMessage);
        
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: salesFAQs[action],
            timestamp: new Date()
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
        }, 500);
      }, 50);
      return;
    }

    // Check if it's Marketing suggestion
    const marketingFAQs = {
      "Marketing": `<div style="
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      ">
        <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #1f2937; text-align: center;">AI Marketing Solutions</h2>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; margin-bottom: 10px; font-size: 18px; font-weight: 600;">The Problem with Most Websites</h3>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
            Most websites in India are sleeping  they look good but don't sell.
          </p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; margin-bottom: 10px; font-size: 18px; font-weight: 600;">Our AI Solution</h3>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
            Our AI Websites don't just look great  they talk, capture leads, and convert visitors automatically.
          </p>
        </div>
        
        <div style="
          background: #f3f4f6;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          margin: 20px 0;
        ">
          <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 500;">
            For just <strong>₹5,000 a month</strong>, you get a 24x7 AI team managing your business online.
          </p>
        </div>
      </div>

      <div style="
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 30px;
        margin: 20px 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      ">
        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1f2937;">Follow Us on Social Media</h3>
        
        <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
          <a href="https://www.facebook.com/troikatechservices" target="_blank" style="
            background: #3b82f6;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          " onmouseover="this.style.backgroundColor='#2563eb'" onmouseout="this.style.backgroundColor='#3b82f6'">
            <span>📘</span> Facebook
          </a>
          
          <a href="https://instagram.com/troikatech" target="_blank" style="
            background: #e11d48;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          " onmouseover="this.style.backgroundColor='#be123c'" onmouseout="this.style.backgroundColor='#e11d48'">
            <span>📷</span> Instagram
          </a>
          
          <a href="https://youtube.com/@troikatech" target="_blank" style="
            background: #dc2626;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          " onmouseover="this.style.backgroundColor='#b91c1c'" onmouseout="this.style.backgroundColor='#dc2626'">
            <span>📺</span> YouTube
          </a>
          
          <a href="https://linkedin.com/company/troikatech" target="_blank" style="
            background: #0a66c2;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          " onmouseover="this.style.backgroundColor='#004182'" onmouseout="this.style.backgroundColor='#0a66c2'">
            <span>💼</span> LinkedIn
          </a>
          
          <a href="https://twitter.com/troikatech" target="_blank" style="
            background: #1da1f2;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          " onmouseover="this.style.backgroundColor='#0d8bd9'" onmouseout="this.style.backgroundColor='#1da1f2'">
            <span>🐦</span> Twitter
          </a>
        </div>
      </div>`
    };

    if (marketingFAQs[action]) {
      setTimeout(() => {
        const userMessage = { 
          sender: "user", 
          text: action, 
          timestamp: new Date() 
        };
        addMessageToTab(currentTab, userMessage);
        
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: "bot",
            text: marketingFAQs[action],
            timestamp: new Date()
          };
          addMessageToTab(currentTab, botMessage);
          setIsTyping(false);
        }, 500);
      }, 50);
      return;
    }
    
    // Fallback for other actions
    const suggestionMessages = {
      'services': 'What services does Troika Tech offer?',
      'pricing': 'What is the pricing for AI services?',
      'demo': 'Can I get a demo?',
      'support': 'What kind of support do you provide?'
    };
    
    const message = suggestionMessages[action] || 'Tell me more about this';
    setTimeout(() => {
      handleSendMessage(message);
    }, 50);
  }, [handleSendMessage]);

  // Handler for suggestion buttons from bot responses
  const handleBotSuggestionClick = useCallback((suggestion) => {
    setShowWelcome(false);
    
    // Get current tab for route-based storage
    const currentTab = getCurrentTab();
    
    // Handle conversational flow suggestions
    if (typeof suggestion === 'object' && suggestion.action) {
      // Handle conversational flow actions for all services
      if (suggestion.action.startsWith('calling-') || suggestion.action.startsWith('back-to-calling') ||
          suggestion.action.startsWith('websites-') || suggestion.action.startsWith('back-to-websites')) {
        // Import the conversational flow data from WelcomeSection

        // Add other conversational flows
        const callingConversationalFlow = {
          "calling-inbound": {
            initialMessage: "📞 **INBOUND CALLING AGENT**\n\nTo attend incoming calls - answering customer queries, booking appointments, providing information, and capturing leads automatically.\n\n**Ideal For:**\n\n• Real estate project inquiries\n• Coaching or education institutes\n• Service bookings (salon, clinic, gym, etc.)\n• Product support lines\n• Customer service hotlines",
            suggestions: [
              { text: "How does it work?", action: "calling-inbound-how" },
              { text: "What are the benefits?", action: "calling-inbound-benefits" },
              { text: "What's the pricing?", action: "calling-inbound-pricing" },
              { text: "Back to main menu", action: "back-to-calling-main" }
            ]
          },
          "calling-inbound-how": {
            message: "⚙️ **How Inbound Calling Works:**\n\n**Step 1:** Customer calls your virtual number\n\n**Step 2:** AI agent greets in natural tone and selected language\n\n**Step 3:** It answers FAQs, explains offerings, captures details (name, phone, requirement)\n\n**Step 4:** Data is auto-saved to CRM or sent to email",
            suggestions: [
              { text: "What are the benefits?", action: "calling-inbound-benefits" },
              { text: "What's the pricing?", action: "calling-inbound-pricing" },
              { text: "Back to inbound overview", action: "calling-inbound" }
            ]
          },
          "calling-inbound-benefits": {
            message: "✨ **Key Benefits of Inbound Calling:**\n\n**24×7 professional response**\nNever miss a call\n\n**Zero human errors or missed calls**\nConsistent performance\n\n**Supports Hindi, English, Marathi, Gujarati & more**\nMultilingual support\n\n**Captures 100% of calls as qualified leads**\nNo lost opportunities\n\n**Can handle multiple calls at once**\nUnlimited capacity",
            suggestions: [
              { text: "What's the pricing?", action: "calling-inbound-pricing" },
              { text: "How does it work?", action: "calling-inbound-how" },
              { text: "Back to inbound overview", action: "calling-inbound" }
            ]
          },
          "calling-inbound-pricing": {
            message: "💰 **Inbound Calling Agent Pricing:**\n\n**One-time Setup: ₹1,00,000**\nDesign & Deployment Fees\n\n**Per Minute Usage: ₹25 per minute**\nBilled on actual talk time\n\n**Monthly Maintenance: ₹10,000 per virtual number**\nMaintenance, server, AI hosting & updates",
            suggestions: [
              { text: "How does it work?", action: "calling-inbound-how" },
              { text: "What are the benefits?", action: "calling-inbound-benefits" },
              { text: "Back to inbound overview", action: "calling-inbound" }
            ]
          },
          "calling-outbound": {
            initialMessage: "📱 **OUTBOUND CALLING AGENT**\n\nTo initiate calls to leads or customers for promotions, follow-ups, reminders, or surveys - without manual effort.\n\n**Ideal For:**\n\n• Promotional campaigns (offers, event invites)\n• Lead follow-ups or re-engagement\n• Payment, delivery, or appointment reminders\n• Customer feedback or survey collection",
            suggestions: [
              { text: "How does it work?", action: "calling-outbound-how" },
              { text: "What are the benefits?", action: "calling-outbound-benefits" },
              { text: "What's the pricing?", action: "calling-outbound-pricing" },
              { text: "Back to main menu", action: "back-to-calling-main" }
            ]
          },
          "calling-outbound-how": {
            message: "⚙️ **How Outbound Calling Works:**\n\n**Step 1:** Upload your contact list (CSV or CRM)\n\n**Step 2:** AI agent automatically starts calling one by one\n\n**Step 3:** Delivers personalized pitch, collects responses, books appointments\n\n**Step 4:** Generates reports: answered, not answered, interested, follow-up needed",
            suggestions: [
              { text: "What are the benefits?", action: "calling-outbound-benefits" },
              { text: "What's the pricing?", action: "calling-outbound-pricing" },
              { text: "Back to outbound overview", action: "calling-outbound" }
            ]
          },
          "calling-outbound-benefits": {
            message: "✨ **Key Benefits of Outbound Calling:**\n\n**100s of calls per hour – zero manual dialing**\nMassive efficiency\n\n**Consistent pitch, tone & data capture**\nUniform quality\n\n**Multilingual and customizable voice scripts**\nFlexible communication\n\n**Fully automated reporting**\nComplete analytics\n\n**Saves manpower cost & training time**\nCost effective",
            suggestions: [
              { text: "What's the pricing?", action: "calling-outbound-pricing" },
              { text: "How does it work?", action: "calling-outbound-how" },
              { text: "Back to outbound overview", action: "calling-outbound" }
            ]
          },
          "calling-outbound-pricing": {
            message: "💰 **Outbound Calling Agent Pricing:**\n\n**One-time Setup: ₹1,00,000**\nDesign & Deployment Fees\n\n**Per Minute Usage: ₹25 per minute**\nBilled per live call\n\n**Monthly Maintenance: ₹10,000 per virtual number**\nMaintenance, CRM integration, analytics",
            suggestions: [
              { text: "How does it work?", action: "calling-outbound-how" },
              { text: "What are the benefits?", action: "calling-outbound-benefits" },
              { text: "Back to outbound overview", action: "calling-outbound" }
            ]
          },
          "back-to-calling-main": {
            message: "📞 **AI Calling Agent**\n\nChoose what you'd like to know more about:",
            suggestions: [
              { text: "Inbound Calling Agent", action: "calling-inbound" },
              { text: "Outbound Calling Agent", action: "calling-outbound" },
              { text: "Pricing", action: "calling-pricing" },
              { text: "FAQs", action: "calling-faqs" }
            ]
          }
        };
        
        const websitesConversationalFlow = {
          "websites-overview": {
            initialMessage: "🌐 **AI Websites - Overview**\n\nAI Created. Human Perfected.\n\nWhether it's a factory owner, lawyer, CA, doctor, institute, or politician - a Troika AI Website gives each, a voice, system, and intelligence that grows their business, brand, or public trust automatically.\n\n'AI Websites don't just inform - they influence, interact, and inspire.'",
            suggestions: [
              { text: "What problems does it solve?", action: "websites-problems" },
              { text: "What are the key features?", action: "websites-features" },
              { text: "How does it work?", action: "websites-how-it-works" },
              { text: "Back to main menu", action: "back-to-websites-main" }
            ]
          },
          "websites-problems": {
            message: "🔹 **Common Business Problems**\n\n**Static Websites**\nYour website just sits there, not engaging visitors\n\n**No Lead Capture**\nVisitors leave without any interaction or data\n\n**Poor User Experience**\nConfusing navigation and outdated information\n\n**No Personalization**\nSame experience for everyone\n\n**Limited Reach**\nOnly works in one language\n\n**No Analytics**\nNo insights into visitor behavior",
            suggestions: [
              { text: "What are the solutions?", action: "websites-solutions" },
              { text: "Show key features", action: "websites-features" },
              { text: "Back to overview", action: "websites-overview" }
            ]
          },
          "websites-solutions": {
            message: "✅ **Solutions with AI Websites**\n\n**Smart Engagement**\nAI greets visitors and guides them through your offerings\n\n**Automatic Lead Capture**\nAI collects visitor information and interests\n\n**Personalized Experience**\nAI adapts content based on visitor behavior\n\n**Multilingual Support**\nSpeaks to visitors in their preferred language\n\n**Real-time Analytics**\nTrack visitor behavior and conversion rates\n\n**24×7 Availability**\nWorks around the clock to engage visitors",
            suggestions: [
              { text: "Show key features", action: "websites-features" },
              { text: "How does it work?", action: "websites-how-it-works" },
              { text: "Back to overview", action: "websites-overview" }
            ]
          },
          "websites-features": {
            message: "✨ **Key Features**\n\n**Smart Websites**\nAI-powered websites that engage visitors\n\n**Auto Engagement**\nAutomatically interacts with visitors\n\n**AI Conversion**\nConverts visitors into leads and customers\n\n**Multilingual Support**\nSpeaks 20+ languages\n\n**Real-time Analytics**\nTrack visitor behavior and conversions\n\n**Mobile Responsive**\nWorks perfectly on all devices\n\n**SEO Optimized**\nRanks higher in search results",
            suggestions: [
              { text: "How does it work?", action: "websites-how-it-works" },
              { text: "What's the pricing?", action: "websites-pricing" },
              { text: "Back to overview", action: "websites-overview" }
            ]
          },
          "websites-how-it-works": {
            message: "⚙️ **How AI Websites Work**\n\n**Step 1: Design**\nWe create a beautiful, responsive website for your business\n\n**Step 2: AI Integration**\nWe integrate AI chatbot and engagement features\n\n**Step 3: Training**\nAI is trained on your business data and offerings\n\n**Step 4: Launch**\nYour AI website goes live and starts engaging visitors\n\n**Step 5: Analytics**\nTrack performance and optimize for better results\n\n**Ready to transform your online presence?**\nGet your AI Website up and running in just 48 hours.",
            suggestions: [
              { text: "What's the pricing?", action: "websites-pricing" },
              { text: "Any FAQs?", action: "websites-faqs" },
              { text: "Back to overview", action: "websites-overview" }
            ]
          },
          "websites-pricing": {
            initialMessage: "💰 **AI Websites - Pricing Structure**\n\nOur AI Websites pricing is designed to be transparent and cost-effective. We offer a one-time setup fee plus optional maintenance packages.\n\n**Key Benefits of Our Pricing:**\n\n**No Hidden Costs**\nEverything is clearly outlined\n\n**One-Time Investment**\nNo recurring monthly fees\n\n**Scalable**\nGrows with your business\n\n**ROI-Focused**\nSave more than you spend\n\n**Pricing Overview:**\n\n**One-Time Setup: ₹50,000**\nComplete website creation, AI integration, and deployment\n\n**Optional Maintenance: ₹5,000/month**\nUpdates, hosting, and technical support\n\n**Ready to see the detailed pricing?**",
            suggestions: [
              { text: "Show detailed pricing", action: "websites-pricing-details" },
              { text: "What's included in setup?", action: "websites-setup-details" },
              { text: "Compare with traditional websites", action: "websites-comparison" },
              { text: "Back to main menu", action: "back-to-websites-main" }
            ]
          },
          "websites-pricing-details": {
            message: "💰 **AI Websites - Complete Pricing**\n\n**One-Time Setup: ₹50,000**\n• Custom website design\n• AI chatbot integration\n• Mobile responsive design\n• SEO optimization\n• Content management system\n• Basic training\n\n**Optional Monthly Maintenance: ₹5,000**\n• Regular updates\n• Hosting and domain\n• Technical support\n• Performance monitoring\n• Content updates\n\n**Additional Features:**\n• E-commerce integration: ₹25,000\n• Advanced analytics: ₹10,000\n• Custom integrations: ₹15,000",
            suggestions: [
              { text: "What's included in setup?", action: "websites-setup-details" },
              { text: "Compare with traditional websites", action: "websites-comparison" },
              { text: "Show ROI benefits", action: "websites-roi" },
              { text: "Back to pricing overview", action: "websites-pricing" }
            ]
          },
          "websites-setup-details": {
            message: "🔧 **What's Included in Setup?**\n\n**Custom Website Design**\nBeautiful, professional design tailored to your business\n\n**AI Chatbot Integration**\nSmart chatbot that engages visitors\n\n**Mobile Responsive Design**\nWorks perfectly on all devices\n\n**SEO Optimization**\nOptimized for search engines\n\n**Content Management System**\nEasy to update and manage\n\n**Basic Training**\nTraining on how to use your new website\n\n**Result:**\nA complete AI-powered website that works 24×7",
            suggestions: [
              { text: "Compare with traditional websites", action: "websites-comparison" },
              { text: "Show ROI benefits", action: "websites-roi" },
              { text: "Back to pricing overview", action: "websites-pricing" }
            ]
          },
          "websites-comparison": {
            message: "⚖️ **AI Websites vs Traditional Websites**\n\n**Engagement:**\nTraditional: Static, no interaction\nAI Websites: Dynamic, interactive\n\n**Lead Capture:**\nTraditional: Manual forms\nAI Websites: Automatic capture\n\n**Personalization:**\nTraditional: Same for everyone\nAI Websites: Personalized experience\n\n**Availability:**\nTraditional: 24×7 but static\nAI Websites: 24×7 and interactive\n\n**Cost:**\nTraditional: ₹20,000-50,000\nAI Websites: ₹50,000 (one-time)\n\n**ROI:**\nTraditional: Low engagement\nAI Websites: High conversion rates",
            suggestions: [
              { text: "Show ROI benefits", action: "websites-roi" },
              { text: "What are the key features?", action: "websites-features" },
              { text: "Back to pricing overview", action: "websites-pricing" }
            ]
          },
          "websites-roi": {
            message: "📈 **ROI: AI Websites vs Traditional Websites**\n\n**Higher Conversion Rates**\nAI Websites convert 3-5x more visitors into leads\n\n**Better User Experience**\nVisitors stay longer and engage more\n\n**Automatic Lead Capture**\nNo missed opportunities\n\n**24×7 Engagement**\nWorks around the clock\n\n**Multilingual Reach**\nReach more customers\n\n**Real-time Analytics**\nTrack and optimize performance\n\n**Cost Effective**\nOne-time investment, long-term benefits",
            suggestions: [
              { text: "How does it work?", action: "websites-how-it-works" },
              { text: "What's the pricing?", action: "websites-pricing" },
              { text: "Back to overview", action: "websites-overview" }
            ]
          },
          "websites-faqs": {
            message: "❓ **Frequently Asked Questions**\n\n**What is an AI Website?**\nA website with integrated AI chatbot that engages visitors automatically.\n\n**Do I need coding knowledge?**\nNo. We handle everything from design to deployment.\n\n**How long does it take to build?**\nTypically 48 hours from start to finish.\n\n**Can I update content myself?**\nYes, we provide a user-friendly content management system.\n\n**Is it mobile responsive?**\nYes, works perfectly on all devices.\n\n**Do you provide hosting?**\nYes, hosting and domain are included in maintenance package.",
            suggestions: [
              { text: "How does it work?", action: "websites-how-it-works" },
              { text: "What's the pricing?", action: "websites-pricing" },
              { text: "Back to overview", action: "websites-overview" }
            ]
          },
          "back-to-websites-main": {
            message: "🌐 **AI Websites**\n\nChoose what you'd like to know more about:",
            suggestions: [
              { text: "Overview", action: "websites-overview" },
              { text: "Pricing", action: "websites-pricing" },
              { text: "FAQs", action: "websites-faqs" },
              { text: "Results", action: "websites-results" }
            ]
          }
        };
        
        // Determine which flow to use based on action
        let flowData = null;
        if (callingConversationalFlow[suggestion.action]) {
          flowData = callingConversationalFlow[suggestion.action];
        } else if (websitesConversationalFlow[suggestion.action]) {
          flowData = websitesConversationalFlow[suggestion.action];
        }
        if (flowData) {
          const message = flowData.initialMessage || flowData.message;
          const suggestions = flowData.suggestions || [];
          
          
          // Add user message to current tab
          const userMessage = {
            sender: "user",
            text: suggestion.text,
            timestamp: new Date()
          };
          addMessageToTab(currentTab, userMessage);
          
        // Add bot message with conversational content
        const botMessage = {
          sender: "bot",
          text: message,
          timestamp: new Date(),
          suggestions: suggestions
        };
        addMessageToTab(currentTab, botMessage);
        
        // Force scroll to bottom after messages are added
        const scrollToBottom = () => {
          if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end' 
            });
          } else if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            });
          }
        };
        
        // Immediate scroll
        scrollToBottom();
        
        // Additional scroll after content is rendered
        setTimeout(scrollToBottom, 50);
        setTimeout(scrollToBottom, 200);
        setTimeout(scrollToBottom, 500);
        return;
        }
      }
      
      // For other conversational actions, send as regular message
      handleSendMessage(suggestion.text);
    } else {
      // Handle regular text suggestions
      handleSendMessage(suggestion);
    }
  }, [handleSendMessage, getCurrentTab, addMessageToTab, handleTabNavigation]);

  // Voice recording handlers
  const handleMicClick = () => {
    // Allow click on both mobile and desktop as fallback
    if (isRecording) {
      stopRecording();
    } else {
      startRecording((text) => {
        handleSendMessage(text);
      }).catch((error) => {
        toast.error(error.message || "Voice recording failed. Please ensure microphone permissions are granted.");
      });
    }
  };

  // Simplified touch handlers - just use click behavior (start/stop toggle)
  const handleMicTouchStart = useCallback(
    (e) => {
      // No-op: Let onClick handle it
    },
    []
  );

  const handleMicTouchEnd = useCallback(
    (e) => {
      // No-op: Let onClick handle it
    },
    []
  );

  const handleMicMouseDown = useCallback((e) => {
    // No-op: Let onClick handle it
  }, []);

  const handleMicMouseUp = useCallback((e) => {
    // No-op: Let onClick handle it
  }, []);

  // Sidebar and page management handlers
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Removed handlePageChange - now using React Router navigation

  // Social media feed handlers
  const handleSocialMediaClick = useCallback((platform) => {
    setSelectedPlatform(platform);
    setSocialFeedOpen(true);
  }, []);

  const handleSocialFeedClose = useCallback(() => {
    setSocialFeedOpen(false);
    setSelectedPlatform(null);
  }, []);

  // Handle page change for social media
  const handlePageChangeWithSocial = useCallback((pageId) => {
    setActivePage(pageId);
    // Always show welcome section when changing pages
    setShowWelcome(true);
    if (pageId === 'social-media') {
      // Show social media options
      setSocialFeedOpen(false);
      setSelectedPlatform(null);
    } else {
      setSocialFeedOpen(false);
      setSelectedPlatform(null);
    }
  }, []);

  // Listen for social media clicks from suggestion cards
  useEffect(() => {
    const handleSocialMediaEvent = (event) => {
      handleSocialMediaClick(event.detail);
    };

    window.addEventListener('socialMediaClick', handleSocialMediaEvent);
    return () => window.removeEventListener('socialMediaClick', handleSocialMediaEvent);
  }, [handleSocialMediaClick]);

  // Listen for navigation events from home page suggestions
  useEffect(() => {
    const handleNavigationEvent = (event) => {
      handlePageChangeWithSocial(event.detail);
    };

    window.addEventListener('navigateToPage', handleNavigationEvent);
    return () => window.removeEventListener('navigateToPage', handleNavigationEvent);
  }, [handlePageChangeWithSocial]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!isTyping) {
        handleSendMessage();
      }
    }
  };

  return (
    <Wrapper>
      <GlobalStyle />

      {showChat && (
        <Overlay ref={overlayRef} $isDarkMode={isDarkMode}>
          <AnimatedBlob $isDarkMode={isDarkMode} />
          
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            onSocialMediaClick={handleSocialMediaClick}
            onTabNavigation={handleTabNavigation}
          />

          {/* Main Content Area */}
          <MainContentArea $isDarkMode={isDarkMode} $sidebarOpen={sidebarOpen}>
            <Chatbox ref={chatboxRef} $isDarkMode={isDarkMode}>
              <ChatHeader
                currentTime={currentTime}
                batteryLevel={batteryLevel}
                isCharging={isCharging}
                chatbotLogo={chatbotLogo}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onSidebarToggle={handleSidebarToggle}
                sidebarOpen={sidebarOpen}
              />

              <ChatContainer $isWelcomeMode={showWelcome}>
        {getCurrentTab() === 'get-quote' ? (
          <ServiceSelection 
            onSendProposal={async (service) => {
              try {
                // Prefer authenticated phone from hook, else fallback to localStorage
                // Try multiple places where phone may be stored
                // Try primary stored phone
                let stored = localStorage.getItem('chatbot_user_phone') || '';
                // Fallback: some flows save a JSON object under supa_pending_otp with { phone, otp }
                if (!stored) {
                  try {
                    const pending = JSON.parse(localStorage.getItem('supa_pending_otp') || 'null');
                    if (pending && pending.phone) stored = String(pending.phone);
                  } catch {}
                }
                // From auth hook
                const authPhone = (userInfo && userInfo.phone) ? String(userInfo.phone) : '';
                // From saved auth blob if hook didn't hydrate yet
                let authBlobPhone = '';
                try {
                  const blob = JSON.parse(localStorage.getItem('chatbot_auth') || 'null');
                  if (blob && blob.userInfo && blob.userInfo.phone) authBlobPhone = String(blob.userInfo.phone);
                } catch {}
                let phoneRaw = authPhone || authBlobPhone || stored;
                if (!phoneRaw) {
                  toast.error('Phone not found. Please complete phone verification once.');
                  return;
                }

                // Call backend API instead of direct WhatsApp API
                const payload = {
                  phone: phoneRaw,
                  serviceName: service.name
                };

                const res = await fetch(`${apiBase}/proposal/send`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || 'Failed to send proposal');
                toast.success('Proposal sent on WhatsApp.');
              } catch (e) {
                toast.error(e.message);
              }
            }}
            phoneNumber={localStorage.getItem('chatbot_user_phone') || ''}
          />
        ) : showWelcome ? (
            <WelcomeSection 
              onSuggestionClick={handleSuggestionClick} 
              activePage={getCurrentTab()}
              socialFeedOpen={socialFeedOpen}
              selectedPlatform={selectedPlatform}
              onSocialFeedClose={handleSocialFeedClose}
              message={message}
              setMessage={setMessage}
              handleKeyPress={handleKeyPress}
              isTyping={isTyping}
              userMessageCount={userMessageCount}
              botMessageCount={botMessageCount}
              verified={verified}
              needsAuth={needsAuth}
              isRecording={isRecording}
              handleMicClick={handleMicClick}
              handleMicTouchStart={handleMicTouchStart}
              handleMicTouchEnd={handleMicTouchEnd}
              handleMicMouseDown={handleMicMouseDown}
              handleMicMouseUp={handleMicMouseUp}
              isMobile={isMobile}
              handleSendMessage={handleSendMessage}
              currentlyPlaying={currentlyPlaying}
              showInlineAuth={showInlineAuth}
              shouldShowAuth={shouldShowAuth}
              isAuthenticated={isAuthenticated}
            />
        ) : null}
                
                <MessagesContainer 
                  ref={messagesContainerRef}
                  $isDarkMode={isDarkMode}
                  style={{ display: showWelcome ? 'none' : 'flex' }}
                >
                  <MessagesInnerContainer>
                    {chatHistory.map((msg, idx) => (
                      <React.Fragment key={idx}>
                        <MessageBubbleComponent
                          message={{
                            ...msg,
                            suggestions: chatHistory.length >= 6 ? [] : msg.suggestions
                          }}
                          index={idx}
                          isUser={msg.sender === "user"}
                          isTyping={isTyping}
                          chatHistoryLength={chatHistory.length}
                          currentlyPlaying={currentlyPlaying}
                          playAudio={playAudio}
                          onSuggestionClick={handleBotSuggestionClick}
                          onCalendlyEventScheduled={handleCalendlyBooking}
                        />
                        {msg.showServiceButtons && showServiceSelection && (
                          <ServiceSelectionButtons
                            isVisible={true}
                            onServiceClick={handleServiceSelection}
                          />
                        )}
                      </React.Fragment>
                    ))}

                    {/* Streaming Message - Show as bot message bubble only when we have content */}
                    {(() => {
                      // Prioritize manualStreamingResponse for demo flow, only use streamingResponse if manual is empty
                      const responseText = manualStreamingResponse || (isStreaming ? streamingResponse : '');
                      const shouldShow = currentStreamingMessageId && responseText && responseText.trim();
                      if (currentStreamingMessageId) {
                        console.log('🔍 RENDER CHECK:', {
                          currentStreamingMessageId,
                          manualStreamingResponse: manualStreamingResponse?.substring(0, 50),
                          streamingResponse: streamingResponse?.substring(0, 50),
                          isStreaming,
                          responseText: responseText?.substring(0, 50),
                          shouldShow,
                          chatHistoryLength: chatHistory.length,
                          lastMessage: chatHistory[chatHistory.length - 1]?.text?.substring(0, 50)
                        });
                      }
                      return shouldShow;
                    })() && (
                      <MessageBubbleComponent
                        message={{
                          sender: "bot",
                          text: manualStreamingResponse || streamingResponse,
                          timestamp: new Date()
                        }}
                        index={chatHistory.length}
                        isUser={false}
                        isTyping={false}
                        chatHistoryLength={chatHistory.length + 1}
                        currentlyPlaying={currentlyPlaying}
                        playAudio={playAudio}
                        onSuggestionClick={handleBotSuggestionClick}
                      />
                    )}

                    {/* REMOVED: Old Authentication Components - Using new user collection flow instead */}
                    {/* {showInlineAuth && showInlineAuthInput && (
                      <AuthMessageBubble
                        onSendOtp={handleSendOtpNew}
                        loading={authLoading}
                        error={authError}
                      />
                    )}

                    {showInlineAuth && showOtpInput && (
                      <OtpMessageBubble
                        onVerifyOtp={handleVerifyOtpNew}
                        onResendOtp={handleResendOtpNew}
                        loading={authLoading}
                        error={authError}
                        success={null}
                        resendCooldown={resendCooldown}
                      />
                    )} */}

                    {/* Show typing indicator when typing but streaming hasn't started with content yet */}
                    {isTyping && !(isStreaming && streamingResponse) && (
                      <TypingIndicator isTyping={true} />
                    )}


                    <div ref={endOfMessagesRef} />
                  </MessagesInnerContainer>
                </MessagesContainer>

                <VoiceInputIndicatorComponent isRecording={isRecording} />

                {getCurrentTab() !== 'social-media' && !showWelcome && (
                <InputArea
                  message={message}
                  setMessage={setMessage}
                  handleKeyPress={handleKeyPress}
                  isTyping={isTyping}
                  userMessageCount={userMessageCount}
                  botMessageCount={botMessageCount}
                  verified={verified}
                  needsAuth={needsAuth}
                  isRecording={isRecording}
                  handleMicClick={handleMicClick}
                  handleMicTouchStart={handleMicTouchStart}
                  handleMicTouchEnd={handleMicTouchEnd}
                  handleMicMouseDown={handleMicMouseDown}
                  handleMicMouseUp={handleMicMouseUp}
                  isMobile={isMobile}
                  handleSendMessage={handleSendMessage}
                    isWelcomeMode={false}
                  currentlyPlaying={currentlyPlaying}
                  showInlineAuth={showInlineAuth}
                  shouldShowAuth={shouldShowAuth}
                  isAuthenticated={isAuthenticated}
                />
                )}
              </ChatContainer>
            </Chatbox>
          </MainContentArea>

          <ToastContainer position="top-center" />
          <Confetti
            trigger={confettiTrigger}
            onComplete={() => {}}
          />
          
          {/* Social Media Feed Panel */}
          <SocialFeedPanel
            isOpen={socialFeedOpen}
            onClose={handleSocialFeedClose}
            platform={selectedPlatform}
          />
        </Overlay>
      )}
    </Wrapper>
  );
};

const SupaChatbot = (props) => {
  return (
    <ThemeProvider>
      <SupaChatbotInner {...props} />
    </ThemeProvider>
  );
};

export default SupaChatbot;
