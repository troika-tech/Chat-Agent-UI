# Authentication Integration Guide

This document explains how authentication works in the application and how to use it in your components.

## Architecture Overview

### Frontend (React)
- **AuthContext**: Global authentication state management
- **API Client**: Automatic JWT token injection for API requests
- **Token Storage**: localStorage with 24-hour JWT tokens

### Backend (Node.js/Express)
- **JWT Authentication**: Token-based authentication with 24-hour expiry
- **Middleware**: `authenticateJWT` for protected routes
- **Endpoints**: OTP send/verify, token validation, logout

---

## How It Works

### 1. User Login Flow

```
User enters phone number
       ↓
Frontend sends OTP via WhatsApp
       ↓
User enters OTP
       ↓
Backend verifies OTP & generates JWT token
       ↓
Frontend stores token + expiry in localStorage
       ↓
User is authenticated for 24 hours
```

### 2. Token Storage Format

```javascript
// localStorage key: 'chatbot_auth'
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userInfo": {
    "userId": "user_123",
    "phone": "+1234567890",
    "chatbotId": "68f1dfa097793a45f3951812"
  },
  "issuedAt": 1729423200000,   // Backend timestamp
  "expiresAt": 1729509600000   // Backend timestamp (issuedAt + 24 hours)
}
```

### 3. Session Persistence

- **On page load**: Frontend checks localStorage for token
- **Validation**: Calls backend `/auth/validate-token` to verify
- **Auto-login**: If valid, user is authenticated automatically
- **Expiry**: After 24 hours, token expires and user must re-authenticate

---

## Using Authentication in Components

### Access Auth State

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const {
    isAuthenticated,    // boolean - is user logged in?
    authToken,          // string - JWT token
    userInfo,           // object - user data (phone, userId, chatbotId)
    loading,            // boolean - is auth check in progress?
    logout              // function - logout user
  } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {userInfo.phone}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Making API Requests with Authentication

### Option 1: Using API Client (Recommended)

The API client automatically adds the Authorization header:

```javascript
import { apiPost, apiGet } from '../utils/apiClient';

async function sendChatMessage(message) {
  try {
    const response = await apiPost('https://api.0804.in/api/chat/send', {
      message: message,
      timestamp: Date.now()
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat error:', error);
    // If 401, user will be auto-logged out
  }
}

async function getChatHistory() {
  try {
    const response = await apiGet('https://api.0804.in/api/chat/history');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('History error:', error);
  }
}
```

**Available Methods:**
- `apiGet(url, options)` - GET request
- `apiPost(url, data, options)` - POST request
- `apiPut(url, data, options)` - PUT request
- `apiDelete(url, options)` - DELETE request
- `publicFetch(url, options)` - Fetch without auth header

### Option 2: Manual Authorization Header

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { authToken } = useAuth();

  async function makeRequest() {
    const response = await fetch('https://api.0804.in/api/protected', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: 'example' })
    });

    if (response.status === 401) {
      // Token expired, user will be logged out
      console.error('Unauthorized');
      return;
    }

    const data = await response.json();
    return data;
  }

  return <button onClick={makeRequest}>Make Request</button>;
}
```

---

## Backend Integration

### Protected Route Example

```javascript
const { authenticateJWT } = require('../middleware/jwtAuthMiddleware');

// This route requires authentication
router.post('/chat/send', authenticateJWT, async (req, res) => {
  // User data is available in req.user
  const { userId, phone, chatbotId } = req.user;

  // Your logic here...

  res.json({
    success: true,
    message: 'Chat message received'
  });
});
```

### Backend Middleware Behavior

- **Valid token**: Request proceeds, `req.user` contains decoded JWT data
- **Invalid/expired token**: Returns `401 Unauthorized`
- **Missing token**: Returns `401 Unauthorized`

---

## Automatic 401 Handling

The API client automatically handles 401 responses:

1. **401 Detected** → Clears localStorage
2. **Dispatches logout event** → AuthContext updates state
3. **Reloads page** → User sees auth modal

**This means you don't need to manually handle session expiry in your components!**

---

## Testing Authentication

### Test Session Persistence

1. Login with OTP
2. Open DevTools → Application → Local Storage
3. Find `chatbot_auth` key
4. Refresh the page → Should stay logged in ✅
5. Close browser and reopen → Should stay logged in ✅

### Test Token Expiry

**Option 1: Manually expire token**
```javascript
// In browser console:
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
auth.expiresAt = Date.now() - 1000; // Set to past
localStorage.setItem('chatbot_auth', JSON.stringify(auth));
location.reload(); // Should show auth modal
```

**Option 2: Wait 24 hours** (not recommended 😄)

### Test 401 Handling

```javascript
// Corrupt the token
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
auth.token = 'invalid_token';
localStorage.setItem('chatbot_auth', JSON.stringify(auth));

// Make any API request → Should auto-logout
```

---

## Security Best Practices

### ✅ DO
- Use the API client for all authenticated requests
- Store tokens only in localStorage (not cookies or sessionStorage)
- Let the backend control token expiry times
- Handle network errors gracefully

### ❌ DON'T
- Don't store sensitive data beyond phone/userId
- Don't modify token expiry on the frontend
- Don't send tokens in URL parameters
- Don't log tokens to console in production

---

## Debugging

### Enable Debug Logs

All auth operations log to the console with emojis:

- 🔍 - Checking authentication
- ✅ - Success
- ❌ - Error
- ⏰ - Token expiry
- 🔐 - Token validation
- 📤 - Sending request
- 🚪 - Logout

### Common Issues

**Issue**: User logged out after refresh
- **Check**: Is `expiresAt` in the past?
- **Check**: Is backend `/auth/validate-token` endpoint working?
- **Check**: Browser DevTools → Network tab for failed requests

**Issue**: 401 errors on all requests
- **Check**: Is token being sent in Authorization header?
- **Check**: Backend middleware is applied to the route?
- **Check**: JWT_SECRET matches between frontend/backend?

**Issue**: Token not persisting
- **Check**: Browser localStorage permissions
- **Check**: Incognito mode (localStorage may be disabled)

---

## API Endpoints Reference

### Frontend → Backend

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/whatsapp-otp/send` | POST | No | Send OTP to phone |
| `/whatsapp-otp/verify` | POST | No | Verify OTP, get JWT token |
| `/auth/validate-token` | POST | Yes | Validate if token is still valid |
| `/auth/logout` | POST | Yes | Logout user (optional token blacklist) |
| `/chat/*` | POST/GET | Yes | All chat operations |

### Backend Response Formats

**OTP Verify Success:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userInfo": {
    "userId": "user_123",
    "phone": "+1234567890",
    "chatbotId": "68f1dfa097793a45f3951812"
  },
  "issuedAt": 1729423200000,
  "expiresAt": 1729509600000,
  "expiresIn": 86400
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Token has expired"
}
```

---

## Summary

- ✅ **24-hour sessions** - Users stay logged in for 24 hours
- ✅ **Automatic token injection** - Use API client, tokens added automatically
- ✅ **Backend validation** - Tokens verified with `/auth/validate-token` on app load
- ✅ **401 auto-logout** - Expired tokens trigger automatic logout
- ✅ **Secure storage** - Tokens stored in localStorage with expiry timestamps
- ✅ **Cross-tab sync** - Logout in one tab logs out all tabs

**Your authentication system is now production-ready!** 🚀
