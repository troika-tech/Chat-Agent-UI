import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const StreamingContainer = styled.div`
  background: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border: 2px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StreamingText = styled.div`
  color: ${props => props.theme === 'dark' ? '#f9fafb' : '#111827'};
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 20px;
`;

const StreamingCursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: ${props => props.theme === 'dark' ? '#3b82f6' : '#1d4ed8'};
  margin-left: 2px;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const StreamingStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'connecting': return '#f59e0b';
      case 'streaming': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  animation: ${props => props.status === 'streaming' ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StopButton = styled.button`
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #dc2626;
  }
`;

const StreamingMessage = ({
  theme,
  message,
  isStreaming,
  onStopStreaming,
  audioPlaying = false
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isStreaming && message) {
      // Start typewriter effect
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev < message.length) {
            setDisplayText(message.substring(0, prev + 1));
            return prev + 1;
          } else {
            clearInterval(intervalRef.current);
            return prev;
          }
        });
      }, 30); // Adjust speed as needed
    } else {
      // Clear interval and show full text
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setDisplayText(message || '');
      setCurrentIndex(message?.length || 0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [message, isStreaming]);

  const handleStopStreaming = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onStopStreaming();
  };

  return (
    <StreamingContainer theme={theme}>
      <StreamingText theme={theme}>
        {displayText}
        {isStreaming && <StreamingCursor theme={theme} />}
      </StreamingText>
      
      {isStreaming && (
        <StreamingStatus theme={theme}>
          <StatusDot status="streaming" />
          <span>
            {audioPlaying ? 'Streaming with audio...' : 'Streaming response...'}
          </span>
          <StopButton onClick={handleStopStreaming}>
            Stop
          </StopButton>
        </StreamingStatus>
      )}
    </StreamingContainer>
  );
};

export default StreamingMessage;
