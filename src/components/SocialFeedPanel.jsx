import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaInstagram, FaYoutube, FaFacebook, FaTwitter } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const PanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: flex-end;
  animation: ${props => props.$isOpen ? 'fadeIn' : 'fadeOut'} 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const PanelContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 100%;
  background: ${props => props.$isDarkMode ? '#1a1a1a' : '#ffffff'};
  border-left: 1px solid ${props => props.$isDarkMode ? '#333333' : '#e5e5e5'};
  display: flex;
  flex-direction: column;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    border-left: none;
  }
`;

const PanelHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#333333' : '#e5e5e5'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.$isDarkMode ? '#1f1f1f' : '#f8f9fa'};
  flex-shrink: 0;
`;

const PlatformInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PlatformIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 18px;
  background: ${props => {
    switch(props.$platform) {
      case 'instagram': return 'linear-gradient(45deg, #feda75, #d62976, #962fbf)';
      case 'youtube': return '#FF0000';
      case 'facebook': return '#1877F2';
      case 'twitter': return '#000000';
      default: return '#6b7280';
    }
  }};
`;

const PlatformName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
  margin: 0;
  text-transform: capitalize;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#6b7280'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;

  &:hover {
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const FeedContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: ${props => props.$isDarkMode ? '#1a1a1a' : '#ffffff'};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.$isDarkMode ? '#2a2a2a' : '#f1f1f1'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.$isDarkMode ? '#555555' : '#c1c1c1'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.$isDarkMode ? '#666666' : '#a8a8a8'};
  }
`;

const EmbeddedFeed = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$isDarkMode ? '#2a2a2a' : '#f8f9fa'};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#6b7280'};
  text-align: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.$isDarkMode ? '#333333' : '#e5e5e5'};
  border-top: 3px solid ${props => props.$isDarkMode ? '#ffffff' : '#6b7280'};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#6b7280'};
  text-align: center;
  gap: 1rem;
  padding: 2rem;
`;

const SocialFeedPanel = ({ isOpen, onClose, platform }) => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Reset states when panel opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, platform]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getPlatformIcon = () => {
    switch(platform) {
      case 'instagram': return <FaInstagram />;
      case 'youtube': return <FaYoutube />;
      case 'facebook': return <FaFacebook />;
      case 'twitter': return <FaTwitter />;
      default: return <FaInstagram />;
    }
  };

  const getEmbedUrl = () => {
    switch(platform) {
      case 'instagram':
        return 'https://www.instagram.com/troikatechindia/embed/';
      case 'youtube':
        return 'https://www.youtube.com/@TroikaDombivali/';
      case 'facebook':
        return 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftroikatechservices&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId';
      case 'twitter':
        return 'https://syndication.twitter.com/i/timeline/profile?screen_name=troikatech_in&theme=dark';
      default:
        return '';
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!isOpen) return null;

  return (
    <PanelOverlay $isOpen={isOpen} onClick={onClose}>
      <PanelContainer 
        $isOpen={isOpen} 
        $isDarkMode={isDarkMode}
        onClick={(e) => e.stopPropagation()}
      >
        <PanelHeader $isDarkMode={isDarkMode}>
          <PlatformInfo>
            <PlatformIcon $platform={platform}>
              {getPlatformIcon()}
            </PlatformIcon>
            <PlatformName $isDarkMode={isDarkMode}>
              {platform || 'Social Media'} Feed
            </PlatformName>
          </PlatformInfo>
          <CloseButton 
            $isDarkMode={isDarkMode}
            onClick={onClose}
            title="Close panel"
          >
            <FaTimes />
          </CloseButton>
        </PanelHeader>

        <FeedContainer $isDarkMode={isDarkMode}>
          {isLoading && (
            <LoadingState $isDarkMode={isDarkMode}>
              <LoadingSpinner $isDarkMode={isDarkMode} />
              <p>Loading {platform} feed...</p>
            </LoadingState>
          )}

          {hasError && (
            <ErrorState $isDarkMode={isDarkMode}>
              <h3>Unable to load feed</h3>
              <p>Please check your internet connection or try again later.</p>
              <button 
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: isDarkMode ? '#333333' : '#f0f0f0',
                  border: 'none',
                  borderRadius: '6px',
                  color: isDarkMode ? '#ffffff' : '#1f2937',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </ErrorState>
          )}

          {!hasError && (
            <EmbeddedFeed
              $isDarkMode={isDarkMode}
              src={getEmbedUrl()}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`${platform} feed`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </FeedContainer>
      </PanelContainer>
    </PanelOverlay>
  );
};

export default SocialFeedPanel;
