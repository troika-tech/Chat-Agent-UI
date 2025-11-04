/**
 * AUTH ROUTES TO ADD TO YOUR BACKEND
 *
 * Add these routes to your backend Express app
 * File location: backend/routes/auth.js (or similar)
 */

const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middleware/jwtAuthMiddleware");

// ============================================
// 1. Validate Token Endpoint
// ============================================
/**
 * Validates if a JWT token is still valid
 * Used by frontend on app load to check session
 *
 * POST /auth/validate-token
 * Headers: Authorization: Bearer <token>
 */
router.post("/validate-token", authenticateJWT, (req, res) => {
  try {
    // If we reach here, token is valid (authenticateJWT middleware passed)
    const { exp, iat, userId, phone, chatbotId } = req.user;
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = exp - now;

    console.log('✅ [AUTH] Token validation successful for user:', phone);

    res.json({
      success: true,
      valid: true,
      userInfo: {
        userId,
        phone,
        chatbotId
      },
      issuedAt: iat * 1000,        // Convert to milliseconds
      expiresAt: exp * 1000,        // Convert to milliseconds
      remainingTime: timeLeft       // Seconds until expiry
    });
  } catch (error) {
    console.error('❌ [AUTH] Token validation error:', error);
    res.status(500).json({
      success: false,
      valid: false,
      error: error.message
    });
  }
});

// ============================================
// 2. Logout Endpoint
// ============================================
/**
 * Logs out user and optionally blacklists token
 *
 * POST /auth/logout
 * Headers: Authorization: Bearer <token>
 */
router.post("/logout", authenticateJWT, async (req, res) => {
  try {
    const { phone, exp } = req.user;

    console.log('🚪 [AUTH] User logout:', phone);

    // OPTIONAL: Add token to blacklist (requires Redis)
    // Uncomment if you want to implement token blacklisting
    /*
    const token = req.headers.authorization.split(' ')[1];
    const ttl = exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      // Store in Redis with TTL = remaining token lifetime
      await redisClient.setex(`blacklist_${token}`, ttl, 'revoked');
      console.log('🔒 [AUTH] Token blacklisted');
    }
    */

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error('❌ [AUTH] Logout error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 3. Check Token Status (Optional)
// ============================================
/**
 * Returns detailed token status without requiring it to be valid
 * Useful for debugging
 *
 * GET /auth/status
 */
router.get("/status", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({
        authenticated: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - now;

      res.json({
        authenticated: true,
        valid: timeLeft > 0,
        expiresIn: timeLeft,
        expiresAt: decoded.exp * 1000,
        issuedAt: decoded.iat * 1000,
        phone: decoded.phone,
        userId: decoded.userId
      });
    } catch (error) {
      res.json({
        authenticated: false,
        valid: false,
        error: error.message
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// ============================================
// 4. Refresh Token (Optional - Future Enhancement)
// ============================================
/**
 * Refreshes an access token using a refresh token
 * Only implement if you add refresh token functionality
 *
 * POST /auth/refresh
 */
/*
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token required"
      });
    }

    // Verify refresh token
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Generate new access token
    const { generateToken } = require('../utils/jwtHelper');
    const newTokenData = generateToken({
      userId: decoded.userId,
      phone: decoded.phone,
      chatbotId: decoded.chatbotId
    });

    res.json({
      success: true,
      token: newTokenData.token,
      expiresIn: newTokenData.expiresIn,
      issuedAt: newTokenData.issuedAt,
      expiresAt: newTokenData.expiresAt
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});
*/

module.exports = router;

/**
 * INTEGRATION INSTRUCTIONS:
 *
 * 1. Save this file as: backend/routes/auth.js
 *
 * 2. In your main app.js or index.js, add:
 *
 *    const authRoutes = require('./routes/auth');
 *    app.use('/api/auth', authRoutes);
 *
 * 3. Make sure your jwtAuthMiddleware.js is in: backend/middleware/jwtAuthMiddleware.js
 *
 * 4. Test the endpoints:
 *    - POST http://localhost:5000/api/auth/validate-token
 *    - POST http://localhost:5000/api/auth/logout
 *    - GET  http://localhost:5000/api/auth/status
 *
 * 5. Protected routes should use authenticateJWT:
 *    router.post('/chat/send', authenticateJWT, async (req, res) => { ... });
 */
