import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { FiMessageCircle } from 'react-icons/fi';

const SuggestionsContainer = styled.div`
  position: absolute;
  ${props => props.$showBelow ? 'top: 100%;' : 'bottom: 100%;'}
  left: 0;
  right: 0;
  ${props => props.$showBelow ? 'margin-top: 0.5rem;' : 'margin-bottom: 0.5rem;'}
  background: ${props => props.$isDarkMode ? '#27272a' : '#ffffff'};
  border: 1px solid ${props => props.$isDarkMode ? '#3f3f46' : '#e5e7eb'};
  border-radius: 12px;
  box-shadow: ${props => props.$isDarkMode 
    ? '0 10px 25px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.3)' 
    : '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)'};
  max-height: 220px;
  overflow-y: auto;
  z-index: 1000;
  animation: ${props => props.$showBelow ? 'slideDown' : 'slideUp'} 0.2s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
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

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.$isDarkMode ? '#18181b' : '#f3f4f6'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.$isDarkMode ? '#52525b' : '#d1d5db'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.$isDarkMode ? '#71717a' : '#9ca3af'};
  }

  @media (max-width: 768px) {
    max-height: 180px;
  }

  @media (max-width: 480px) {
    max-height: 160px;
  }
`;

const SuggestionItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: ${props => props.$isDarkMode ? '#e5e7eb' : '#374151'};
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#3f3f46' : '#f3f4f6'};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.$isDarkMode ? '#3f3f46' : '#f9fafb'};
    color: #8b5cf6;
  }

  &:active {
    background: ${props => props.$isDarkMode ? '#52525b' : '#f3f4f6'};
  }

  svg {
    flex-shrink: 0;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
`;

// Default suggestions shown on click/focus
const defaultSuggestions = [
  'What is Troika Tech?',
  'How can AI help my business?',
  'What services does Troika Tech offer?'
];

// Smart suggestion database - All available suggestions
const suggestionDatabase = {
  general: [
    'What is Troika Tech?',
    'What services does Troika Tech offer?',
    'What is AI automation?',
    'What are the benefits of AI agents?',
    'How does AI automation work?',
    'How can AI help my business?',
    'How do I get started?',
    'How much do AI services cost?'
  ],
  aiWebsite: [
    'What is an AI Website?',
    'How can AI Websites help grow my business?',
    'What features does an AI Website include?',
    'How much does an AI Website cost?',
    'Can I customize my AI Website design?'
  ],
  aiCalling: [
    'How does the AI Calling Agent work?',
    'Can AI Calling Agent handle multiple calls simultaneously?',
    'What languages does the AI Calling Agent support?',
    'How much does AI Calling Agent cost?'
  ],
  pricing: [
    'What is the pricing for AI Websites?',
    'What is the pricing for AI Calling Agent?',
    'Do you offer custom pricing plans?'
  ],
  other: [
    'Can I get a demo?',
    'Do you offer a free trial?',
    'What kind of support do you provide?',
    'How long does setup take?'
  ]
};

const AutoSuggestions = ({ inputValue, onSuggestionClick, isWelcomeMode = false, showBelow = false }) => {
  const { isDarkMode } = useTheme();
  const [suggestions, setSuggestions] = useState([]); // Always start empty

  useEffect(() => {
    // Never show default suggestions on focus/click - only when actively typing
    if (!inputValue || inputValue.trim().length < 1) {
      setSuggestions([]); // Always empty for empty input
      return;
    }

    const searchTerm = inputValue.toLowerCase().trim();
    
    // Get all suggestions from database
    const allSuggestions = Object.values(suggestionDatabase).flat();
    
    // Find suggestions that START with what user is typing (exact match)
    // User types: "How can" → matches "How can AI help my business?"
    // User types: "How can AI Websites" → does NOT match "How can AI help my business?"
    const matches = allSuggestions.filter(suggestion => {
      const suggestionLower = suggestion.toLowerCase();
      // Must start with exact typed text
      return suggestionLower.startsWith(searchTerm);
    });

    // If matches found, show them; otherwise hide
    if (matches.length > 0) {
      setSuggestions(matches.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [inputValue, isWelcomeMode]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <SuggestionsContainer $isDarkMode={isDarkMode} $showBelow={showBelow}>
      {suggestions.map((suggestion, index) => (
        <SuggestionItem
          key={index}
          $isDarkMode={isDarkMode}
          onClick={() => onSuggestionClick(suggestion)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <FiMessageCircle size={14} />
          <span>{suggestion}</span>
        </SuggestionItem>
      ))}
    </SuggestionsContainer>
  );
};

export default AutoSuggestions;

