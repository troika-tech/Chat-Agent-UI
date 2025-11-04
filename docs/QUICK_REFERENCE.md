# Transcript Send Feature - Quick Reference

## 🚀 Quick Start

The transcript send feature is **already integrated** and works automatically!

### What it does:
- ⏰ Waits 30 seconds after last chat activity
- 📄 Generates a PDF transcript of the conversation
- 📱 Sends it to user's WhatsApp automatically

## 📁 Files Created

```
src/services/
├── conversationTranscriptService.js    # Backend API communication
└── frontendInactivityManager.js        # Timer & inactivity logic

Documentation:
├── TRANSCRIPT_SEND_FEATURE.md          # Full documentation
├── IMPLEMENTATION_SUMMARY.md           # What was replicated
└── QUICK_REFERENCE.md                  # This file
```

## 🔧 Modified Files

```
src/components/SupaChatbot.jsx
└── + import frontendInactivityManager
└── + useEffect for inactivity timer
```

## 📝 Backend Requirements

Your backend must implement this endpoint:

```
POST /conversation-transcript/send

Body: {
  sessionId: string,
  phone: string,
  chatbotId: string,
  customMessage: string,
  chatHistory: [{sender, text, timestamp}]
}

Response: {
  success: boolean,
  s3Url: string,
  messageCount: number
}
```

## 🎯 How It Works

```
User sends message
        ↓
chatHistory updates
        ↓
useEffect detects change
        ↓
Inactivity timer starts (30 seconds)
        ↓
If no activity for 30 seconds:
        ↓
sendConversationTranscript() called
        ↓
Backend generates PDF
        ↓
Sent to WhatsApp
        ✅ Done
```

## 🧪 Testing

### Automatic
1. Send messages to chatbot
2. Wait 30 seconds
3. Check WhatsApp for PDF

### Manual (Console)
```javascript
frontendInactivityManager.handleInactivity(
  sessionId,
  phone,
  chatbotId,
  chatHistory,
  apiBase
);
```

## ⚙️ Configuration

### Change Timeout (30 seconds → 60 seconds)

Edit `src/services/frontendInactivityManager.js`:

```javascript
this.INACTIVITY_TIMEOUT = 60000; // milliseconds
```

## 🐛 Debugging

### Check Status
```javascript
// In browser console:
console.log('Active timers:', 
  frontendInactivityManager.getActiveTimerCount());
```

### View Logs
```
✅ Transcript sent successfully
📱 PDF URL: https://s3.amazonaws.com/...
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Not sending | Check backend endpoint exists |
| No logs | Check user is verified |
| No history | Check chat has messages |
| Timer issues | Check useEffect dependencies |

## 📞 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/conversation-transcript/send` | POST | Send transcript |
| `/conversation-transcript/s3-status` | GET | Check S3 (optional) |
| `/conversation-transcript/timers` | GET | Get timer count (optional) |

## 🔑 Key Variables

```javascript
// In SupaChatbot.jsx useEffect:
chatHistory      // Conversation history
phone            // User's WhatsApp number  
sessionId        // Unique session ID
chatbotId        // Chatbot identifier
apiBase          // Backend URL
verified         // User verification status
```

## ✅ Checklist

- [x] Services created
- [x] SupaChatbot integrated
- [x] Timer logic implemented
- [x] Error handling added
- [x] Console logging added
- [x] Documentation complete
- [ ] Backend endpoint implemented (YOUR TODO)
- [ ] Testing verified (YOUR TODO)

## 🎓 Understanding the Flow

### Service Layer (conversationTranscriptService.js)
```javascript
// Handles API calls
sendConversationTranscript(phone, chatHistory, sessionId, chatbotId, apiBase)
  → Formats data
  → Posts to /conversation-transcript/send
  → Returns response
```

### Timer Layer (frontendInactivityManager.js)
```javascript
// Manages 30-second timers
resetInactivityTimer(...)
  → Clears old timer
  → Sets new 30-second timer
  → Calls sendConversationTranscript when done
```

### Component Layer (SupaChatbot.jsx)
```javascript
// Triggers timer on chat updates
useEffect(() => {
  if (verified && phone && sessionId && chatHistory.length > 0) {
    frontendInactivityManager.resetInactivityTimer(...)
  }
})
```

## 📦 No Additional Dependencies

The feature uses:
- ✅ Native `fetch()` API
- ✅ `setTimeout()` for timers
- ✅ React hooks (`useEffect`)
- ✅ No extra npm packages needed

## 🚀 Deployment Steps

1. Deploy Exhibition-SupaAgent frontend
2. Ensure backend has `/conversation-transcript/send` endpoint
3. Test with 30-second wait
4. Verify WhatsApp delivery
5. Monitor console logs

## 📊 Feature Status

| Component | Status |
|-----------|--------|
| Frontend Services | ✅ Complete |
| React Integration | ✅ Complete |
| Backend Routes | ⏳ Your turn |
| Testing | ⏳ Your turn |
| Monitoring | ⏳ Your turn |

## 💡 Tips

- Feature only works for **verified users**
- Timer **resets on every message**
- **Cleans up automatically** on unmount
- **Multiple timers** can run simultaneously
- **Logging enabled** by default

## 🔗 Related Files

- Full docs: `TRANSCRIPT_SEND_FEATURE.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Service code: `src/services/conversationTranscriptService.js`
- Timer logic: `src/services/frontendInactivityManager.js`
- Integration: `src/components/SupaChatbot.jsx` (lines ~335-353)

## ❓ Questions?

Check the full documentation files for:
- Detailed API specs
- Error handling info
- Testing procedures
- Troubleshooting guides
- Future enhancements
