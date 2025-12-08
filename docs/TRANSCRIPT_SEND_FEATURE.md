# Conversation Transcript Send Feature

## Overview

The **Conversation Transcript Send Feature** automatically generates and sends conversation transcripts to users via WhatsApp after 30 seconds of inactivity. This feature has been replicated exactly from `Troika-AI-Website` and integrated into `Exhibition-SupaAgent`.

## How It Works

### 1. **Inactivity Detection** ⏰
- The system monitors user activity in the chatbot
- After **30 seconds of inactivity**, a transcript is automatically generated and sent
- The timer resets every time:
  - A new message is added to the chat
  - The user sends a message
  - The chat history is updated

### 2. **Transcript Generation & Sending** 📄
When inactivity is detected:
1. The current chat history is collected
2. Messages are formatted with sender (User/Assistant), text, and timestamp
3. A POST request is sent to the backend API endpoint
4. The backend generates a PDF and sends it to WhatsApp
5. An S3 URL is returned with the generated transcript

### 3. **Message Format** 📋
Each message in the transcript is formatted as:
```json
{
  "sender": "User" or "Assistant",
  "text": "Message content",
  "timestamp": "ISO 8601 timestamp"
}
```

## Files Added/Modified

### New Files Created:

#### 1. **`src/services/conversationTranscriptService.js`**
Service class for handling transcript API calls to the backend.

**Main Methods:**
- `sendConversationTranscript(phoneNumber, chatHistory, sessionId, chatbotId, apiBase)`
  - Sends the conversation transcript to WhatsApp via backend
  - Returns: `{ success, message, data, s3Url, messageCount }`
  
- `checkS3Status(apiBase)`
  - Verifies S3 connectivity
  - Returns: `{ success, accessible, message }`
  
- `getActiveTimers(apiBase)`
  - Gets count of active inactivity timers
  - Returns: `{ success, activeTimers, message }`

#### 2. **`src/services/frontendInactivityManager.js`**
Singleton class managing inactivity timers for each chat session.

**Main Methods:**
- `startInactivityTimer(sessionId, phone, chatbotId, chatHistory, apiBase)`
  - Starts a 30-second timer for the session
  
- `resetInactivityTimer(sessionId, phone, chatbotId, chatHistory, apiBase)`
  - Clears and restarts the inactivity timer
  
- `handleInactivity(sessionId, phone, chatbotId, chatHistory, apiBase)`
  - Called when 30 seconds have passed without activity
  - Triggers transcript send via `conversationTranscriptService`
  
- `clearInactivityTimer(sessionId)`
  - Stops the timer for a specific session
  
- `clearAllTimers()`
  - Stops all active timers
  
- `getActiveTimerCount()`
  - Returns number of active inactivity timers

### Modified Files:

#### **`src/components/SupaChatbot.jsx`**
**Changes:**
1. Added import:
   ```javascript
   import frontendInactivityManager from "../services/frontendInactivityManager";
   ```

2. Added useEffect hook (after line 332):
   ```javascript
   useEffect(() => {
     // Only start timer if verified and there's chat history
     if (verified && phone && sessionId && chatbotId && chatHistory.length > 0) {
       console.log('⏰ Resetting inactivity timer due to chat update');
       frontendInactivityManager.resetInactivityTimer(
         sessionId,
         phone,
         chatbotId,
         chatHistory,
         apiBase
       );
     }

     // Cleanup timer when component unmounts
     return () => {
       if (sessionId) {
         frontendInactivityManager.clearInactivityTimer(sessionId);
       }
     };
   }, [chatHistory, verified, phone, sessionId, chatbotId, apiBase]);
   ```

## Backend API Routes Required

The feature uses the following backend endpoints:

### 1. **Send Transcript Endpoint**
```
POST /conversation-transcript/send
```

**Request Body:**
```json
{
  "sessionId": "string",
  "phone": "string (phone number)",
  "chatbotId": "string",
  "customMessage": "string",
  "chatHistory": [
    {
      "sender": "User" or "Assistant",
      "text": "string",
      "timestamp": "ISO 8601 timestamp"
    }
  ]
}
```

**Response:**
```json
{
  "success": boolean,
  "result": "object (PDF metadata)",
  "s3Url": "string (URL to generated PDF)",
  "messageCount": number
}
```

### 2. **S3 Status Check Endpoint** (Optional)
```
GET /conversation-transcript/s3-status
```

**Response:**
```json
{
  "success": boolean,
  "s3Accessible": boolean,
  "message": "string"
}
```

### 3. **Active Timers Endpoint** (Optional)
```
GET /conversation-transcript/timers
```

**Response:**
```json
{
  "success": boolean,
  "activeTimers": number,
  "message": "string"
}
```

## Configuration

### Inactivity Timeout
The default timeout is **30 seconds** (30000 milliseconds). To modify this:

Edit `src/services/frontendInactivityManager.js`:
```javascript
class FrontendInactivityManager {
  constructor() {
    this.activeTimers = new Map();
    this.INACTIVITY_TIMEOUT = 30000; // Change this value in milliseconds
  }
  // ...
}
```

## Usage Example

The feature works automatically once integrated:

```javascript
// In SupaChatbot.jsx, the useEffect automatically:
// 1. Detects when chat history changes
// 2. Resets the 30-second inactivity timer
// 3. After 30 seconds of no activity, sends the transcript
// 4. Cleans up timers when component unmounts
```

## Console Logs

The feature provides detailed console logging for debugging:

```
⏰ Starting inactivity timer for session: <sessionId>
📱 Sending conversation transcript via backend API...
📤 Sending to backend API: {...}
📥 Backend API response: {...}
✅ Conversation transcript sent successfully for session: <sessionId>
📱 PDF URL: <s3Url>
```

## Error Handling

The service handles errors gracefully:

```javascript
return {
  success: false,
  message: 'Failed to send conversation transcript. Please try again.',
  error: error.message
};
```

All errors are logged to the console with emoji prefixes for easy debugging.

## Features

✅ **Automatic**: No user action required  
✅ **Configurable**: Adjustable timeout period  
✅ **Persistent**: Session-based tracking  
✅ **Clean**: Automatic cleanup on unmount  
✅ **Resilient**: Error handling with fallbacks  
✅ **Observable**: Comprehensive console logging  

## Testing

To test the feature:

1. **Start a chat conversation** with the chatbot
2. **Wait 30 seconds** without sending any messages
3. **Check WhatsApp** - the transcript should be received
4. **Check browser console** for debug logs confirming the send

### Manual Test with Console:
```javascript
// In browser console, manually trigger:
frontendInactivityManager.handleInactivity(
  sessionId,
  phone,
  chatbotId,
  chatHistory,
  apiBase
);
```

## Compatibility

- ✅ Works with verified users (phone-verified via OTP)
- ✅ Tracks across multiple chat sessions
- ✅ Handles multiple simultaneous users
- ✅ Works on mobile and desktop
- ✅ Responsive to route changes

## Notes

- The feature only activates when the user is **verified** (has completed phone verification)
- The feature tracks each **session independently**
- **Timers are cleaned up** when the component unmounts to prevent memory leaks
- The feature **resets the timer** every time chat history is updated
- The **phone number** is used for WhatsApp delivery

## Future Enhancements

Possible improvements:
- Add manual "Send Transcript" button
- Add customizable transcript formats (PDF, HTML, TXT)
- Add transcript scheduling options
- Add transcript email delivery option
- Add transcript history/archive
- Add transcript preview before sending
