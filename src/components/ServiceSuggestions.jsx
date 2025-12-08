import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { FiMessageCircle } from 'react-icons/fi';

const Container = styled.div`
  width: 100%;
  max-width: 700px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  /* Responsive adjustments for mobile */
  @media (max-width: 768px) {
    margin-top: 0.75rem;
    gap: 0.4rem;
  }
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const QuestionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: ${props => props.$isDarkMode ? '#000000' : '#ffffff'};
  border: 1px solid ${props => props.$isDarkMode ? '#404040' : '#e5e7eb'};
  border-radius: 8px;
  color: ${props => props.$isDarkMode ? '#e5e7eb' : '#374151'};
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  svg {
    font-size: 1rem;
    color: ${props => props.$isDarkMode ? '#a1a1aa' : '#6b7280'};
    flex-shrink: 0;
  }
  
  &:hover {
    background: ${props => props.$isDarkMode ? '#111111' : '#f9fafb'};
    border-color: #8b5cf6;
    color: #8b5cf6;
    transform: translateY(-1px);
    
    svg {
      color: #8b5cf6;
    }
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
    padding: 0.75rem 0.875rem;
    gap: 0.625rem;
  }
`;

const questionsByPage = {
  'home': [
    'What is PlastiWorld?',
    'What are the dates for PlastiWorld 2026?',
    'When and where is PlastiWorld 2026 happening?',
    'How do I register as an exhibitor or as a buyer/visitor?'
  ],
  'project-information': [
    'What are the available unit sizes?',
    'When is the expected possession date?',
    'Is the project RERA-registered?',
    'What amenities are included?'
  ],
  'pricing-payment': [
    'What is the starting price of the units?',
    'Do you offer any payment schemes?',
    'Are there any current offers or discounts?',
    'What are the additional charges?'
  ],
  'location-connectivity': [
    'How far is the project from major landmarks?',
    'What schools and hospitals are nearby?',
    'Is public transport easily accessible?',
    'Are there upcoming developments in the area?'
  ]
};

const ServiceSuggestions = ({ onQuestionClick, isWelcomeMode, activePage }) => {
  const { isDarkMode } = useTheme();

  // Only show on welcome mode
  if (!isWelcomeMode) return null;

  // Get questions for the current page, default to home questions
  const questions = questionsByPage[activePage] || questionsByPage['home'];

  return (
    <Container>
      <QuestionsContainer>
        {questions.map((question, index) => (
          <QuestionButton
            key={index}
            $isDarkMode={isDarkMode}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuestionClick(question);
            }}
          >
            <FiMessageCircle />
            {question}
          </QuestionButton>
        ))}
      </QuestionsContainer>
    </Container>
  );
};

export default ServiceSuggestions;

