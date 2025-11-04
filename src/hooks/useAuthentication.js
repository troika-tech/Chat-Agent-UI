import { useState, useEffect, useCallback } from 'react';

const useAuthentication = (apiBase) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check for existing authentication on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('chatbot_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.token && authData.expires > Date.now()) {
          setAuthToken(authData.token);
          setUserInfo(authData.userInfo);
          setIsAuthenticated(true);
          // Ensure phone is also available under the simple key used by proposal sender
          try {
            if (authData.userInfo && authData.userInfo.phone) {
              localStorage.setItem('chatbot_user_phone', String(authData.userInfo.phone));
            }
          } catch {}
        } else {
          // Token expired, clear it
          localStorage.removeItem('chatbot_auth');
        }
      } catch (error) {
        console.error('❌ [AUTH DEBUG] Error parsing saved auth:', error);
        localStorage.removeItem('chatbot_auth');
      }
    }
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
      setResendCooldown(60); // 60 seconds cooldown

      return data;
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

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

      if (phone) {
        try {
          localStorage.setItem('chatbot_user_phone', phone);
        } catch (storageError) {
          console.warn('Failed to persist verified phone number:', storageError);
        }
      }
      
      // Save authentication data
      const authData = {
        token: data.token,
        userInfo: data.userInfo,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      localStorage.setItem('chatbot_auth', JSON.stringify(authData));

      setAuthToken(data.token);
      setUserInfo(data.userInfo);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  const logout = useCallback(() => {
    localStorage.removeItem('chatbot_auth');
    localStorage.removeItem('chatbot_user_phone');
    setAuthToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const resendOtp = useCallback(async (phone) => {
    if (resendCooldown > 0) return;
    
    try {
      await sendOtp(phone);
    } catch (error) {
      // Error is already handled in sendOtp
    }
  }, [sendOtp, resendCooldown]);

  return {
    isAuthenticated,
    authToken,
    userInfo,
    loading,
    error,
    resendCooldown,
    sendOtp,
    verifyOtp,
    logout,
    resendOtp
  };
};

export default useAuthentication;
