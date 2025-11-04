import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { InlineWidget } from "react-calendly";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import { useBattery } from "../hooks/useBattery";
import { useClock } from "../hooks/useClock";
import GlobalStyle from "../styles/GlobalStyles";
import { Wrapper, Overlay, AnimatedBlob, Chatbox, MainContentArea } from "../styles/MainStyles";

const BookCallContentContainer = styled.div`
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

function BookCall() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Use the same hooks as SupaChatbot for consistency
  const { batteryLevel, isCharging } = useBattery();
  const { currentTime } = useClock();

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
          onSocialMediaClick={handleSocialMediaClick}
          onTabNavigation={handleTabNavigation}
        />

        {/* Main Content Area */}
        <MainContentArea $isDarkMode={isDarkMode} $sidebarOpen={sidebarOpen}>
          <Chatbox $isDarkMode={isDarkMode}>
            <ChatHeader
              currentTime={currentTime}
              batteryLevel={batteryLevel}
              isCharging={isCharging}
              chatbotLogo="https://raw.githubusercontent.com/troika-tech/Asset/refs/heads/main/Supa%20Agent%20new.png"
              isMuted={isMuted}
              toggleMute={toggleMute}
              onSidebarToggle={handleSidebarToggle}
              sidebarOpen={sidebarOpen}
            />

            <BookCallContentContainer $isDarkMode={isDarkMode}>
              <ContentWrapper>
                <Title $isDarkMode={isDarkMode}>Book a Call</Title>
                <Subtitle $isDarkMode={isDarkMode}>
                  Choose a time that works for you and let's talk about how we can help your business grow.
                </Subtitle>

                <CalendlyWrapper $isDarkMode={isDarkMode}>
                  <InlineWidget
                    url="https://calendly.com/troika-parvati/new-meeting"
                    styles={{
                      height: '700px',
                      width: '100%'
                    }}
                  />
                </CalendlyWrapper>
              </ContentWrapper>
            </BookCallContentContainer>
          </Chatbox>
        </MainContentArea>
      </Overlay>
    </Wrapper>
  );
}

export default BookCall;
