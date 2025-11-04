import React from "react";

import styled from "styled-components";

import { useTheme } from "../contexts/ThemeContext";

import { FaGlobe, FaBolt, FaRobot } from "react-icons/fa";

import InputArea from "./InputArea";



const WelcomeContainer = styled.div`

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: ${props => props.$isSocialMedia ? 'flex-start' : 'center'};

  padding: ${props => props.$isSocialMedia ? '2rem 1.5rem 2rem 1.5rem' : '1rem 1.5rem 2rem 1.5rem'};
  text-align: center;

  background: ${props => props.$isDarkMode ? '#000000' : 'transparent'};
  flex: 1 1 auto;

  position: relative;

  overflow-y: auto;

  overflow-x: hidden;

  min-height: 0;

  width: 100%;

  max-width: 100%;

  height: 100%;

  

  /* Force visibility in production */

  visibility: visible !important;

  opacity: 1 !important;

  display: flex !important;



  /* Custom scrollbar styling */

  &::-webkit-scrollbar {

    width: 6px;

  }



  &::-webkit-scrollbar-track {

    background: transparent;

  }



  &::-webkit-scrollbar-thumb {

    background: rgba(139, 92, 246, 0.3);

    border-radius: 3px;

  }



  &::-webkit-scrollbar-thumb:hover {

    background: rgba(139, 92, 246, 0.5);

  }



  /* Firefox scrollbar styling */

  scrollbar-width: thin;

  scrollbar-color: rgba(139, 92, 246, 0.3) transparent;





  /* Tablet responsive design */

  @media (max-width: 1024px) {

    padding: ${props => props.$isSocialMedia ? '1.5rem 1.5rem 1.5rem 1.5rem' : '1rem 1.5rem 1.5rem 1.5rem'};
    justify-content: ${props => props.$isSocialMedia ? 'flex-start' : 'center'};

  }



  @media (max-width: 900px) {

    padding: ${props => props.$isSocialMedia ? '1.25rem 1.25rem 1.5rem 1.25rem' : '1rem 1.25rem 1.5rem 1.25rem'};
    justify-content: ${props => props.$isSocialMedia ? 'flex-start' : 'center'};

  }



  @media (max-width: 768px) {

    padding: ${props => props.$isSocialMedia ? '1rem 1rem 1.25rem 1rem' : '0.75rem 1rem 1.25rem 1rem'};
    justify-content: ${props => props.$isSocialMedia ? 'flex-start' : 'center'};

  }



  @media (max-width: 640px) {

    padding: ${props => props.$isSocialMedia ? '0.75rem 0.75rem 1rem 0.75rem' : '0.5rem 0.75rem 1rem 0.75rem'};
    justify-content: ${props => props.$isSocialMedia ? 'flex-start' : 'center'};

  }



  @media (max-width: 600px) {

    padding: ${props => props.$isSocialMedia ? '0.5rem 0.5rem 1rem 0.5rem' : '0.5rem 0.5rem 1rem 0.5rem'};
    justify-content: ${props => props.$isSocialMedia ? 'flex-start' : 'center'};

  }



  @media (max-width: 480px) {

    padding: ${props => props.$isSocialMedia ? '0.5rem 0.4rem 1rem 0.4rem' : '0.5rem 0.4rem 1rem 0.4rem'};
    justify-content: ${props => props.$isSocialMedia ? 'flex-start' : 'center'};

  }



  @media (max-width: 414px) {

    padding: ${props => props.$isSocialMedia ? '0.5rem 0.3rem 1rem 0.3rem' : '0.5rem 0.3rem 1rem 0.3rem'};
    justify-content: ${props => props.$isSocialMedia ? 'flex-start' : 'center'};

  }



  @media (max-width: 390px) {

    padding: 0.5rem 0.25rem 1rem 0.25rem;
    justify-content: center;

  }



  @media (max-width: 375px) {

    padding: 0.5rem 0.2rem 1rem 0.2rem;
    justify-content: center;

  }



  @media (max-width: 360px) {

    padding: 0.5rem 0.15rem 1rem 0.15rem;
    justify-content: center;

  }



  @media (max-width: 320px) {

    padding: 0.5rem 0.05rem 1rem 0.05rem;
    justify-content: center;

  }



  /* Extra small screens */

  @media (max-width: 280px) {

    padding: 0.2rem 0.025rem;

    padding-top: 1.75rem; /* Minimal but safe spacing */

    justify-content: center;

  }

`;



const AvatarContainer = styled.div`

  position: relative;

  z-index: 2;

  margin-bottom: 0.75rem;

  margin-top: 1rem;
  
  display: flex;
  align-items: center;
  justify-content: center;



  /* Tablet responsive design */

  @media (max-width: 1024px) {

    margin-bottom: 0.625rem;

    margin-top: 0.875rem;

  }



  @media (max-width: 900px) {

    margin-bottom: 0.5rem;

    margin-top: 0.75rem;

  }



  @media (max-width: 768px) {

    margin-bottom: 0.5rem;

    margin-top: 0.625rem;

  }



  @media (max-width: 640px) {

    margin-bottom: 0.625rem;

    margin-top: 0.75rem;

  }
  
  
  
  @media (max-width: 480px) {
  
    margin-bottom: 0.5rem;
    
    margin-top: 0.5rem;
  }



  @media (max-width: 600px) {

    margin-bottom: 0.625rem;

    margin-top: 0.4rem;

  }



  @media (max-width: 480px) {

    margin-bottom: 0.5rem;

    margin-top: 0.4rem;

  }



  @media (max-width: 414px) {

    margin-bottom: 0.4rem;

    margin-top: 0.3rem;

  }



  @media (max-width: 390px) {

    margin-bottom: 0.35rem;

    margin-top: 0.3rem;

  }



  @media (max-width: 375px) {

    margin-bottom: 0.3rem;

    margin-top: 0.25rem;

  }



  @media (max-width: 360px) {

    margin-bottom: 0.25rem;

    margin-top: 0.25rem;

  }



  @media (max-width: 320px) {

    margin-bottom: 0.5rem;

    margin-top: 0.2rem;

  }



  /* Extra small screens */

  @media (max-width: 280px) {

    margin-bottom: 0.4rem;

    margin-top: 0.2rem;

  }

`;



const AvatarCircle = styled.div`

  width: 80px;

  height: 80px;

  border-radius: 50%;

//  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);

  position: relative;

  margin-bottom: 1rem;

  animation: float 3s ease-in-out infinite;



  &::before {

    content: '';

    position: absolute;

    top: -4px;

    left: -4px;

    right: -4px;

    bottom: -4px;

    border-radius: 50%;

    // background: linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b);
    z-index: -1;

    animation: rotate 3s linear infinite;

  }



  /* Reduce border thickness on smaller screens */

  @media (max-width: 480px) {

    &::before {

      top: -3px;

      left: -3px;

      right: -3px;

      bottom: -3px;

    }

  }



  @media (max-width: 320px) {

    &::before {

      top: -2px;

      left: -2px;

      right: -2px;

      bottom: -2px;

    }

  }



  @keyframes rotate {

    0% { transform: rotate(0deg); }

    100% { transform: rotate(360deg); }

  }



  @keyframes float {

    0%, 100% { 

      transform: translateY(0px); 

    }

    50% { 

      transform: translateY(-10px); 

    }

  }



  /* Reduce floating animation on smaller screens */

  @media (max-width: 480px) {

    animation: floatMobile 3s ease-in-out infinite;

  }



  @keyframes floatMobile {

    0%, 100% { 

      transform: translateY(0px); 

    }

    50% { 

      transform: translateY(-5px); 

    }

  }



  /* Tablet responsive design */

  @media (max-width: 1024px) {

    width: 75px;

    height: 75px;

    margin-bottom: 0.875rem;

  }



  @media (max-width: 900px) {

    width: 70px;

    height: 70px;

    margin-bottom: 0.75rem;

  }



  @media (max-width: 768px) {

    width: 85px;

    height: 85px;

    margin-bottom: 0.625rem;

  }



  @media (max-width: 640px) {

    width: 80px;

    height: 80px;

    margin-bottom: 0.5rem;

  }



  @media (max-width: 600px) {

    width: 78px;

    height: 78px;

    margin-bottom: 0.4rem;

  }



  @media (max-width: 480px) {

    width: 75px;

    height: 75px;

    margin-bottom: 0.35rem;

  }



  @media (max-width: 414px) {

    width: 72px;

    height: 72px;

    margin-bottom: 0.3rem;

  }



  @media (max-width: 390px) {

    width: 70px;

    height: 70px;

    margin-bottom: 0.25rem;

  }



  @media (max-width: 375px) {

    width: 68px;

    height: 68px;

    margin-bottom: 0.2rem;

  }



  @media (max-width: 360px) {

    width: 65px;

    height: 65px;

    margin-bottom: 0.15rem;

  }



  @media (max-width: 320px) {

    width: 42px;

    height: 42px;

    margin-bottom: 0.1rem;

    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.25);

  }



  /* Extra small screens - maintain minimum usable size */

  @media (max-width: 280px) {

    width: 40px;

    height: 40px;

    margin-bottom: 0.1rem;

    box-shadow: 0 5px 15px rgba(139, 92, 246, 0.2);

  }

`;



const AvatarImage = styled.img`

  width: 55px;

  height: 55px;

  object-fit: cover;

  border-radius: 0%;
  z-index: 1;



  /* Tablet responsive design */

  @media (max-width: 1024px) {

    width: 50px;

    height: 50px;

  }



  @media (max-width: 900px) {

    width: 48px;

    height: 48px;

  }



  @media (max-width: 768px) {

    width: 60px;

    height: 60px;

  }



  @media (max-width: 640px) {

    width: 57px;

    height: 57px;

  }



  @media (max-width: 600px) {

    width: 55px;

    height: 55px;

  }



  @media (max-width: 480px) {

    width: 53px;

    height: 53px;

  }



  @media (max-width: 414px) {

    width: 51px;

    height: 51px;

  }



  @media (max-width: 390px) {

    width: 49px;

    height: 49px;

  }



  @media (max-width: 375px) {

    width: 48px;

    height: 48px;

  }



  @media (max-width: 360px) {

    width: 46px;

    height: 46px;

  }



  @media (max-width: 320px) {

    width: 44px;

    height: 44px;

  }



  /* Extra small screens - maintain minimum usable size */

  @media (max-width: 280px) {

    width: 42px;

    height: 42px;

  }

`;



const OnlineIndicator = styled.div`

  position: absolute;

  top: 8px;

  right: 8px;

  width: 10px;

  height: 10px;

  background: #10b981;

  border-radius: 50%;

  border: 2px solid white;

  box-shadow: 0 0 0 1px #10b981;

  animation: pulse 2s infinite, float-indicator 3s ease-in-out infinite;

  animation-delay: 0.5s;



  @keyframes float-indicator {

    0%, 100% { 

      transform: translateY(0px) scale(1); 

    }

    50% { 

      transform: translateY(-2px) scale(1.05); 

    }

  }



  /* Responsive sizing for smaller screens */

  @media (max-width: 480px) {

    width: 12px;

    height: 12px;

    top: 8px;

    right: 8px;

    border: 2px solid white;

    box-shadow: 0 0 0 1.5px #10b981;

  }



  @media (max-width: 375px) {

    width: 11px;

    height: 11px;

    top: 7px;

    right: 7px;

    border: 2px solid white;

    box-shadow: 0 0 0 1px #10b981;

  }



  @media (max-width: 320px) {

    width: 10px;

    height: 10px;

    top: 6px;

    right: 6px;

    border: 2px solid white;

    box-shadow: 0 0 0 1px #10b981;

  }

`;



const GreetingText = styled.h1`

  font-size: 2.0rem !important;
  font-weight: 500 !important;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};

  margin: 0.5rem 0 1rem 0;

  position: relative;

  z-index: 2;

  transition: color 0.3s ease;

  text-align: center;

  word-wrap: break-word;

  overflow-wrap: break-word;

  line-height: 1.2;


  @media (max-width: 768px) {

    font-size: 1.5rem !important;

    margin: 0.375rem 0 1rem 0;
  }



  @media (max-width: 480px) {

            font-size: 1.5rem !important;
        margin: 1.25rem 0 0.75rem 0;
  }



  @media (max-width: 375px) {

  font-size: 1.5rem !important;
        margin: 1.25rem 0 0.75rem 0;
  }



  @media (max-width: 320px) {

    font-size: 1.8rem !important;
    margin: 0 0 1rem 0;
  }

`;



const SubText = styled.p`

  font-size: 1.1rem;

  color: ${props => props.$isDarkMode ? '#a0a0a0' : '#6b7280'};

  margin: 0 0 2rem 0;

  position: relative;

  z-index: 2;

  transition: color 0.3s ease;

  text-align: center;

  word-wrap: break-word;

  overflow-wrap: break-word;



  @media (max-width: 768px) {

    font-size: 1rem;
    padding: 0 0.75rem;

  }



  @media (max-width: 480px) {

    font-size: 0.9rem;

    margin: 0 0 1rem 0;
    padding: 0 0.5rem;

  }



  @media (max-width: 375px) {

    font-size: 0.85rem;

    margin: 0 0 1rem 0;
    padding: 0 0.4rem;

  }



  @media (max-width: 320px) {

    font-size: 0.8rem;

    margin: 0 0 1rem 0;
    padding: 0 0.3rem;

  }

`;



const SuggestionsContainer = styled.div`

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 0.5rem;
  width: 100%;

  max-width: 500px;
  position: relative;

  z-index: 2;

  margin: 0.5rem auto 0 auto;

  

  /* Force visibility in production */

  visibility: visible !important;

  opacity: 1 !important;

  display: grid !important;



  @media (max-width: 768px) {

    grid-template-columns: repeat(2, 1fr);

    gap: 0.4rem;
    max-width: 100%;

  }



  @media (max-width: 480px) {

    grid-template-columns: repeat(2, 1fr);

    gap: 0.3rem;
    max-width: 100%;

    padding: 0 0.5rem;

  }



  @media (max-width: 375px) {

    gap: 0.3rem;
    padding: 0 0.25rem;

  }



  @media (max-width: 320px) {

    gap: 0.25rem;
    padding: 0 0.1rem;

  }

`;



const SuggestionCard = styled.button`

  background: ${props => props.$isDarkMode ? '#1f2937' : '#ffffff'};
  border: 1px solid ${props => props.$isDarkMode ? '#374151' : '#e5e7eb'};

  border-radius: 10px;
  padding: 0.875rem 1.5rem;
  display: flex;

  align-items: center;

  gap: 1rem;
  cursor: pointer;

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  text-align: left;

  box-shadow: none;
  width: 100%;

  min-height: auto;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.$isDarkMode ? '#374151' : '#ffffff'};
    border-color: #8b5cf6;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
  }

  &:active {
    transform: translateY(0);
    background: ${props => props.$isDarkMode ? '#4b5563' : '#f9fafb'};
    box-shadow: none;
  }



  @media (max-width: 480px) {

    padding: 0.75rem 1.25rem;
    gap: 0.75rem;
    border-radius: 8px;
  }



  @media (max-width: 375px) {
    padding: 0.625rem 1rem;
    gap: 0.625rem;
    border-radius: 8px;

  }


  @media (max-width: 320px) {
    padding: 0.5rem 0.875rem;
    gap: 0.5rem;
    border-radius: 8px;
  }
`;



const SuggestionIcon = styled.div`

  font-size: 1.75rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  
  ${SuggestionCard}:hover & {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }

  @media (max-width: 375px) {
    font-size: 1.375rem;
  }

  @media (max-width: 320px) {
    font-size: 1.25rem;
  }

`;



const SuggestionText = styled.span`

  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.4;
  color: ${props => props.$isDarkMode ? '#f1f5f9' : '#111827'};
  flex: 1;
  transition: all 0.2s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;

  ${SuggestionCard}:hover & {
    color: ${props => props.$isDarkMode ? '#ffffff' : '#7c3aed'};
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }

  @media (max-width: 375px) {
    font-size: 0.875rem;
  }

  @media (max-width: 320px) {
    font-size: 0.8125rem;

  }

`;





const FeatureTags = styled.div`

  display: flex;

  gap: 1.5rem;

  margin-top: 1.5rem;

  margin-bottom: 2rem;

  position: relative;

  z-index: 2;

  flex-wrap: wrap;

  justify-content: center;

  align-items: center;

  

  /* Force visibility in production */

  visibility: visible !important;

  opacity: 1 !important;

  display: flex !important;



  /* Tablet responsive design */

  @media (max-width: 1024px) {

    gap: 0.8rem;

    margin-top: 1.25rem;

  }



  @media (max-width: 900px) {

    gap: 0.75rem;

    margin-top: 1rem;

  }



  @media (max-width: 768px) {

    gap: 0.8rem;

    margin-top: 2.5rem;

    margin-bottom: 2rem;

    flex-direction: row;

    flex-wrap: nowrap;

    align-items: center;

    justify-content: center;

    width: 100%;

    max-width: 100%;

    margin-left: auto;

    margin-right: auto;

  }



  @media (max-width: 480px) {

    gap: 0.6rem;

    margin-top: 2rem;

    margin-bottom: 1.5rem;

    max-width: 100%;

    padding: 0 0.5rem;

    flex-direction: row;

    flex-wrap: nowrap;

    justify-content: center;

  }



  @media (max-width: 375px) {

    gap: 0.5rem;

    margin-top: 1.5rem;

    margin-bottom: 1.25rem;

    padding: 0 0.25rem;

    flex-direction: row;

    flex-wrap: wrap;

    justify-content: center;

  }



  @media (max-width: 320px) {

    gap: 0.4rem;

    margin-top: 1.25rem;

    margin-bottom: 1rem;

    padding: 0 0.1rem;

    flex-direction: row;

    flex-wrap: wrap;

    justify-content: center;

  }



  @media (max-width: 640px) {

    gap: 0.875rem;

    margin-top: 2.25rem;

    margin-bottom: 1.75rem;

    max-width: 280px;

  }



  @media (max-width: 600px) {

    gap: 0.875rem;

    margin-top: 2rem;

    margin-bottom: 1.5rem;

    max-width: 260px;

  }



  @media (max-width: 480px) {

    gap: 0.875rem;

    margin-top: 1.75rem;

    margin-bottom: 1.25rem;

    max-width: 240px;

  }



  @media (max-width: 414px) {

    gap: 0.75rem;

    margin-top: 1.5rem;

    margin-bottom: 1rem;

    max-width: 220px;

  }



  @media (max-width: 390px) {

    gap: 0.75rem;

    margin-top: 1.25rem;

    margin-bottom: 0.875rem;

    max-width: 200px;

  }



  @media (max-width: 375px) {

    gap: 0.75rem;

    margin-top: 1rem;

    margin-bottom: 0.75rem;

    max-width: 180px;

  }



  @media (max-width: 360px) {

    gap: 0.75rem;

    margin-top: 0.875rem;

    margin-bottom: 0.625rem;

    max-width: 160px;

  }



  @media (max-width: 320px) {

    gap: 0.75rem;

    margin-top: 0.75rem;

    margin-bottom: 0.5rem;

    max-width: 140px;

  }

`;



/* ScrollIndicator styled component removed */

// =======================================================

// THIS IS THE CORRECTED PART (REVERTED TO NO WRAPPING)

// =======================================================

const SocialMediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0 0.25rem;
  }
`;

const SocialMediaContainer = styled.div`
  background: ${props => props.$isDarkMode ? '#000000' : '#ffffff'};
  border: 2px solid ${props => props.$borderColor};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.$boxShadow};
  height: 440px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    height: 450px;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    height: 440px;
    margin-bottom: 0.25rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$hoverShadow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const FeatureTag = styled.div`

  background: #ffffff;
  color: #111827;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  border: 1px solid #e5e7eb;
  box-shadow: none;
  width: fit-content;
  max-width: 100%;
  justify-content: center;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: visible;
  position: relative;



  .feature-icon {

    font-size: 1.75rem;

    flex-shrink: 0;

    display: flex;

    align-items: center;

    justify-content: center;

  }



  .feature-text {

    font-weight: 600;

    color: #1f2937;

    flex: 1;

    word-wrap: break-word;

    overflow-wrap: break-word;

    hyphens: auto;

    margin-left: -0.25rem;

    white-space: nowrap;

    overflow: visible;

    text-overflow: unset;

    max-width: none;

  }



  @media (min-width: 1001px) {

    gap: 0.75rem;

    

    .feature-text {

      margin-left: 0;

    }

  }



  /* Tablet responsive design */

  @media (max-width: 1024px) {

    padding: 0.875rem 1rem;

    font-size: 0.85rem;

  }



  @media (max-width: 900px) {

    padding: 0.8rem 0.9rem;

    font-size: 0.8rem;

  }



  @media (max-width: 768px) {

    padding: 1rem 1.25rem;

    font-size: 0.9rem;

    width: fit-content;

    max-width: 100%;

    justify-content: center;

    gap: 0.5rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }

  }



  @media (max-width: 640px) {

    padding: 0.9rem 1rem;

    font-size: 0.85rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.4rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }

  }



  @media (max-width: 600px) {

    padding: 0.85rem 0.9rem;

    font-size: 0.8rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.3rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }

  }



  @media (max-width: 480px) {

    padding: 0.8rem 0.85rem;

    font-size: 0.75rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.3rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }

  }



  @media (max-width: 414px) {

    padding: 0.75rem 0.8rem;

    font-size: 0.75rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.3rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }



    .feature-icon {

      font-size: 1.5rem;

    }

  }



  @media (max-width: 390px) {

    padding: 0.7rem 0.75rem;

    font-size: 0.7rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.2rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }



    .feature-icon {

      font-size: 1.4rem;

    }

  }



  @media (max-width: 375px) {

    padding: 0.65rem 0.7rem;

    font-size: 0.65rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.2rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }



    .feature-icon {

      font-size: 1.35rem;

    }

  }



  @media (max-width: 360px) {

    padding: 0.6rem 0.65rem;

    font-size: 0.6rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.2rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }



    .feature-icon {

      font-size: 1.3rem;

    }

  }



  @media (max-width: 320px) {

    padding: 0.5rem 0.6rem;

    font-size: 0.6rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.4rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }



    .feature-icon {

      font-size: 1.4rem;

    }

  }



  /* Extra small screens */

  @media (max-width: 280px) {

    padding: 0.45rem 0.5rem;

    font-size: 0.55rem;

    width: fit-content;

    max-width: 100%;

    gap: 0.3rem;

    

    .feature-text {

      margin-left: 0;

      max-width: none;

    }



    .feature-icon {

      font-size: 1.3rem;

    }

  }

  

  /* Hide third button and beyond on mobile */

  &.mobile-hidden {

    @media (max-width: 768px) {

      display: none;

    }

  }

`;



const WelcomeSection = ({ 
  onSuggestionClick, 
  activePage = 'home', 
  socialFeedOpen = false, 
  selectedPlatform = null, 
  onSocialFeedClose,
  // InputArea props
  message,
  setMessage,
  handleKeyPress,
  isTyping,
  userMessageCount,
  botMessageCount,
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
  showInlineAuth = false,
  shouldShowAuth = false,
  isAuthenticated = false
}) => {
  const { isDarkMode } = useTheme();

  // Handle direct window open
  const handleFeedClick = (platform) => {
    const urls = {
      instagram: 'https://www.instagram.com/troikatechindia/',
      youtube: 'https://www.youtube.com/@TroikaDombivali',
      facebook: 'https://www.facebook.com/troikatechservices',
      twitter: 'https://x.com/TroikaTechAI'
    };
    
    // Open in new tab
    window.open(urls[platform], '_blank');
  };

  // Handle static responses for suggestion cards
  const handleStaticResponse = (suggestion) => {
    // Handle navigation actions from home page
    if (suggestion.action === 'ai-websites' ||
        suggestion.action === 'ai-calling' ||
        suggestion.action === 'industry-use-cases' ||
        suggestion.action === 'social-media') {
      // Use onSuggestionClick to trigger navigation
      if (onSuggestionClick) {
        onSuggestionClick({
          type: 'navigation',
          action: suggestion.action,
          text: suggestion.text
        });
      }
      return;
    }
    
    // Handle results action - pass to parent component
    if (suggestion.action === 'results') {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion.action);
      }
      return;
    }
    
    // Handle AI Calling static content
    if (suggestion.action === 'inbound-calling' && suggestion.staticContent) {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion.staticContent);
      }
      return;
    }
    if (suggestion.action === 'outbound-calling' && suggestion.staticContent) {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion.staticContent);
      }
      return;
    }
    if (suggestion.action === 'calling-pricing' && suggestion.staticContent) {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion.staticContent);
      }
      return;
    }
    
    // Handle conversational flows for all services
    if (suggestion.isConversational) {
      let flowData = null;
      
      // Check which conversational flow to use
      if (callingConversationalFlow[suggestion.action]) {
        flowData = callingConversationalFlow[suggestion.action];
      } else if (websitesConversationalFlow[suggestion.action]) {
        flowData = websitesConversationalFlow[suggestion.action];
      }
      
      if (flowData) {
        const message = flowData.initialMessage || flowData.message;
        const suggestions = flowData.suggestions || [];
        
        if (onSuggestionClick) {
          onSuggestionClick({
            type: 'conversational',
            message: message,
            suggestions: suggestions,
            action: suggestion.action
          });
        }
        return;
      }
    }
    
    // Handle Calling conversational flow
    if (callingConversationalFlow[suggestion.action]) {
      const flowData = callingConversationalFlow[suggestion.action];
      const message = flowData.initialMessage || flowData.message;
      const suggestions = flowData.suggestions || [];
      
      if (onSuggestionClick) {
        onSuggestionClick({
          type: 'conversational',
          message: message,
          suggestions: suggestions,
          action: suggestion.action
        });
      }
      return;
    }
    
    // Handle Websites conversational flow
    if (websitesConversationalFlow[suggestion.action]) {
      const flowData = websitesConversationalFlow[suggestion.action];
      const message = flowData.initialMessage || flowData.message;
      const suggestions = flowData.suggestions || [];
      
      if (onSuggestionClick) {
        onSuggestionClick({
          type: 'conversational',
          message: message,
          suggestions: suggestions,
          action: suggestion.action
        });
      }
      return;
    }
    
    // Handle Industry Use Cases static content
    if (suggestion.action === 'industry-overall' && suggestion.staticContent) {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion.staticContent);
      }
      return;
    }
    
    if (suggestion.action === 'industry-b2b' && suggestion.staticContent) {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion.staticContent);
      }
      return;
    }
    
    if (suggestion.action === 'industry-b2c' && suggestion.staticContent) {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion.staticContent);
      }
      return;
    }
    
    if (suggestion.action === 'industry-final' && suggestion.staticContent) {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion.staticContent);
      }
      return;
    }
    // Handle social media feed clicks
    if (suggestion.action === 'instagram-feed') {
      // Trigger Instagram feed
      window.dispatchEvent(new CustomEvent('socialMediaClick', { detail: 'instagram' }));
      return;
    }
    if (suggestion.action === 'youtube-channel') {
      // Trigger YouTube feed
      window.dispatchEvent(new CustomEvent('socialMediaClick', { detail: 'youtube' }));
      return;
    }
    if (suggestion.action === 'facebook-page') {
      // Trigger Facebook feed
      window.dispatchEvent(new CustomEvent('socialMediaClick', { detail: 'facebook' }));
      return;
    }
    if (suggestion.action === 'twitter-feed') {
      // Trigger Twitter feed
      window.dispatchEvent(new CustomEvent('socialMediaClick', { detail: 'twitter' }));
      return;
    }


    if (onSuggestionClick) {
      // Pass the question text as action - parent component will handle the static response
      onSuggestionClick(suggestion.text);
    }
  };

  // SVG Icon Component
  const IconSVG = ({ type, isDarkMode }) => {
    const iconColor = isDarkMode ? '#a78bfa' : '#8b5cf6';
    const secondaryColor = isDarkMode ? '#c4b5fd' : '#a78bfa';
    
    const icons = {
      'website': (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill={iconColor}/>
        </svg>
      ),
      'phone': (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill={iconColor}/>
        </svg>
      )
    };
    
    return icons[type] || icons.website;
  };

  // Home suggestions
  const homeSuggestions = [
    {
      icon: "🤖",
      text: "What you guys do?",
      action: "What you guys do?"
    },
    {
      icon: "💬",
      text: "What is an AI agent?",
      action: "What is an AI agent?"
    },
    {
      icon: "⚡",
      text: "How will it help my business?",
      action: "How will it help my business?"
    },
    {
      icon: "💰",
      text: "What are the charges?",
      action: "What are the charges?"
    }
  ];

  // AI Websites suggestions - Now with conversational flow
  const aiWebsitesSuggestions = [
    {
      icon: "🌐",
      text: "Overview",
      action: "websites-overview",
      isConversational: true
    },
    {
      icon: "💰",
      text: "Pricing",
      action: "websites-pricing",
      isConversational: true
    }
  ];

  // AI Calling suggestions - Now with conversational flow
  const aiCallingSuggestions = [
    {
      icon: "📞",
      text: "Inbound calling agent",
      action: "calling-inbound",
      isConversational: true
    },
    {
      icon: "📱",
      text: "Outbound calling agent",
      action: "calling-outbound",
      isConversational: true
    }
  ];


  // Conversational flow data for AI Calling Agent
  const callingConversationalFlow = {
    "calling-inbound": {
      initialMessage: "📞 **INBOUND CALLING AGENT**\n\nTo attend incoming calls - answering customer queries, booking appointments, providing information, and capturing leads automatically.\n\n**Ideal For:**\n\n• Real estate project inquiries\n• Coaching or education institutes\n• Service bookings (salon, clinic, gym, etc.)\n• Product support lines\n• Customer service hotlines",
      suggestions: [
        { text: "How does it work?", action: "calling-inbound-how" },
        { text: "What are the benefits?", action: "calling-inbound-benefits" },
        { text: "What's the pricing?", action: "calling-inbound-pricing" },
        { text: "Back to main menu", action: "back-to-calling-main" }
      ]
    },
    "calling-inbound-how": {
      message: "⚙️ **How Inbound Calling Works:**\n\n**Step 1:** Customer calls your virtual number\n\n**Step 2:** AI agent greets in natural tone and selected language\n\n**Step 3:** It answers FAQs, explains offerings, captures details (name, phone, requirement)\n\n**Step 4:** Data is auto-saved to CRM or sent to WhatsApp/email",
      suggestions: [
        { text: "What are the benefits?", action: "calling-inbound-benefits" },
        { text: "What's the pricing?", action: "calling-inbound-pricing" },
        { text: "Back to inbound overview", action: "calling-inbound" }
      ]
    },
    "calling-inbound-benefits": {
      message: "✨ **Key Benefits of Inbound Calling:**\n\n**24×7 professional response**\nNever miss a call\n\n**Zero human errors or missed calls**\nConsistent performance\n\n**Supports Hindi, English, Marathi, Gujarati & more**\nMultilingual support\n\n**Captures 100% of calls as qualified leads**\nNo lost opportunities\n\n**Can handle multiple calls at once**\nUnlimited capacity",
      suggestions: [
        { text: "What's the pricing?", action: "calling-inbound-pricing" },
        { text: "How does it work?", action: "calling-inbound-how" },
        { text: "Back to inbound overview", action: "calling-inbound" }
      ]
    },
    "calling-inbound-pricing": {
      message: "💰 **Inbound Calling Agent Pricing:**\n\n**One-time Setup: ₹1,00,000**\nDesign & Deployment Fees\n\n**Per Minute Usage: ₹25 per minute**\nBilled on actual talk time\n\n**Monthly Maintenance: ₹10,000 per virtual number**\nMaintenance, server, AI hosting & updates",
      suggestions: [
        { text: "How does it work?", action: "calling-inbound-how" },
        { text: "What are the benefits?", action: "calling-inbound-benefits" },
        { text: "Back to inbound overview", action: "calling-inbound" }
      ]
    },
    "calling-outbound": {
      initialMessage: "📱 **OUTBOUND CALLING AGENT**\n\nTo initiate calls to leads or customers for promotions, follow-ups, reminders, or surveys - without manual effort.\n\n**Ideal For:**\n\n• Promotional campaigns (offers, event invites)\n• Lead follow-ups or re-engagement\n• Payment, delivery, or appointment reminders\n• Customer feedback or survey collection",
      suggestions: [
        { text: "How does it work?", action: "calling-outbound-how" },
        { text: "What are the benefits?", action: "calling-outbound-benefits" },
        { text: "What's the pricing?", action: "calling-outbound-pricing" },
        { text: "Back to main menu", action: "back-to-calling-main" }
      ]
    },
    "calling-outbound-how": {
      message: "⚙️ **How Outbound Calling Works:**\n\n**Step 1:** Upload your contact list (CSV or CRM)\n\n**Step 2:** AI agent automatically starts calling one by one\n\n**Step 3:** Delivers personalized pitch, collects responses, books appointments\n\n**Step 4:** Generates reports: answered, not answered, interested, follow-up needed",
      suggestions: [
        { text: "What are the benefits?", action: "calling-outbound-benefits" },
        { text: "What's the pricing?", action: "calling-outbound-pricing" },
        { text: "Back to outbound overview", action: "calling-outbound" }
      ]
    },
    "calling-outbound-benefits": {
      message: "✨ **Key Benefits of Outbound Calling:**\n\n**100s of calls per hour – zero manual dialing**\nMassive efficiency\n\n**Consistent pitch, tone & data capture**\nUniform quality\n\n**Multilingual and customizable voice scripts**\nFlexible communication\n\n**Fully automated reporting**\nComplete analytics\n\n**Saves manpower cost & training time**\nCost effective",
      suggestions: [
        { text: "What's the pricing?", action: "calling-outbound-pricing" },
        { text: "How does it work?", action: "calling-outbound-how" },
        { text: "Back to outbound overview", action: "calling-outbound" }
      ]
    },
    "calling-outbound-pricing": {
      message: "💰 **Outbound Calling Agent Pricing:**\n\n**One-time Setup: ₹1,00,000**\nDesign & Deployment Fees\n\n**Per Minute Usage: ₹25 per minute**\nBilled per live call\n\n**Monthly Maintenance: ₹10,000 per virtual number**\nMaintenance, CRM integration, analytics",
      suggestions: [
        { text: "How does it work?", action: "calling-outbound-how" },
        { text: "What are the benefits?", action: "calling-outbound-benefits" },
        { text: "Back to outbound overview", action: "calling-outbound" }
      ]
    },
    "back-to-calling-main": {
      message: "📞 **AI Calling Agent**\n\nChoose what you'd like to know more about:",
      suggestions: [
        { text: "Inbound Calling Agent", action: "calling-inbound" },
        { text: "Outbound Calling Agent", action: "calling-outbound" },
        { text: "Pricing", action: "calling-pricing" }
      ]
    }
  };

  // Conversational flow data for AI Websites
  const websitesConversationalFlow = {
    "websites-overview": {
      initialMessage: "🌐 **AI Websites - Overview**\n\nAI Created. Human Perfected.\n\nWhether it's a factory owner, lawyer, CA, doctor, institute, or politician - a Troika AI Website gives each, a voice, system, and intelligence that grows their business, brand, or public trust automatically.\n\n'AI Websites don't just inform - they influence, interact, and inspire.'",
      suggestions: [
        { text: "What problems does it solve?", action: "websites-problems" },
        { text: "What are the key features?", action: "websites-features" },
        { text: "How does it work?", action: "websites-how-it-works" },
        { text: "Back to main menu", action: "back-to-websites-main" }
      ]
    },
    "websites-problems": {
      message: "🔹 **Common Business Problems**\n\n**Static Websites**\nYour website just sits there, not engaging visitors\n\n**No Lead Capture**\nVisitors leave without any interaction or data\n\n**Poor User Experience**\nConfusing navigation and outdated information\n\n**No Personalization**\nSame experience for everyone\n\n**Limited Reach**\nOnly works in one language\n\n**No Analytics**\nNo insights into visitor behavior",
      suggestions: [
        { text: "What are the solutions?", action: "websites-solutions" },
        { text: "Show key features", action: "websites-features" },
        { text: "Back to overview", action: "websites-overview" }
      ]
    },
    "websites-solutions": {
      message: "✅ **Solutions with AI Websites**\n\n**Smart Engagement**\nAI greets visitors and guides them through your offerings\n\n**Automatic Lead Capture**\nAI collects visitor information and interests\n\n**Personalized Experience**\nAI adapts content based on visitor behavior\n\n**Multilingual Support**\nSpeaks to visitors in their preferred language\n\n**Real-time Analytics**\nTrack visitor behavior and conversion rates\n\n**24×7 Availability**\nWorks around the clock to engage visitors",
      suggestions: [
        { text: "Show key features", action: "websites-features" },
        { text: "How does it work?", action: "websites-how-it-works" },
        { text: "Back to overview", action: "websites-overview" }
      ]
    },
    "websites-features": {
      message: "✨ **Key Features**\n\n**Smart Websites**\nAI-powered websites that engage visitors\n\n**Auto Engagement**\nAutomatically interacts with visitors\n\n**AI Conversion**\nConverts visitors into leads and customers\n\n**Multilingual Support**\nSpeaks 20+ languages\n\n**Real-time Analytics**\nTrack visitor behavior and conversions\n\n**Mobile Responsive**\nWorks perfectly on all devices\n\n**SEO Optimized**\nRanks higher in search results",
      suggestions: [
        { text: "How does it work?", action: "websites-how-it-works" },
        { text: "What's the pricing?", action: "websites-pricing" },
        { text: "Back to overview", action: "websites-overview" }
      ]
    },
    "websites-how-it-works": {
      message: "⚙️ **How AI Websites Work**\n\n**Step 1: Design**\nWe create a beautiful, responsive website for your business\n\n**Step 2: AI Integration**\nWe integrate AI chatbot and engagement features\n\n**Step 3: Training**\nAI is trained on your business data and offerings\n\n**Step 4: Launch**\nYour AI website goes live and starts engaging visitors\n\n**Step 5: Analytics**\nTrack performance and optimize for better results\n\n**Ready to transform your online presence?**\nGet your AI Website up and running in just 48 hours.",
      suggestions: [
        { text: "What's the pricing?", action: "websites-pricing" },
        { text: "Back to overview", action: "websites-overview" }
      ]
    },
    "websites-pricing": {
      initialMessage: "💰 **AI Websites - Pricing Structure**\n\nOur AI Websites pricing is designed to be transparent and cost-effective. We offer a one-time setup fee plus optional maintenance packages.\n\n**Key Benefits of Our Pricing:**\n\n**No Hidden Costs**\nEverything is clearly outlined\n\n**One-Time Investment**\nNo recurring monthly fees\n\n**Scalable**\nGrows with your business\n\n**ROI-Focused**\nSave more than you spend\n\n**Pricing Overview:**\n\n**One-Time Setup: ₹50,000**\nComplete website creation, AI integration, and deployment\n\n**Optional Maintenance: ₹5,000/month**\nUpdates, hosting, and technical support\n\n**Ready to see the detailed pricing?**",
      suggestions: [
        { text: "Show detailed pricing", action: "websites-pricing-details" },
        { text: "What's included in setup?", action: "websites-setup-details" },
        { text: "Compare with traditional websites", action: "websites-comparison" },
        { text: "Back to main menu", action: "back-to-websites-main" }
      ]
    },
    "websites-pricing-details": {
      message: "💰 **AI Websites - Complete Pricing**\n\n**One-Time Setup: ₹50,000**\n• Custom website design\n• AI chatbot integration\n• Mobile responsive design\n• SEO optimization\n• Content management system\n• Basic training\n\n**Optional Monthly Maintenance: ₹5,000**\n• Regular updates\n• Hosting and domain\n• Technical support\n• Performance monitoring\n• Content updates\n\n**Additional Features:**\n• E-commerce integration: ₹25,000\n• Advanced analytics: ₹10,000\n• Custom integrations: ₹15,000",
      suggestions: [
        { text: "What's included in setup?", action: "websites-setup-details" },
        { text: "Compare with traditional websites", action: "websites-comparison" },
        { text: "Show ROI benefits", action: "websites-roi" },
        { text: "Back to pricing overview", action: "websites-pricing" }
      ]
    },
    "websites-setup-details": {
      message: "🔧 **What's Included in Setup?**\n\n**Custom Website Design**\nBeautiful, professional design tailored to your business\n\n**AI Chatbot Integration**\nSmart chatbot that engages visitors\n\n**Mobile Responsive Design**\nWorks perfectly on all devices\n\n**SEO Optimization**\nOptimized for search engines\n\n**Content Management System**\nEasy to update and manage\n\n**Basic Training**\nTraining on how to use your new website\n\n**Result:**\nA complete AI-powered website that works 24×7",
      suggestions: [
        { text: "Compare with traditional websites", action: "websites-comparison" },
        { text: "Show ROI benefits", action: "websites-roi" },
        { text: "Back to pricing overview", action: "websites-pricing" }
      ]
    },
    "websites-comparison": {
      message: "⚖️ **AI Websites vs Traditional Websites**\n\n**Engagement:**\nTraditional: Static, no interaction\nAI Websites: Dynamic, interactive\n\n**Lead Capture:**\nTraditional: Manual forms\nAI Websites: Automatic capture\n\n**Personalization:**\nTraditional: Same for everyone\nAI Websites: Personalized experience\n\n**Availability:**\nTraditional: 24×7 but static\nAI Websites: 24×7 and interactive\n\n**Cost:**\nTraditional: ₹20,000-50,000\nAI Websites: ₹50,000 (one-time)\n\n**ROI:**\nTraditional: Low engagement\nAI Websites: High conversion rates",
      suggestions: [
        { text: "Show ROI benefits", action: "websites-roi" },
        { text: "What are the key features?", action: "websites-features" },
        { text: "Back to pricing overview", action: "websites-pricing" }
      ]
    },
    "websites-roi": {
      message: "📈 **ROI: AI Websites vs Traditional Websites**\n\n**Higher Conversion Rates**\nAI Websites convert 3-5x more visitors into leads\n\n**Better User Experience**\nVisitors stay longer and engage more\n\n**Automatic Lead Capture**\nNo missed opportunities\n\n**24×7 Engagement**\nWorks around the clock\n\n**Multilingual Reach**\nReach more customers\n\n**Real-time Analytics**\nTrack and optimize performance\n\n**Cost Effective**\nOne-time investment, long-term benefits",
      suggestions: [
        { text: "How does it work?", action: "websites-how-it-works" },
        { text: "What's the pricing?", action: "websites-pricing" },
        { text: "Back to overview", action: "websites-overview" }
      ]
    },
    "websites-faqs": {
      message: "❓ **Frequently Asked Questions**\n\n**What is an AI Website?**\nA website with integrated AI chatbot that engages visitors automatically.\n\n**Do I need coding knowledge?**\nNo. We handle everything from design to deployment.\n\n**How long does it take to build?**\nTypically 48 hours from start to finish.\n\n**Can I update content myself?**\nYes, we provide a user-friendly content management system.\n\n**Is it mobile responsive?**\nYes, works perfectly on all devices.\n\n**Do you provide hosting?**\nYes, hosting and domain are included in maintenance package.",
      suggestions: [
        { text: "How does it work?", action: "websites-how-it-works" },
        { text: "What's the pricing?", action: "websites-pricing" },
        { text: "Back to overview", action: "websites-overview" }
      ]
    },
    "back-to-websites-main": {
      message: "🌐 **AI Websites**\n\nChoose what you'd like to know more about:",
      suggestions: [
        { text: "Overview", action: "websites-overview" },
        { text: "Pricing", action: "websites-pricing" },
        { text: "Results", action: "websites-results" }
      ]
    }
  };

  // Industry Use Cases suggestions
  const industryUseCasesSuggestions = [
    {
      icon: "🏆",
      text: "Overall advantages",
      action: "industry-overall",
      staticContent: "<div style='text-align: left; line-height: 1.6; color: #374151; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;'><div style='font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; text-align: center; background: linear-gradient(135deg, #3b82f6, #1d4ed8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'>💎 OVERALL ADVANTAGES FOR ALL BUSINESSES</div><div style='background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 5px solid #3b82f6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='display: grid; gap: 1.5rem;'><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🚀</span>1. 24×7 Digital Salesperson</div><div style='color: #4b5563; font-size: 1rem; line-height: 1.6;'>Your AI Website works non-stop  greeting visitors, answering FAQs, sharing information, and capturing leads even while you sleep.</div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>💬</span>2. Instant Communication</div><div style='color: #4b5563; font-size: 1rem; line-height: 1.6;'>Integrated Supa Agent Chat replies instantly on WhatsApp, Telegram, and your website  no missed inquiries.</div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #8b5cf6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>📊</span>3. Data-Driven Growth</div><div style='color: #4b5563; font-size: 1rem; line-height: 1.6;'>Every visitor, chat, and click is tracked  giving insights into who's visiting, what they want, and how to convert them.</div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #f59e0b; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🌐</span>4. Multilingual Reach</div><div style='color: #4b5563; font-size: 1rem; line-height: 1.6;'>Talk to your customers in their own language  Hindi, English, Marathi, Gujarati, Tamil, or even Arabic.</div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ef4444; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>💰</span>5. High ROI & Low Maintenance</div><div style='color: #4b5563; font-size: 1rem; line-height: 1.6;'>No recurring ad spend  your AI Website becomes a long-term marketing asset that grows with your business.</div></div></div></div></div>"
    },
    {
      icon: "🏢",
      text: "B2B industry advantages",
      action: "industry-b2b",
      staticContent: "<div style='text-align: left; line-height: 1.6; color: #374151; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;'><div style='font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; text-align: center; background: linear-gradient(135deg, #059669, #047857); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'>🏢 B2B INDUSTRY ADVANTAGES & USE CASES</div><div style='background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 5px solid #059669; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='display: grid; gap: 2rem;'><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🧱</span>1. Manufacturing & Industrial Companies</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Clients request catalogs, pricing, or quotations over and over again.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Displays interactive product catalogs</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Shares technical specs via chat instantly</div><div style='color: #065f46; font-size: 0.95rem;'>• Captures distributor/dealer inquiries automatically</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Faster conversions, fewer manual follow-ups, and global reach.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #8b5cf6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>💊</span>2. Pharmaceutical & Healthcare Equipment</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Dealers and hospitals need quick information about formulations, licenses, and delivery times.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• AI chat assists with product information and compliance queries</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Collects dealer requests and forwards to sales instantly</div><div style='color: #065f46; font-size: 0.95rem;'>• Integrates with CRM and WhatsApp</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>24×7 professional response system that never misses a lead.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #f59e0b; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🏗️</span>3. Construction, Architecture & Civil Engineering</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Projects and portfolios are hard to present in an interactive way.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Showcases galleries, 3D renders, and project walkthroughs</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Chatbot schedules site visits or consultation calls</div><div style='color: #065f46; font-size: 0.95rem;'>• Generates quote requests instantly</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Stronger first impression and faster decision cycles.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>📈</span>4. IT, SaaS & Consultancy</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Complex services are difficult to explain to new clients.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• AI chatbot explains services in simple terms</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Collects project briefs and automates appointment booking</div><div style='color: #065f46; font-size: 0.95rem;'>• Provides demo scheduling and proposal generation</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Higher engagement and reduced dependency on sales staff.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ef4444; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🏭</span>5. Traders, Distributors & Wholesalers</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Inquiries come from multiple channels  WhatsApp, email, phone  and get lost.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Centralizes all leads through website chat</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Sends automated price lists, catalogs, or PDFs</div><div style='color: #065f46; font-size: 0.95rem;'>• Tracks inquiry sources for reporting</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Organized, measurable sales pipeline with zero leakage.</div></div></div></div></div></div>"
    },
    {
      icon: "🛍️",
      text: "B2C industry advantages",
      action: "industry-b2c",
      staticContent: "<div style='text-align: left; line-height: 1.6; color: #374151; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;'><div style='font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; text-align: center; background: linear-gradient(135deg, #dc2626, #b91c1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'>🏪 B2C INDUSTRY ADVANTAGES & USE CASES</div><div style='background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 5px solid #dc2626; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='display: grid; gap: 2rem;'><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🩺</span>1. Doctors, Clinics & Hospitals</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Missed appointment calls, repetitive FAQs, and poor patient follow-up.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Patients can book appointments via chat or calendar</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Shares treatment details, timings, and directions automatically</div><div style='color: #065f46; font-size: 0.95rem;'>• AI sends follow-up reminders and feedback forms</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>More appointments, smoother patient experience, zero missed calls.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #8b5cf6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>⚖️</span>2. Lawyers & Legal Consultants</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Clients hesitate to call or ask initial questions.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Confidential AI chat to pre-qualify clients</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Shares services, case types, consultation fees, and slots</div><div style='color: #065f46; font-size: 0.95rem;'>• Collects client details securely</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Builds trust, captures quality leads, saves time on unqualified inquiries.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #f59e0b; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>📊</span>3. Chartered Accountants & Financial Advisors</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Constant queries on tax, GST, or filing timelines.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• AI chatbot answers basic financial questions</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Books consultation calls</div><div style='color: #065f46; font-size: 0.95rem;'>• Sends reminders for due dates and new compliance updates</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Reduces repetitive work, improves client engagement, positions firm as tech-savvy.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🏫</span>4. Education & Coaching Institutes</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Admission queries and course info overwhelm staff.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• AI explains courses, fees, and admission process</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Collects student data and sends it to CRM</div><div style='color: #065f46; font-size: 0.95rem;'>• Handles multilingual parent queries</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Increased enrollments and professional digital impression.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #ef4444; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🛍️</span>5. Retail, Fashion & E-Commerce</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Shoppers ask about products, stock, and delivery.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Displays catalog, takes orders, and processes payments</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• AI chat gives instant shipping updates</div><div style='color: #065f46; font-size: 0.95rem;'>• Suggests related products for upselling</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Faster checkouts and repeat purchases.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #8b5cf6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🧘</span>6. Salons, Gyms & Fitness Centers</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Missed inquiries for memberships or bookings.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• 24×7 booking assistant</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Shares offers, schedules, and trainer info</div><div style='color: #065f46; font-size: 0.95rem;'>• Sends reminders or re-engagement messages</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Higher bookings and retention.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🏡</span>7. Real Estate Developers & Agents</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>High competition and slow manual response to leads.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Chatbot shares floor plans, pricing, and videos</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Schedules site visits automatically</div><div style='color: #065f46; font-size: 0.95rem;'>• Tracks lead status and interest levels</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>Faster lead conversion and stronger customer trust.</div></div></div><div style='background: white; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #f59e0b; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-weight: 700; color: #1f2937; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.1rem;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>✈️</span>8. Travel & Hospitality</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Visitors ask for quotes, packages, and availability.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• AI shares destination info, itineraries, and pricing</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Books inquiries instantly</div><div style='color: #065f46; font-size: 0.95rem;'>• Integrates with WhatsApp and Google Calendar</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem;'>More bookings, fewer calls, smoother workflow.</div></div></div><div style='background: linear-gradient(135deg, #1f2937, #374151); padding: 2rem; border-radius: 12px; margin-top: 2rem; color: white; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);'><div style='font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; color: #fbbf24; display: flex; align-items: center;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>🗳️</span>9. Politicians, Election Campaigns & Political Consultants</div><div style='background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #f59e0b;'><div style='font-weight: 600; color: #92400e; margin-bottom: 0.5rem;'>Problem:</div><div style='color: #92400e; font-size: 0.95rem;'>Hard to manage large-scale voter communication, feedback, and volunteer coordination.</div></div><div style='background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #10b981;'><div style='font-weight: 600; color: #065f46; margin-bottom: 0.5rem;'>AI Website Solution:</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• AI-powered website engages citizens 24×7 in multiple languages</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Collects voter data, feedback, and opinions through chat</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Shares candidate manifesto, achievements, and event schedules</div><div style='color: #065f46; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Integrated WhatsApp & Telegram chatbots for regional voter engagement</div><div style='color: #065f46; font-size: 0.95rem;'>• Analytics dashboard tracks public sentiment and reach</div></div><div style='background: #dbeafe; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 3px solid #3b82f6;'><div style='font-weight: 600; color: #1e40af; margin-bottom: 0.5rem;'>Result:</div><div style='color: #1e40af; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Real-time voter engagement</div><div style='color: #1e40af; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Stronger public image</div><div style='color: #1e40af; font-size: 0.95rem; margin-bottom: 0.5rem;'>• Automated data collection for campaign planning</div><div style='color: #1e40af; font-size: 0.95rem;'>• Direct, personalized communication with supporters</div></div><div style='background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;'><div style='font-weight: 600; color: #fbbf24; margin-bottom: 0.5rem;'>Perfect For:</div><div style='color: #d1d5db; font-size: 0.95rem; margin-bottom: 0.5rem;'>✅ Political parties</div><div style='color: #d1d5db; font-size: 0.95rem; margin-bottom: 0.5rem;'>✅ Independent candidates</div><div style='color: #d1d5db; font-size: 0.95rem; margin-bottom: 0.5rem;'>✅ Campaign managers</div><div style='color: #d1d5db; font-size: 0.95rem;'>✅ PR and communication agencies</div></div><div style='background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; text-align: center; border-left: 4px solid #fbbf24;'><div style='font-style: italic; color: #fbbf24; font-size: 1rem;'>\"AI Websites turn election campaigns into data-driven movements  building trust, connection, and recall.\"</div></div></div></div></div></div>"
    },
    {
      icon: "🎯",
      text: "Final result",
      action: "industry-final",
      staticContent: "<div style='text-align: left; line-height: 1.6; color: #374151; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;'><div style='font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; text-align: center; background: linear-gradient(135deg, #7c3aed, #5b21b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'>🎯 FINAL RESULT</div><div style='background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 5px solid #7c3aed; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);'><div style='font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; text-align: center; display: flex; align-items: center; justify-content: center;'><span style='margin-right: 0.75rem; font-size: 1.4rem;'>💡</span>WHY THIS WORKS FOR ALL INDUSTRIES</div><div style='overflow-x: auto;'><table style='width: 100%; border-collapse: collapse; font-size: 0.9rem; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);'><thead><tr style='background: linear-gradient(135deg, #7c3aed, #5b21b6); color: white;'><th style='padding: 0.75rem; text-align: left; font-weight: 600; border: none;'>Feature</th><th style='padding: 0.75rem; text-align: left; font-weight: 600; border: none;'>Advantage</th></tr></thead><tbody><tr style='border-bottom: 1px solid #e5e7eb;'><td style='padding: 0.75rem; border: none; color: #1f2937; font-weight: 600;'>AI Chat & Lead Capture</td><td style='padding: 0.75rem; border: none; color: #4b5563;'>Converts curiosity into action instantly</td></tr><tr style='background: #f9fafb; border-bottom: 1px solid #e5e7eb;'><td style='padding: 0.75rem; border: none; color: #1f2937; font-weight: 600;'>Multilingual Support</td><td style='padding: 0.75rem; border: none; color: #4b5563;'>Expands regional & global reach</td></tr><tr style='border-bottom: 1px solid #e5e7eb;'><td style='padding: 0.75rem; border: none; color: #1f2937; font-weight: 600;'>Analytics Dashboard</td><td style='padding: 0.75rem; border: none; color: #4b5563;'>Tracks every visitor & campaign</td></tr><tr style='background: #f9fafb; border-bottom: 1px solid #e5e7eb;'><td style='padding: 0.75rem; border: none; color: #1f2937; font-weight: 600;'>Smart Follow-ups</td><td style='padding: 0.75rem; border: none; color: #4b5563;'>Converts 2nd chances into sales</td></tr><tr style='border-bottom: 1px solid #e5e7eb;'><td style='padding: 0.75rem; border: none; color: #1f2937; font-weight: 600;'>Seamless Integrations</td><td style='padding: 0.75rem; border: none; color: #4b5563;'>Connects website, WhatsApp, and CRM</td></tr><tr style='background: #f9fafb;'><td style='padding: 0.75rem; border: none; color: #1f2937; font-weight: 600;'>Managed by Troika</td><td style='padding: 0.75rem; border: none; color: #4b5563;'>Zero technical stress for business owners</td></tr></tbody></table></div></div><div style='background: linear-gradient(135deg, #1f2937, #374151); padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem; color: white; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);'><div style='font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #fbbf24; text-align: center; display: flex; align-items: center; justify-content: center;'><span style='margin-right: 0.5rem; font-size: 2rem;'>🎯</span>FINAL RESULT</div><div style='background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 5px solid #fbbf24; margin-bottom: 1.5rem;'><div style='font-size: 1.1rem; color: #d1d5db; line-height: 1.7; margin-bottom: 1rem;'>Whether you're a doctor scheduling patients, a manufacturer handling bulk orders, or a lawyer managing new case leads </div><div style='font-size: 1.2rem; font-weight: 600; color: #fbbf24; line-height: 1.6;'>your AI Website becomes the most reliable, intelligent, and cost-effective employee you've ever had.</div></div><div style='background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 5px solid #fbbf24; text-align: center;'><div style='font-size: 1.2rem; font-weight: 600; color: #fbbf24; margin-bottom: 0.5rem; font-style: italic;'>\"Troika AI Websites don't just represent your business  they run it smarter.\"</div></div></div></div>"
    }
  ];

  // About suggestions
  const aboutSuggestions = [
    {
      icon: "⭐",
      text: "Features",
      action: "features"
    }
  ];

  // ROI suggestions
  const roiSuggestions = [
    {
      icon: "🏠",
      text: "Real Estate",
      action: "real-estate"
    },
    {

      icon: "🎓",

      text: "Education / Coaching Institutes",
      action: "education"
    },
    {
      icon: "🏭",
      text: "Manufacturing / B2B",
      action: "manufacturing"
    },
    {
      icon: "⚖️",
      text: "Services (Consultants, Lawyers, Hospitals)",
      action: "services"
    }
  ];

  // Pricing suggestions
  const pricingSuggestions = [
    {
      icon: "💰",
      text: "Pricing",
      action: "pricing"
    }
  ];

  // Sales suggestions
  const salesSuggestions = [
    {
      icon: "🎯",
      text: "What offer you have?",
      action: "offer"
    },
    {
      icon: "💸",
      text: "How much discount I can Get?",
      action: "discount"
    }
  ];

  // Marketing suggestions
  const marketingSuggestions = [
    {
      icon: "📢",
      text: "Marketing",
      action: "marketing"
    }
  ];

  // Home features
  const homeFeatures = [
    { icon: FaGlobe, text: "80+ Languages", color: "#3B82F6" },

    { icon: FaBolt, text: "Instant Responses", color: "#F59E0B" },

    { icon: FaRobot, text: "AI-Powered", color: "#8B5CF6" }

  ];



  // AI Websites features
  const aiWebsitesFeatures = [
    { icon: FaGlobe, text: "Smart Websites", color: "#3B82F6" },
    { icon: FaBolt, text: "Auto Engagement", color: "#F59E0B" },
    { icon: FaRobot, text: "AI Conversion", color: "#8B5CF6" }
  ];

  // About features
  const aboutFeatures = [
    { icon: FaGlobe, text: "AI Websites", color: "#3B82F6" },
    { icon: FaBolt, text: "Automation", color: "#F59E0B" },
    { icon: FaRobot, text: "Growth Solutions", color: "#8B5CF6" }
  ];

  // ROI features
  const roiFeatures = [
    { icon: FaGlobe, text: "Industry Focused", color: "#3B82F6" },
    { icon: FaBolt, text: "Proven ROI", color: "#F59E0B" },
    { icon: FaRobot, text: "Real Results", color: "#8B5CF6" }
  ];

  // Pricing features
  const pricingFeatures = [
    { icon: FaGlobe, text: "Transparent Pricing", color: "#3B82F6" },
    { icon: FaBolt, text: "Value for Money", color: "#F59E0B" },
    { icon: FaRobot, text: "No Hidden Costs", color: "#8B5CF6" }
  ];

  // Sales features
  const salesFeatures = [
    { icon: FaGlobe, text: "Special Offers", color: "#3B82F6" },
    { icon: FaBolt, text: "Discounts Available", color: "#F59E0B" },
    { icon: FaRobot, text: "Sales Support", color: "#8B5CF6" }
  ];

  // Marketing features
  const marketingFeatures = [
    { icon: FaGlobe, text: "AI Marketing", color: "#3B82F6" },
    { icon: FaBolt, text: "Lead Generation", color: "#F59E0B" },
    { icon: FaRobot, text: "24x7 Conversion", color: "#8B5CF6" }
  ];

  // Social media suggestions and features
  const socialMediaSuggestions = [
    { icon: "📸", text: "Instagram Feed", action: "instagram-feed" },
    { icon: "🎥", text: "YouTube Channel", action: "youtube-channel" },
    { icon: "👥", text: "Facebook Page", action: "facebook-page" },
    { icon: "🐦", text: "Twitter Feed", action: "twitter-feed" }
  ];

  const socialMediaFeatures = [
    { icon: FaGlobe, text: "Live Feeds", color: "#8B5CF6" },
    { icon: FaBolt, text: "Real-time Updates", color: "#F59E0B" },
    { icon: FaRobot, text: "AI-Powered Content", color: "#10B981" }
  ];

  // Get current suggestions and features based on active page
  const suggestions = activePage === 'social-media' ? socialMediaSuggestions :
                     activePage === 'ai-websites' ? aiWebsitesSuggestions :
                     activePage === 'ai-calling' ? aiCallingSuggestions :
                     activePage === 'industry-use-cases' ? industryUseCasesSuggestions :
                     homeSuggestions;
  const features = activePage === 'social-media' ? socialMediaFeatures :
                   activePage === 'ai-websites' ? aiWebsitesFeatures :
                   homeFeatures;

  // Scroll indicator removed



  return (

    <>

      <WelcomeContainer $isDarkMode={isDarkMode} $isSocialMedia={activePage === 'social-media'}>
        {activePage !== 'social-media' && (
        <AvatarContainer>

          <AvatarCircle>

            <AvatarImage

              src="/logo.png"
              alt="Supa Agent Logo"
              onError={(e) => {

                e.target.src = "/logo.png";
              }}

            />

            <OnlineIndicator />

          </AvatarCircle>

        </AvatarContainer>

        )}
        
        {activePage !== 'social-media' && (
          <>
        <GreetingText $isDarkMode={isDarkMode}>
          {activePage === 'who-is-troika' ? 'Explore Troika Tech AI' :
           activePage === 'what-is-ai-agent' ? 'Understanding AI Agents' :
           activePage === 'how-it-works' ? 'How AI Agents Work' :
           activePage === 'use-case-for-me' ? 'AI Agent Use Cases' :
           activePage === 'pricing-setup' ? 'Troika Tech Setup & Pricing' :
           activePage === 'ai-websites' ? 'Troika Tech – AI Websites' :
           activePage === 'ai-calling' ? 'Troika Tech – AI Calling Agent' :
           activePage === 'ai-agent' ? 'Hi! This is Troika Tech 👋' :
           activePage === 'industry-use-cases' ? 'AI Websites By Troika Tech' :
           'Hi! This is Troika Tech 👋'}
        </GreetingText>
        <SubText $isDarkMode={isDarkMode} style={{
          fontSize: '1.1rem',
          lineHeight: '1.7',
          maxWidth: '700px',
          margin: '0 auto',
          fontWeight: '400',
          padding: '0 1rem'
        }}>
          {activePage === 'new-chat' ? 'Welcome to Troika Tech! We specialize in creating intelligent AI solutions that transform how businesses interact with their customers. Our comprehensive suite includes AI-powered websites and automated calling agents - all designed to help your business grow 24/7.' :
           activePage === 'ai-agent' ? 'A 24×7 digital employee that chats, calls, and messages like a real team member to automate your business.' :
           activePage === 'ai-calling-agent' ? 'A human-like voice AI that makes and answers calls to engage, follow up, and close leads automatically.' :
           activePage === 'ai-websites' ? '' :
           activePage === 'ai-calling' ? 'A human-like voice AI that makes and answers calls to engage, follow up, and close leads automatically.' :
           activePage === 'industry-use-cases' ? '' :
           ''}
        </SubText>
        
        {/* Input Area - integrated into welcome section */}
        <InputArea
          message={message}
          setMessage={setMessage}
          handleKeyPress={handleKeyPress}
          isTyping={isTyping}
          userMessageCount={userMessageCount}
          botMessageCount={botMessageCount}
          verified={verified}
          needsAuth={needsAuth}
          isRecording={isRecording}
          handleMicClick={handleMicClick}
          handleMicTouchStart={handleMicTouchStart}
          handleMicTouchEnd={handleMicTouchEnd}
          handleMicMouseDown={handleMicMouseDown}
          handleMicMouseUp={handleMicMouseUp}
          isMobile={isMobile}
          handleSendMessage={handleSendMessage}
          isWelcomeMode={true}
          currentlyPlaying={currentlyPlaying}
          showInlineAuth={showInlineAuth}
          shouldShowAuth={shouldShowAuth}
          isAuthenticated={isAuthenticated}
          activePage={activePage}
        />


        {/* AI WhatsApp description removed */}

        {/* AI Telegram and Industry Use Cases descriptions removed */}
          </>
        )}

        {activePage === 'social-media' ? (
          <SocialMediaGrid>
            {/* Instagram Feed - Top Left */}
            <SocialMediaContainer
              $isDarkMode={isDarkMode}
              $borderColor="#E4405F"
              $boxShadow="0 4px 12px rgba(228, 64, 95, 0.2)"
              $hoverShadow="0 8px 25px rgba(228, 64, 95, 0.3)"
              onClick={() => handleFeedClick('instagram')}
            >
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #E4405F',
                background: 'linear-gradient(45deg, #feda75, #d62976, #962fbf)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '1.2rem' }}>📸</span>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>
                  Instagram Feed
                </h3>
              </div>
              <div style={{
                flex: 1,
                overflow: 'hidden',
                position: 'relative'
              }}>
                <iframe
                  src="https://www.instagram.com/troikatechindia/embed/"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency="true"
                  style={{ 
                    border: 'none', 
                    background: 'transparent',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    minHeight: '200px'
                  }}
                  title="Instagram Feed"
                />
              </div>
            </SocialMediaContainer>

            {/* Facebook Feed - Top Right */}
            <SocialMediaContainer
              $isDarkMode={isDarkMode}
              $borderColor="#1877F2"
              $boxShadow="0 4px 12px rgba(24, 119, 242, 0.2)"
              $hoverShadow="0 8px 25px rgba(24, 119, 242, 0.3)"
              onClick={() => handleFeedClick('facebook')}
            >
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #1877F2',
                background: '#1877F2',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '1.2rem' }}>👥</span>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>
                  Facebook Page
                </h3>
              </div>
              <div style={{
                flex: 1,
                overflow: 'hidden',
                position: 'relative'
              }}>
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftroikatechservices&tabs=timeline&width=350&height=400&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
                  width="100%"
                  height="100%"
                  style={{ 
                    border: 'none', 
                    overflow: 'hidden', 
                    background: 'transparent',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    minHeight: '350px'
                  }}
                  scrolling="no"
                  frameBorder="0"
                  allowTransparency="true"
                  allow="encrypted-media"
                  title="Facebook Page"
                />
              </div>
            </SocialMediaContainer>

            {/* YouTube Feed - Bottom Left */}
            <SocialMediaContainer
              $isDarkMode={isDarkMode}
              $borderColor="#FF0000"
              $boxShadow="0 4px 12px rgba(255, 0, 0, 0.2)"
              $hoverShadow="0 8px 25px rgba(255, 0, 0, 0.3)"
              onClick={() => handleFeedClick('youtube')}
            >
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #FF0000',
                background: '#FF0000',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '1.2rem' }}>🎥</span>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>
                  YouTube Channel
                </h3>
              </div>
              <div style={{
                flex: 1,
                overflow: 'hidden',
                position: 'relative',
                background: isDarkMode ? '#000000' : '#ffffff'
              }}>
                 <div style={{
                   width: '100%',
                   height: '100%',
                   background: isDarkMode ? '#000000' : '#ffffff',
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center',
                   justifyContent: 'center',
                   padding: '1rem',
                   color: isDarkMode ? '#ffffff' : '#333333',
                   position: 'relative'
                 }}>
                   <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎥</div>
                   <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', opacity: 0.8, textAlign: 'center' }}>
                     Click to view our latest videos
                   </p>
                   <button
                     onClick={() => window.open('https://www.youtube.com/@TroikaDombivali/videos', '_blank')}
                     style={{
                       background: '#FF0000',
                       color: 'white',
                       border: '2px solid #FF0000',
                       padding: '0.5rem 1rem',
                       borderRadius: '25px',
                       cursor: 'pointer',
                       fontSize: '0.9rem',
                       fontWeight: '600',
                       transition: 'all 0.3s ease'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.background = '#cc0000';
                       e.target.style.transform = 'scale(1.05)';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.background = '#FF0000';
                       e.target.style.transform = 'scale(1)';
                     }}
                   >
                     View Videos
                   </button>
                 </div>
              </div>
            </SocialMediaContainer>

            {/* Twitter Feed - Bottom Right */}
            <SocialMediaContainer
              $isDarkMode={isDarkMode}
              $borderColor="#000000"
              $boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
              $hoverShadow="0 8px 25px rgba(0, 0, 0, 0.3)"
              onClick={() => handleFeedClick('twitter')}
            >
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #1da1f2',
                background: '#1da1f2',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '1.2rem' }}>🐦</span>
                <h3 style={{ color: '#ffffff', margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>
                  Twitter Feed
                </h3>
              </div>
              <div style={{
                flex: 1,
                overflow: 'hidden',
                position: 'relative',
                background: isDarkMode ? '#000000' : '#ffffff'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: isDarkMode ? '#000000' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  color: isDarkMode ? '#ffffff' : '#333333',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐦</div>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', opacity: 0.8, textAlign: 'center' }}>
                    Click to view our latest tweets
                  </p>
                  <button
                    onClick={() => window.open('https://x.com/TroikaTechAI', '_blank')}
                    style={{
                      background: '#1da1f2',
                      color: 'white',
                      border: '2px solid #1da1f2',
                      padding: '0.5rem 1rem',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#0d8bd9';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#1da1f2';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    View Tweets
                  </button>
                </div>
              </div>
            </SocialMediaContainer>
          </SocialMediaGrid>
        ) : null}
        
        {/* Feature Tags - DISABLED */}
        {/* {activePage !== 'new-chat' && (
          <FeatureTags>

            {features.map((feature, index) => {

              const IconComponent = feature.icon;

              return (

                <FeatureTag key={index} className={index >= 2 ? 'mobile-hidden' : ''}>

                  <div className="feature-icon" style={{ color: feature.color }}>

                    <IconComponent />

                  </div>

                  <span className="feature-text">{feature.text}</span>

                </FeatureTag>

              );

            })}

          </FeatureTags>
        )} */}


        {/* Social Media Feed Area */}
        {socialFeedOpen && selectedPlatform && (
          <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '1rem auto 0 auto',
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            border: '2px solid',
            borderColor: selectedPlatform === 'instagram' ? '#E4405F' :
                        selectedPlatform === 'youtube' ? '#FF0000' :
                        selectedPlatform === 'facebook' ? '#1877F2' :
                        selectedPlatform === 'twitter' ? '#000000' : '#e5e5e5',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            animation: 'slideInUp 0.4s ease-out',
            position: 'relative',
            zIndex: 2,
            minHeight: '300px'
          }}>
            {/* Header */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid',
              borderBottomColor: isDarkMode ? '#333333' : '#e5e5e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isDarkMode ? '#1f1f1f' : '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '16px',
                  background: selectedPlatform === 'instagram' ? 'linear-gradient(45deg, #feda75, #d62976, #962fbf)' :
                             selectedPlatform === 'youtube' ? '#FF0000' :
                             selectedPlatform === 'facebook' ? '#1877F2' :
                             selectedPlatform === 'twitter' ? '#000000' : '#6b7280'
                }}>
                  {selectedPlatform === 'instagram' ? '📸' :
                   selectedPlatform === 'youtube' ? '🎥' :
                   selectedPlatform === 'facebook' ? '👥' :
                   selectedPlatform === 'twitter' ? '🐦' : '🔗'}
                </div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: isDarkMode ? '#ffffff' : '#1f2937',
                  margin: 0,
                  textTransform: 'capitalize'
                }}>
                  {selectedPlatform === 'instagram' ? 'Instagram Feed' :
                   selectedPlatform === 'youtube' ? 'YouTube Channel' :
                   selectedPlatform === 'facebook' ? 'Facebook Page' :
                   selectedPlatform === 'twitter' ? 'Twitter Feed' : `${selectedPlatform} Feed`}
                </h3>
              </div>
              <button
                onClick={onSocialFeedClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDarkMode ? '#ffffff' : '#6b7280',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  fontSize: '1.1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
                title="Close feed"
              >
                ✕
              </button>
            </div>

            {/* Feed Content */}
            <div style={{
              minHeight: '300px',
              padding: 0,
              background: isDarkMode ? '#1a1a1a' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Instagram Feed */}
              {selectedPlatform === 'instagram' && (
                <div style={{ width: '100%', height: '100%', background: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
                  <iframe
                    src="https://www.instagram.com/troikatechindia/embed/"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency="true"
                    style={{ border: 'none', borderRadius: '0', background: 'transparent' }}
                    title="Instagram Feed"
                  />
                </div>
              )}

              {/* YouTube Feed */}
              {selectedPlatform === 'youtube' && (
                <div style={{ width: '100%', height: '100%', background: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
                   <iframe
                     src="https://www.youtube.com/embed?listType=user_uploads&list=@TroikaDombivali&autoplay=0&mute=0&controls=1&showinfo=0&rel=0"
                     width="100%"
                     height="400"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none', borderRadius: '0', background: 'transparent' }}
                    title="YouTube Channel"
                  />
                </div>
              )}

              {/* Facebook Feed */}
              {selectedPlatform === 'facebook' && (
                <div style={{ width: '100%', height: '100%', background: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftroikatechservices&tabs=timeline&width=500&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    width="100%"
                    height="400"
                    style={{ border: 'none', overflow: 'hidden', background: 'transparent' }}
                    scrolling="no"
                    frameBorder="0"
                    allowTransparency="true"
                    allow="encrypted-media"
                    title="Facebook Page"
                  />
                </div>
              )}

              {/* Twitter Feed */}
              {selectedPlatform === 'twitter' && (
                <div style={{ width: '100%', height: '100%', background: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
                  <iframe
                    src="https://syndication.twitter.com/i/timeline/profile?screen_name=troikatech_in&theme=dark"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency="true"
                    style={{ border: 'none', borderRadius: '0', background: 'transparent' }}
                    title="Twitter Feed"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </WelcomeContainer>



      {/* ScrollIndicator removed */}

    </>

  );

};



export default WelcomeSection;