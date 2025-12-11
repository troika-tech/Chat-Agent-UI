import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const MessageWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 0.75rem 0;
  width: 100%;
  animation: slideUp 0.5s ease-out;
  overflow: visible;

  @keyframes slideUp {
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

const MessageContainer = styled.div`
  max-width: 75%;
  display: flex;
  flex-direction: column;
  order: 1;
`;

const BotHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
`;

const BotAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  font-size: 1.25rem;
`;

const BotAvatarImage = styled.img`
  width: 80%;
  height: 80%;
  object-fit: cover;
  border-radius: 10px;
`;

const BotName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  transition: color 0.3s ease;
`;

const MessageBubble = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 24px 24px 24px 4px;
  font-size: 1rem;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  hyphens: auto;
  word-break: break-word;
  position: relative;
  margin: 0.25rem 0;
  width: 100%;
  max-width: 100%;
  min-width: 60px;
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transform: scale(1);
  transition: transform 0.2s ease, background 0.3s ease, color 0.3s ease;

  @media (min-width: 1200px) {
    min-width: 300px;
  }

  @media (min-width: 1400px) {
    min-width: 350px;
  }

  @media (min-width: 1600px) {
    min-width: 400px;
  }

  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 480px) {
    margin: 0.2rem 0;
    min-width: 50px;
    padding: 0.75rem 0.875rem;
  }
  
  @media (max-width: 360px) {
    margin: 0.15rem 0;
    min-width: 40px;
    padding: 0.625rem 0.75rem;
  }

  background: ${props => props.$isDarkMode ? '#000000' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#1f2937'};
  border: 1px solid ${props => props.$isDarkMode ? '#374151' : '#e5e7eb'};
`;

const AuthContent = styled.div`
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  width: 100%;
  max-width: 100%;
`;

const AuthTitle = styled.h3`
  color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

const AuthSubtitle = styled.p`
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  text-align: left;
`;

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  display: block;
  color: ${props => props.$isDarkMode ? '#d1d5db' : '#374151'};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$isDarkMode ? '#374151' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.$isDarkMode ? '#1f2937' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: ${props => props.$isDarkMode ? '#9ca3af' : '#9ca3af'};
  }
`;

const SendButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#9ca3af'};
  margin-top: 0.75rem;
  display: block;
  transition: color 0.3s ease;
`;

const AuthMessageBubble = ({
  onSendOtp,
  loading,
  error,
  assistantName,
  assistantAvatarUrl,
}) => {
  const { isDarkMode } = useTheme();
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendOtp(phone);
  };

  const isValidInput = () => {
    return phone.length >= 10;
  };

  return (
    <MessageWrapper>
      <MessageContainer>
        {/* Show Assistant header OUTSIDE bubble */}
        <BotHeader>
          <BotAvatar>
            {assistantAvatarUrl && (
              <BotAvatarImage
                src={assistantAvatarUrl}
                alt={assistantName || "Assistant"}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </BotAvatar>
          <BotName $isDarkMode={isDarkMode}>{assistantName || "Ai Assistant"}</BotName>
        </BotHeader>

        <MessageBubble $isDarkMode={isDarkMode}>
          <AuthContent>
            <AuthSubtitle $isDarkMode={isDarkMode}>
              Sure! Please share your WhatsApp number so I can share the demo credentials with you.
            </AuthSubtitle>

            <form onSubmit={handleSubmit}>
              <InputContainer>
                <InputLabel $isDarkMode={isDarkMode}>
                  WhatsApp Number
                </InputLabel>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your number"
                  $isDarkMode={isDarkMode}
                  required
                />
              </InputContainer>

              <SendButton
                type="submit"
                disabled={!isValidInput() || loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </SendButton>

              {error && (
                <ErrorMessage>{error}</ErrorMessage>
              )}
            </form>
          </AuthContent>

          {/* Timestamp inside message bubble */}
          <Timestamp $isDarkMode={isDarkMode}>
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Timestamp>
        </MessageBubble>
      </MessageContainer>
    </MessageWrapper>
  );
};

export default AuthMessageBubble;
