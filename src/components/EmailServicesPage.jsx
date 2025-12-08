import React, { useState, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../styles/GlobalStyles";
import {
  Wrapper,
  Overlay,
  AnimatedBlob,
  Chatbox,
  MainContentArea,
} from "../styles/MainStyles";
import Sidebar from "./Sidebar";
import ServiceSelection from "./ServiceSelection";
import { useBattery } from "../hooks/useBattery";
import { useClock } from "../hooks/useClock";

const EmailServicesPage = ({ chatbotId, apiBase }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { batteryLevel, isCharging } = useBattery();
  const { currentTime } = useClock();

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleTabNavigation = useCallback(
    (routeId) => {
      const path = routeId === "new-chat" ? "/" : `/${routeId}`;
      navigate(path, { replace: false });
      setSidebarOpen(false);
    },
    [navigate]
  );

  const handleSocialMediaClick = useCallback(() => {}, []);

  return (
    <Wrapper>
      <GlobalStyle />
      <Overlay $isDarkMode={isDarkMode}>
        <AnimatedBlob $isDarkMode={isDarkMode} />

        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          onToggle={handleSidebarToggle}
          onSocialMediaClick={handleSocialMediaClick}
          onTabNavigation={handleTabNavigation}
          chatbotId={chatbotId}
          apiBase={apiBase}
          batteryLevel={batteryLevel}
          isCharging={isCharging}
          currentTime={currentTime}
        />

        <MainContentArea $isDarkMode={isDarkMode} $sidebarOpen={sidebarOpen}>
          <Chatbox $isDarkMode={isDarkMode}>
            <ServiceSelection chatbotId={chatbotId} apiBase={apiBase} />
          </Chatbox>
        </MainContentArea>
      </Overlay>
    </Wrapper>
  );
};

export default EmailServicesPage;

