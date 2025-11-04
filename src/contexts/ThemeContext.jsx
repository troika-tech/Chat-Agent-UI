import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('chatbot_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('chatbot_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      // Dark mode colors
      background: '#1a1a1a',
      backgroundGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      backgroundPattern: `
        radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
      `,
      chatbox: '#1f1f1f',
      header: 'linear-gradient(135deg, #6b46c1 0%, #be185d 50%, #b45309 100%)',
      inputBg: '#2d2d2d',
      inputBorder: '#4a4a4a',
      inputText: '#ffffff',
      inputPlaceholder: '#999',
      inputFocusBg: '#2d2d2d',
      messageUser: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      messageBot: '#2d2d2d',
      messageUserText: '#ffffff',
      messageBotText: '#e5e7eb',
      border: '#404040',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      feature: '#a0a0a0',
    } : {
      // Light mode colors
      background: '#ffffff',
      backgroundGradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #fef3c7 100%)',
      backgroundPattern: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
      `,
      chatbox: '#ffffff',
      header: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
      inputBg: '#f8f9fa',
      inputBorder: '#e5e7eb',
      inputText: '#000',
      inputPlaceholder: '#666',
      inputFocusBg: '#ffffff',
      messageUser: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      messageBot: '#f3f4f6',
      messageUserText: '#ffffff',
      messageBotText: '#1f2937',
      border: '#e5e7eb',
      text: '#000000',
      textSecondary: '#6b7280',
      feature: '#6b7280',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
