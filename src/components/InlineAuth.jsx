import React, { useState } from 'react';
import styled from 'styled-components';

const AuthContainer = styled.div`
  background: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  border: 2px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  border-radius: 16px;
  padding: 24px;
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

const AuthTitle = styled.h3`
  color: ${props => props.theme === 'dark' ? '#f9fafb' : '#111827'};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  text-align: center;
`;

const AuthSubtitle = styled.p`
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6b7280'};
  font-size: 0.875rem;
  margin: 0 0 20px 0;
  text-align: center;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  color: ${props => props.theme === 'dark' ? '#d1d5db' : '#374151'};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme === 'dark' ? '#374151' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.theme === 'dark' ? '#1f2937' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#f9fafb' : '#111827'};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: ${props => props.theme === 'dark' ? '#9ca3af' : '#9ca3af'};
  }
`;

const SendButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
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
  margin-top: 8px;
  text-align: center;
`;

const InlineAuth = ({
  theme,
  onSendOtp,
  loading,
  error
}) => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendOtp(phone);
  };

  const isValidInput = () => {
    return phone.length >= 10;
  };

  return (
    <AuthContainer theme={theme}>
      <AuthTitle theme={theme}>Verify Your Identity</AuthTitle>
      <AuthSubtitle theme={theme}>
        Please verify your WhatsApp number to continue chatting
      </AuthSubtitle>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <InputLabel theme={theme}>
            Phone Number
          </InputLabel>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your WhatsApp number"
            theme={theme}
            required
          />
        </InputContainer>

        <SendButton
          type="submit"
          disabled={!isValidInput() || loading}
        >
          {loading ? 'Sending...' : 'Send OTP via WhatsApp'}
        </SendButton>

        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
      </form>
    </AuthContainer>
  );
};

export default InlineAuth;
