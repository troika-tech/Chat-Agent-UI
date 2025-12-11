import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { FiZap, FiUsers, FiSettings, FiArrowLeft, FiMenu, FiRefreshCw } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import ProfileDropdown from "./ProfileDropdown";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(0.5rem, 1.5vw, 1rem) clamp(0.75rem, 2vw, 1.5rem);
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#1f1f1f' : '#e5e5e5'};
  background: ${props => props.$isDarkMode ? '#000000' : '#ffffff'};
  flex-shrink: 0;
  border-radius: 0;
  position: relative;
  min-height: clamp(55px, 4vw, 60px);
  width: 100%;
  max-width: 100vw;
  transition: background 0.3s ease;
  
  /* Prevent horizontal scroll */
  overflow-x: hidden;
  
  /* Add left padding to accommodate back button */
  @media (min-width: 901px) {
    padding-left: 3rem; /* Space for back button on large screens */
  }
  
  /* Back button positioned at absolute leftmost of screen */
  .back-button {
    position: absolute;
    left: 0; /* True leftmost edge of screen */
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    flex-shrink: 0;
    color: white; /* Make back icon white */
    
    /* Hide absolutely positioned back button on screens below 900px */
    @media (max-width: 900px) {
      display: none;
    }
  }

  /* Responsive design with fluid units */
  @media (max-width: 1024px) {
    padding: clamp(0.75rem, 1.5vw, 1.25rem) clamp(1rem, 2vw, 1.5rem);
    min-height: clamp(60px, 5vw, 70px);
  }

  @media (max-width: 768px) {
    padding: clamp(0.5rem, 1.25vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem);
    min-height: clamp(55px, 4vw, 60px);
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    padding: clamp(0.4rem, 1vw, 0.5rem) clamp(0.5rem, 1.25vw, 0.625rem);
    min-height: clamp(50px, 3.5vw, 55px);
  }

  @media (max-width: 360px) {
    padding: clamp(0.35rem, 0.75vw, 0.4rem) clamp(0.4rem, 1vw, 0.5rem);
    min-height: clamp(48px, 3vw, 52px);
  }
  
  /* Landscape mode */
  @media (orientation: landscape) and (max-height: 500px) {
    min-height: clamp(50px, 4vh, 55px);
    padding: clamp(0.4rem, 1vh, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem);
  }
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;

  /* Tablet responsive design */
  @media (max-width: 1024px) {
    gap: 0.875rem;
  }

  @media (max-width: 900px) {
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    gap: 0.625rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 640px) {
    gap: 0.5rem;
    padding: 0 0.25rem;
  }

  @media (max-width: 600px) {
    gap: 0.4rem;
    padding: 0 0.2rem;
  }

  @media (max-width: 480px) {
    gap: 0.3rem;
    padding: 0 0.15rem;
  }

  @media (max-width: 414px) {
    gap: 0.25rem;
    padding: 0 0.1rem;
  }

  @media (max-width: 390px) {
    gap: 0.2rem;
    padding: 0 0.05rem;
  }

  @media (max-width: 375px) {
    gap: 0.15rem;
    padding: 0;
  }

  @media (max-width: 360px) {
    gap: 0.1rem;
    padding: 0;
  }

  @media (max-width: 320px) {
    gap: 0.05rem;
    padding: 0;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  gap: 1rem;
  padding: 0;
  min-width: 0;

  /* Enhanced mobile responsiveness - Better spacing with increased gaps */
  @media (max-width: 1200px) {
    gap: 0.95rem;
  }

  @media (max-width: 1024px) {
    gap: 0.9rem;
  }

  @media (max-width: 900px) {
    gap: 0.85rem;
  }

  @media (max-width: 768px) {
    gap: 0.8rem; /* Better mobile spacing */
    padding-top: 0.1rem;
  }

  @media (max-width: 640px) {
    gap: 0.75rem;
    padding-top: 0.05rem;
  }

  @media (max-width: 600px) {
    gap: 0.7rem;
    padding-top: 0.05rem;
  }

  @media (max-width: 480px) {
    gap: 0.65rem; /* Better mobile spacing */
    padding-top: 0;
  }

  @media (max-width: 414px) {
    gap: 0.6rem; /* iPhone readability */
    padding-top: 0;
  }

  @media (max-width: 390px) {
    gap: 0.55rem; /* Small phone optimization */
    padding-top: 0;
  }

  @media (max-width: 375px) {
    gap: 0.5rem; /* iPhone SE readability */
    padding-top: 0;
  }

  @media (max-width: 360px) {
    gap: 0.45rem; /* Very small screens */
    padding-top: 0;
  }

  @media (max-width: 320px) {
    gap: 0.4rem; /* Minimum spacing */
    padding-top: 0;
  }
`;

/* Generic circle wrapper so avatar, bot name and status can each sit in a circle */
const Circle = styled.div`
  width: ${(props) => props.$size || 78}px;
  height: ${(props) => props.$size || 78}px;
  border-radius: 50%;
  background: transparent;
  backdrop-filter: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  padding: 0;
  text-align: center;
  flex-shrink: 0;
  overflow: hidden;

  /* Desktop-specific logo size increase by 10% */
  @media (min-width: 1201px) {
    width: ${(props) => props.$size ? (props.$size * 1.05) : 82}px;
    height: ${(props) => props.$size ? (props.$size * 1.05) : 82}px;
  }

  @media (max-width: 768px) {
    width: ${(props) => Math.max(70, (props.$size || 78) * 0.95)}px;
    height: ${(props) => Math.max(70, (props.$size || 78) * 0.95)}px;
  }

  @media (max-width: 480px) {
    width: ${(props) => Math.max(65, (props.$size || 78) * 0.88)}px;
    height: ${(props) => Math.max(65, (props.$size || 78) * 0.88)}px;
  }

  @media (max-width: 375px) {
    width: ${(props) => Math.max(60, (props.$size || 78) * 0.8)}px;
    height: ${(props) => Math.max(60, (props.$size || 78) * 0.8)}px;
  }

  @media (max-width: 320px) {
    width: ${(props) => Math.max(54, (props.$size || 78) * 0.72)}px;
    height: ${(props) => Math.max(54, (props.$size || 78) * 0.72)}px;
  }
`;

/* Rectangle wrapper for logo to show full logo properly */
const LogoContainer = styled.div`
  width: ${(props) => props.$width || 120}px;
  height: ${(props) => props.$height || 65}px;
  border-radius: 8px;
  background: transparent;
  backdrop-filter: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  border: none;
  padding: 4px;
  text-align: center;
  flex-shrink: 0;

  /* Desktop-specific logo size */
  @media (min-width: 1201px) {
    width: ${(props) => props.$width ? (props.$width * 1.05) : 126}px;
    height: ${(props) => props.$height ? (props.$height * 1.05) : 68}px;
  }

  @media (max-width: 768px) {
    width: ${(props) => Math.max(100, (props.$width || 120) * 0.9)}px;
    height: ${(props) => Math.max(54, (props.$height || 65) * 0.9)}px;
  }

  @media (max-width: 480px) {
    width: ${(props) => Math.max(90, (props.$width || 120) * 0.85)}px;
    height: ${(props) => Math.max(49, (props.$height || 65) * 0.85)}px;
  }

  @media (max-width: 375px) {
    width: ${(props) => Math.max(80, (props.$width || 120) * 0.75)}px;
    height: ${(props) => Math.max(43, (props.$height || 65) * 0.75)}px;
  }

  @media (max-width: 320px) {
    width: ${(props) => Math.max(70, (props.$width || 120) * 0.65)}px;
    height: ${(props) => Math.max(38, (props.$height || 65) * 0.65)}px;
  }
`;

const Avatar = styled.img`
  width: 90%;
  height: 90%;
  object-fit: cover; /* fill circle exactly */
  border-radius: 50%;
  display: block;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; /* show full logo without cropping */
  border-radius: 0%;
  display: block;
`;

const StatusBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Reverted to original left alignment */
  text-align: left; /* Reverted to original left text alignment */
  gap: 0.4rem; /* Increased gap for better spacing between bot name and status */
  
  /* Enhanced mobile responsiveness - Better spacing */
  @media (max-width: 1200px) {
    gap: 0.38rem;
  }

  @media (max-width: 1024px) {
    gap: 0.36rem;
  }

  @media (max-width: 900px) {
    gap: 0.34rem;
  }

  @media (max-width: 768px) {
    gap: 0.32rem; /* Better mobile spacing */
  }

  @media (max-width: 640px) {
    gap: 0.3rem;
  }

  @media (max-width: 600px) {
    gap: 0.28rem;
  }

  @media (max-width: 480px) {
    gap: 0.26rem; /* Better mobile spacing */
  }

  @media (max-width: 414px) {
    gap: 0.24rem; /* iPhone readability */
  }

  @media (max-width: 390px) {
    gap: 0.22rem; /* Small phone optimization */
  }

  @media (max-width: 375px) {
    gap: 0.2rem; /* iPhone SE readability */
  }

  @media (max-width: 360px) {
    gap: 0.18rem; /* Very small screens */
  }

  @media (max-width: 320px) {
    gap: 0.16rem; /* Minimum spacing */
  }
`;

const BotName = styled.div`
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  text-align: left;
  line-height: 1.1;
  margin: 0;

  /* Responsive font sizing with clamp */
  @media (min-width: 1280px) {
    font-size: clamp(1.2rem, 1.5vw, 1.4rem);
  }

  @media (max-width: 1024px) {
    font-size: clamp(1.3rem, 2vw, 1.6rem);
  }

  @media (max-width: 768px) {
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(1.1rem, 3vw, 1.4rem);
  }

  @media (max-width: 360px) {
    font-size: clamp(1rem, 3.5vw, 1.3rem);
  }
`;

const Status = styled.div`
  font-size: clamp(0.75rem, 1.25vw, 0.9rem);
  color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'};
  text-align: left;
  font-weight: 400;
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 0.5vw, 0.35rem);
  /* Removed gradient background for simple appearance */
  /* Removed padding for simple text appearance */
  /* Removed border-radius for simple text appearance */
  /* Removed box-shadow for simple appearance */

  /* Hide response time on mobile */
  .hide-on-mobile {
    @media (max-width: 640px) {
      display: none;
    }
  }

  /* Responsive font sizing with clamp */
  @media (min-width: 1280px) {
    font-size: clamp(0.8rem, 1vw, 0.9rem);
  }

  @media (max-width: 1024px) {
    font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  }

  @media (max-width: 768px) {
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    gap: clamp(0.2rem, 0.5vw, 0.25rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(0.75rem, 2.5vw, 0.85rem);
    gap: clamp(0.15rem, 0.4vw, 0.2rem);
  }

  @media (max-width: 360px) {
    font-size: clamp(0.7rem, 3vw, 0.8rem);
    gap: clamp(0.1rem, 0.3vw, 0.15rem);
  }
`;

const OnlineIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    width: 7px;
    height: 7px;
  }

  @media (max-width: 480px) {
    width: 6px;
    height: 6px;
  }
`;

const StatusDivider = styled.span`
  color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#9ca3af'};
  font-weight: 300;
`;

const Clock = styled.div`
  position: absolute;
  top: 16px; /* Reverted to original position */
  left: 12px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1f2937;
  z-index: 20;
  pointer-events: none;
  user-select: none;
`;

const BatteryContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 60px; /* Moved left to avoid close button overlap */
  display: flex;
  align-items: center;
  gap: 4px; /* Restored gap between percentage and battery */
  font-size: 0.85rem; /* iPhone-style smaller font */
  font-weight: 600;
  color: #495057; /* Dark gray like iPhone */
  z-index: 20;
  pointer-events: none;
  user-select: none;

  @media (max-width: 480px) {
    right: 50px; /* Adjust for mobile */
    font-size: 0.8rem;
  }
`;

const BatteryIcon = styled.div`
  width: 25px; /* Back to standard iPhone proportions */
  height: 13px;
  border: 1px solid #adb5bd;
  border-radius: 3px;
  position: relative;
  background: transparent;

  &::before {
    content: "";
    position: absolute;
    right: -4px;
    top: 4px;
    width: 3px;
    height: 5px;
    background: #6c757d;
    border-radius: 0 2px 2px 0;
  }

  &::after {
    content: "";
    position: absolute;
    left: 1.5px;
    top: 1.5px;
    bottom: 1.5px;
    width: ${(props) => Math.max(0, (props.$level / 100) * 21)}px;
    background: ${(props) => {
      if (props.$isCharging) return "#34c759"; /* Always green when charging */
      if (props.$level >= 50) return "#34c759"; /* iPhone green */
      if (props.$level >= 20) return "#ff9500"; /* iPhone orange */
      return "#ff3b30"; /* iPhone red */
    }};
    border-radius: 1.5px;
    transition: width 0.3s ease;

    ${(props) =>
      props.$isCharging &&
      `
        animation: chargingPulse 2s ease-in-out infinite;
        
        @keyframes chargingPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}
  }

  @media (max-width: 480px) {
    width: 22px;
    height: 11px;

    &::before {
      right: -3px;
      top: 3px;
      width: 2px;
      height: 5px;
    }

    &::after {
      width: ${(props) => Math.max(0, (props.$level / 100) * 18)}px;
    }
  }
`;

const ChargingIcon = styled.div`
  position: absolute;
  right: 64px; /* Next to battery percentage */
  top: 16px;
  font-size: 0.8rem;
  color: #34c759; /* iPhone green */
  z-index: 21;
  pointer-events: none;
  user-select: none;
  animation: chargingBolt 1.5s ease-in-out infinite;

  @keyframes chargingBolt {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  @media (max-width: 480px) {
    right: 54px;
    font-size: 0.75rem;
  }
`;

const BatteryPercentage = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #495057; /* Dark gray like iPhone */

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  
  /* Enhanced mobile responsiveness - Better spacing */
  @media (max-width: 1200px) {
    gap: 0.75rem;
  }

  @media (max-width: 1024px) {
    gap: 0.7rem;
  }

  @media (max-width: 900px) {
    gap: 0.65rem;
  }

  @media (max-width: 768px) {
    gap: 0.6rem; /* Better mobile spacing */
  }

  @media (max-width: 640px) {
    gap: 0.55rem;
  }

  @media (max-width: 600px) {
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.45rem; /* Better mobile spacing */
  }

  @media (max-width: 414px) {
    gap: 0.4rem; /* iPhone readability */
  }

  @media (max-width: 390px) {
    gap: 0.35rem; /* Small phone optimization */
  }

  @media (max-width: 375px) {
    gap: 0.3rem; /* iPhone SE readability */
  }

  @media (max-width: 360px) {
    gap: 0.25rem; /* Very small screens */
  }

  @media (max-width: 320px) {
    gap: 0.2rem; /* Minimum spacing */
  }
`;

const HeaderButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#374151'};
  cursor: pointer;
  padding: clamp(0.4rem, 1vw, 0.5rem);
  border-radius: clamp(6px, 1vw, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: clamp(36px, 3vw, 44px);
  min-height: clamp(36px, 3vw, 44px);
  gap: clamp(0.2rem, 0.5vw, 0.25rem);

  &:hover {
    background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }

  &:active {
    outline: none;
    border: none;
    box-shadow: none;
  }

  svg {
    font-size: clamp(1.1rem, 2vw, 1.3rem);
    width: clamp(1.1rem, 2vw, 1.3rem);
    height: clamp(1.1rem, 2vw, 1.3rem);
  }

  span {
    font-size: clamp(0.75rem, 1.5vw, 0.9rem);
    font-weight: 500;
  }
  
  /* Enhanced mobile responsiveness - Better touch targets */
  @media (max-width: 1024px) {
    padding: clamp(0.5rem, 1vw, 0.6rem);
    min-width: clamp(38px, 3.5vw, 42px);
    min-height: clamp(38px, 3.5vw, 42px);
    svg { 
      font-size: clamp(1rem, 2vw, 1.2rem);
      width: clamp(1rem, 2vw, 1.2rem);
      height: clamp(1rem, 2vw, 1.2rem);
    }
  }

  @media (max-width: 768px) {
    padding: clamp(0.4rem, 1vw, 0.5rem);
    min-width: clamp(36px, 3vw, 40px);
    min-height: clamp(36px, 3vw, 40px);
    svg { 
      font-size: clamp(0.95rem, 2.5vw, 1.1rem);
      width: clamp(0.95rem, 2.5vw, 1.1rem);
      height: clamp(0.95rem, 2.5vw, 1.1rem);
    }
    span { 
      font-size: clamp(0.7rem, 1.5vw, 0.85rem);
      display: none; /* Hide text on mobile, keep icons only */
    }

    /* Hide text on mobile, keep icons only */
    &.hide-text-mobile span {
      display: none;
    }
  }

  @media (max-width: 480px) {
    padding: clamp(0.35rem, 0.8vw, 0.4rem);
    min-width: clamp(34px, 2.5vw, 38px);
    min-height: clamp(34px, 2.5vw, 38px);
    svg { 
      font-size: clamp(0.9rem, 2.5vw, 1rem);
      width: clamp(0.9rem, 2.5vw, 1rem);
      height: clamp(0.9rem, 2.5vw, 1rem);
    }
    span { display: none; }
  }

  @media (max-width: 360px) {
    padding: clamp(0.3rem, 0.6vw, 0.35rem);
    min-width: clamp(32px, 2vw, 36px);
    min-height: clamp(32px, 2vw, 36px);
    svg { 
      font-size: clamp(0.85rem, 2vw, 0.95rem);
      width: clamp(0.85rem, 2vw, 0.95rem);
      height: clamp(0.85rem, 2vw, 0.95rem);
    }
    span { display: none; }
  }
  
  /* Landscape mode */
  @media (orientation: landscape) and (max-height: 500px) {
    min-width: clamp(32px, 3vh, 36px);
    min-height: clamp(32px, 3vh, 36px);
    padding: clamp(0.3rem, 0.8vh, 0.4rem);
  }

  /* Back button specific styling */
  &.back-button {
    background: transparent;
    border-radius: 0 8px 8px 0; /* Rounded on right side only */
    transition: transform 0.2s ease;
    flex-shrink: 0;
    
    &:hover {
      transform: translateY(-50%) scale(1.05);
    }
    
    .back-text {
      display: inline;
      margin-left: 0.5rem;
      
      /* Show text only on large screens (1440px and above) */
      @media (max-width: 1439px) {
        display: none;
      }
    }
    
    /* Ensure proper spacing for icon-only mode on mobile */
    @media (max-width: 768px) {
      min-width: 36px;
      min-height: 36px;
      padding: 0.5rem;
    }
  }
  
  /* Inline back button styling (replaces settings on smaller screens) */
  &.back-button-inline {
    /* Same styling as other header buttons */
    background: transparent;
    border: none;
    border-radius: 8px;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white; /* Make back icon white */
    font-size: 1.2rem;
    min-width: 36px;
    min-height: 36px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.05);
    }
  }
`;

const ChatHeader = ({
  currentTime,
  batteryLevel,
  isCharging,
  chatbotLogo,
  isMuted,
  toggleMute,
  onSidebarToggle,
  sidebarOpen
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <Header $isDarkMode={isDarkMode}>
      {/* Mobile Layout */}
      {isSmallScreen ? (
        <>
          {/* Left: Hamburger Menu */}
          <HeaderButton
            $isDarkMode={isDarkMode}
            title="Menu"
            onClick={onSidebarToggle}
            className="mobile-menu-btn"
          >
            <FiMenu />
          </HeaderButton>

          {/* Right: Profile Dropdown */}
          <ProfileDropdown />

          {/* Right: Mute Button */}
          {/* <HeaderButton
            $isDarkMode={isDarkMode}
            title={isMuted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="mobile-mute-btn"
          >
            {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
          </HeaderButton> */}
        </>
      ) : (
        /* Desktop Layout */
        <HeaderInner>
          <HeaderLeft>
            <Circle $size={65} $isDarkMode={isDarkMode}>
                <Avatar
                  src="/plastiworldlogo.png"
                  alt="Plasticworld Logo"
                  onError={(e) => {
                    e.target.src = "/plastiworldlogo.png";
                  }}
                />
            </Circle>
            <StatusBlock>
              {/* <BotName $isDarkMode={isDarkMode}>SP University Pune</BotName> */}
              <Status $isDarkMode={isDarkMode}>
                <OnlineIndicator />
                <span>Online</span>
                <StatusDivider $isDarkMode={isDarkMode} className="hide-on-mobile">•</StatusDivider>
                <span className="hide-on-mobile">Avg Response: 2s</span>
              </Status>
            </StatusBlock>
          </HeaderLeft>
          <HeaderRight>
            {/* <HeaderButton
              $isDarkMode={isDarkMode}
              title={isMuted ? "Unmute" : "Mute"}
              onClick={toggleMute}
            >
              {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
            </HeaderButton> */}
            <ProfileDropdown />
          </HeaderRight>
        </HeaderInner>
      )}
    </Header>
  );
};

export default ChatHeader;
