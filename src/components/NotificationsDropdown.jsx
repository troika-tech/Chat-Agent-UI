import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FiBell, FiVolume2, FiVolumeX } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";

const NotificationsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const NotificationsButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 20px;
  width: 40px;
  height: 40px;
  position: relative;

  &:hover {
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${props => props.$isDarkMode ? '#1f2937' : '#ffffff'};
  border: 1px solid ${props => props.$isDarkMode ? '#374151' : '#e5e7eb'};
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
  transform-origin: top right;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
  user-select: none;

  &:hover {
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'};
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
`;

const NotificationsDropdown = ({ soundEnabled = true, toggleSound }) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Close on Escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSoundToggle = () => {
    if (toggleSound) {
      toggleSound();
    }
    // Optionally close dropdown after toggle
    // setIsOpen(false);
  };

  return (
    <NotificationsContainer ref={containerRef}>
      <NotificationsButton
        $isDarkMode={isDarkMode}
        onClick={handleToggle}
        title="Notifications"
        aria-label="Notifications"
      >
        <FiBell />
      </NotificationsButton>

      {isOpen && (
        <>
          <Overlay onClick={() => setIsOpen(false)} />
          <DropdownMenu $isDarkMode={isDarkMode} ref={dropdownRef}>
            <MenuItem
              $isDarkMode={isDarkMode}
              onClick={handleSoundToggle}
            >
              {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
              <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
            </MenuItem>
          </DropdownMenu>
        </>
      )}
    </NotificationsContainer>
  );
};

export default NotificationsDropdown;

