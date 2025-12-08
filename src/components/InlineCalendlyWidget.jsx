import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { InlineWidget } from 'react-calendly';
import { useTheme } from '../contexts/ThemeContext';

// Slide up animation
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Shimmer animation for loading skeleton
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Pulse animation for border glow
const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
  }
  50% {
    box-shadow: 0 0 20px 2px rgba(139, 92, 246, 0.3);
  }
`;

// Spinner rotation animation
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Gradient rotation for premium loader
const gradientRotate = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Fade in/out animation for dots
const dotPulse = keyframes`
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  40% {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const WidgetContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  border-radius: 16px;
  overflow: hidden;
  background: ${props => props.$isDarkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${props => props.$isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
  transition: all 0.3s ease;

  /* Pulse animation on mount */
  ${props => props.$shouldPulse && css`
    animation: ${slideUp} 0.6s cubic-bezier(0.4, 0.0, 0.2, 1),
               ${pulse} 1.2s ease-in-out 0.6s;
  `}

  &:hover {
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15);
    border-color: ${props => props.$isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.25)'};
  }

  /* Responsive heights */
  @media (min-width: 769px) {
    height: 550px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    height: 500px;
  }

  @media (max-width: 480px) {
    height: 450px;
    margin-top: 0.75rem;
    border-radius: 12px;
  }
`;

const LoadingSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.$isDarkMode
    ? 'linear-gradient(-45deg, rgba(31, 41, 55, 0.8), rgba(55, 65, 81, 0.6), rgba(75, 85, 99, 0.7), rgba(55, 65, 81, 0.6))'
    : 'linear-gradient(-45deg, rgba(249, 250, 251, 0.9), rgba(243, 244, 246, 0.8), rgba(229, 231, 235, 0.9), rgba(243, 244, 246, 0.8))'
  };
  background-size: 400% 400%;
  animation: ${gradientRotate} 3s ease infinite;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.$isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)'},
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }

  @media (max-width: 480px) {
    border-radius: 12px;
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const LoadingText = styled.div`
  color: ${props => props.$isDarkMode ? '#d1d5db' : '#4b5563'};
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.025em;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const LoadingSubText = styled.div`
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 400;
  text-align: center;
  margin-top: -0.5rem;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  z-index: 1;

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
  }
`;

const Spinner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid ${props => props.$isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(167, 139, 250, 0.2)'};
  border-top-color: ${props => props.$isDarkMode ? '#8b5cf6' : '#a78bfa'};
  animation: ${spin} 1s linear infinite;

  @media (max-width: 480px) {
    border-width: 3px;
  }
`;

const SpinnerInner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-bottom-color: ${props => props.$isDarkMode ? '#c4b5fd' : '#8b5cf6'};
  border-left-color: ${props => props.$isDarkMode ? '#c4b5fd' : '#8b5cf6'};
  animation: ${spin} 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;

  @media (max-width: 480px) {
    border-width: 2.5px;
  }
`;

const CalendarIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.75rem;
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
  z-index: 1;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$isDarkMode ? '#8b5cf6' : '#a78bfa'};
  animation: ${dotPulse} 1.4s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;

  @media (max-width: 480px) {
    width: 6px;
    height: 6px;
  }
`;

const ErrorContainer = styled.div`
  width: 100%;
  padding: 2rem;
  text-align: center;
  background: ${props => props.$isDarkMode ? 'rgba(220, 38, 38, 0.1)' : 'rgba(254, 226, 226, 0.8)'};
  border: 1px solid ${props => props.$isDarkMode ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.2)'};
  border-radius: 12px;
  color: ${props => props.$isDarkMode ? '#fca5a5' : '#dc2626'};

  @media (max-width: 480px) {
    padding: 1.5rem;
    font-size: 0.9rem;
  }
`;

const ErrorTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0.9;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const RetryButton = styled.button`
  background: ${props => props.$isDarkMode ? '#dc2626' : '#ef4444'};
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isDarkMode ? '#b91c1c' : '#dc2626'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const InlineCalendlyWidget = ({ url, onError, onEventScheduled }) => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);
  const [isBooked, setIsBooked] = useState(false);

  // Auto-hide loading after 2 seconds (Calendly doesn't provide load callbacks)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [url]);

  // Listen for Calendly events (booking confirmation)
  React.useEffect(() => {
    const handleCalendlyEvent = (e) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {

        // Event when user schedules a meeting
        if (e.data.event === 'calendly.event_scheduled') {

          // Extract meeting details
          const eventDetails = e.data.payload || {};
          const eventUri = eventDetails.event?.uri || '';
          const inviteeUri = eventDetails.invitee?.uri || '';


          // Hide the widget after booking
          setIsBooked(true);

          // Notify parent component
          onEventScheduled?.({
            eventUri,
            inviteeUri,
            timestamp: new Date()
          });
        }
      }
    };

    // Add event listener for Calendly messages
    window.addEventListener('message', handleCalendlyEvent);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, [onEventScheduled]);

  // Open in new tab as fallback
  const handleOpenInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <WidgetContainer $isDarkMode={isDarkMode} $shouldPulse={shouldPulse}>
      {isLoading && (
        <LoadingSkeleton $isDarkMode={isDarkMode}>
          <SpinnerContainer>
            <Spinner $isDarkMode={isDarkMode} />
          </SpinnerContainer>
          <LoadingText $isDarkMode={isDarkMode}>
            Loading your calendar
          </LoadingText>
          <LoadingSubText $isDarkMode={isDarkMode}>
            Preparing available time slots...
          </LoadingSubText>
          <LoadingDots>
            <Dot $isDarkMode={isDarkMode} $delay={0} />
            <Dot $isDarkMode={isDarkMode} $delay={0.2} />
            <Dot $isDarkMode={isDarkMode} $delay={0.4} />
          </LoadingDots>
        </LoadingSkeleton>
      )}

      <div style={{
        display: isLoading ? 'none' : 'block',
        height: '100%',
        width: '100%'
      }}>
        <InlineWidget
          url={url}
          styles={{
            height: '100%',
            width: '100%',
            minWidth: '100%',
            overflow: 'hidden'
          }}
          pageSettings={{
            backgroundColor: isDarkMode ? '1f2937' : 'ffffff',
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
            primaryColor: '8b5cf6',
            textColor: isDarkMode ? 'ffffff' : '000000'
          }}
        />
      </div>
    </WidgetContainer>
  );
};

export default InlineCalendlyWidget;
