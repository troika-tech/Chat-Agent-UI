import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import ShinyText from './ShinyText';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(-10px) rotate(-5deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.$isDarkMode
    ? 'radial-gradient(ellipse at top left, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.15) 0%, transparent 50%), linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(30, 41, 59, 0.97) 100%)'
    : 'radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.12) 0%, transparent 50%), linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)'
  };
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: ${props => props.$isDarkMode
      ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)'
    };
    top: -300px;
    left: -300px;
    animation: ${float} 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 800px;
    height: 800px;
    background: ${props => props.$isDarkMode
      ? 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)'
    };
    bottom: -400px;
    right: -400px;
    animation: ${float} 10s ease-in-out infinite reverse;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  position: relative;
  background: ${props => props.$isDarkMode
    ? '#1e293b'
    : '#ffffff'
  };
  border: 1px solid ${props => props.$isDarkMode
    ? 'rgba(148, 163, 184, 0.2)'
    : 'rgba(226, 232, 240, 0.8)'
  };
  border-radius: 32px;
  padding: 0;
  margin: 20px;
  box-shadow: ${props => props.$isDarkMode
    ? '0 32px 64px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(148, 163, 184, 0.05)'
    : '0 32px 64px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(148, 163, 184, 0.05)'
  };
  max-width: 900px;
  width: 100%;
  animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
  z-index: 10002;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(60px) scale(0.94);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 0;
  }
`;

const LeftPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: ${props => props.$isDarkMode
    ? 'rgba(30, 41, 59, 0.3)'
    : 'rgba(248, 250, 252, 0.5)'
  };
  border-right: 2px solid ${props => props.$isDarkMode
    ? 'rgba(148, 163, 184, 0.2)'
    : 'rgba(226, 232, 240, 0.8)'
  };
  border-radius: 32px 0 0 32px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: -1px;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      ${props => props.$isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'} 50%,
      transparent
    );
  }

  @media (max-width: 768px) {
    border-radius: 32px 32px 0 0;
    border-right: none;
    border-bottom: 2px solid ${props => props.$isDarkMode
      ? 'rgba(148, 163, 184, 0.2)'
      : 'rgba(226, 232, 240, 0.8)'
    };
    padding: 36px 24px;
    min-height: 200px;

    &::after {
      right: auto;
      top: auto;
      bottom: -1px;
      left: 20%;
      right: 20%;
      width: auto;
      height: 1px;
      background: linear-gradient(
        to right,
        transparent,
        ${props => props.$isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'} 50%,
        transparent
      );
    }
  }
`;

const RightPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 36px 28px;
  }
`;

const ModalHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 0;
  z-index: 1;
`;

const ModalAvatar = styled.div`
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  animation: ${pulse} 3s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ModalAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ModalTitle = styled.h2`
  color: ${props => props.$isDarkMode ? '#f1f5f9' : '#0f172a'};
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  text-align: center;
  letter-spacing: -0.03em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ModalSubtitle = styled.p`
  position: relative;
  color: ${props => props.$isDarkMode ? '#cbd5e1' : '#475569'};
  font-size: 1.0625rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.7;
  z-index: 1;
  opacity: 0.9;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
`;

const FormTitle = styled.h3`
  color: ${props => props.$isDarkMode ? '#f1f5f9' : '#0f172a'};
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.025em;
`;

const FormSubtitle = styled.p`
  color: ${props => props.$isDarkMode ? '#94a3b8' : '#64748b'};
  font-size: 0.9375rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.6;
`;

const OtpInputsContainer = styled.div`
  position: relative;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 28px;
  z-index: 1;
`;

const OtpInput = styled.input`
  width: 52px;
  height: 56px;
  border: 2px solid ${props => props.$isDarkMode
    ? 'rgba(148, 163, 184, 0.12)'
    : 'rgba(226, 232, 240, 0.6)'
  };
  border-radius: 16px;
  background: ${props => props.$isDarkMode
    ? 'rgba(15, 23, 42, 0.5)'
    : 'rgba(255, 255, 255, 0.9)'
  };
  color: ${props => props.$isDarkMode ? '#f1f5f9' : '#0f172a'};
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$isDarkMode
    ? 'inset 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05)'
    : 'inset 0 2px 6px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
  };

  &:hover {
    border-color: ${props => props.$isDarkMode
      ? 'rgba(139, 92, 246, 0.4)'
      : 'rgba(139, 92, 246, 0.5)'
    };
  }

  &:focus {
    outline: none;
    border-color: ${props => props.$isDarkMode ? '#a78bfa' : '#8b5cf6'};
    background: ${props => props.$isDarkMode
      ? 'rgba(15, 23, 42, 0.7)'
      : '#ffffff'
    };
    box-shadow: ${props => props.$isDarkMode
      ? '0 0 0 5px rgba(139, 92, 246, 0.2), 0 8px 24px rgba(139, 92, 246, 0.15)'
      : '0 0 0 5px rgba(139, 92, 246, 0.12), 0 8px 24px rgba(139, 92, 246, 0.1)'
    };
    transform: translateY(-2px) scale(1.05);
  }
`;

const VerifyButton = styled.button`
  position: relative;
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #6366f1 100%);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4),
              0 4px 8px rgba(236, 72, 153, 0.3),
              inset 0 2px 0 rgba(255, 255, 255, 0.25),
              inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #4f46e5 100%);
    background-size: 200% auto;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.01);
    background-position: right center;
    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.5),
                0 6px 16px rgba(236, 72, 153, 0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                inset 0 -2px 0 rgba(0, 0, 0, 0.1),
                0 0 60px rgba(139, 92, 246, 0.3);

    &::before {
      opacity: 1;
      background-position: right center;
    }

    &::after {
      width: 300px;
      height: 300px;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px) scale(0.99);
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4),
                0 2px 8px rgba(236, 72, 153, 0.3);
  }

  &:disabled {
    background: ${props => props.$isDarkMode
      ? 'linear-gradient(135deg, #475569 0%, #334155 100%)'
      : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)'
    };
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.5;
  }

  span {
    position: relative;
    z-index: 2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const ResendButton = styled.button`
  position: relative;
  width: 100%;
  padding: 12px 18px;
  background: ${props => props.$isDarkMode
    ? 'rgba(30, 41, 59, 0.5)'
    : 'rgba(248, 250, 252, 0.8)'
  };
  color: ${props => props.$isDarkMode ? '#94a3b8' : '#64748b'};
  border: 1px solid ${props => props.$isDarkMode
    ? 'rgba(148, 163, 184, 0.15)'
    : 'rgba(226, 232, 240, 0.8)'
  };
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 16px;
  z-index: 1;

  &:hover:not(:disabled) {
    background: ${props => props.$isDarkMode
      ? 'rgba(51, 65, 85, 0.6)'
      : 'rgba(241, 245, 249, 1)'
    };
    border-color: ${props => props.$isDarkMode
      ? 'rgba(148, 163, 184, 0.25)'
      : 'rgba(203, 213, 225, 1)'
    };
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
`;

const ErrorMessage = styled.div`
  color: ${props => props.$isDarkMode ? '#fca5a5' : '#dc2626'};
  font-size: 0.9375rem;
  font-weight: 600;
  margin-top: 20px;
  padding: 14px 18px;
  background: ${props => props.$isDarkMode
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.12) 100%)'
    : 'linear-gradient(135deg, rgba(254, 226, 226, 0.9) 0%, rgba(254, 202, 202, 0.8) 100%)'
  };
  border: 1.5px solid ${props => props.$isDarkMode
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(239, 68, 68, 0.4)'
  };
  border-radius: 12px;
  text-align: center;
  animation: ${shake} 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  box-shadow: ${props => props.$isDarkMode
    ? '0 4px 12px rgba(239, 68, 68, 0.15)'
    : '0 4px 12px rgba(239, 68, 68, 0.1)'
  };
`;

const OtpModal = ({
  onVerifyOtp,
  onResendOtp,
  loading,
  error,
  resendCooldown
}) => {
  const { isDarkMode } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerifyOtp(otpString);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <ModalOverlay $isDarkMode={isDarkMode}>
      <ModalContainer $isDarkMode={isDarkMode}>
        <LeftPanel $isDarkMode={isDarkMode}>
          <ModalHeader>
            <ModalAvatar $isDarkMode={isDarkMode}>
              <ModalAvatarImage
                src="/logo.png"
                alt="AI"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </ModalAvatar>
            <ModalTitle $isDarkMode={isDarkMode}>
              <ShinyText text="AI Agent" speed={3} />
            </ModalTitle>
            <ModalSubtitle $isDarkMode={isDarkMode}>
              Your Intelligent Business Assistant
            </ModalSubtitle>
          </ModalHeader>
        </LeftPanel>

        <RightPanel>
          <FormHeader>
            <FormTitle $isDarkMode={isDarkMode}>Verify OTP</FormTitle>
            <FormSubtitle $isDarkMode={isDarkMode}>
              Enter the 6-digit code sent to your WhatsApp
            </FormSubtitle>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <OtpInputsContainer>
              {otp.map((digit, index) => (
                <OtpInput
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  $isDarkMode={isDarkMode}
                  autoFocus={index === 0}
                />
              ))}
            </OtpInputsContainer>

            <VerifyButton
              type="submit"
              disabled={!isOtpComplete || loading}
              $isDarkMode={isDarkMode}
            >
              <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
            </VerifyButton>

            <ResendButton
              type="button"
              onClick={onResendOtp}
              disabled={resendCooldown > 0 || loading}
              $isDarkMode={isDarkMode}
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : 'Resend OTP'}
            </ResendButton>

            {error && (
              <ErrorMessage $isDarkMode={isDarkMode}>{error}</ErrorMessage>
            )}
          </form>
        </RightPanel>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default OtpModal;
