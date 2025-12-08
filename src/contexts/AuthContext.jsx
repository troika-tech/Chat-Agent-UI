import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AUTH_STORAGE_KEY = 'chatbot_auth';
const PHONE_STORAGE_KEY = 'chatbot_user_phone';

// Helper function to read auth from sessionStorage synchronously
// Using sessionStorage instead of localStorage for better reliability
const readAuthFromStorage = () => {
  try {
    // Debug: Log all sessionStorage keys
    const allKeys = Object.keys(sessionStorage);
    const authRelatedKeys = allKeys.filter(key => 
      key.includes('auth') || key.includes('token') || key.includes('chatbot')
    );
    console.log('🔍 [AUTH INIT] Checking sessionStorage on mount:', {
      allKeysCount: allKeys.length,
      authRelatedKeys: authRelatedKeys,
      lookingFor: AUTH_STORAGE_KEY
    });
    
    const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
    console.log('🔍 [AUTH INIT] Token lookup result:', {
      key: AUTH_STORAGE_KEY,
      found: !!savedAuth,
      length: savedAuth?.length || 0
    });
    
    if (!savedAuth) {
      // Try alternative keys in sessionStorage
      const alternativeKeys = ['chatbot_auth', 'auth_token', 'user_token', 'token'];
      for (const key of alternativeKeys) {
        const value = sessionStorage.getItem(key);
        if (value) {
          console.log(`⚠️ [AUTH INIT] Found token under alternative key: ${key}`);
          try {
            const parsed = JSON.parse(value);
            if (parsed.token) {
              // Migrate to correct key
              sessionStorage.setItem(AUTH_STORAGE_KEY, value);
              console.log(`✅ [AUTH INIT] Migrated token from ${key} to ${AUTH_STORAGE_KEY}`);
              // Continue with normal flow
              const authData = parsed;
              // Check expiration
              const now = Date.now();
              if (authData.expiresAt && now >= authData.expiresAt) {
                sessionStorage.removeItem(AUTH_STORAGE_KEY);
                return null;
              }
              return authData;
            }
          } catch (e) {
            // Not valid JSON
          }
        }
      }
      return null;
    }
    
    const authData = JSON.parse(savedAuth);
    if (!authData.token) {
      console.warn('⚠️ [AUTH INIT] Auth data found but no token field');
      return null;
    }
    
    // Check if token is expired
    const now = Date.now();
    if (authData.expiresAt && now >= authData.expiresAt) {
      console.log('⏰ [AUTH INIT] Token expired, clearing');
      // Token expired, clear it
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    
    console.log('✅ [AUTH INIT] Valid token found, initializing auth state');
    return authData;
  } catch (e) {
    console.error('❌ [AUTH INIT] Error reading from sessionStorage:', e);
    return null;
  }
};

export const AuthProvider = ({ children, apiBase }) => {
  // CRITICAL: Initialize state from sessionStorage SYNCHRONOUSLY on mount
  // This ensures ProtectedRoute sees the correct auth state immediately
  // Using sessionStorage instead of localStorage for better reliability
  const initialAuth = readAuthFromStorage();
  
  // Debug: Log what we found
  console.log('🚀 [AUTH PROVIDER] Initializing...', {
    hasInitialAuth: !!initialAuth,
    hasToken: !!initialAuth?.token,
    hasUserInfo: !!initialAuth?.userInfo,
    tokenLength: initialAuth?.token?.length || 0
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialAuth);
  const [authToken, setAuthToken] = useState(initialAuth?.token || null);
  const [userInfo, setUserInfo] = useState(initialAuth?.userInfo || null);
  const [loading, setLoading] = useState(true); // Start with true to check existing auth
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  // If we have initial auth, mark as initialized immediately
  const [isInitialized, setIsInitialized] = useState(!!initialAuth);
  const checkingAuthRef = useRef(false); // Prevent multiple simultaneous checks
  
  // Store initialAuth in a ref so we can access it in callbacks
  const initialAuthRef = useRef(initialAuth);
  initialAuthRef.current = initialAuth;

  // Check for existing authentication on mount (only once)
  useEffect(() => {
    // Debug: Log ALL sessionStorage contents on mount
    console.log('🔍 [AUTH PROVIDER] Full sessionStorage dump on mount:', {
      totalKeys: sessionStorage.length,
      allKeys: Object.keys(sessionStorage),
      chatbotAuth: sessionStorage.getItem('chatbot_auth') ? 'EXISTS' : 'MISSING',
      chatbotAuthLength: sessionStorage.getItem('chatbot_auth')?.length || 0,
      initialAuthExists: !!initialAuthRef.current,
      currentAuthState: {
        isAuthenticated,
        hasToken: !!authToken,
        isInitialized
      }
    });
    
    // If we already have auth from initial state, still validate with backend
    // but don't clear it if validation fails (trust local token)
    if (!checkingAuthRef.current) {
      // Run check immediately on mount
      // This will validate the token with backend but won't clear if we already have it
      checkExistingAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const checkExistingAuth = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (checkingAuthRef.current) {
      console.log('⏸️ [AUTH CONTEXT] Auth check already in progress, skipping...');
      return;
    }
    
    checkingAuthRef.current = true;
    
    // IMPORTANT: Set loading to true at the start to prevent ProtectedRoute from redirecting
    setLoading(true);
    
    // CRITICAL: Read token synchronously FIRST, before any async operations
    let savedAuth = null;
    try {
      savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('❌ [AUTH CONTEXT] Error reading sessionStorage:', e);
      setLoading(false);
      setIsInitialized(true);
      checkingAuthRef.current = false;
      return;
    }
    
    try {
      // Check all sessionStorage keys related to auth
      const allKeys = Object.keys(sessionStorage);
      const authKeys = allKeys.filter(key => key.includes('chatbot') || key.includes('auth') || key.includes('token'));
      console.log('🔍 [AUTH CONTEXT] Checking existing auth...', { 
        hasSavedAuth: !!savedAuth,
        allAuthKeys: authKeys,
        sessionStorageSize: sessionStorage.length,
        currentAuthState: { isAuthenticated, hasToken: !!authToken, isInitialized },
        initialAuthWasSet: !!initialAuth
      });
      
      // If we already have auth from initial state, use that instead of sessionStorage
      if (isAuthenticated && authToken && initialAuthRef.current) {
        console.log('✅ [AUTH CONTEXT] Already authenticated from initial state, using initial auth data');
        // Use initial auth data that was already validated
        const authData = initialAuthRef.current;
        // Skip to validation section below - but first check if token still exists in sessionStorage
        // Re-read from sessionStorage to make sure it's still there
        const currentSavedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (!currentSavedAuth) {
          console.warn('⚠️ [AUTH CONTEXT] Initial auth exists but not in sessionStorage, re-saving...');
          // Re-save to sessionStorage
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        }
      } else if (!savedAuth) {
        console.log('❌ [AUTH CONTEXT] No saved auth found', {
          storageKey: AUTH_STORAGE_KEY,
          sessionStorageAvailable: typeof Storage !== 'undefined',
          sessionStorageLength: sessionStorage.length,
          allKeys: Object.keys(sessionStorage).slice(0, 10) // First 10 keys for debugging
        });
        
        // Try to recover - check if token might be stored under a different key
        const possibleKeys = ['chatbot_auth', 'auth_token', 'user_token', 'token'];
        let recovered = false;
        for (const key of possibleKeys) {
          try {
            const value = sessionStorage.getItem(key);
            if (value) {
              console.warn(`⚠️ [AUTH CONTEXT] Found potential auth data under key: ${key}`);
              try {
                const parsed = JSON.parse(value);
                if (parsed.token) {
                  console.log(`✅ [AUTH CONTEXT] Recovering auth from key: ${key}`);
                  // Migrate to correct key
                  sessionStorage.setItem(AUTH_STORAGE_KEY, value);
                  // Continue with normal flow
                  savedAuth = value; // Use recovered auth
                  recovered = true;
                  break;
                }
              } catch (e) {
                // Not valid JSON, skip
              }
            }
          } catch (e) {
            // Skip this key
          }
        }
        
        if (!recovered) {
          // No auth found, set unauthenticated state
          setIsAuthenticated(false);
          setLoading(false);
          setIsInitialized(true);
          checkingAuthRef.current = false;
          return;
        }
        // If recovered, continue with normal flow below
        savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY); // Re-read after recovery
      }

      // Parse auth data (either from savedAuth or use initialAuth if already authenticated)
      let authData;
      if (isAuthenticated && authToken && initialAuthRef.current) {
        // Use initial auth data
        authData = initialAuthRef.current;
        console.log('✅ [AUTH CONTEXT] Using initial auth data');
      } else if (savedAuth) {
        // Parse from sessionStorage
        authData = JSON.parse(savedAuth);
        console.log('✅ [AUTH CONTEXT] Parsed auth data from sessionStorage');
      } else {
        // No auth data available
        console.log('❌ [AUTH CONTEXT] No auth data available');
        setIsAuthenticated(false);
        setLoading(false);
        setIsInitialized(true);
        checkingAuthRef.current = false;
        return;
      }
      const now = Date.now();
      console.log('📦 [AUTH CONTEXT] Auth data found:', {
        hasToken: !!authData.token,
        hasIssuedAt: !!authData.issuedAt,
        hasExpiresAt: !!authData.expiresAt,
        hasUserInfo: !!authData.userInfo,
        expiresAt: authData.expiresAt,
        now: now,
        isExpired: authData.expiresAt ? now >= authData.expiresAt : 'unknown',
        alreadyAuthenticated: isAuthenticated // Log if we're already authenticated from initial state
      });

      // Check if authentication exists and hasn't expired (client-side check)
      if (authData.token) {
        // If we have issuedAt and expiresAt, check expiration
        if (authData.issuedAt && authData.expiresAt) {
        const isExpired = now >= authData.expiresAt;

          // If token is expired, clear auth immediately
        if (isExpired) {
            console.log('⏰ [AUTH CONTEXT] Token expired, clearing auth');
          clearAuthData();
          setLoading(false);
          setIsInitialized(true);
          checkingAuthRef.current = false;
          return;
        }
        } else {
          // If missing timestamps, try to decode from token
          try {
            const tokenParts = authData.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              authData.issuedAt = payload.iat * 1000;
              authData.expiresAt = payload.exp * 1000;
              // Update sessionStorage with timestamps
              sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
              console.log('✅ [AUTH CONTEXT] Extracted timestamps from token');
            }
          } catch (e) {
            console.warn('⚠️ [AUTH CONTEXT] Could not extract timestamps from token');
          }
        }

        // CRITICAL: Set auth state IMMEDIATELY and SYNCHRONOUSLY from sessionStorage (optimistic)
        // This prevents logout flash while validation is in progress
        // MUST be done before any async operations to ensure ProtectedRoute sees authenticated state
        // NOTE: If we already have auth from initial state, this is a no-op, but we still update
        // to ensure we have the latest data from sessionStorage
        console.log('✅ [AUTH CONTEXT] Setting/updating optimistic auth state (SYNCHRONOUS)');
        setAuthToken(authData.token);
        setUserInfo(authData.userInfo || {});
        setIsAuthenticated(true);
        
        // Mark as initialized IMMEDIATELY so ProtectedRoute doesn't redirect
        // We'll validate in the background but keep user logged in
        setLoading(false);
        setIsInitialized(true);
        
        // Log to verify state is set
        console.log('✅ [AUTH CONTEXT] Auth state set, isInitialized=true, isAuthenticated=true');

        // Validate token with backend (with retry logic) - run in background
        // NOTE: We already set auth state optimistically above, so user stays logged in
        // This validation is just to update with fresh data from backend
        let validationSuccess = false;
        let retryCount = 0;
        const maxRetries = 1; // Reduced retries for faster page load

        while (retryCount <= maxRetries && !validationSuccess) {
          try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout (reduced)

          const response = await fetch(`${apiBase}/auth/validate-token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authData.token}`,
              'Content-Type': 'application/json',
              },
              signal: controller.signal
          });

            clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data.valid) {
                // Token is valid, update with fresh data from backend
                // IMPORTANT: Preserve existing userInfo (name, avatar) if backend doesn't return them
                if (data.userInfo) {
                  const mergedUserInfo = {
                    ...authData.userInfo, // Keep existing name, avatar, etc.
                    ...data.userInfo,     // Override with backend data (userId, phone, etc.)
                  };
                  setUserInfo(mergedUserInfo);
                  // Update stored auth data with fresh timestamps and merged userInfo
                  const updatedAuthData = {
                    ...authData,
                    userInfo: mergedUserInfo,
                    issuedAt: data.issuedAt || authData.issuedAt,
                    expiresAt: data.expiresAt || authData.expiresAt
                  };
                  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuthData));
                  console.log('💾 [AUTH CONTEXT] Updated auth data in sessionStorage');
                }
                validationSuccess = true;
                console.log('✅ [AUTH CONTEXT] Token validated successfully');
              } else {
                // Backend says token is invalid - but only clear if we're sure
                // For now, trust local token if it's not expired
                console.warn('⚠️ [AUTH CONTEXT] Backend says token is invalid, but trusting local token (not expired)');
                validationSuccess = true; // Stop retrying, but keep user logged in
              }
            } else if (response.status === 401) {
              // 401 Unauthorized - token is definitely invalid
              // BUT: Only clear if token is actually expired, not just if backend says so
              // (backend might be down or having issues)
              const now = Date.now();
              if (authData.expiresAt && now >= authData.expiresAt) {
                console.log('❌ [AUTH CONTEXT] Token unauthorized (401) and expired, clearing auth');
                clearAuthData();
              } else {
                console.warn('⚠️ [AUTH CONTEXT] Token unauthorized (401) but not expired, trusting local token');
                // Don't clear - might be backend issue
              }
              validationSuccess = true; // Stop retrying
            } else {
              // Other HTTP errors (500, 503, etc.) - backend issue, trust local token
              console.warn(`⚠️ [AUTH CONTEXT] Backend validation returned ${response.status}, trusting local token`);
              // Keep using local token, don't clear auth
              validationSuccess = true; // Stop retrying, trust local token
            }
          } catch (validationError) {
            retryCount++;
            
            // Check if it's a network error or timeout
            const isNetworkError = validationError.name === 'TypeError' || 
                                   validationError.name === 'AbortError' ||
                                   validationError.message.includes('fetch') ||
                                   validationError.message.includes('network');

            if (isNetworkError && retryCount <= maxRetries) {
              // Network error, retry after short delay
              console.warn(`⚠️ [AUTH CONTEXT] Network error during validation (attempt ${retryCount}/${maxRetries + 1}), retrying...`);
              await new Promise(resolve => setTimeout(resolve, 500 * retryCount)); // Shorter backoff
            } else {
              // Network error after retries or other error - trust local token
              console.warn('⚠️ [AUTH CONTEXT] Backend validation failed, trusting local token:', validationError.message);
              // Keep using local token, don't clear auth
              validationSuccess = true; // Stop retrying, trust local token
            }
          }
        }
        
        // If validation never succeeded but token exists and isn't expired, keep user logged in
        if (!validationSuccess && authData.token) {
          console.log('✅ [AUTH CONTEXT] Using local token (backend validation skipped/failed)');
          // Auth state already set optimistically above, so user stays logged in
        }
      } else {
        // Token structure is invalid (missing token)
        console.warn('⚠️ [AUTH CONTEXT] Invalid auth data structure (no token), clearing');
        clearAuthData();
        setLoading(false);
        setIsInitialized(true);
        checkingAuthRef.current = false;
        return;
      }
    } catch (error) {
      console.error('❌ [AUTH CONTEXT] Error checking existing auth:', error);
      // On parse error, try to recover by checking if token exists
      const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          if (authData.token) {
            // If we have a token, trust it even if structure is slightly off
            console.warn('⚠️ [AUTH CONTEXT] Recovering from parse error, trusting token');
              setAuthToken(authData.token);
            setUserInfo(authData.userInfo || {});
              setIsAuthenticated(true);
            setLoading(false);
            setIsInitialized(true);
            checkingAuthRef.current = false;
            return;
            } else {
              clearAuthData();
            }
        } catch {
            clearAuthData();
        }
      } else {
        clearAuthData();
      }
    } finally {
      // Always clear the checking flag
      // NOTE: Don't reset loading/isInitialized here if they were already set above
      // Only reset if we're still checking (shouldn't happen, but safety check)
      checkingAuthRef.current = false;
      console.log('✅ [AUTH CONTEXT] Auth check completed, checkingAuthRef reset');
    }
  }, [apiBase]);

  // Clear authentication data
  const clearAuthData = useCallback(() => {
    console.log('🗑️ [AUTH CONTEXT] Clearing auth data');
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(PHONE_STORAGE_KEY);
    setAuthToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Send OTP
  const sendOtp = useCallback(async (phone) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = `${apiBase}/whatsapp-otp/send`;
      const requestBody = {
        phone,
        chatbotId: '68ea0b4d28fb01da88e59697',
        campaignName: 'Signup OTP Campaign',
        templateName: 'otp_message'
      };


      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

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

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }


      // Start resend cooldown
      setResendCooldown(60);

      return data;
    } catch (error) {
      console.error('❌ [AUTH CONTEXT] Error sending OTP:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  // Verify OTP
  const verifyOtp = useCallback(async (otp, phone) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = `${apiBase}/whatsapp-otp/verify`;
      const requestBody = {
        phone,
        otp,
        chatbotId: '68ea0b4d28fb01da88e59697',
        campaignName: 'Signup OTP Campaign',
        templateName: 'otp_message'
      };


      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid OTP');
      }

      const data = await response.json();

      // Save phone number
      if (phone) {
        sessionStorage.setItem(PHONE_STORAGE_KEY, phone);
      }

      // Save authentication data with backend-provided timestamps
      const authData = {
        token: data.token,
        userInfo: data.userInfo || { phone },
        issuedAt: data.issuedAt,      // Backend timestamp in milliseconds
        expiresAt: data.expiresAt      // Backend timestamp in milliseconds
      };

      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      setAuthToken(data.token);
      setUserInfo(data.userInfo || { phone });
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.error('❌ [AUTH CONTEXT] Error verifying OTP:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  // Logout
  const logout = useCallback(async () => {

    // Call backend logout endpoint if token exists
    if (authToken) {
      try {
        const response = await fetch(`${apiBase}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
        } else {
          console.warn('⚠️ [AUTH CONTEXT] Backend logout failed, clearing local data anyway');
        }
      } catch (error) {
        console.error('❌ [AUTH CONTEXT] Logout error:', error);
        // Continue with local logout even if backend call fails
      }
    }

    clearAuthData();
    setError(null);
  }, [authToken, apiBase, clearAuthData]);

  // Resend OTP
  const resendOtp = useCallback(async (phone) => {
    if (resendCooldown > 0) {
      return;
    }

    try {
      await sendOtp(phone);
    } catch (error) {
      console.error('❌ [AUTH CONTEXT] Error resending OTP:', error);
    }
  }, [sendOtp, resendCooldown]);

  // Check session validity periodically (every 5 minutes)
  // Only checks expiration, doesn't call backend (to avoid unnecessary network calls)
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionValidity = () => {
      try {
        const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (!savedAuth) {
          // Only logout if token is actually missing
          console.log('⏰ [AUTH CONTEXT] No auth data found, logging out');
          logout();
          return;
        }

        const authData = JSON.parse(savedAuth);
        const now = Date.now();

        // Only logout if token is expired
        if (authData.expiresAt && now >= authData.expiresAt) {
          console.log('⏰ [AUTH CONTEXT] Token expired during periodic check, logging out');
          logout();
        }
        // If token exists and not expired, keep user logged in
        // Don't clear auth for other errors
      } catch (error) {
        console.error('❌ [AUTH CONTEXT] Error checking session validity:', error);
        // Don't logout on parse errors - token might still be valid
        // Only logout if we can't read the data at all
      }
    };

    // Check immediately
    checkSessionValidity();

    // Then check every 5 minutes (less frequent to reduce overhead)
    const interval = setInterval(checkSessionValidity, 5 * 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  // Listen for 401 logout events from API client
  useEffect(() => {
    const handleLogoutEvent = (event) => {
      clearAuthData();
      setError(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, [clearAuthData]);

  // Listen for storage events (when auth is updated in another tab/window or same tab)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === AUTH_STORAGE_KEY && event.newValue) {
        try {
          const authData = JSON.parse(event.newValue);
          // Only update if token is not expired
          const now = Date.now();
          if (authData.expiresAt && now < authData.expiresAt) {
            console.log('✅ [AUTH CONTEXT] Storage event detected, updating auth state');
            setAuthToken(authData.token);
            setUserInfo(authData.userInfo || {});
            setIsAuthenticated(true);
            setLoading(false);
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('❌ [AUTH CONTEXT] Error parsing storage event:', error);
        }
      } else if (event.key === AUTH_STORAGE_KEY && !event.newValue) {
        // Auth was cleared in another tab
        clearAuthData();
      }
    };

    // Listen for custom auth token stored event (same-tab updates)
    const handleTokenStored = (event) => {
      try {
        const authData = event.detail;
        const now = Date.now();
        if (authData.expiresAt && now < authData.expiresAt) {
          console.log('✅ [AUTH CONTEXT] Token stored event detected, updating auth state');
          setAuthToken(authData.token);
          setUserInfo(authData.userInfo || {});
          setIsAuthenticated(true);
          setLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('❌ [AUTH CONTEXT] Error handling token stored event:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:token-stored', handleTokenStored);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:token-stored', handleTokenStored);
    };
  }, [clearAuthData]);

  const value = {
    isAuthenticated,
    authToken,
    userInfo,
    loading,
    error,
    resendCooldown,
    isInitialized,
    sendOtp,
    verifyOtp,
    logout,
    resendOtp,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
