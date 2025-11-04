import React, { useState } from "react";
import styled from "styled-components";
import { FiArrowUp, FiMic, FiSquare, FiVolume2, FiVolumeX, FiSend } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { useTheme } from "../contexts/ThemeContext";
import ServiceSuggestions from "./ServiceSuggestions";
import AutoSuggestions from "./AutoSuggestions";

const InputContainer = styled.div`
  flex-shrink: 0;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: ${props => props.$isWelcomeMode ? 'none' : `1px solid ${props.$isDarkMode ? '#404040' : '#e5e7eb'}`};
  background: ${props => props.$isDarkMode ? '#000000' : '#ffffff'};
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 10;
  margin-top: 0;
  min-height: 100px;
  overflow: visible;
  
  /* Force visibility in production */
  visibility: visible !important;
  opacity: 1 !important;
  display: flex !important;
  
  /* Background styling */
  background: ${props => props.$isWelcomeMode ? 'transparent' : props.$isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
  
  /* Conditional positioning based on welcome mode */
  ${props => props.$isWelcomeMode ? `
    /* Welcome mode: natural flow, not absolute */
    position: relative !important;
    margin-top: 0.5rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  ` : `
    /* Chat mode: sticky at bottom */
    position: sticky !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
  `}

  /* Mobile responsive styling */
  @media (max-width: 768px) {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    background: ${props => props.$isWelcomeMode ? 'transparent' : props.$isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
  }

  @media (max-width: 640px) {
    padding: 1rem 1.25rem 1.5rem 1.25rem;
    background: ${props => props.$isWelcomeMode ? 'transparent' : props.$isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
  }

  @media (max-width: 480px) {
    padding: 1rem 1rem 1.5rem 1rem;
    background: ${props => props.$isWelcomeMode ? 'transparent' : props.$isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
  }

  @media (max-width: 375px) {
    padding: 1rem 0.75rem 1.5rem 0.75rem;
    background: ${props => props.$isWelcomeMode ? 'transparent' : props.$isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
  }
`;

const ChatInput = styled.input`
  padding: 1rem 3rem 1rem 1.25rem;
  border: 2px solid ${props => props.$isDarkMode ? '#3f3f46' : '#e5e7eb'};
  border-radius: 16px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.$isDarkMode ? '#111111' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
  line-height: 1.5;
  font-weight: 400;
  box-shadow: ${props => props.$isDarkMode 
    ? '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)' 
    : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)'};

  /* Force visibility in all modes */
  &::placeholder {
    color: ${props => props.$isDarkMode ? '#a1a1aa' : '#9ca3af'};
    font-weight: 400;
  }

  &:hover {
    border-color: ${props => props.$isDarkMode ? '#52525b' : '#d1d5db'};
    box-shadow: ${props => props.$isDarkMode 
      ? '0 2px 4px rgba(0, 0, 0, 0.4), 0 2px 3px rgba(0, 0, 0, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 3px rgba(0, 0, 0, 0.06)'};
  }

  &:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12), 
                ${props => props.$isDarkMode 
                  ? '0 4px 6px rgba(0, 0, 0, 0.4)' 
                  : '0 4px 6px rgba(0, 0, 0, 0.1)'};
    background: ${props => props.$isDarkMode ? '#111111' : '#ffffff'};
    color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
    transform: translateY(-1px);
  }

  /* Enhanced mobile responsiveness - Better mobile input layout with improved font scaling */
  @media (max-width: 1200px) {
    padding: 1.04rem 161px 1.04rem 1.04rem; /* Increased by 15% from 0.9rem 140px 0.9rem 0.9rem */
    font-size: 1.25rem; /* Increased from 1.13rem for better readability */
    border-radius: 28px; /* Increased by 15% from 24px */
    line-height: 1.38;
  }

  @media (max-width: 1024px) {
    padding: 0.98rem 155px 0.98rem 0.92rem; /* Increased by 15% from 0.85rem 135px 0.85rem 0.8rem */
    font-size: 1.2rem; /* Increased from 1.1rem for improved readability */
    border-radius: 26px; /* Increased by 15% from 23px */
    line-height: 1.36;
  }

  @media (max-width: 900px) {
    padding: 0.92rem 150px 0.92rem 0.86rem; /* Increased by 15% from 0.8rem 130px 0.8rem 0.75rem */
    font-size: 1.15rem; /* Increased from 1.08rem for better mobile readability */
    border-radius: 25px; /* Increased by 15% from 22px */
    line-height: 1.34;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 144px 0.75rem 1rem; /* Reduced vertical padding */
    font-size: 1.1rem; /* Increased from 1.06rem for maintained readability on tablets */
    border-radius: 24px; /* Increased by 15% from 21px */
    line-height: 1.32;
  }

  @media (max-width: 640px) {
    padding: 0.8rem 138px 0.8rem 1.1rem; /* Reduced vertical padding */
    font-size: 1.08rem; /* Increased from 1.04rem for good mobile readability */
    border-radius: 22px; /* Increased by 15% from 19px */
    line-height: 1.3;
  }

  @media (max-width: 600px) {
    padding: 0.9rem 132px 0.9rem 1.2rem; /* Reduced vertical padding */
    font-size: 1.05rem; /* Increased from 1.01rem for optimized small screens */
    border-radius: 21px; /* Increased by 15% from 18px */
    line-height: 1.28;
  }

  @media (max-width: 480px) {
    padding: 1rem 127px 1rem 1.3rem; /* Reduced vertical padding */
    font-size: 1.08rem; /* Increased from 1.06rem for better mobile readability */
    border-radius: 20px; /* Increased by 15% from 17px */
    line-height: 1.26;
  }

  @media (max-width: 414px) {
    padding: 1.1rem 121px 1.1rem 1.4rem; /* Reduced vertical padding */
    font-size: 1.06rem; /* Increased from 1.04rem for iPhone readability */
    border-radius: 18px; /* Increased by 15% from 16px */
    line-height: 1.24;
  }

  @media (max-width: 390px) {
    padding: 1.2rem 115px 1.2rem 1.5rem; /* Reduced vertical padding */
    font-size: 1.03rem; /* Increased from 1.01rem for small phone optimization */
    border-radius: 17px; /* Increased by 15% from 15px */
    line-height: 1.22;
  }

  @media (max-width: 375px) {
    padding: 1.3rem 109px 1.3rem 1.6rem; /* Reduced vertical padding */
    font-size: 1.01rem; /* Increased from 0.99rem for iPhone SE readability */
    border-radius: 16px; /* Increased by 15% from 14px */
    line-height: 1.2;
  }

  @media (max-width: 360px) {
    padding: 1.4rem 104px 1.4rem 1.7rem; /* Reduced vertical padding */
    font-size: 0.99rem; /* Increased from 0.97rem for very small screens */
    border-radius: 15px; /* Increased by 15% from 13px */
    line-height: 1.18;
  }

  @media (max-width: 320px) {
    padding: 1.5rem 98px 1.5rem 1.8rem; /* Reduced vertical padding */
    font-size: 0.96rem; /* Increased from 0.94rem for minimum readable size */
    border-radius: 14px; /* Increased by 15% from 12px */
    line-height: 1.16;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 700px;
  overflow: visible;
`;

const InputButtons = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 6px;

  /* Enhanced mobile responsiveness - Comprehensive breakpoints */
  @media (max-width: 1200px) {
    right: 8px;
    gap: 6px;
  }

  @media (max-width: 1024px) {
    right: 8px;
    gap: 6px;
  }

  @media (max-width: 900px) {
    right: 8px;
    gap: 6px;
  }

  @media (max-width: 768px) {
    right: 8px;
    gap: 5px;
  }

  @media (max-width: 640px) {
    right: 8px;
    gap: 5px;
  }

  @media (max-width: 600px) {
    right: 8px;
    gap: 5px;
  }

  @media (max-width: 480px) {
    right: 8px;
    gap: 4px;
  }

  @media (max-width: 414px) {
    right: 8px;
    gap: 4px;
  }

  @media (max-width: 390px) {
    right: 8px;
    gap: 4px;
  }

  @media (max-width: 375px) {
    right: 8px;
    gap: 4px;
  }

  @media (max-width: 360px) {
    right: 8px;
    gap: 4px;
  }

  @media (max-width: 320px) {
    right: 8px;
    gap: 4px;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$variant === 'primary' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #ec4899 100%)' : 'transparent'};
  border: ${props => props.$variant === 'primary' ? 'none' : 'none'};
  border-radius: 14px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$variant === 'primary' ? 'white' : '#6b7280'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  padding: 0;
  box-shadow: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: none;
    background: ${props => props.$variant === 'primary'
      ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #ec4899 100%)'
      : 'transparent'};
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  svg {
    font-size: 21px; /* Increased by 15% from 18px */
    width: 21px; /* Increased by 15% from 18px */
    height: 21px; /* Increased by 15% from 18px */
  }

  /* Mobile responsive design - matching SendButton */
  @media (max-width: 1200px) {
    width: 42px; /* Increased by 15% from 40px */
    height: 42px; /* Increased by 15% from 40px */
    min-width: 42px; /* Increased by 15% from 40px */
    min-height: 42px; /* Increased by 15% from 40px */
    max-width: 42px; /* Increased by 15% from 40px */
    max-height: 42px; /* Increased by 15% from 40px */

    svg {
      font-size: 22px; /* Increased by 15% from 19px */
      width: 22px; /* Increased by 15% from 19px */
      height: 22px; /* Increased by 15% from 19px */
    }
  }

  @media (max-width: 1024px) {
    width: 41px; /* Increased by 15% from 40px */
    height: 41px; /* Increased by 15% from 40px */
    min-width: 41px; /* Increased by 15% from 40px */
    min-height: 41px; /* Increased by 15% from 40px */
    max-width: 41px; /* Increased by 15% from 40px */
    max-height: 41px; /* Increased by 15% from 40px */

    svg {
      font-size: 21px; /* Increased by 15% from 18px */
      width: 21px; /* Increased by 15% from 18px */
      height: 21px; /* Increased by 15% from 18px */
    }
  }

  @media (max-width: 768px) {
    width: 41px; /* Increased by 15% from 36px */
    height: 41px; /* Increased by 15% from 36px */
    min-width: 41px; /* Increased by 15% from 36px */
    min-height: 41px; /* Increased by 15% from 36px */
    max-width: 41px; /* Increased by 15% from 36px */
    max-height: 41px; /* Increased by 15% from 36px */

    svg {
      font-size: 20px; /* Increased by 15% from 17px */
      width: 20px; /* Increased by 15% from 17px */
      height: 20px; /* Increased by 15% from 17px */
    }
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #ec4899 100%);
  border: none;
  border-radius: 14px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  padding: 0;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35), 0 2px 4px rgba(139, 92, 246, 0.2);

  svg {
    color: inherit;
    flex-shrink: 0;
    font-size: 21px; /* Increased by 15% from 18px */
    width: 21px; /* Increased by 15% from 18px */
    height: 21px; /* Increased by 15% from 18px */
    font-weight: 900;
    stroke-width: 3;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #ec4899 100%);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.45), 0 3px 6px rgba(139, 92, 246, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    box-shadow: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.2);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.2);
  }

  /* Enhanced mobile responsiveness - Better touch targets */
  @media (max-width: 1024px) {
    width: 44px; /* Increased by 15% from 38px */
    height: 44px; /* Increased by 15% from 38px */
    min-width: 44px; /* Increased by 15% from 38px */
    min-height: 44px; /* Increased by 15% from 38px */
    max-width: 44px; /* Increased by 15% from 38px */
    max-height: 44px; /* Increased by 15% from 38px */

    svg {
      font-size: 21px; /* Increased by 15% from 18px */
      width: 21px; /* Increased by 15% from 18px */
      height: 21px; /* Increased by 15% from 18px */
    }
  }

  @media (max-width: 768px) {
    width: 41px; /* Increased by 15% from 36px */
    height: 41px; /* Increased by 15% from 36px */
    min-width: 41px; /* Increased by 15% from 36px */
    min-height: 41px; /* Increased by 15% from 36px */
    max-width: 41px; /* Increased by 15% from 36px */
    max-height: 41px; /* Increased by 15% from 36px */

    svg {
      font-size: 20px; /* Increased by 15% from 17px */
      width: 20px; /* Increased by 15% from 17px */
      height: 20px; /* Increased by 15% from 17px */
    }
  }

  @media (max-width: 640px) {
    width: 39px; /* Increased by 15% from 34px */
    height: 39px; /* Increased by 15% from 34px */
    min-width: 39px; /* Increased by 15% from 34px */
    min-height: 39px; /* Increased by 15% from 34px */
    max-width: 39px; /* Increased by 15% from 34px */
    max-height: 39px; /* Increased by 15% from 34px */

    svg {
      font-size: 18px; /* Increased by 15% from 16px */
      width: 18px; /* Increased by 15% from 16px */
      height: 18px; /* Increased by 15% from 16px */
    }
  }

  @media (max-width: 600px) {
    width: 40px; /* Increased by 15% from 32px */
    height: 40px; /* Increased by 15% from 32px */
    min-width: 40px; /* Increased by 15% from 32px */
    min-height: 40px; /* Increased by 15% from 32px */
    max-width: 40px; /* Increased by 15% from 32px */
    max-height: 40px; /* Increased by 15% from 32px */

    svg {
      font-size: 17px; /* Increased by 15% from 15px */
      width: 17px; /* Increased by 15% from 15px */
      height: 17px; /* Increased by 15% from 15px */
    }
  }

  @media (max-width: 480px) {
    width: 40px; /* Increased by 15% from 30px */
    height: 40px; /* Increased by 15% from 30px */
    min-width: 40px; /* Increased by 15% from 30px */
    min-height: 40px; /* Increased by 15% from 30px */
    max-width: 40px; /* Increased by 15% from 30px */
    max-height: 40px; /* Increased by 15% from 30px */

    svg {
      font-size: 16px; /* Increased by 15% from 14px */
      width: 16px; /* Increased by 15% from 14px */
      height: 16px; /* Increased by 15% from 14px */
    }
  }

  @media (max-width: 414px) {
    width: 40px; /* Increased by 15% from 28px */
    height: 40px; /* Increased by 15% from 28px */
    min-width: 40px; /* Increased by 15% from 28px */
    min-height: 40px; /* Increased by 15% from 28px */
    max-width: 40px; /* Increased by 15% from 28px */
    max-height: 40px; /* Increased by 15% from 28px */

    svg {
      font-size: 15px; /* Increased by 15% from 13px */
      width: 15px; /* Increased by 15% from 13px */
      height: 15px; /* Increased by 15% from 13px */
    }
  }

  @media (max-width: 390px) {
    width: 40px; /* Increased by 15% from 26px */
    height: 40px; /* Increased by 15% from 26px */
    min-width: 40px; /* Increased by 15% from 26px */
    min-height: 40px; /* Increased by 15% from 26px */
    max-width: 40px; /* Increased by 15% from 26px */
    max-height: 40px; /* Increased by 15% from 26px */

    svg {
      font-size: 14px; /* Increased by 15% from 12px */
      width: 14px; /* Increased by 15% from 12px */
      height: 14px; /* Increased by 15% from 12px */
    }
  }

  @media (max-width: 375px) {
    width: 28px; /* Increased by 15% from 24px */
    height: 28px; /* Increased by 15% from 24px */
    min-width: 28px; /* Increased by 15% from 24px */
    min-height: 28px; /* Increased by 15% from 24px */
    max-width: 28px; /* Increased by 15% from 24px */
    max-height: 28px; /* Increased by 15% from 24px */

    svg {
      font-size: 13px; /* Increased by 15% from 11px */
      width: 13px; /* Increased by 15% from 11px */
      height: 13px; /* Increased by 15% from 11px */
    }
  }

  @media (max-width: 360px) {
    width: 40px; /* Increased by 15% from 22px */
    height: 40px; /* Increased by 15% from 22px */
    min-width: 40px; /* Increased by 15% from 22px */
    min-height: 40px; /* Increased by 15% from 22px */
    max-width: 40px; /* Increased by 15% from 22px */
    max-height: 40px; /* Increased by 15% from 22px */

    svg {
      font-size: 12px; /* Increased by 15% from 10px */
      width: 12px; /* Increased by 15% from 10px */
      height: 12px; /* Increased by 15% from 10px */
    }
  }

  @media (max-width: 320px) {
    width: 23px; /* Increased by 15% from 20px */
    height: 23px; /* Increased by 15% from 20px */
    min-width: 23px; /* Increased by 15% from 20px */
    min-height: 23px; /* Increased by 15% from 20px */
    max-width: 23px; /* Increased by 15% from 20px */
    max-height: 23px; /* Increased by 15% from 20px */

    svg {
      font-size: 10px; /* Increased by 15% from 9px */
      width: 10px; /* Increased by 15% from 9px */
      height: 10px; /* Increased by 15% from 9px */
    }
  }
`;

const MuteButton = styled.button`
  background: ${props => props.$isMuted ? 'rgba(255, 107, 157, 0.1)' : 'transparent'};
  border: none;
  border-radius: 50%;
  width: 37px; /* Increased by 15% from 32px */
  height: 37px; /* Increased by 15% from 32px */
  min-width: 37px; /* Increased by 15% from 32px */
  min-height: 37px; /* Increased by 15% from 32px */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$isMuted ? '#ff6b9d' : '#ff6b9d'};
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  z-index: 9999;
  transform: scale(1);

  svg {
    color: inherit;
    flex-shrink: 0;
    font-size: 23px; /* Increased by 15% from 20px */
  }

  &:hover:not(:disabled) {
    transform: scale(1.1);
    color: #8b5cf6;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
    background-color: rgba(255, 107, 157, 0.1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
  }

  /* Enhanced mobile responsiveness - Better touch targets */
  @media (max-width: 1024px) {
    width: 39px; /* Increased by 15% from 34px */
    height: 39px; /* Increased by 15% from 34px */
    min-width: 39px; /* Increased by 15% from 34px */
    min-height: 39px; /* Increased by 15% from 34px */

    svg {
      font-size: 23px; /* Increased by 15% from 20px */
    }
  }

  @media (max-width: 768px) {
    width: 37px; /* Increased by 15% from 32px */
    height: 37px; /* Increased by 15% from 32px */
    min-width: 37px; /* Increased by 15% from 32px */
    min-height: 37px; /* Increased by 15% from 32px */

    svg {
      font-size: 22px; /* Increased by 15% from 19px */
    }
  }

  @media (max-width: 640px) {
    width: 35px; /* Increased by 15% from 30px */
    height: 35px; /* Increased by 15% from 30px */
    min-width: 35px; /* Increased by 15% from 30px */
    min-height: 35px; /* Increased by 15% from 30px */

    svg {
      font-size: 21px; /* Increased by 15% from 18px */
    }
  }

  @media (max-width: 600px) {
    width: 40px; /* Increased by 15% from 28px */
    height: 40px; /* Increased by 15% from 28px */
    min-width: 40px; /* Increased by 15% from 28px */
    min-height: 40px; /* Increased by 15% from 28px */

    svg {
      font-size: 20px; /* Increased by 15% from 17px */
    }
  }

  @media (max-width: 480px) {
    width: 40px; /* Increased by 15% from 26px */
    height: 40px; /* Increased by 15% from 26px */
    min-width: 40px; /* Increased by 15% from 26px */
    min-height: 40px; /* Increased by 15% from 26px */

    svg {
      font-size: 18px; /* Increased by 15% from 16px */
    }
  }

  @media (max-width: 414px) {
    width: 40px; /* Increased by 15% from 24px */
    height: 40px; /* Increased by 15% from 24px */
    min-width: 40px; /* Increased by 15% from 24px */
    min-height: 40px; /* Increased by 15% from 24px */

    svg {
      font-size: 17px; /* Increased by 15% from 15px */
    }
  }

  @media (max-width: 390px) {
    width: 25px; /* Increased by 15% from 22px */
    height: 25px; /* Increased by 15% from 22px */
    min-width: 25px; /* Increased by 15% from 22px */
    min-height: 25px; /* Increased by 15% from 22px */

    svg {
      font-size: 16px; /* Increased by 15% from 14px */
    }
  }

  @media (max-width: 375px) {
    width: 23px; /* Increased by 15% from 20px */
    height: 23px; /* Increased by 15% from 20px */
    min-width: 23px; /* Increased by 15% from 20px */
    min-height: 23px; /* Increased by 15% from 20px */

    svg {
      font-size: 15px; /* Increased by 15% from 13px */
    }
  }

  @media (max-width: 360px) {
    width: 21px; /* Increased by 15% from 18px */
    height: 21px; /* Increased by 15% from 18px */
    min-width: 21px; /* Increased by 15% from 18px */
    min-height: 21px; /* Increased by 15% from 18px */

    svg {
      font-size: 14px; /* Increased by 15% from 12px */
    }
  }

  @media (max-width: 320px) {
    width: 18px; /* Increased by 15% from 16px */
    height: 18px; /* Increased by 15% from 16px */
    min-width: 18px; /* Increased by 15% from 16px */
    min-height: 18px; /* Increased by 15% from 16px */

    svg {
      font-size: 13px; /* Increased by 15% from 11px */
    }
  }
`;

const VoiceButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 37px; /* Increased by 15% from 32px */
  height: 37px; /* Increased by 15% from 32px */
  min-width: 37px; /* Increased by 15% from 32px */
  min-height: 37px; /* Increased by 15% from 32px */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => (props.$isRecording ? "#ef4444" : "#ff6b9d")};
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  z-index: 9999;
  transform: ${(props) => (props.$isRecording ? "scale(1.1)" : "scale(1)")};

  /* Add pulsing animation when recording */
  ${(props) =>
    props.$isRecording &&
    `
      animation: pulse 1s infinite;
    `}

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }

  svg {
    color: inherit;
    flex-shrink: 0;
    font-size: 23px; /* Increased by 15% from 20px */
  }

  &:hover:not(:disabled) {
    transform: ${(props) => (props.$isRecording ? "scale(1.2)" : "scale(1.1)")};
    color: ${(props) => (props.$isRecording ? "#dc2626" : "#8b5cf6")};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
  }

  /* Enhanced mobile responsiveness - Better touch targets */
  @media (max-width: 1024px) {
    width: 39px; /* Increased by 15% from 34px */
    height: 39px; /* Increased by 15% from 34px */
    min-width: 39px; /* Increased by 15% from 34px */
    min-height: 39px; /* Increased by 15% from 34px */

    svg {
      font-size: 23px; /* Increased by 15% from 20px */
    }
  }

  @media (max-width: 768px) {
    width: 37px; /* Increased by 15% from 32px */
    height: 37px; /* Increased by 15% from 32px */
    min-width: 37px; /* Increased by 15% from 32px */
    min-height: 37px; /* Increased by 15% from 32px */

    svg {
      font-size: 22px; /* Increased by 15% from 19px */
    }
  }

  @media (max-width: 640px) {
    width: 35px; /* Increased by 15% from 30px */
    height: 35px; /* Increased by 15% from 30px */
    min-width: 35px; /* Increased by 15% from 30px */
    min-height: 35px; /* Increased by 15% from 30px */

    svg {
      font-size: 21px; /* Increased by 15% from 18px */
    }
  }

  @media (max-width: 600px) {
    width: 32px; /* Increased by 15% from 28px */
    height: 32px; /* Increased by 15% from 28px */
    min-width: 32px; /* Increased by 15% from 28px */
    min-height: 32px; /* Increased by 15% from 28px */

    svg {
      font-size: 20px; /* Increased by 15% from 17px */
    }
  }

  @media (max-width: 480px) {
    width: 30px; /* Increased by 15% from 26px */
    height: 30px; /* Increased by 15% from 26px */
    min-width: 30px; /* Increased by 15% from 26px */
    min-height: 30px; /* Increased by 15% from 26px */

    svg {
      font-size: 18px; /* Increased by 15% from 16px */
    }
  }

  @media (max-width: 414px) {
    width: 28px; /* Increased by 15% from 24px */
    height: 28px; /* Increased by 15% from 24px */
    min-width: 28px; /* Increased by 15% from 24px */
    min-height: 28px; /* Increased by 15% from 24px */

    svg {
      font-size: 17px; /* Increased by 15% from 15px */
    }
  }

  @media (max-width: 390px) {
    width: 25px; /* Increased by 15% from 22px */
    height: 25px; /* Increased by 15% from 22px */
    min-width: 25px; /* Increased by 15% from 22px */
    min-height: 25px; /* Increased by 15% from 22px */

    svg {
      font-size: 16px; /* Increased by 15% from 14px */
    }
  }

  @media (max-width: 375px) {
    width: 23px; /* Increased by 15% from 20px */
    height: 23px; /* Increased by 15% from 20px */
    min-width: 23px; /* Increased by 15% from 20px */
    min-height: 23px; /* Increased by 15% from 20px */

    svg {
      font-size: 15px; /* Increased by 15% from 13px */
    }
  }

  @media (max-width: 360px) {
    width: 21px; /* Increased by 15% from 18px */
    height: 21px; /* Increased by 15% from 18px */
    min-width: 21px; /* Increased by 15% from 18px */
    min-height: 21px; /* Increased by 15% from 18px */

    svg {
      font-size: 14px; /* Increased by 15% from 12px */
    }
  }

  @media (max-width: 320px) {
    width: 18px; /* Increased by 15% from 16px */
    height: 18px; /* Increased by 15% from 16px */
    min-width: 18px; /* Increased by 15% from 16px */
    min-height: 18px; /* Increased by 15% from 16px */

    svg {
      font-size: 13px; /* Increased by 15% from 11px */
    }
  }
`;

const InputArea = ({
  message,
  setMessage,
  handleKeyPress,
  isTyping,
  userMessageCount,
  verified,
  needsAuth,
  isRecording,
  handleMicClick,
  handleMicTouchStart,
  handleMicTouchEnd,
  handleMicMouseDown,
  handleMicMouseUp,
  isMobile,
  handleSendMessage,
  currentlyPlaying,
  isWelcomeMode = false,
  showInlineAuth = false,
  shouldShowAuth = false,
  activePage
}) => {
  const { isDarkMode } = useTheme();
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Disable input when typing OR when authentication is required
  const shouldDisable = isTyping || (showInlineAuth && !verified);

  const handleQuestionClick = (question) => {
    setMessage(question);
  };

  const handleAutoSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  return (
    <InputContainer $isDarkMode={isDarkMode} $isWelcomeMode={isWelcomeMode}>
      <InputWrapper>
        {/* Auto Suggestions - Disabled */}
        {/* {showSuggestions && !isTyping && (
          <AutoSuggestions
            inputValue={message}
            onSuggestionClick={handleAutoSuggestionClick}
            isWelcomeMode={isWelcomeMode}
            showBelow={userMessageCount === 0}
          />
        )} */}

        <ChatInput
          $isDarkMode={isDarkMode}
          value={message}
          onChange={(e) => {
            const newValue = e.target.value;
            setMessage(newValue);
            // Suggestions disabled
            // if (newValue.trim().length > 0) {
            //   setShowSuggestions(true);
            // } else {
            //   setShowSuggestions(false);
            // }
          }}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowSuggestions(false)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={
            isTyping
              ? "Thinking..."
              : (showInlineAuth && !verified)
                ? "Please verify to continue..."
                : "Ask me anything..."
          }
          disabled={shouldDisable}
          style={{
            opacity: shouldDisable ? 0.6 : 1,
            cursor: shouldDisable ? "not-allowed" : "text"
          }}
        />
        <InputButtons>
          <ActionButton
            $variant="secondary"
            $isRecording={isRecording}
            onClick={handleMicClick}
            onTouchStart={handleMicTouchStart}
            onTouchEnd={handleMicTouchEnd}
            onMouseDown={handleMicMouseDown}
            onMouseUp={handleMicMouseUp}
            disabled={shouldDisable}
            title={isRecording ? "Stop recording" : (isMobile ? "Tap or hold to record" : "Click to record")}
            style={{
              background: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              color: isRecording ? '#ef4444' : '#6b7280'
            }}
          >
            {isRecording ? <FiSquare /> : <FiMic />}
          </ActionButton>
          <SendButton
            onClick={() => {
              if (!isTyping) {
                handleSendMessage();
              }
            }}
            disabled={shouldDisable}
          >
            <FiSend />
          </SendButton>
        </InputButtons>
      </InputWrapper>

      {/* Service Suggestions - only visible in welcome mode */}
      <ServiceSuggestions
        isWelcomeMode={isWelcomeMode}
        onQuestionClick={handleQuestionClick}
        activePage={activePage}
      />

      {/* Feature highlights */}
      {/* Powered by branding moved to sidebar */}
    </InputContainer>
  );
};

export default InputArea;
