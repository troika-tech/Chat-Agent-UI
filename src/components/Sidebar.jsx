import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import PremiumFeatureModal from "./PremiumFeatureModal";
import axios from "axios";
import {
  // Navigation & Basic
  FaHome,
  FaGlobe,
  FaLink,
  FaBars,
  FaArrowRight,
  FaArrowLeft,
  FaChevronRight,
  FaChevronLeft,
  FaTh,
  FaList,
  // Communication
  FaEnvelope,
  FaPhone,
  FaPhoneAlt,
  FaComment,
  FaComments,
  FaPaperPlane,
  FaInbox,
  FaBell,
  FaRss,
  FaAt,
  // Business & Commerce
  FaShoppingCart,
  FaStore,
  FaCreditCard,
  FaDollarSign,
  FaTag,
  FaTags,
  FaGift,
  FaPercent,
  FaReceipt,
  FaHandshake,
  // Content & Media
  FaBook,
  FaFileAlt,
  FaNewspaper,
  FaVideo,
  FaImage,
  FaImages,
  FaMusic,
  FaFilm,
  FaPodcast,
  FaPlay,
  // User & Account
  FaUser,
  FaUserCircle,
  FaUsers,
  FaUserFriends,
  FaUserPlus,
  FaUserCheck,
  FaUserShield,
  FaIdCard,
  FaAddressBook,
  FaUserCog,
  // Tools & Settings
  FaCog,
  FaTools,
  FaWrench,
  FaLock,
  FaKey,
  FaShieldAlt,
  FaSearch,
  FaFilter,
  FaSort,
  FaDownload,
  // Social & Sharing
  FaShare,
  FaShareAlt,
  FaHeart,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaBookmark,
  FaFlag,
  FaRetweet,
  FaCommentDots,
  // Location & Maps
  FaMap,
  FaMapMarkerAlt,
  FaMapPin,
  FaDirections,
  FaRoute,
  // Actions & Utilities
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaPrint,
  FaCopy,
  FaCut,
  FaPaste,
  FaUndo,
  FaRedo,
  // Special & Custom
  FaInfoCircle,
  FaQuestionCircle,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  // Legacy/Additional
  FaWhatsapp,
  FaBolt,
  FaChartLine,
  FaRupeeSign,
  FaBullhorn,
  FaHeadset,
  FaBrain,
  FaMagic,
  FaTelegram,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaBuilding,
  FaFlickr,
  FaYoutube,
  FaCalendarAlt,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

const SidebarContainer = styled.div`
  width: ${props => props.$isCollapsed ? '60px' : 'clamp(240px, 20vw, 260px)'};
  height: 100vh;
  max-height: 100vh;
  background: ${props => props.$isDarkMode ? '#000000' : '#ebebeb'};
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  transition: width 0.3s ease;
  
  /* Responsive width */
  @media (max-width: 1024px) {
    width: ${props => props.$isCollapsed ? '60px' : 'clamp(280px, 28vw, 300px)'};
  }

  /* Hide scrollbar for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* WebKit browsers */
  }

  /* Smooth scrolling for mobile */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Hide close button on desktop */
  .mobile-close-btn {
    display: none !important;
  }

  /* Professional Navigation Styles */
  .nav-item {
    transition: all 0.2s ease;
    border-radius: 8px;
    margin: 0;
  }

  .nav-item:hover {
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    transform: translateX(2px);
  }

  .nav-item.active {
    background: ${props => props.$isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'};
    border-left: 3px solid #3b82f6;
    font-weight: 600;
  }

  .nav-item.active .nav-icon {
    color: #3b82f6;
  }


  @media (max-width: 768px) {
    width: ${props => props.$isOpen ? 'min(85vw, 320px)' : '0'};
    max-width: ${props => props.$isOpen ? '85vw' : '0'};
    height: 100vh;
    max-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease;
    box-shadow: ${props => props.$isOpen ? '4px 0 20px rgba(0, 0, 0, 0.3)' : 'none'};
    display: ${props => props.$isOpen ? 'flex' : 'flex'};
    z-index: 10000;
    overflow-y: auto;
    overflow-x: hidden;
    
    /* Show close button on mobile */
    .mobile-close-btn {
      display: flex !important;
    }
  }
  
  /* Force mobile sidebar behavior when data-is-mobile="true" */
  html[data-is-mobile="true"] & {
    width: ${props => props.$isOpen ? 'min(85vw, 320px)' : '0'};
    max-width: ${props => props.$isOpen ? '85vw' : '0'};
    height: 100vh;
    max-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease;
    box-shadow: ${props => props.$isOpen ? '4px 0 20px rgba(0, 0, 0, 0.3)' : 'none'};
    z-index: 10000;
    
    .mobile-close-btn {
      display: flex !important;
    }
  }
  
  @media (max-width: 480px) {
    width: min(90vw, 300px);
    max-width: 90vw;
  }
  
  @media (max-width: 360px) {
    width: 100vw;
    max-width: 100vw;
  }
  
  /* Landscape mode */
  @media (orientation: landscape) and (max-height: 500px) {
    height: 100vh;
    max-height: 100vh;
  }
`;

const SidebarHeader = styled.div`
  padding: ${props => props.$isCollapsed ? '0.5rem' : '1rem'};
  border-bottom: ${props => props.$isCollapsed ? 'none' : `1px solid ${props.$isDarkMode ? '#2f2f2f' : '#b0b0b0'}`};
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'space-between'};
  gap: 0.75rem;
  position: relative;
  min-height: ${props => props.$isCollapsed ? '60px' : 'auto'};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 60px;
    justify-content: space-between;
  }
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;
  background: transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  font-weight: bold;
  font-size: 14px;
`;

const LogoText = styled.span`
  font-family: "Amaranth", sans-serif;
  font-size: 20px !important;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
  flex: 1;
  min-width: 0;
`;

const ChevronDown = styled(FaChevronDown)`
  color: ${props => props.$isDarkMode ? '#8e8ea0' : '#6b7280'};
  font-size: 12px;
  margin-left: auto;
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 0.25rem 0;
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  margin-bottom: 0;
`;

const SectionTitle = styled.div`
  padding: 0.5rem 1rem;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#8e8ea0' : '#6b7280'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

const NavItem = styled.button`
  width: 100%;
  padding: ${props => props.$isCollapsed ? '0.4rem' : 'clamp(0.4rem, 1.2vw, 0.5rem) clamp(0.75rem, 2vw, 1rem)'};
  background: none;
  border: none;
  outline: none;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  text-align: ${props => props.$isCollapsed ? 'center' : 'left'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  gap: ${props => props.$isCollapsed ? '0' : 'clamp(0.5rem, 1.5vw, 0.75rem)'};
  font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
  font-weight: 500;
  transition: background-color 0.2s ease;
  border-radius: ${props => props.$isCollapsed ? '8px' : '0'};
  position: relative;
  min-height: ${props => props.$isCollapsed ? '36px' : 'clamp(36px, 3.5vw, 40px)'};
  margin-bottom: 0;
  
  /* Touch-friendly on mobile */
  @media (max-width: 768px) {
    min-height: 44px;
    padding: clamp(0.75rem, 2vw, 0.875rem) clamp(1rem, 2.5vw, 1.25rem);
    text-align: left;
    justify-content: flex-start;
    gap: clamp(0.5rem, 1.5vw, 0.75rem);
    border-radius: 0;
  }

  &:hover {
    background: ${props => props.$isDarkMode ? '#2a2a2a' : '#f0f0f0'};
  }

  &:active {
    background: ${props => props.$isDarkMode ? '#1f1f1f' : '#e5e5e5'};
    outline: none;
  }

  &:focus {
    outline: none;
  }

  &.active {
    background: ${props => props.$isDarkMode ? '#2a2a2a' : '#f0f0f0'};
  }
`;

const NavIcon = styled.div`
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(18px, 2vw, 22px);
  height: clamp(18px, 2vw, 22px);
  flex-shrink: 0;
  color: #000000;
`;

const NavText = styled.span`
  flex: 1;
`;

const SocialIconsContainer = styled.div`
  padding: 1.5rem 1rem;
  border-top: 1px solid ${props => props.$isDarkMode ? '#2f2f2f' : '#b0b0b0'};
  display: flex;
  justify-content: center;
  gap: clamp(0.02rem, 0.1vw, 0.08rem);
  margin-top: auto;
  
  /* Reduced spacing on mobile */
  @media (max-width: 768px) {
    gap: clamp(0.01rem, 0.08vw, 0.06rem);
    padding: 1.25rem 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: clamp(0.005rem, 0.05vw, 0.04rem);
    padding: 1rem 0.5rem;
  }
`;

const SocialIcon = styled.a`
  width: clamp(36px, 4vw, 44px);
  height: clamp(36px, 4vw, 44px);
  min-width: clamp(36px, 4vw, 44px);
  min-height: clamp(36px, 4vw, 44px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: clamp(10px, 1.5vw, 12px);
  background: transparent;
  color: ${props => props.$defaultColor || (props.$isDarkMode ? '#9ca3af' : '#6b7280')};
  transition: all 0.3s ease;

  svg {
    width: clamp(18px, 2vw, 22px);
    height: clamp(18px, 2vw, 22px);
  }
  
  /* Touch-friendly on mobile */
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
  }

  &:hover {
    color: ${props => props.$hoverColor || '#8b5cf6'};
    transform: scale(1.2);
  }

  &:active {
    transform: scale(1.1);
  }
`;

const PoweredByContainer = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid ${props => props.$isDarkMode ? '#1f1f1f' : '#b0b0b0'};
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 500;
`;

const PoweredByLink = styled.a`
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 600;

  &:hover {
    color: #8b5cf6;
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  touch-action: none;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};

  @media (min-width: 769px) {
    display: none;
  }
`;

const CollapsedContent = styled.div`
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
  overflow: hidden;
  white-space: nowrap;
`;

const Sidebar = ({ isOpen, onClose, onToggle, onSocialMediaClick, onTabNavigation, chatbotId, apiBase }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(false);
  const [isLogoHovered, setIsLogoHovered] = React.useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Sidebar configuration state
  const [sidebarEnabled, setSidebarEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappMode, setWhatsappMode] = useState("premium_modal");
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [whatsappText, setWhatsappText] = useState("Connect on WhatsApp");
  const [callEnabled, setCallEnabled] = useState(false);
  const [callMode, setCallMode] = useState("premium_modal");
  const [callNumber, setCallNumber] = useState(null);
  const [callText, setCallText] = useState("Talk to a Counsellor");
  const [calendlyEnabled, setCalendlyEnabled] = useState(false);
  const [calendlyMode, setCalendlyMode] = useState("premium_modal");
  const [calendlyUrl, setCalendlyUrl] = useState(null);
  const [calendlyText, setCalendlyText] = useState("Schedule a Meeting");
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailMode, setEmailMode] = useState("premium_modal");
  const [emailText, setEmailText] = useState("Send an Email");
  const [socialEnabled, setSocialEnabled] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [brandingEnabled, setBrandingEnabled] = useState(false);
  const [brandingText, setBrandingText] = useState("Powered by");
  const [brandingCompany, setBrandingCompany] = useState("Troika Tech");
  const [brandingLogoUrl, setBrandingLogoUrl] = useState(null);
  const [brandingLogoLink, setBrandingLogoLink] = useState(null);
  const [headerEnabled, setHeaderEnabled] = useState(false);
  const [headerText, setHeaderText] = useState(null);
  const [headerLogoUrl, setHeaderLogoUrl] = useState(null);
  const [headerLogoLink, setHeaderLogoLink] = useState(null);
  const [chatbotName, setChatbotName] = useState(null);
  const [customNavEnabled, setCustomNavEnabled] = useState(false);
  const [customNavItems, setCustomNavItems] = useState([]);
  const [sidebarConfigLoading, setSidebarConfigLoading] = useState(true);

  React.useEffect(() => {
    const checkScreenSize = () => {
      // Use multiple detection methods for reliability
      const width = window.innerWidth || document.documentElement.clientWidth || window.screen.width;
      
      // Check CSS custom property first (set by loader)
      const cssIsMobile = document.documentElement.getAttribute('data-is-mobile');
      let isMobileValue = width <= 768;
      
      if (cssIsMobile === 'true') {
        isMobileValue = true;
      } else if (cssIsMobile === 'false') {
        isMobileValue = false;
      } else {
        // Fallback detection
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
        isMobileValue = width <= 768 || (isTouchDevice && width <= 1024) || isMobileUserAgent;
      }
      
      setIsMobile(isMobileValue);
    };

    // Initial check with slight delay to ensure DOM is ready
    const initialCheck = setTimeout(checkScreenSize, 50);
    
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkScreenSize, 200);
    });
    
    // Also listen for viewport changes
    const observer = new MutationObserver(() => {
      checkScreenSize();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-is-mobile']
    });
    
    return () => {
      clearTimeout(initialCheck);
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
      observer.disconnect();
    };
  }, []);

  // Lock body scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (isMobile && isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMobile, isOpen]);

  // Fetch sidebar configuration when chatbotId or apiBase changes
  useEffect(() => {
    if (!chatbotId || !apiBase) {
      console.log('Sidebar Config: Missing chatbotId or apiBase', { chatbotId, apiBase });
      setSidebarConfigLoading(false);
      return;
    }

    // Reset loading state when chatbotId changes
    setSidebarConfigLoading(true);
    setSidebarEnabled(false);
    setWhatsappEnabled(false);
    setWhatsappMode("premium_modal");
    setWhatsappUrl(null);
    setWhatsappText("Connect on WhatsApp");
    setCallEnabled(false);
    setCallMode("premium_modal");
    setCallNumber(null);
    setCallText("Talk to a Counsellor");
    setCalendlyEnabled(false);
    setCalendlyMode("premium_modal");
    setCalendlyUrl(null);
    setCalendlyText("Schedule a Meeting");
    setEmailEnabled(false);
    setEmailMode("premium_modal");
    setEmailText("Send an Email");
    setSocialEnabled(false);
    setSocialLinks([]);
    setBrandingEnabled(false);
    setBrandingText("Powered by");
    setBrandingCompany("Troika Tech");
    setBrandingLogoUrl(null);
    setBrandingLogoLink(null);
    setHeaderEnabled(false);
    setHeaderText(null);
    setHeaderLogoUrl(null);
    setHeaderLogoLink(null);
    setChatbotName(null);
    setCustomNavEnabled(false);
    setCustomNavItems([]);

    const fetchSidebarConfig = async () => {
      try {
        console.log(`[Sidebar Config] Fetching sidebar config for chatbot: ${chatbotId} from ${apiBase}`);
        const response = await axios.get(`${apiBase}/chatbot/${chatbotId}/sidebar-config`);
        
        console.log('[Sidebar Config] Full response:', response);
        console.log('[Sidebar Config] Response data:', response.data);
        
        // Handle response structure: { success: true, data: { ... } }
        const config = response.data?.data || response.data;
        
        console.log('[Sidebar Config] Parsed config:', config);
        
        setSidebarEnabled(config.sidebar_enabled || false);
        setWhatsappEnabled(config.whatsapp_enabled || false);
        setWhatsappMode(config.whatsapp_mode || "premium_modal");
        setWhatsappUrl(config.whatsapp_url || null);
        setWhatsappText(config.whatsapp_text || "Connect on WhatsApp");
        setCallEnabled(config.call_enabled || false);
        setCallMode(config.call_mode || "premium_modal");
        setCallNumber(config.call_number || null);
        setCallText(config.call_text || "Talk to a Counsellor");
        setCalendlyEnabled(config.calendly_enabled || false);
        setCalendlyMode(config.calendly_mode || "premium_modal");
        setCalendlyUrl(config.calendly_url || null);
        setCalendlyText(config.calendly_text || "Schedule a Meeting");
        setEmailEnabled(config.email_enabled || false);
        setEmailMode(config.email_mode || "premium_modal");
        setEmailText(config.email_text || "Send an Email");
        setSocialEnabled(config.social_enabled || false);
        setSocialLinks(config.social_links || []);
        setBrandingEnabled(config.branding_enabled || false);
        setBrandingText(config.branding_text || "Powered by");
        setBrandingCompany(config.branding_company || "Troika Tech");
        setBrandingLogoUrl(config.branding_logo_url || null);
        setBrandingLogoLink(config.branding_logo_link || null);
        setHeaderEnabled(config.header_enabled || false);
        setHeaderText(config.header_text || null);
        setHeaderLogoUrl(config.header_logo_url || null);
        setHeaderLogoLink(config.header_logo_link || null);
        setChatbotName(config.chatbot_name || null);
        setCustomNavEnabled(config.custom_nav_enabled || false);
        setCustomNavItems(config.custom_nav_items || []);
        
        console.log('[Sidebar Config] ✅ Sidebar config loaded successfully');
      } catch (error) {
        console.error("[Sidebar Config] ❌ Error fetching sidebar config:", error);
        console.error("[Sidebar Config] Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: `${apiBase}/chatbot/${chatbotId}/sidebar-config`
        });
        // Silently fail - use defaults if config not found
        setSidebarEnabled(false);
        setWhatsappEnabled(false);
        setWhatsappText("Connect on WhatsApp");
        setCallEnabled(false);
        setCallText("Talk to a Counsellor");
        setCalendlyEnabled(false);
        setCalendlyText("Schedule a Meeting");
      } finally {
        // Always set loading to false after fetch completes (success or error)
        setSidebarConfigLoading(false);
      }
    };

    fetchSidebarConfig();
  }, [chatbotId, apiBase]);

  // Use isOpen prop for desktop, collapsed when not open
  const isCollapsed = !isOpen && !isMobile;

  const handlePageChange = (routeId) => {

    // Use the navigation handler if provided, otherwise use direct navigation
    if (onTabNavigation) {
      // Pass just the route ID (without leading slash) to the parent
      // e.g., 'ai-agent' or 'new-chat' or 'schedule-meeting'
      const cleanRouteId = routeId.startsWith('/') ? routeId.substring(1) : routeId;
      onTabNavigation(cleanRouteId === '' ? 'new-chat' : cleanRouteId);
    } else {
      // For direct navigation, ensure we have a leading slash
      const path = routeId.startsWith('/') ? routeId : `/${routeId}`;
      navigate(path);
    }

    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle WhatsApp click based on mode
  const handleWhatsAppClick = () => {
    if (whatsappMode === "redirect" && whatsappUrl) {
      // Format WhatsApp URL if needed
      let url = whatsappUrl.trim();
      // If it's just a phone number, convert to WhatsApp URL
      if (/^\+?\d{10,15}$/.test(url)) {
        url = `https://wa.me/${url.replace(/[^0-9]/g, '')}`;
      }
      // Ensure it's a valid URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      window.open(url, '_blank');
    } else {
      // Show premium modal
      setIsPremiumModalOpen(true);
    }
  };

  // Handle Call click based on mode
  const handleCallClick = () => {
    if (callMode === "redirect" && callNumber) {
      // Format phone number for tel: link
      let phone = callNumber.trim();
      // Remove any non-digit characters except +
      phone = phone.replace(/[^\d+]/g, '');
      // Ensure it starts with tel:
      window.location.href = `tel:${phone}`;
    } else {
      // Show premium modal
      setIsPremiumModalOpen(true);
    }
  };

  // Handle Calendly click based on mode
  const handleCalendlyClick = () => {
    if (calendlyMode === "redirect" && calendlyUrl) {
      // Navigate to schedule-meeting route instead of opening new tab
      navigate('/schedule-meeting');
      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        onClose();
      }
    } else {
      // Show premium modal
      setIsPremiumModalOpen(true);
    }
  };

  const handleEmailClick = () => {
    if (emailMode === "show_templates") {
      // Navigate to email services route to show templates beside sidebar
      navigate('/email-services');
      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        onClose();
      }
    } else {
      // Show premium modal
      setIsPremiumModalOpen(true);
    }
  };

  // Map platform to icon component
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook />;
      case 'instagram':
        return <FaInstagram />;
      case 'youtube':
        return <FaYoutube />;
      case 'linkedin':
        return <FaLinkedin />;
      case 'twitter':
        return <FaTwitter />;
      case 'whatsapp':
        return <FaWhatsapp />;
      case 'telegram':
        return <FaTelegram />;
      default:
        return <FaLink />;
    }
  };

  // Get platform color
  const getPlatformColor = (platform) => {
    const colors = {
      facebook: '#1877F2',
      instagram: '#E4405F',
      youtube: '#FF0000',
      linkedin: '#0077B5',
      twitter: '#1DA1F2',
      whatsapp: '#25D366',
      telegram: '#0088cc',
      pinterest: '#BD081C',
      tiktok: '#000000',
      snapchat: '#FFFC00',
      custom: isDarkMode ? '#9ca3af' : '#6b7280'
    };
    return colors[platform] || colors.custom;
  };

  // Get icon component from icon name (Font Awesome)
  const getIconComponent = (iconName) => {
    if (!iconName || typeof iconName !== 'string') {
      return <FaLink />;
    }

    // Map all Font Awesome icon names to components
    const iconMap = {
      // Navigation & Basic
      'FaHome': FaHome,
      'FaGlobe': FaGlobe,
      'FaLink': FaLink,
      'FaBars': FaBars,
      'FaArrowRight': FaArrowRight,
      'FaArrowLeft': FaArrowLeft,
      'FaChevronRight': FaChevronRight,
      'FaChevronLeft': FaChevronLeft,
      'FaTh': FaTh,
      'FaList': FaList,
      // Communication
      'FaEnvelope': FaEnvelope,
      'FaPhone': FaPhone,
      'FaPhoneAlt': FaPhoneAlt,
      'FaComment': FaComment,
      'FaComments': FaComments,
      'FaPaperPlane': FaPaperPlane,
      'FaInbox': FaInbox,
      'FaBell': FaBell,
      'FaRss': FaRss,
      'FaAt': FaAt,
      // Business & Commerce
      'FaShoppingCart': FaShoppingCart,
      'FaStore': FaStore,
      'FaCreditCard': FaCreditCard,
      'FaDollarSign': FaDollarSign,
      'FaTag': FaTag,
      'FaTags': FaTags,
      'FaGift': FaGift,
      'FaPercent': FaPercent,
      'FaReceipt': FaReceipt,
      'FaHandshake': FaHandshake,
      // Content & Media
      'FaBook': FaBook,
      'FaFileAlt': FaFileAlt,
      'FaNewspaper': FaNewspaper,
      'FaVideo': FaVideo,
      'FaImage': FaImage,
      'FaImages': FaImages,
      'FaMusic': FaMusic,
      'FaFilm': FaFilm,
      'FaPodcast': FaPodcast,
      'FaPlay': FaPlay,
      // User & Account
      'FaUser': FaUser,
      'FaUserCircle': FaUserCircle,
      'FaUsers': FaUsers,
      'FaUserFriends': FaUserFriends,
      'FaUserPlus': FaUserPlus,
      'FaUserCheck': FaUserCheck,
      'FaUserShield': FaUserShield,
      'FaIdCard': FaIdCard,
      'FaAddressBook': FaAddressBook,
      'FaUserCog': FaUserCog,
      // Tools & Settings
      'FaCog': FaCog,
      'FaTools': FaTools,
      'FaWrench': FaWrench,
      'FaLock': FaLock,
      'FaKey': FaKey,
      'FaShieldAlt': FaShieldAlt,
      'FaSearch': FaSearch,
      'FaFilter': FaFilter,
      'FaSort': FaSort,
      'FaDownload': FaDownload,
      // Social & Sharing
      'FaShare': FaShare,
      'FaShareAlt': FaShareAlt,
      'FaHeart': FaHeart,
      'FaStar': FaStar,
      'FaThumbsUp': FaThumbsUp,
      'FaThumbsDown': FaThumbsDown,
      'FaBookmark': FaBookmark,
      'FaFlag': FaFlag,
      'FaRetweet': FaRetweet,
      'FaCommentDots': FaCommentDots,
      // Location & Maps
      'FaMap': FaMap,
      'FaMapMarkerAlt': FaMapMarkerAlt,
      'FaMapPin': FaMapPin,
      'FaDirections': FaDirections,
      'FaRoute': FaRoute,
      // Actions & Utilities
      'FaPlus': FaPlus,
      'FaEdit': FaEdit,
      'FaTrash': FaTrash,
      'FaSave': FaSave,
      'FaPrint': FaPrint,
      'FaCopy': FaCopy,
      'FaCut': FaCut,
      'FaPaste': FaPaste,
      'FaUndo': FaUndo,
      'FaRedo': FaRedo,
      // Special & Custom
      'FaInfoCircle': FaInfoCircle,
      'FaQuestionCircle': FaQuestionCircle,
      'FaExclamationCircle': FaExclamationCircle,
      'FaCheckCircle': FaCheckCircle,
      'FaTimesCircle': FaTimesCircle,
      // Legacy/Additional
      'FaWhatsapp': FaWhatsapp,
      'FaBolt': FaBolt,
      'FaChartLine': FaChartLine,
      'FaRupeeSign': FaRupeeSign,
      'FaBullhorn': FaBullhorn,
      'FaHeadset': FaHeadset,
      'FaBrain': FaBrain,
      'FaMagic': FaMagic,
      'FaTelegram': FaTelegram,
      'FaInstagram': FaInstagram,
      'FaLinkedin': FaLinkedin,
      'FaFacebook': FaFacebook,
      'FaBuilding': FaBuilding,
      'FaFlickr': FaFlickr,
      'FaYoutube': FaYoutube,
      'FaCalendarAlt': FaCalendarAlt,
      'FaChevronDown': FaChevronDown,
      'FaTimes': FaTimes,
    };

    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent />;
    }

    // Fallback to FaLink if icon not found
    return <FaLink />;
  };

  // Handle custom navigation item click
  const handleCustomNavClick = (item) => {
    const { redirect_url } = item;
    
    if (!redirect_url) {
      return;
    }

    // Handle different URL types
    if (redirect_url.startsWith('tel:')) {
      window.location.href = redirect_url;
    } else if (redirect_url.startsWith('mailto:')) {
      window.location.href = redirect_url;
    } else if (redirect_url.startsWith('/')) {
      // Relative path - navigate within app
      navigate(redirect_url);
      if (window.innerWidth <= 768) {
        onClose();
      }
    } else {
      // External URL - open in new tab
      window.open(redirect_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <MobileOverlay $isOpen={isOpen} onClick={onClose} />
      <SidebarContainer $isDarkMode={isDarkMode} $isOpen={isOpen} $isCollapsed={isCollapsed && !isMobile}>
        <SidebarHeader $isDarkMode={isDarkMode} $isCollapsed={isCollapsed && !isMobile}>
          {isCollapsed && !isMobile ? (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '100%', 
                padding: '0.5rem',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              onClick={onToggle}
              title="Open sidebar"
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                fontSize: '24px',
                transition: 'all 0.2s ease'
              }}>
                <FaBars />
              </div>
            </div>
          ) : (
            <CollapsedContent $isCollapsed={false}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between', width: '100%', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  {!sidebarConfigLoading && sidebarEnabled && headerEnabled ? (
                    <>
                      {headerLogoUrl && (
                        headerLogoLink ? (
                          <a
                            href={headerLogoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: '8px' }}
                          >
                            <img
                              src={headerLogoUrl}
                              alt={headerText || chatbotName || "Logo"}
                              style={{
                                height: "32px",
                                width: "auto",
                                maxWidth: "120px",
                                objectFit: "contain",
                                filter: isDarkMode ? "brightness(0.9)" : "none"
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </a>
                        ) : (
                          <img
                            src={headerLogoUrl}
                            alt={headerText || chatbotName || "Logo"}
                            style={{
                              height: "32px",
                              width: "auto",
                              maxWidth: "120px",
                              objectFit: "contain",
                              filter: isDarkMode ? "brightness(0.9)" : "none",
                              marginRight: '8px'
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )
                      )}
                      <LogoText $isDarkMode={isDarkMode}>
                        {headerText || chatbotName || "Chatbot"}
                      </LogoText>
                    </>
                  ) : (
                    chatbotName ? (
                      <LogoText $isDarkMode={isDarkMode}>{chatbotName}</LogoText>
                    ) : null
                  )}
                </div>
                {/* Mobile close button */}
                {isMobile && (
                  <button
                    onClick={onClose}
                    className="mobile-close-btn"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      fontSize: '24px',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      borderRadius: '6px',
                      transition: 'background 0.2s ease',
                      minWidth: '40px',
                      minHeight: '40px',
                      flexShrink: 0,
                      marginLeft: 'auto',
                      marginRight: '-1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                    title="Close sidebar"
                  >
                    <FaTimes />
                  </button>
                )}
                {!isMobile && (
                  <button
                    onClick={onClose}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? '#ffffff' : '#1f2937',
                      fontSize: '24px',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      marginLeft: '30px',
                      borderRadius: '6px',
                      transition: 'background 0.2s ease',
                      minWidth: '40px',
                      minHeight: '40px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                    title="Close sidebar"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </CollapsedContent>
          )}
        </SidebarHeader>

        <SidebarContent>
          <Section>
            <NavItem
              $isDarkMode={isDarkMode}
              $isCollapsed={isCollapsed && !isMobile}
              onClick={() => handlePageChange('new-chat')}
              className=""
              title={isCollapsed && !isMobile ? 'New Chat' : ''}
            >
              <NavIcon><FaMagic /></NavIcon>
              {(!isCollapsed || isMobile) && <NavText>New Chat</NavText>}
            </NavItem>
          </Section>

          <Section>
            {/* Send an Email - Commented out */}
            {/* <NavItem
              $isDarkMode={isDarkMode}
              $isCollapsed={isCollapsed && !isMobile}
              onClick={() => setIsPremiumModalOpen(true)}
              className="nav-item"
              title={isCollapsed && !isMobile ? 'Send an Email' : ''}
            >
              <NavIcon>
                <FaEnvelope />
              </NavIcon>
              {(!isCollapsed || isMobile) && <NavText>Send an Email</NavText>}
            </NavItem> */}
            {/* Show WhatsApp only if sidebar is enabled, WhatsApp is enabled, and config is loaded */}
            {!sidebarConfigLoading && sidebarEnabled && whatsappEnabled && (
              <NavItem
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                onClick={handleWhatsAppClick}
                className="nav-item"
                title={isCollapsed && !isMobile ? whatsappText : ''}
              >
                <NavIcon>
                  <FaWhatsapp />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText>{whatsappText}</NavText>}
              </NavItem>
            )}
            {/* Get Fee Details & Plans - Commented out */}
            {/* <NavItem
              $isDarkMode={isDarkMode}
              $isCollapsed={isCollapsed && !isMobile}
              onClick={() => setIsPremiumModalOpen(true)}
              className="nav-item"
              title={isCollapsed && !isMobile ? 'Get Fee Details & Plans' : ''}
            >
              <NavIcon>
                <FaRupeeSign />
              </NavIcon>
              {(!isCollapsed || isMobile) && <NavText>Get Fee Details & Plans</NavText>}
            </NavItem> */}
            {/* Book a Campus Visit - Commented out */}
            {/* <NavItem
              $isDarkMode={isDarkMode}
              $isCollapsed={isCollapsed && !isMobile}
              onClick={() => setIsPremiumModalOpen(true)}
              className="nav-item"
              title={isCollapsed && !isMobile ? 'Book a Campus Visit' : ''}
            >
              <NavIcon>
                <FaHandshake />
              </NavIcon>
              {(!isCollapsed || isMobile) && <NavText>Book a Campus Visit</NavText>}
            </NavItem> */}
            {/* Show Call only if sidebar is enabled, Call is enabled, and config is loaded */}
            {!sidebarConfigLoading && sidebarEnabled && callEnabled && (
              <NavItem
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                onClick={handleCallClick}
                className="nav-item"
                title={isCollapsed && !isMobile ? callText : ''}
              >
                <NavIcon>
                  <FaPhoneAlt />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText>{callText}</NavText>}
              </NavItem>
            )}

            {/* Show Calendly only if sidebar is enabled, Calendly is enabled, and config is loaded */}
            {!sidebarConfigLoading && sidebarEnabled && calendlyEnabled && (
              <NavItem
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                onClick={handleCalendlyClick}
                className="nav-item"
                title={isCollapsed && !isMobile ? calendlyText : ''}
              >
                <NavIcon>
                  <FaCalendarAlt />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText>{calendlyText}</NavText>}
              </NavItem>
            )}

            {!sidebarConfigLoading && sidebarEnabled && emailEnabled && (
              <NavItem
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                onClick={handleEmailClick}
                className="nav-item"
                title={isCollapsed && !isMobile ? emailText : ''}
              >
                <NavIcon>
                  <FaEnvelope />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText>{emailText}</NavText>}
              </NavItem>
            )}

            {/* Custom Navigation Items */}
            {!sidebarConfigLoading && sidebarEnabled && customNavEnabled && customNavItems.length > 0 && customNavItems.map((item) => (
              <NavItem
                key={item._id || item.order}
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                onClick={() => handleCustomNavClick(item)}
                className="nav-item"
                title={isCollapsed && !isMobile ? item.display_text : ''}
              >
                <NavIcon>
                  {getIconComponent(item.icon_name)}
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText>{item.display_text}</NavText>}
              </NavItem>
            ))}
          </Section>
        </SidebarContent>

        {/* Social Media Icons */}
        {!sidebarConfigLoading && sidebarEnabled && socialEnabled && socialLinks.length > 0 && (
          <CollapsedContent $isCollapsed={isCollapsed && !isMobile}>
            <SocialIconsContainer $isDarkMode={isDarkMode}>
              {socialLinks.map((link) => {
                const platformName = link.platform === 'facebook' ? 'Facebook' :
                                     link.platform === 'instagram' ? 'Instagram' :
                                     link.platform === 'youtube' ? 'YouTube' :
                                     link.platform === 'linkedin' ? 'LinkedIn' :
                                     link.platform === 'twitter' ? 'Twitter/X' :
                                     link.platform === 'whatsapp' ? 'WhatsApp' :
                                     link.platform === 'telegram' ? 'Telegram' :
                                     link.platform === 'pinterest' ? 'Pinterest' :
                                     link.platform === 'tiktok' ? 'TikTok' :
                                     link.platform === 'snapchat' ? 'Snapchat' :
                                     'Social Media';
                
                return (
                  <SocialIcon
                    key={link._id || link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    $isDarkMode={isDarkMode}
                    $defaultColor={getPlatformColor(link.platform)}
                    $hoverColor={getPlatformColor(link.platform)}
                    title={platformName}
                  >
                    {getPlatformIcon(link.platform)}
                  </SocialIcon>
                );
              })}
            </SocialIconsContainer>
          </CollapsedContent>
        )}

        {/* Powered by - Dynamic Branding */}
        {!sidebarConfigLoading && sidebarEnabled && brandingEnabled && (
          <CollapsedContent $isCollapsed={isCollapsed && !isMobile}>
            <PoweredByContainer $isDarkMode={isDarkMode}>
              <span>{brandingText}</span>
              {brandingLogoUrl && (
                <img
                  src={brandingLogoUrl}
                  alt={brandingCompany}
                  style={{
                    height: "14px",
                    width: "auto",
                    filter: isDarkMode ? "brightness(0.8)" : "none"
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              {brandingLogoLink ? (
                <PoweredByLink
                  href={brandingLogoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {brandingCompany}
                </PoweredByLink>
              ) : (
                <span>{brandingCompany}</span>
              )}
            </PoweredByContainer>
          </CollapsedContent>
        )}

      </SidebarContainer>
      
      <PremiumFeatureModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
    </>
  );
};

export default Sidebar;
