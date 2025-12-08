import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useTheme } from "../contexts/ThemeContext";
import { IoClose } from "react-icons/io5";
import { FaCrown } from "react-icons/fa";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #f5f5f5;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    border-radius: 12px;
    max-width: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  font-size: 20px;
  transition: all 0.2s ease;
  z-index: 1;
  padding: 0;

  svg {
    width: 20px;
    height: 20px;
    color: #333;
  }

  &:hover {
    background: #d0d0d0;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #f97316 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
`;

const CrownIcon = styled(FaCrown)`
  color: white;
  font-size: 40px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #d946ef;
  text-align: center;
  margin: 0 0 1rem 0;
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: #4b5563;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const PremiumFeatureModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose} aria-label="Close">
          <IoClose />
        </CloseButton>

        <IconContainer>
          <CrownIcon />
        </IconContainer>

        <Title>Premium Feature</Title>
        
        <Description>
          You can access this feature with a paid subscription.
        </Description>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PremiumFeatureModal;

