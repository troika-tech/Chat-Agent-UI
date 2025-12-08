/**
 * API Service for Chatbot UI
 * 
 * Centralized API functions for authentication and configuration
 */

/**
 * Safely parse error response that might be JSON or plain text
 * @param {Response} response - Fetch response object
 * @returns {Promise<string>} Error message
 */
async function parseErrorResponse(response) {
  try {
    // Read response as text first (can only read body once)
    const text = await response.text();
    
    // Try to parse as JSON
    try {
      const error = JSON.parse(text);
      return error.message || error.error || text || 'An error occurred';
    } catch (jsonError) {
      // Not JSON, return the text as-is
      return text || 'An error occurred';
    }
  } catch (parseError) {
    // If reading fails, return a generic error message
    return `Request failed with status ${response.status}`;
  }
}

/**
 * Get authentication configuration for a chatbot
 * @param {string} apiBase - Base API URL
 * @param {string} chatbotId - Chatbot ID
 * @returns {Promise<object>} Auth config
 */
export async function getAuthConfig(apiBase, chatbotId) {
  try {
    const response = await fetch(`${apiBase}/chatbot/${chatbotId}/auth-config`);
    if (!response.ok) {
      throw new Error('Failed to fetch auth config');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching auth config:', error);
    // Return default config on error
    return {
      auth_enabled: false,
      auth_provider: 'aisensy',
      auth_trigger_message_count: 1,
      auth_phone_prompt_text: "To continue chat, please type your whatsapp number.",
      auth_otp_prompt_text: "I've sent an OTP to your whatsapp number. Please enter the 6-digit OTP code.",
      auth_success_text: "Great! You're verified",
    };
  }
}

/**
 * Send OTP to user's WhatsApp number
 * @param {string} apiBase - Base API URL
 * @param {string} chatbotId - Chatbot ID
 * @param {string} phone - Phone number
 * @returns {Promise<object>} Response data
 */
export async function sendOTP(apiBase, chatbotId, phone) {
  const response = await fetch(`${apiBase}/chatbot/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatbotId,
      phone,
    }),
  });

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    throw new Error(errorMessage || 'Failed to send OTP');
  }

  return await response.json();
}

/**
 * Verify OTP code
 * @param {string} apiBase - Base API URL
 * @param {string} chatbotId - Chatbot ID
 * @param {string} phone - Phone number
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<object>} Response with token
 */
export async function verifyOTP(apiBase, chatbotId, phone, otp) {
  const response = await fetch(`${apiBase}/chatbot/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatbotId,
      phone,
      otp,
    }),
  });

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    throw new Error(errorMessage || 'Invalid OTP');
  }

  return await response.json();
}

/**
 * Get intent configuration for a chatbot
 * @param {string} apiBase - Base API URL
 * @param {string} chatbotId - Chatbot ID
 * @returns {Promise<object>} Intent config
 */
export async function getIntentConfig(apiBase, chatbotId) {
  try {
    const response = await fetch(`${apiBase}/intent/${chatbotId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch intent config');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching intent config:', error);
    // Return default config on error
    return {
      enabled: false,
      keywords: [],
      confirmation_prompt_text: "Would you like me to send the proposal to your WhatsApp number?",
      success_message: "✅ Proposal sent to your WhatsApp number!",
      toast_message: "Proposal sent successfully! 📱",
    };
  }
}

/**
 * Get transcript configuration for a chatbot
 * @param {string} apiBase - Base API URL
 * @param {string} chatbotId - Chatbot ID
 * @returns {Promise<object>} Transcript config
 */
export async function getTranscriptConfig(apiBase, chatbotId) {
  try {
    const response = await fetch(`${apiBase}/transcript/${chatbotId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transcript config');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching transcript config:', error);
    // Return default config on error
    return {
      enabled: false,
      inactivity_timeout_ms: null,
    };
  }
}

/**
 * Send proposal to user's WhatsApp number
 * @param {string} apiBase - Base API URL
 * @param {string} chatbotId - Chatbot ID
 * @param {string} phone - Phone number
 * @param {string} serviceName - Service name (optional)
 * @returns {Promise<object>} Response data
 */
export async function sendProposal(apiBase, chatbotId, phone, serviceName) {
  const response = await fetch(`${apiBase}/intent/send-proposal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatbotId,
      phone,
      serviceName,
    }),
  });

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    throw new Error(errorMessage || 'Failed to send proposal');
  }

  return await response.json();
}

/**
 * Get Zoho configuration for a chatbot
 * @param {string} apiBase - Base API URL
 * @param {string} chatbotId - Chatbot ID
 * @returns {Promise<object>} Zoho config
 */
export async function getZohoConfig(apiBase, chatbotId) {
  try {
    const response = await fetch(`${apiBase}/zoho/${chatbotId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Zoho config');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching Zoho config:', error);
    // Return default config on error
    return {
      enabled: false,
      capture_intent_keywords: [],
      required_fields: ['name', 'phone', 'email'],
      optional_fields: ['company'],
      name_prompt_text: "Great! What's your name?",
      phone_prompt_text: "What's your phone number?",
      email_prompt_text: "What's your email address?",
      company_prompt_text: "Which company are you from? (optional)",
      success_message: "✅ Thank you! We've saved your details. Our team will reach out soon!",
    };
  }
}

/**
 * Capture lead to Zoho CRM
 * @param {string} apiBase - Base API URL
 * @param {string} chatbotId - Chatbot ID
 * @param {object} leadData - Lead data {name, phone, email, company, message}
 * @param {string} sessionId - Session ID
 * @returns {Promise<object>} Response data
 */
export async function captureLeadToZoho(apiBase, chatbotId, leadData, sessionId) {
  const response = await fetch(`${apiBase}/zoho/capture-lead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatbotId,
      leadData,
      sessionId,
    }),
  });

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    throw new Error(errorMessage || 'Failed to capture lead');
  }

  return await response.json();
}

