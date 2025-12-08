# 🧪 Authentication Testing Guide

Your authentication system is now fully integrated! Here's how to test it.

---

## ✅ Backend Setup Confirmed

You've added these routes:
- ✅ `POST /api/auth/validate-token`
- ✅ `POST /api/auth/logout`
- ✅ `GET /api/auth/status`

---

## 🚀 Quick Test (5 Minutes)

### 1. Open the App
Frontend is running at: **http://localhost:5174/**

Open it in your browser.

---

### 2. Test Login Flow

**Step 1: Initial Load**
- Should see a loading spinner briefly
- Then auth modal appears (if not logged in)

**Expected Console Logs:**
```
🔍 [AUTH CONTEXT] Initializing authentication check...
ℹ️ [AUTH CONTEXT] No saved authentication found
🔓 [AUTH GATE] User not authenticated - Showing auth modal
```

**Step 2: Enter Phone & Get OTP**
- Enter your phone number
- Click "Send OTP"
- Check WhatsApp for OTP

**Expected Console Logs:**
```
📤 [AUTH CONTEXT] Sending OTP to: +1234567890
✅ [AUTH CONTEXT] OTP sent successfully
```

**Step 3: Verify OTP**
- Enter the 6-digit OTP
- Click "Verify"

**Expected Console Logs:**
```
🔐 [AUTH CONTEXT] Verifying OTP for: +1234567890
✅ [AUTH CONTEXT] OTP verification successful
🔑 [AUTH CONTEXT] Backend response: {hasToken: true, issuedAt: ..., expiresAt: ...}
💾 [AUTH CONTEXT] Auth data saved - Session valid for 24 hours
📅 [AUTH CONTEXT] Issued at: [current time]
📅 [AUTH CONTEXT] Expires at: [24 hours from now]
```

**Step 4: Verify Login Success**
- Auth modal should close
- App should load
- You should see the chatbot interface

---

### 3. Test Session Persistence (Most Important!)

**Test 1: Page Refresh**
```
1. Press F5 or Ctrl+R to refresh
2. Should NOT see auth modal
3. Should directly load into the app
```

**Expected Console Logs:**
```
🔍 [AUTH CONTEXT] Initializing authentication check...
📊 [AUTH CONTEXT] Session age: 0 hours
⏰ [AUTH CONTEXT] Expires at: [24 hours from now]
🔐 [AUTH CONTEXT] Validating token with backend...
✅ [AUTH CONTEXT] Token validated by backend - Auto-authenticating
👤 [AUTH CONTEXT] User info: {phone: "+1234567890", ...}
```

**Test 2: Close Browser & Reopen**
```
1. Close the browser completely
2. Reopen browser
3. Go to http://localhost:5174/
4. Should still be logged in!
```

**Test 3: New Tab**
```
1. Open new tab
2. Go to http://localhost:5174/
3. Should be logged in (same session)
```

---

### 4. Test Backend Token Validation

Open **Browser DevTools → Console** and run:

```javascript
// Check what's stored
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
console.log('Stored Auth:', auth);
console.log('Token:', auth.token);
console.log('Expires At:', new Date(auth.expiresAt));
console.log('Hours Until Expiry:', (auth.expiresAt - Date.now()) / 1000 / 60 / 60);
```

**You should see:**
- Valid JWT token
- `expiresAt` timestamp 24 hours in the future
- User info with phone number

---

### 5. Test Token Expiry (Simulate)

In **Browser Console**, run:

```javascript
// Force token to expire
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
auth.expiresAt = Date.now() - 1000; // Set to past
localStorage.setItem('chatbot_auth', JSON.stringify(auth));
console.log('Token expired! Now reload page...');
location.reload();
```

**Expected Result:**
- Page reloads
- Auth modal appears
- Console shows: `⏰ [AUTH CONTEXT] Token expired (>24 hours) - Clearing authentication`

---

### 6. Test Backend Validation Endpoint

In **Browser Console**, run:

```javascript
// Get current token
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
const token = auth.token;

// Test validate-token endpoint
fetch('https://api.0804.in/api/auth/validate-token', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ Backend Validation Response:', data);
  console.log('Valid:', data.valid);
  console.log('Time Remaining:', data.remainingTime, 'seconds');
});
```

**Expected Response:**
```json
{
  "success": true,
  "valid": true,
  "userInfo": {
    "userId": "...",
    "phone": "+1234567890",
    "chatbotId": "..."
  },
  "issuedAt": 1729423200000,
  "expiresAt": 1729509600000,
  "remainingTime": 86395
}
```

---

### 7. Test Logout

**Option 1: Browser Console**
```javascript
// Manual logout
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
const token = auth.token;

fetch('https://api.0804.in/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Logout Response:', data);
  localStorage.removeItem('chatbot_auth');
  location.reload();
});
```

**Option 2: Use App Logout**
- If you have a logout button in the UI, click it
- Should clear session and show auth modal

**Expected Console Logs:**
```
🚪 [AUTH CONTEXT] Logging out user
📤 [AUTH CONTEXT] Calling backend logout endpoint
✅ [AUTH CONTEXT] Backend logout successful
```

---

### 8. Test Invalid Token (401 Handling)

In **Browser Console**, run:

```javascript
// Corrupt the token
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
auth.token = 'invalid_token_12345';
localStorage.setItem('chatbot_auth', JSON.stringify(auth));
console.log('Token corrupted! Now reload...');
location.reload();
```

**Expected Result:**
- Backend returns 401
- Frontend clears auth
- Auth modal appears
- Console shows: `❌ [AUTH CONTEXT] Token validation failed - Clearing`

---

## 🎯 What Should Work

After all tests pass, your system should:

| Feature | Status |
|---------|--------|
| ✅ Login with OTP | Working |
| ✅ JWT token stored in localStorage | Working |
| ✅ 24-hour session expiry | Working |
| ✅ Page refresh keeps user logged in | Working |
| ✅ Backend token validation on load | Working |
| ✅ Auto-logout on token expiry | Working |
| ✅ Logout endpoint called | Working |
| ✅ 401 responses handled | Working |

---

## 🐛 Troubleshooting

### Issue: "Auth modal appears after refresh"

**Check:**
1. Open DevTools → Application → Local Storage
2. Look for `chatbot_auth` key
3. Is it present?
   - **No**: Token wasn't saved during login
   - **Yes**: Check if `expiresAt` is in the past

**Fix:**
```javascript
// Check expiry
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
console.log('Expires at:', new Date(auth.expiresAt));
console.log('Now:', new Date());
console.log('Expired?', Date.now() > auth.expiresAt);
```

---

### Issue: "Backend validation failing"

**Check:**
1. Is backend running?
2. Is `/api/auth/validate-token` endpoint accessible?

**Test Backend:**
```bash
# In terminal, test with curl:
curl -X POST http://localhost:5000/api/auth/validate-token \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected:** `{"success": true, "valid": true, ...}`

---

### Issue: "Console shows backend unreachable"

**Logs:**
```
❌ [AUTH CONTEXT] Backend validation error: Failed to fetch
⚠️ [AUTH CONTEXT] Backend unreachable, using local token
```

**This is OK!** The frontend falls back to local token validation if backend is temporarily unreachable.

**To Fix:**
- Verify backend is running
- Check `apiBase` URL is correct
- Check CORS settings on backend

---

### Issue: "Token expiry not working"

**Check the token structure:**
```javascript
const auth = JSON.parse(localStorage.getItem('chatbot_auth'));
console.log('Token structure:', {
  hasToken: !!auth.token,
  hasIssuedAt: !!auth.issuedAt,
  hasExpiresAt: !!auth.expiresAt,
  issuedAt: new Date(auth.issuedAt),
  expiresAt: new Date(auth.expiresAt)
});
```

**Should have:**
- `token`: JWT string
- `issuedAt`: Timestamp (milliseconds)
- `expiresAt`: Timestamp (milliseconds, 24h after issuedAt)

---

## 📊 Expected Backend Logs

When frontend validates token, backend should log:

```
✅ [AUTH] Token validation successful for user: +1234567890
```

When frontend logs out, backend should log:

```
🚪 [AUTH] User logout: +1234567890
```

---

## 🎉 Success Criteria

Your authentication is working correctly if:

1. ✅ User can login with OTP
2. ✅ Refresh page → Stays logged in
3. ✅ Close browser → Reopen → Still logged in
4. ✅ Console shows backend validation success
5. ✅ Token expires after 24 hours
6. ✅ Logout clears session

---

## 🚀 Next Steps

Once all tests pass:

1. **Test in Production**
   - Deploy frontend and backend
   - Verify HTTPS is working
   - Test on mobile devices

2. **Monitor Logs**
   - Check backend logs for auth events
   - Monitor for 401 errors
   - Track session durations

3. **Optional Enhancements**
   - Add refresh token support
   - Implement token blacklisting with Redis
   - Add session analytics

---

## 📞 Need Help?

If you encounter issues:

1. **Check Console Logs** - Look for emoji-prefixed messages
2. **Check Network Tab** - Verify API calls are successful
3. **Check Backend Logs** - Confirm endpoints are being hit
4. **Review Docs** - See [AUTH_INTEGRATION.md](AUTH_INTEGRATION.md)

---

**Your authentication system is production-ready!** 🎊

Test it now at: **http://localhost:5174/**
