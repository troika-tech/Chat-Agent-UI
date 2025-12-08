# OTP Rate Limiting - Frontend Implementation

## Overview
This document describes the frontend implementation for handling OTP rate limiting. When users exceed the backend rate limit (3 OTP requests per 24 hours), the frontend displays a toast notification with the error message from the backend.

## Implementation Date
**Date**: 2025-10-28

---

## What Was Implemented

### Simple Toast-Based Approach
Instead of implementing complex UI components (counters, timers, banners), we opted for a **simple, elegant solution**: Display backend error messages as toast notifications.

### Why This Approach?
1. **Backend-Driven**: The backend already provides clear, user-friendly error messages
2. **Minimal Code**: No need for state management, countdown timers, or localStorage tracking
3. **Consistent UX**: Uses the existing toast notification system (react-toastify)
4. **Less Maintenance**: Single source of truth for rate limit logic (backend)
5. **User-Friendly**: Clear, actionable error messages

---

## Code Changes

### 1. Updated `useAuthentication.js` Hook
**File**: [src/hooks/useAuthentication.js](src/hooks/useAuthentication.js#L78-L87)

**Changes**:
- Added specific handling for 429 (rate limit) status codes
- Extract and display backend error message in toast

```javascript
// Handle rate limit (429) response
if (response.status === 429) {
  const rateLimitError = new Error(data.message || 'Rate limit exceeded');
  rateLimitError.rateLimitData = {
    attemptsRemaining: data.attemptsRemaining || 0,
    resetTime: data.resetTime,
    message: data.message
  };
  throw rateLimitError;
}
```

### 2. Updated `AuthContext.jsx`
**File**: [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx#L158-L167)

**Changes**:
- Added same 429 handling as useAuthentication.js
- Ensures consistent behavior across the app

```javascript
// Handle rate limit (429) response
if (response.status === 429) {
  const rateLimitError = new Error(data.message || 'Rate limit exceeded');
  rateLimitError.rateLimitData = {
    attemptsRemaining: data.attemptsRemaining || 0,
    resetTime: data.resetTime,
    message: data.message
  };
  throw rateLimitError;
}
```

### 3. Toast Display in `SupaChatbot.jsx`
**File**: [src/components/SupaChatbot.jsx](src/components/SupaChatbot.jsx#L1510-L1520)

**Existing Code** (No changes needed):
```javascript
const handleSendOtpNew = async (phoneNumber) => {
  try {
    setCurrentAuthValue(phoneNumber);
    await sendOtp(phoneNumber);
    setShowInlineAuthInput(false);
    setShowOtpInput(true);
    toast.success('OTP sent to your WhatsApp!');
  } catch (error) {
    toast.error(error.message || 'Failed to send OTP'); // ← Shows rate limit message
  }
};
```

The existing error handling automatically displays the backend's rate limit message!

---

## How It Works

### Normal Flow (No Rate Limit)
1. User enters phone number and clicks "Send OTP"
2. Frontend calls `/whatsapp-otp/send` endpoint
3. Backend responds with 200 OK
4. Toast displays: ✅ "OTP sent to your WhatsApp!"

### Rate Limited Flow (Exceeded 3 Attempts)
1. User enters phone number and clicks "Send OTP"
2. Frontend calls `/whatsapp-otp/send` endpoint
3. Backend responds with 429 (Rate Limit Exceeded)
4. Backend response:
   ```json
   {
     "message": "Rate limit exceeded. You have requested OTP 3 times in the last 24 hours. Please try again in 5 hour(s).",
     "attemptsRemaining": 0,
     "resetTime": "2025-10-29T12:00:00.000Z"
   }
   ```
5. Frontend extracts `data.message` and throws error
6. Toast displays: ⛔ "Rate limit exceeded. You have requested OTP 3 times in the last 24 hours. Please try again in 5 hour(s)."

---

## Backend API Contract

### Expected Response Format

#### Success Response (200 OK)
```json
{
  "message": "OTP sent successfully to +1234567890",
  "attemptsRemaining": 2,
  "maxAttempts": 3
}
```

#### Rate Limit Response (429 Too Many Requests)
```json
{
  "message": "Rate limit exceeded. You have requested OTP 3 times in the last 24 hours. Please try again in 5 hour(s).",
  "attemptsRemaining": 0,
  "resetTime": "2025-10-29T12:00:00.000Z"
}
```

#### Error Response (500 Internal Server Error)
```json
{
  "message": "Failed to send OTP"
}
```

---

## User Experience

### What Users See

#### Scenario 1: First OTP Request
- User enters phone number
- Clicks "Send OTP"
- Toast appears: ✅ "OTP sent to your WhatsApp!"

#### Scenario 2: Second/Third OTP Request
- User enters phone number
- Clicks "Resend OTP"
- Toast appears: ✅ "OTP sent to your WhatsApp!"

#### Scenario 3: Rate Limit Exceeded (4th Request)
- User enters phone number
- Clicks "Send OTP"
- Toast appears: ⛔ "Rate limit exceeded. You have requested OTP 3 times in the last 24 hours. Please try again in 5 hour(s)."
- Message stays visible for 5 seconds
- User can clearly understand why they can't request OTP and when they can retry

---

## Testing

### Manual Testing Steps

#### Test 1: Normal OTP Request
1. Open the application
2. Enter a valid phone number: `+1234567890`
3. Click "Send OTP"
4. **Expected**: Green toast with "OTP sent to your WhatsApp!"

#### Test 2: Rate Limit Exceeded
1. Request OTP 3 times within 24 hours
2. Try to request OTP a 4th time
3. **Expected**: Red toast with rate limit message including wait time
4. **Example**: "Rate limit exceeded. You have requested OTP 3 times in the last 24 hours. Please try again in 5 hour(s)."

#### Test 3: Network Error
1. Disconnect internet
2. Try to send OTP
3. **Expected**: Red toast with "Failed to send OTP"

### Testing with Mock Backend Response

To test the rate limit handling without hitting actual limits, you can temporarily mock the response:

```javascript
// In useAuthentication.js, temporarily replace the fetch call:
const response = {
  status: 429,
  ok: false,
  json: async () => ({
    message: "Rate limit exceeded. You have requested OTP 3 times in the last 24 hours. Please try again in 5 hour(s).",
    attemptsRemaining: 0,
    resetTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString()
  })
};
```

---

## Advantages of This Implementation

### 1. Simplicity
- ✅ Only ~10 lines of code changed
- ✅ No new components created
- ✅ No complex state management
- ✅ No localStorage tracking

### 2. Maintainability
- ✅ Backend controls the message content
- ✅ Easy to update error messages
- ✅ No frontend/backend sync issues
- ✅ Single source of truth

### 3. User Experience
- ✅ Clear, actionable error messages
- ✅ Includes exact wait time
- ✅ Consistent with other app errors
- ✅ Non-intrusive (toast notification)

### 4. Flexibility
- ✅ Easy to add more details later (e.g., attempts remaining)
- ✅ Backend can customize messages per user type
- ✅ Supports internationalization (i18n) at backend level

---

## Future Enhancements (Optional)

If more advanced UI is needed in the future, consider:

### 1. Proactive Attempts Counter
- Show remaining attempts before user hits limit
- **Example**: "2 attempts remaining today"
- **Location**: Below "Send OTP" button

### 2. Countdown Timer
- Show real-time countdown when rate limited
- **Example**: "Try again in 4 hours 32 minutes"
- **Updates**: Every minute

### 3. Visual Indicators
- Color-coded banners (green → yellow → orange → red)
- Icon changes based on attempts remaining
- Progress bar showing rate limit status

### 4. Persistent State
- Store attempts in localStorage
- Sync across tabs using localStorage events
- Show countdown even after page refresh

---

## Code Locations Reference

| Component | File Path | Lines | Purpose |
|-----------|-----------|-------|---------|
| OTP Sending (Hook) | [src/hooks/useAuthentication.js](src/hooks/useAuthentication.js) | 78-87 | Handles rate limit errors from backend |
| OTP Sending (Context) | [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx) | 158-167 | Handles rate limit errors in context |
| Error Display | [src/components/SupaChatbot.jsx](src/components/SupaChatbot.jsx) | 1517-1518 | Displays error toast to user |
| Resend Handler | [src/components/SupaChatbot.jsx](src/components/SupaChatbot.jsx) | 1556-1557 | Displays resend error toast |

---

## Troubleshooting

### Issue 1: Toast Not Appearing
**Symptom**: Rate limit reached but no toast shows

**Check**:
1. Verify `react-toastify` is installed: `npm list react-toastify`
2. Verify `ToastContainer` is rendered in App.jsx or SupaChatbot.jsx
3. Check browser console for errors

**Solution**:
```bash
npm install react-toastify
```

### Issue 2: Wrong Error Message Displayed
**Symptom**: Generic error instead of rate limit message

**Check**:
1. Verify backend returns proper 429 status code
2. Check backend response includes `message` field
3. Verify error handling extracts `data.message`

**Debug**:
```javascript
// Add logging in useAuthentication.js
console.log('Response status:', response.status);
console.log('Response data:', data);
```

### Issue 3: Error Message Not User-Friendly
**Symptom**: Technical error instead of friendly message

**Solution**: Update backend to return clear, user-friendly messages:
- ❌ Bad: "ERR_RATE_LIMIT_EXCEEDED"
- ✅ Good: "Rate limit exceeded. Please try again in 5 hours."

---

## API Endpoints Used

### WhatsApp OTP
- **Endpoint**: `POST /whatsapp-otp/send`
- **Auth Required**: No
- **Rate Limited**: Yes (3 per 24 hours)

### Email OTP
- **Endpoint**: `POST /otp/request-otp`
- **Auth Required**: No
- **Rate Limited**: Yes (3 per 24 hours)

---

## Dependencies

### Required
- `react-toastify`: ^9.x.x - Toast notification library

### No New Dependencies Added
This implementation uses existing dependencies only.

---

## Conclusion

The OTP rate limiting frontend implementation is **complete and production-ready**. It provides:
- ✅ Clear error communication to users
- ✅ Minimal code changes
- ✅ Easy maintenance
- ✅ Consistent UX
- ✅ Backend-driven messaging

**No additional UI components are needed** unless product requirements change to show proactive warnings or countdown timers.

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-28 | 1.0 | Initial implementation - Toast-based rate limit error handling |

---

## Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Developer | Claude | ✅ Implemented | 2025-10-28 |
| Code Review | - | Pending | - |
| QA Testing | - | Pending | - |
| Product Owner | - | Pending | - |

---

**Document End**
