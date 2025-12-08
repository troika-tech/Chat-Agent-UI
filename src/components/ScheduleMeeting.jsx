import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { InlineWidget } from "react-calendly";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import Sidebar from "./Sidebar";
import { useBattery } from "../hooks/useBattery";
import { useClock } from "../hooks/useClock";
import GlobalStyle from "../styles/GlobalStyles";
import { Wrapper, Overlay, AnimatedBlob, Chatbox, MainContentArea } from "../styles/MainStyles";
import axios from "axios";

const ScheduleContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 1.5rem;
  background: ${props => props.$isDarkMode ? '#212121' : '#ffffff'};
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.$isDarkMode ? '#cccccc' : '#666666'};
  margin-bottom: 3rem;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const OpenCalendlyButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  margin-bottom: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
`;

const ErrorNote = styled.div`
  background: ${props => props.$isDarkMode ? '#2a2a2a' : '#fff3cd'};
  border: 1px solid ${props => props.$isDarkMode ? '#444' : '#ffc107'};
  color: ${props => props.$isDarkMode ? '#ffc107' : '#856404'};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  max-width: 600px;
`;

const CalendlyWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.$isDarkMode
    ? '0 10px 30px rgba(0, 0, 0, 0.5)'
    : '0 10px 30px rgba(0, 0, 0, 0.1)'};
  background: ${props => props.$isDarkMode ? '#1a1a1a' : '#ffffff'};

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

function ScheduleMeeting({ chatbotId, apiBase }) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState("https://calendly.com/troika-parvati/new-meeting"); // Default fallback
  const [loadingCalendly, setLoadingCalendly] = useState(true);

  // Use the same hooks as SupaChatbot for consistency
  const { batteryLevel, isCharging } = useBattery();
  const { currentTime } = useClock();

  // Fetch Calendly URL from backend when component mounts
  useEffect(() => {
    if (!chatbotId || !apiBase) {
      console.log('[ScheduleMeeting] Missing chatbotId or apiBase, using default Calendly URL');
      setLoadingCalendly(false);
      return;
    }

    const fetchCalendlyUrl = async () => {
      try {
        console.log(`[ScheduleMeeting] Fetching Calendly config for chatbot: ${chatbotId} from ${apiBase}`);
        const response = await axios.get(`${apiBase}/chatbot/${chatbotId}/sidebar-config`);
        
        const config = response.data?.data || response.data;
        const configuredUrl = config.calendly_url;
        
        if (configuredUrl && config.calendly_enabled && config.calendly_mode === "redirect") {
          setCalendlyUrl(configuredUrl);
          console.log('[ScheduleMeeting] ✅ Using configured Calendly URL:', configuredUrl);
        } else {
          console.log('[ScheduleMeeting] ⚠️ No configured Calendly URL found, using default');
        }
      } catch (error) {
        console.error("[ScheduleMeeting] ❌ Error fetching Calendly config:", error);
        // Keep default URL on error
      } finally {
        setLoadingCalendly(false);
      }
    };

    fetchCalendlyUrl();
  }, [chatbotId, apiBase]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleTabNavigation = useCallback((routeId) => {
    // Convert route ID to path (e.g., 'ai-agent' -> '/ai-agent')
    const path = routeId === 'new-chat' ? '/' : `/${routeId}`;
    // Use navigate with replace: false to ensure client-side navigation
    navigate(path, { replace: false });
    setSidebarOpen(false);
  }, [navigate]);

  const handleSocialMediaClick = useCallback((platform) => {
    // Handle social media click if needed
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  return (
    <Wrapper>
      <GlobalStyle />
      <Overlay $isDarkMode={isDarkMode}>
        <AnimatedBlob $isDarkMode={isDarkMode} />

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          onToggle={handleSidebarToggle}
          onSocialMediaClick={handleSocialMediaClick}
          onTabNavigation={handleTabNavigation}
          chatbotId={chatbotId}
          apiBase={apiBase}
        />

        {/* Main Content Area */}
        <MainContentArea $isDarkMode={isDarkMode} $sidebarOpen={sidebarOpen}>
          <Chatbox $isDarkMode={isDarkMode}>
            <ScheduleContentContainer $isDarkMode={isDarkMode}>
              <ContentWrapper>
                <Title $isDarkMode={isDarkMode}>Book An Appointment</Title>
                <Subtitle $isDarkMode={isDarkMode}>
                  Book a time that works best for you. We're excited to connect!
                </Subtitle>

                {loadingCalendly ? (
                  <CalendlyWrapper $isDarkMode={isDarkMode}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '700px',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}>
                      Loading Calendly...
                    </div>
                  </CalendlyWrapper>
                ) : (
                  <CalendlyWrapper $isDarkMode={isDarkMode}>
                    <InlineWidget
                      url={calendlyUrl}
                      styles={{
                        height: '700px',
                        width: '100%'
                      }}
                    />
                  </CalendlyWrapper>
                )}
              </ContentWrapper>
            </ScheduleContentContainer>
          </Chatbox>
        </MainContentArea>
      </Overlay>
    </Wrapper>
  );
}

export default ScheduleMeeting;
