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

  font-family: "Amaranth", "Poppins", sans-serif;
`;

export const Overlay = styled.div`
  opacity: 0;
  animation: fadeIn 0.4s ease forwards 0s;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => props.$isDarkMode
    ? 'linear-gradient(to bottom right, #000000, #000000, #000000)'
    : 'linear-gradient(to bottom right, #e0e7ff, #f0f9ff, #fef3c7)'};
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

  /* Animated blob backgrounds */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, ${props => props.$isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)'} 0%, transparent 70%);
    animation: blob 7s ease-in-out infinite;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -30%;
    right: -30%;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, ${props => props.$isDarkMode ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.1)'} 0%, transparent 70%);
    animation: blob 8s ease-in-out infinite reverse;
    animation-delay: 2s;
    pointer-events: none;
  }

  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(20px, -50px) scale(1.1);
    }
    50% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    75% {
      transform: translate(20px, 50px) scale(1.05);
    }
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
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;


  background: transparent;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  border: none;
  transition: background 0.3s ease;

`;

export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  position: relative;
  overflow: visible;
  background: ${props => props.$isDarkMode ? 'transparent' : '#f8f9fa'};
  width: 100%;
  align-items: stretch;
  
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
  overflow-x: visible;
  padding: 1.5rem; /* Match Reference.jsx p-6 (24px) */
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
  background: ${props => props.$isDarkMode ? '#000000' : '#f8f9fa'};
  width: 100%;

  /* Responsive padding to match Reference.jsx behavior */
  @media (max-width: 768px) {
    padding: 1rem; /* p-4 (16px) */
  }

  @media (max-width: 640px) {
    padding: 0.75rem; /* p-3 (12px) */
  }

  @media (max-width: 480px) {
    padding: 0.5rem; /* p-2 (8px) */
  }

  @media (max-width: 414px) {
    padding: 0.4rem; /* Smaller padding for small phones */
  }

  @media (max-width: 375px) {
    padding: 0.3rem; /* p-1 (4px) */
  }

  @media (max-width: 320px) {
    padding: 0.2rem; /* Minimal padding for very small screens */
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
  max-width: 900px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
  background: transparent;

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
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.$isDarkMode ? '#212121' : '#ffffff'};
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* Adds space between messages */
  padding: 0.75rem 0.5rem; /* Minimal horizontal padding for hover effects */
  overflow: visible;

  /* Reduce horizontal padding on smaller screens */
  @media (max-width: 768px) {
    padding: 0.75rem 0.25rem;
  }

  @media (max-width: 640px) {
    padding: 0.75rem 0.2rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.15rem;
  }

  @media (max-width: 414px) {
    padding: 0.75rem 0.1rem;
  }

  @media (max-width: 375px) {
    padding: 0.75rem 0.05rem;
  }

  @media (max-width: 360px) {
    padding: 0.75rem 0.025rem;
  }

  @media (max-width: 320px) {
    padding: 0.75rem 0;
  }
`;
