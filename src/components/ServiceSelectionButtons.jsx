import React from "react";
import styled from "styled-components";

const ServiceButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
  margin: 0.25rem 0 0.5rem 0;
  background: transparent;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 100%;
  justify-content: flex-start;
  align-items: center;

  /* Enhanced mobile responsiveness */
  @media (max-width: 1024px) {
    gap: 0.4rem;
    padding: 0.4rem 0;
    margin: 0.2rem 0 0.4rem 0;
  }

  @media (max-width: 768px) {
    gap: 0.35rem;
    padding: 0.35rem 0;
    margin: 0.15rem 0 0.35rem 0;
  }

  @media (max-width: 640px) {
    gap: 0.3rem;
    padding: 0.3rem 0;
    margin: 0.1rem 0 0.3rem 0;
  }

  @media (max-width: 480px) {
    gap: 0.25rem;
    padding: 0.25rem 0;
    margin: 0.05rem 0 0.25rem 0;
  }

  @media (max-width: 360px) {
    gap: 0.2rem;
    padding: 0.2rem 0;
    margin: 0 0 0.2rem 0;
  }
`;

const ServiceButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  color: #111827;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: none;

  /* Animation properties */
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.4s ease-in-out forwards;
  animation-delay: ${(props) => props.$delay || "0s"};

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-2px);
    background: #ffffff;
    border-color: #8b5cf6;
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.2);
    color: #7c3aed;
  }

  &:active {
    transform: translateY(0);
    background: #f9fafb;
    box-shadow: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  @media (max-width: 1024px) {
    padding: 0.45rem 0.9rem;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }

  @media (max-width: 640px) {
    padding: 0.35rem 0.7rem;
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.65rem;
  }

  @media (max-width: 360px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.6rem;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.div`
  text-align: center;
`;

const ServiceSelectionButtons = ({ onServiceClick, isVisible }) => {
  const services = [
    { text: "AI Website", value: "AI Website" },
    { text: "Supa Agent", value: "Supa Agent" },
    { text: "RCS Messaging", value: "RCS Messaging" },
  ];

  if (!isVisible) return null;

  return (
    <ServiceButtonsContainer>
      {services.map((service, index) => (
        <ServiceButton
          key={index}
          $delay={`${index * 0.1}s`}
          onClick={() => onServiceClick(service.value)}
        >
          <ButtonContent>
            <TextContainer>{service.text}</TextContainer>
          </ButtonContent>
        </ServiceButton>
      ))}
    </ServiceButtonsContainer>
  );
};

export default ServiceSelectionButtons;

