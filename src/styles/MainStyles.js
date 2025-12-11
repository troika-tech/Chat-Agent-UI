import styled, { keyframes } from "styled-components";

const slideOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  40% {
    transform: scale(0.97);
  }
  100% {
    opacity: 0;
    transform: translateY(100px) scale(0.9);
  }
`;

const pop = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

const fadeInItem = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Wrapper = styled.div`
  @keyframes slideOut {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    40% {
      transform: scale(0.97);
    }
    100% {
      opacity: 0;
      transform: translateY(100px) scale(0.9);
    }
  }

  @keyframes pop {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    60% {
      transform: scale(1.15);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes fadeInItem {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
`;

export const Overlay = styled.div`
  opacity: 0;
  animation: fadeIn 0.4s ease forwards 0s;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  max-height: 100vh;
  max-height: calc(var(--vh, 1vh) * 100);
  background: ${props => props.$isDarkMode
    ? 'linear-gradient(to bottom right, #000000, #000000, #000000)'
    : '#f8f8f7'};
  z-index: 9999;
  display: flex;
  flex-direction: row;
  padding: 0;
  overscroll-behavior: contain;
  touch-action: pan-y;
  z-index: 2147481000;
  overflow: hidden;
  transition: background 0.5s ease;
  position: relative;
  
  /* Prevent horizontal scroll */
  overflow-x: hidden;
  
  /* Force mobile layout when data-is-mobile="true" */
  html[data-is-mobile="true"] & {
    flex-direction: column;
  }
  
  /* Landscape mode optimization */
  @media (orientation: landscape) and (max-height: 500px) {
    height: 100vh;
    max-height: 100vh;
  }


  /* Enhanced mobile responsiveness - Full screen coverage */
  @media (max-width: 1200px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 1024px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 900px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 768px) {
    align-items: center;
    padding: 0;
    flex-direction: column;
  }
  
  /* Force mobile layout when data-is-mobile="true" (even if media query doesn't match) */
  html[data-is-mobile="true"] & {
    flex-direction: column;
    align-items: stretch;
  }

  @media (max-width: 640px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 600px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 480px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 414px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 390px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 375px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 360px) {
    align-items: center;
    padding: 0;
  }

  @media (max-width: 320px) {
    align-items: center;
    padding: 0;
  }

  /* Landscape mobile optimization */
  @media (max-height: 500px) and (orientation: landscape) {
    align-items: center;
    padding: 0;
  }

  /* Very small landscape screens */
  @media (max-height: 400px) and (orientation: landscape) {
    align-items: center;
    padding: 0;
  }
`;

export const AnimatedBlob = styled.div`
  position: absolute;
  bottom: -8%;
  left: 40%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, ${props => props.$isDarkMode ? 'rgba(120, 219, 255, 0.15)' : 'rgba(120, 219, 255, 0.1)'} 0%, transparent 70%);
  animation: blob 10s ease-in-out infinite;
  animation-delay: 4s;
  pointer-events: none;
  z-index: 1;
`;

export const Chatbox = styled.div`
  &.closing {
    animation: slideOut 0.5s ease forwards;
  }
  transform: translateY(40px);
  opacity: 0;
  animation: slideUp 0.5s ease-out forwards;
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  max-height: 100vh;
  max-height: calc(var(--vh, 1vh) * 100);
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  border: none;
  transition: background 0.3s ease;
  
  /* Prevent horizontal scroll */
  overflow-x: hidden;
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100vw;
  }
  
  /* Landscape mode */
  @media (orientation: landscape) and (max-height: 500px) {
    height: 100vh;
    max-height: 100vh;
  }
`;

export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: visible;
  background: ${props => props.$isDarkMode ? 'transparent' : '#f8f8f7'};
  width: 100%;
  max-width: 100%;
  align-items: stretch;
  
  /* Prevent horizontal scroll */
  overflow-x: hidden;
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100vw;
  }
  
  /* Ensure InputArea is always visible and positioned correctly */
  & > *:last-child {
    visibility: visible !important;
    opacity: 1 !important;
    display: flex !important;
    margin-top: auto !important;
  }

  /* Enable scrolling only on smaller devices when in welcome mode */
  ${props => props.$isWelcomeMode && `
    @media (max-height: 700px), (max-width: 480px) {
      overflow-y: auto;
      overflow-x: hidden;
    }

    /* Hide scrollbar for all browsers */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */

    &::-webkit-scrollbar {
      display: none; /* WebKit browsers */
    }

    /* Smooth scrolling for mobile */
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  `}
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(0.5rem, 2vw, 1.5rem);
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
  background: ${props => props.$isDarkMode ? '#000000' : '#f8f9fa'};
  width: 100%;
  max-width: 100%;

  /* Background pattern overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: ${props => props.$isDarkMode ? 0.15 : 0.4};
    pointer-events: none;
    z-index: 0;
    background-image: radial-gradient(
      circle,
      #a8a29e 1px,
      transparent 1px
    );
    background-size: 24px 24px;
    background-position: 0 0;
  }

  /* Responsive padding with fluid units */
  @media (max-width: 1024px) {
    padding: clamp(0.75rem, 1.5vw, 1.25rem);
  }

  @media (max-width: 768px) {
    padding: clamp(0.5rem, 1.25vw, 1rem);
  }

  @media (max-width: 480px) {
    padding: clamp(0.4rem, 1vw, 0.75rem);
  }

  @media (max-width: 360px) {
    padding: clamp(0.3rem, 0.75vw, 0.5rem);
  }
  
  max-width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Hide scrollbar for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* WebKit browsers (Chrome, Safari, Edge) */
  }

  /* Smooth scrolling for mobile */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
`;

export const MessagesInnerContainer = styled.div`
  width: 100%;
  max-width: min(900px, 95vw);
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
  background: transparent;
  z-index: 1;
  
  /* Responsive max-width */
  @media (max-width: 1024px) {
    max-width: min(800px, 95vw);
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }

  /* Responsive padding for greeting message positioning - full screen */
  @media (max-width: 1200px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 1024px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 900px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 640px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 600px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 414px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 390px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 375px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 360px) {
    padding: 0.5rem 0 0 0;
  }

  @media (max-width: 320px) {
    padding: 0.5rem 0 0 0;
  }
`;

export const MainContentArea = styled.div`
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  max-height: 100vh;
  max-height: calc(var(--vh, 1vh) * 100);
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.$isDarkMode ? '#212121' : '#f8f8f7'};
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100vw;
    /* Prevent content from being pushed when sidebar opens */
    position: relative;
    z-index: 1;
  }
  
  /* Landscape mode */
  @media (orientation: landscape) and (max-height: 500px) {
    height: 100vh;
    max-height: 100vh;
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  padding: clamp(0.5rem, 1vw, 0.75rem) clamp(0.25rem, 0.5vw, 0.5rem);
  overflow: visible;
  width: 100%;
  max-width: 100%;

  /* Responsive padding with fluid units */
  @media (max-width: 768px) {
    padding: clamp(0.5rem, 1vw, 0.75rem) clamp(0.15rem, 0.4vw, 0.25rem);
  }

  @media (max-width: 480px) {
    padding: clamp(0.4rem, 0.8vw, 0.6rem) clamp(0.1rem, 0.3vw, 0.15rem);
  }

  @media (max-width: 360px) {
    padding: clamp(0.3rem, 0.6vw, 0.5rem) clamp(0.05rem, 0.2vw, 0.1rem);
  }
`;

export const ChatTitle = styled.div`
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2rem);
  background: ${props => props.$isDarkMode ? '#000000' : '#f8f8f7'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: clamp(3rem, 5vw, 2.5rem);
  font-weight: 700;
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  flex-shrink: 0;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.5rem);
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    gap: 0.75rem;
  }
`;
