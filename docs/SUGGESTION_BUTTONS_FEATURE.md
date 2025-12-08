# Suggestion Buttons Feature

## Overview
This feature adds suggestion buttons below each bot response in the SupaChatbot component. The backend provides 2-3 suggestions with each response, and these are displayed as clickable buttons that allow users to quickly send follow-up questions.

## Implementation Details

### Backend Response Format
The backend now returns suggestions in the following format:
```json
{
  "answer": "We offer 24/7 support, analytics, and multi-language chatbots.",
  "suggestions": [
    "What languages are supported?",
    "How does the analytics work?",
    "What are the pricing plans?"
  ],
  "tokens": 150,
  "sessionId": "abc-123"
}
```

### Components Added/Modified

#### 1. SuggestionButtons Component (`src/components/SuggestionButtons.jsx`)
- New component that renders suggestion buttons
- Styled with hover effects and responsive design
- Supports dark/light theme
- Maximum 3 suggestions displayed
- Buttons are truncated with ellipsis for long text

#### 2. MessageBubbleComponent (`src/components/MessageBubble.jsx`)
- Added import for SuggestionButtons component
- Added `onSuggestionClick` prop
- Renders SuggestionButtons below bot messages when suggestions are available
- Only shows for bot messages (not user messages)

#### 3. SupaChatbot Component (`src/components/SupaChatbot.jsx`)
- Modified backend response handling to extract and store suggestions
- Added `handleBotSuggestionClick` function to handle suggestion button clicks
- Passes suggestion click handler to MessageBubbleComponent
- Suggestions are stored in chat history with each bot message

### Features

1. **Responsive Design**: Buttons adapt to different screen sizes
2. **Theme Support**: Works with both dark and light themes
3. **Smooth Animations**: Buttons appear with a slide-up animation
4. **Accessibility**: Proper hover states and click feedback
5. **Mobile Optimized**: Smaller buttons and spacing on mobile devices
6. **Text Truncation**: Long suggestion text is truncated with ellipsis

### Usage

When the backend returns a response with suggestions, they will automatically appear as clickable buttons below the bot's message. Users can click any suggestion to send it as their next message.

### Styling

The suggestion buttons use the same beautiful gradient border design as the existing ServiceSelectionButtons:
- **Gradient Border**: Beautiful gradient border effect using #20E3B2 to #8B5CF6 colors
- **Theme Support**: Adapts to both light and dark themes
- **Hover Effects**: Smooth lift animation with enhanced shadow
- **Mobile Responsive**: Fully responsive with smaller padding and font sizes on mobile devices
- **Staggered Animation**: Each button appears with a 0.1s delay for a cascading effect

### Animation

Suggestion buttons appear with a staggered fadeInUp animation:
- Each button has a 0.1s delay increment (0s, 0.1s, 0.2s)
- Smooth slide-up animation with fade-in effect
- Hover effects include lift animation and enhanced shadows
- Matches the existing ServiceSelectionButtons animation pattern
