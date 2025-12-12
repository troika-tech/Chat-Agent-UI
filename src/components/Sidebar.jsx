import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import PremiumFeatureModal from "./PremiumFeatureModal";
import WhatsAppProposalModal from "./WhatsAppProposalModal";
import axios from "axios";
import { X } from "lucide-react";
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
  FaTwitter,
  FaBuilding,
  FaFlickr,
  FaYoutube,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";
import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
  FiMessageCircle,
  FiSend,
  FiGlobe,
  FiMessageSquare,
  FiPhone,
  FiCalendar,
  FiMail,
} from "react-icons/fi";

const SidebarContainer = styled.div`
  width: ${props => props.$isCollapsed ? '100px' : '320px'};
  height: 100vh;
  max-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: ${props => {
    const isCollapsed = Boolean(props.$isCollapsed);
    const radius = isCollapsed ? '1.5rem' : '1rem';
    return `0 ${radius} ${radius} 0`;
  }} !important;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  transition: width 0.3s ease, border-radius 0.3s ease;
  
  /* Responsive width */
  @media (max-width: 1024px) {
    width: ${props => props.$isCollapsed ? '90px' : '320px'};
  }


  /* Hide close button on desktop */
  .mobile-close-btn {
    display: none !important;
  }

  /* Professional Navigation Styles */
  .nav-item {
    transition: all 0.2s ease;
    border-radius: 0.75rem;
    margin: 0;
  }
  
  /* Increased border-radius when collapsed - rounded square/pill shape */
  &[data-collapsed="true"] .nav-item {
    border-radius: 1rem;
  }
  
  &[data-collapsed="true"] .nav-item.active {
    border-radius: 1rem;
  }

  .nav-item:hover {
    background: #f3f4f6;
    border: none;
    transform: none;
  }

  .nav-item.active {
    background: #eef2ff;
    border: none;
    border-left: 2px solid #6366f1;
    font-weight: 600;
    color: #4338ca;
  }

  .nav-item.active .nav-icon {
    color: #6366f1;
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
    box-shadow: ${props => props.$isOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none'};
    display: ${props => props.$isOpen ? 'flex' : 'flex'};
    z-index: 10000;
    overflow-y: auto;
    overflow-x: hidden;
    background: #ffffff;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    
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
    box-shadow: ${props => props.$isOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none'};
    z-index: 10000;
    background: #ffffff;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    
    .mobile-close-btn {
      display: flex !important;
    }
  }
  
  @media (max-width: 480px) {
    width: min(90vw, 320px);
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
  padding: ${props => props.$isCollapsed ? '0.75rem' : '1.5rem'};
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'space-between'};
  gap: 0.75rem;
  position: relative;
  min-height: ${props => props.$isCollapsed ? '60px' : 'auto'};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
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
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  font-size: 1.25rem !important; /* text-xl = 20px - matches -llamacoder exactly */
  font-weight: bold;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#111827'};
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.3;
  flex: 1;
  min-width: 0;
  letter-spacing: -0.025em; /* tracking-tight */
  transition: color 0.2s ease;
  
  @media (max-width: 768px) {
    font-size: 1.25rem !important;
  }
`;

const ChevronDown = styled(FaChevronDown)`
  color: ${props => props.$isDarkMode ? '#8e8ea0' : '#6b7280'};
  font-size: 12px;
  margin-left: auto;
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 0;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Hide scrollbar for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* WebKit browsers */
  }
  
  /* Smooth scrolling for mobile */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 0.5rem;
  padding: 0 1.5rem;
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

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: inherit;
  transition: color 0.2s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NavItem = styled.button`
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  background: ${props => props.$isActive ? '#eef2ff' : '#f9fafb'};
  border: none;
  border-left: ${props => props.$isActive ? '2px solid #6366f1' : 'none'};
  outline: none;
  color: ${props => props.$isActive ? '#4338ca' : '#374151'};
  text-align: ${props => props.$isCollapsed ? 'center' : 'left'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  gap: 0.75rem;
  transition: all 0.2s ease;
  border-radius: ${props => props.$isCollapsed ? '1rem' : '0.75rem'};
  position: relative;
  margin: 0;
  white-space: nowrap;
  font-size: 0.875rem; /* 14px - ensures base font size */

  &:hover {
    background: ${props => props.$isActive ? '#eef2ff' : '#f3f4f6'};
    border-left: ${props => props.$isActive ? '2px solid #6366f1' : 'none'};
  }

  &:active {
    background: ${props => props.$isActive ? '#eef2ff' : '#f3f4f6'};
    border-left: ${props => props.$isActive ? '2px solid #6366f1' : 'none'};
    outline: none;
  }

  &:focus {
    outline: none;
  }

  &.active {
    background: #eef2ff;
    border-left: 2px solid #6366f1;
    color: #4338ca;
  }
`;

const NavText = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
  font-size: 0.875rem !important; /* 14px - text-sm for both active and inactive */
  font-weight: 500; /* font-medium */
  line-height: 1.25rem; /* matches Tailwind text-sm line-height */
`;

const CloseButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f3f4f6;
    transform: scale(1.1);
  }

  &:focus,
  &:focus-visible {
    outline: none;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #4b5563;
    stroke-width: 2.5;
    font-weight: 400;
    display: block;
  }
`;

const SocialIconsContainer = styled.div`
  padding: 1.5rem 1rem;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
  width: 100%;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: auto;

  /* Reduced spacing on mobile */
  @media (max-width: 768px) {
    gap: 1rem;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    padding: 1.5rem 1rem;
  }
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.625rem;
  background: transparent;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  border: none;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.7;
  }

  /* Force outline look for all platform icons */
  svg * {
    fill: none !important;
    stroke: currentColor !important;
    stroke-width: 2px;
  }

  /* Touch-friendly on mobile */
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;

    svg {
      width: 22px;
      height: 22px;
    }
  }

  &:hover {
    background: #f3f4f6;
    color: ${props => props.$isDarkMode ? '#f3f4f6' : '#374151'};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1);
  }
`;

const PoweredByContainer = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 0.75rem; /* text-xs = 12px */
  font-weight: 400;
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

const CloseButtonContainer = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
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
  width: 100%;
`;

const Sidebar = ({ isOpen, onClose, onToggle, onSocialMediaClick, onTabNavigation, chatbotId, apiBase, authenticatedPhone }) => {
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
  const [whatsappProposalEnabled, setWhatsappProposalEnabled] = useState(false);
  const [whatsappProposalText, setWhatsappProposalText] = useState("Send Proposal via WhatsApp");
  const [whatsappProposalTemplates, setWhatsappProposalTemplates] = useState([]);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
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
        setWhatsappProposalEnabled(config.whatsapp_proposal_enabled || false);
        setWhatsappProposalText(config.whatsapp_proposal_text || "Send Proposal via WhatsApp");
        setWhatsappProposalTemplates(config.whatsapp_proposal_templates || []);
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
    if (!path) return false;
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname === path ||
      location.pathname.startsWith(`${path}/`);
  };

  const navClass = (paths = []) => (paths.some(isActive) ? 'nav-item active' : 'nav-item');

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

  // Handle WhatsApp Proposal click
  const handleWhatsAppProposalClick = () => {
    // Navigate to WhatsApp proposals page
    navigate('/whatsapp-proposals');
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  // Map platform to icon component
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <FiFacebook />;
      case 'instagram':
        return <FiInstagram />;
      case 'youtube':
        return <FiYoutube />;
      case 'linkedin':
        return <FiLinkedin />;
      case 'twitter':
        return <FiTwitter />;
      case 'whatsapp':
        return <FiMessageCircle />;
      case 'telegram':
        return <FiSend />;
      case 'indiamart':
        return <FaStore />;
      case 'justdial':
        return <FaBuilding />;
      case 'tradeindia':
        return <FaShoppingCart />;
      case 'exportersindia':
        return <FiGlobe />;
      default:
        return <FiGlobe />;
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
      indiamart: '#FF6B00',
      justdial: '#FF6B35',
      tradeindia: '#007BFF',
      exportersindia: '#28A745',
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
      <SidebarContainer 
        $isDarkMode={isDarkMode} 
        $isOpen={isOpen} 
        $isCollapsed={isCollapsed && !isMobile}
        data-collapsed={isCollapsed && !isMobile ? 'true' : 'false'}
      >
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {!sidebarConfigLoading && sidebarEnabled && headerEnabled ? (
                    <>
                      {headerLogoUrl && (
                        headerLogoLink ? (
                          <a
                            href={headerLogoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
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
                              filter: isDarkMode ? "brightness(0.9)" : "none"
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
                <CloseButton
                  onClick={onClose}
                  title="Close sidebar"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </CloseButton>
              </div>
            </CollapsedContent>
          )}
        </SidebarHeader>

        <SidebarContent>
          <Section>
            <NavItem
              $isDarkMode={isDarkMode}
              $isCollapsed={isCollapsed && !isMobile}
              $isActive={isActive('/') || isActive('/new-chat') || isActive('/chat') || isActive('/home')}
              onClick={() => handlePageChange('new-chat')}
              className={navClass(['/', '/new-chat', '/chat', '/home'])}
              title={isCollapsed && !isMobile ? 'New Chat' : ''}
            >
          <NavIcon><FiMessageSquare /></NavIcon>
              {(!isCollapsed || isMobile) && <NavText $isActive={isActive('/') || isActive('/new-chat') || isActive('/chat') || isActive('/home')}>New Chat</NavText>}
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
                $isActive={isActive('/ai-whatsapp')}
                onClick={handleWhatsAppClick}
                className={navClass(['/ai-whatsapp'])}
                title={isCollapsed && !isMobile ? whatsappText : ''}
              >
                <NavIcon>
                <FiMessageCircle />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText $isActive={isActive('/ai-whatsapp')}>{whatsappText}</NavText>}
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
                $isActive={isActive('/book-call') || isActive('/ai-calling') || isActive('/ai-calling-agent')}
                onClick={handleCallClick}
                className={navClass(['/book-call', '/ai-calling', '/ai-calling-agent'])}
                title={isCollapsed && !isMobile ? callText : ''}
              >
                <NavIcon>
                <FiPhone />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText $isActive={isActive('/book-call') || isActive('/ai-calling') || isActive('/ai-calling-agent')}>{callText}</NavText>}
              </NavItem>
            )}

            {/* Show Calendly only if sidebar is enabled, Calendly is enabled, and config is loaded */}
            {!sidebarConfigLoading && sidebarEnabled && calendlyEnabled && (
              <NavItem
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                $isActive={isActive('/schedule-meeting')}
                onClick={handleCalendlyClick}
                className={navClass(['/schedule-meeting'])}
                title={isCollapsed && !isMobile ? calendlyText : ''}
              >
                <NavIcon>
                <FiCalendar />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText $isActive={isActive('/schedule-meeting')}>{calendlyText}</NavText>}
              </NavItem>
            )}

            {!sidebarConfigLoading && sidebarEnabled && emailEnabled && (
              <NavItem
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                $isActive={isActive('/email-services')}
                onClick={handleEmailClick}
                className={navClass(['/email-services'])}
                title={isCollapsed && !isMobile ? emailText : ''}
              >
                <NavIcon>
                <FiMail />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText $isActive={isActive('/email-services')}>{emailText}</NavText>}
              </NavItem>
            )}

            {/* WhatsApp Proposal */}
            {!sidebarConfigLoading && sidebarEnabled && whatsappProposalEnabled && whatsappProposalTemplates.length > 0 && (
              <NavItem
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                $isActive={isActive('/whatsapp-proposals')}
                onClick={handleWhatsAppProposalClick}
                className={navClass(['/whatsapp-proposals'])}
                title={isCollapsed && !isMobile ? whatsappProposalText : ''}
              >
                <NavIcon>
                  <FaWhatsapp />
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText $isActive={isActive('/whatsapp-proposals')}>{whatsappProposalText}</NavText>}
              </NavItem>
            )}

            {/* Custom Navigation Items */}
            {!sidebarConfigLoading && sidebarEnabled && customNavEnabled && customNavItems.length > 0 && customNavItems.map((item) => (
              <NavItem
                key={item._id || item.order}
                $isDarkMode={isDarkMode}
                $isCollapsed={isCollapsed && !isMobile}
                $isActive={isActive(item.redirect_url || '')}
                onClick={() => handleCustomNavClick(item)}
                className={navClass([item.redirect_url || ''])}
                title={isCollapsed && !isMobile ? item.display_text : ''}
              >
                <NavIcon>
                  {getIconComponent(item.icon_name)}
                </NavIcon>
                {(!isCollapsed || isMobile) && <NavText $isActive={isActive(item.redirect_url || '')}>{item.display_text}</NavText>}
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
                                     link.platform === 'indiamart' ? 'IndiaMART' :
                                     link.platform === 'justdial' ? 'JustDial' :
                                     link.platform === 'tradeindia' ? 'TradeIndia' :
                                     link.platform === 'exportersindia' ? 'ExportersIndia' :
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
                    height: "20px",
                    width: "auto",
                    filter: isDarkMode ? "brightness(0.8)" : "none"
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <PoweredByLink
                href="https://troikatech.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {brandingCompany}
              </PoweredByLink>
            </PoweredByContainer>
          </CollapsedContent>
        )}

      </SidebarContainer>
      
      <PremiumFeatureModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
      <WhatsAppProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        chatbotId={chatbotId}
        apiBase={apiBase}
        templates={whatsappProposalTemplates}
        authenticatedPhone={authenticatedPhone}
      />
    </>
  );
};

export default Sidebar;
