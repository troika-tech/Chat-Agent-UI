import React from "react";
import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaGlobe,
  FaPhone,
  FaWhatsapp,
  FaInfoCircle,
  FaBolt,
  FaChartLine,
  FaRupeeSign,
  FaHandshake,
  FaBullhorn,
  FaHeadset,
  FaPlus,
  FaShareAlt,
  FaPaperPlane,
  FaComment,
  FaChevronDown,
  FaTimes,
  FaBrain,
  FaPhoneAlt,
  FaMagic,
  FaTelegram,
  FaInstagram,
  FaLinkedin
} from "react-icons/fa";

const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background: ${props => props.$isDarkMode ? '#000000' : '#f9f9f9'};
  border-right: 1px solid ${props => props.$isDarkMode ? '#1f1f1f' : '#e5e5e5'};
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;

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
    margin: 2px 0;
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
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
    
    /* Show close button on mobile */
    .mobile-close-btn {
      display: flex !important;
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#2f2f2f' : '#e5e5e5'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
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
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
`;

const ChevronDown = styled(FaChevronDown)`
  color: ${props => props.$isDarkMode ? '#8e8ea0' : '#6b7280'};
  font-size: 12px;
  margin-left: auto;
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  margin-bottom: 1rem;
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
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  outline: none;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  border-radius: 0;
  position: relative;

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
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const NavText = styled.span`
  flex: 1;
`;

const SocialIconsContainer = styled.div`
  padding: 1.5rem 1rem;
  border-top: 1px solid ${props => props.$isDarkMode ? '#2f2f2f' : '#e5e5e5'};
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: auto;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: transparent;
  color: ${props => props.$defaultColor || (props.$isDarkMode ? '#9ca3af' : '#6b7280')};
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
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
  border-top: 1px solid ${props => props.$isDarkMode ? '#1f1f1f' : '#e5e5e5'};
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 500;

  @media (max-width: 768px) {
    justify-content: center;
  }
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
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.$isOpen ? 'block' : 'none'};

  @media (min-width: 769px) {
    display: none;
  }
`;

const Sidebar = ({ isOpen, onClose, onSocialMediaClick, onTabNavigation }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navigationItems = [
    { id: 'ai-agent', label: 'AI Agent', icon: FaBrain, color: '#10a37f' },
    { id: 'ai-calling-agent', label: 'AI Calling Agent', icon: FaPhoneAlt, color: '#3b82f6' }
  ];

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

  return (
    <>
      <MobileOverlay $isOpen={isOpen} onClick={onClose} />
      <SidebarContainer $isDarkMode={isDarkMode} $isOpen={isOpen}>
        <SidebarHeader $isDarkMode={isDarkMode}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo $isDarkMode={isDarkMode}>
              <img src="/logo.png" alt="Supa Agent Logo" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
            </Logo>
            <LogoText $isDarkMode={isDarkMode}>Troika Tech</LogoText>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none'
              }}
              title="Close menu"
            >
              <FaTimes />
            </button>
          )}
        </SidebarHeader>

        <SidebarContent>
          <Section>
            <NavItem
              $isDarkMode={isDarkMode}
              onClick={() => handlePageChange('new-chat')}
              className=""
            >
              <NavIcon><FaMagic   /></NavIcon>
              <NavText>Ask Me Anything</NavText>
            </NavItem>
          </Section>

          <Section>
            <SectionTitle $isDarkMode={isDarkMode}>Services</SectionTitle>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavItem
                  key={item.id}
                  $isDarkMode={isDarkMode}
                  onClick={() => handlePageChange(item.id)}
                  className={`nav-item ${isActive(`/${item.id}`) ? 'active' : ''}`}
                >
                  <NavIcon style={{ color: item.color || 'inherit' }}>
                    <IconComponent />
                  </NavIcon>
                  <NavText>{item.label}</NavText>
                </NavItem>
              );
            })}
          </Section>

          <Section>
            <SectionTitle $isDarkMode={isDarkMode}>Contact</SectionTitle>
            <NavItem
              $isDarkMode={isDarkMode}
              onClick={() => handlePageChange('get-quote')}
              className={`nav-item ${isActive('/get-quote') ? 'active' : ''}`}
            >
              <NavIcon style={{ color: '#f59e0b' }}>
                <FaRupeeSign />
              </NavIcon>
              <NavText>Get Quote</NavText>
            </NavItem>
            <NavItem
              $isDarkMode={isDarkMode}
              onClick={() => handlePageChange('schedule-meeting')}
              className={`nav-item ${isActive('/schedule-meeting') ? 'active' : ''}`}
            >
              <NavIcon style={{ color: '#ec4899' }}>
                <FaHandshake />
              </NavIcon>
              <NavText>Schedule a Meeting</NavText>
            </NavItem>
            <NavItem
              $isDarkMode={isDarkMode}
              onClick={() => handlePageChange('book-call')}
              className={`nav-item ${isActive('/book-call') ? 'active' : ''}`}
            >
              <NavIcon style={{ color: '#10b981' }}>
                <FaPhone />
              </NavIcon>
              <NavText>Book a Call</NavText>
            </NavItem>
          </Section>

        </SidebarContent>

        {/* Social Media Icons */}
        <SocialIconsContainer $isDarkMode={isDarkMode}>
          <SocialIcon
            href="https://api.whatsapp.com/send?phone=919897433544"
            target="_blank"
            rel="noopener noreferrer"
            $isDarkMode={isDarkMode}
            $defaultColor="#25d366"
            $hoverColor="#25d366"
            title="WhatsApp"
          >
            <FaWhatsapp />
          </SocialIcon>
          <SocialIcon
            href="https://t.me/your-telegram"
            target="_blank"
            rel="noopener noreferrer"
            $isDarkMode={isDarkMode}
            $defaultColor="#0088cc"
            $hoverColor="#0088cc"
            title="Telegram"
          >
            <FaTelegram />
          </SocialIcon>
          <SocialIcon
            href="https://www.instagram.com/troikatechindia/"
            target="_blank"
            rel="noopener noreferrer"
            $isDarkMode={isDarkMode}
            $defaultColor="#E4405F"
            $hoverColor="#E4405F"
            title="Instagram"
          >
            <FaInstagram />
          </SocialIcon>
          <SocialIcon
            href="https://in.linkedin.com/company/troika-tech"
            target="_blank"
            rel="noopener noreferrer"
            $isDarkMode={isDarkMode}
            $defaultColor="#0077b5"
            $hoverColor="#0077b5"
            title="LinkedIn"
          >
            <FaLinkedin />
          </SocialIcon>
        </SocialIconsContainer>

        {/* Powered by Troika Tech - Branding */}
        <PoweredByContainer $isDarkMode={isDarkMode}>
          <span>Powered by</span>
          <img
            src="/logo.png"
            alt="Troika Tech"
            style={{
              height: "14px",
              width: "auto",
              filter: isDarkMode ? "brightness(0.8)" : "none"
            }}
          />
          <PoweredByLink
            href="https://troikatech.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Troika Tech
          </PoweredByLink>
        </PoweredByContainer>

      </SidebarContainer>
    </>
  );
};

export default Sidebar;
