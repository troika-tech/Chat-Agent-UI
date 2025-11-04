/**
 * API Client with automatic JWT token injection and 401 handling
 *
 * This utility wraps fetch to automatically:
 * 1. Add Authorization header with JWT token
 * 2. Handle 401 responses by logging out user
 * 3. Provide consistent error handling
 */

const AUTH_STORAGE_KEY = 'chatbot_auth';

/**
 * Get the current auth token from localStorage
 */
function getAuthToken() {
  try {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      return authData.token;
    }
  } catch (error) {
    console.error('Error reading auth token:', error);
  }
  return null;
}

/**
 * Handle 401 unauthorized responses
 */
function handle401() {
  console.warn('🔒 [API CLIENT] 401 Unauthorized - Clearing auth and reloading');
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem('chatbot_user_phone');

  // Dispatch custom event to notify AuthContext
  window.dispatchEvent(new CustomEvent('auth:logout', {
    detail: { reason: '401_unauthorized' }
  }));

  // Reload page to trigger auth flow
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

/**
 * Enhanced fetch with automatic JWT injection and 401 handling
 *
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Fetch options
 * @param {boolean} includeAuth - Whether to include Authorization header (default: true)
 * @returns {Promise<Response>}
 */
export async function authenticatedFetch(url, options = {}, includeAuth = true) {
  const token = getAuthToken();

  // Merge headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists and includeAuth is true
  if (token && includeAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Handle 401 Unauthorized
    if (response.status === 401 && includeAuth) {
      handle401();
      throw new Error('Unauthorized - Session expired');
    }

    return response;
  } catch (error) {
    console.error('[API CLIENT] Fetch error:', error);
    throw error;
  }
}

/**
 * GET request with authentication
 */
export async function apiGet(url, options = {}) {
  return authenticatedFetch(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request with authentication
 */
export async function apiPost(url, data, options = {}) {
  return authenticatedFetch(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request with authentication
 */
export async function apiPut(url, data, options = {}) {
  return authenticatedFetch(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request with authentication
 */
export async function apiDelete(url, options = {}) {
  return authenticatedFetch(url, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * Public fetch without authentication header
 */
export async function publicFetch(url, options = {}) {
  return authenticatedFetch(url, options, false);
}

export default {
  authenticatedFetch,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  publicFetch,
};
