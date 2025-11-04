// Mobile utility functions for better mobile experience

/**
 * Check if the device is mobile based on multiple criteria
 * @returns {boolean} True if device is mobile
 */
export const isMobileDevice = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Enhanced mobile detection
  const isMobileWidth = width < 768;
  const isMobileHeight = height < 1024;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Consider it mobile if any of these conditions are true
  return isMobileWidth || (isMobileHeight && isTouchDevice) || isMobileUserAgent;
};

/**
 * Get device type information
 * @returns {object} Device information
 */
export const getDeviceInfo = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return {
    width,
    height,
    isMobile: isMobileDevice(),
    isTouchDevice,
    isMobileUserAgent,
    orientation: width > height ? 'landscape' : 'portrait',
    devicePixelRatio: window.devicePixelRatio || 1
  };
};

/**
 * Add haptic feedback if supported
 * @param {number} duration - Vibration duration in ms
 */
export const hapticFeedback = (duration = 50) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

/**
 * Prevent zoom on input focus for mobile
 * @param {HTMLElement} element - Input element
 */
export const preventZoomOnFocus = (element) => {
  if (element && isMobileDevice()) {
    element.addEventListener('focus', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    });
    
    element.addEventListener('blur', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    });
  }
};

/**
 * Optimize scroll behavior for mobile
 * @param {HTMLElement} element - Scrollable element
 */
export const optimizeScrollForMobile = (element) => {
  if (element && isMobileDevice()) {
    element.style.webkitOverflowScrolling = 'touch';
    element.style.scrollBehavior = 'smooth';
    element.style.overscrollBehavior = 'contain';
  }
};

/**
 * Get optimal font size for mobile
 * @param {number} baseSize - Base font size
 * @returns {number} Optimized font size
 */
export const getOptimalFontSize = (baseSize) => {
  const deviceInfo = getDeviceInfo();
  const { width, devicePixelRatio } = deviceInfo;
  
  // Scale font size based on screen width and pixel ratio
  let scaleFactor = 1;
  
  if (width < 320) {
    scaleFactor = 0.8;
  } else if (width < 375) {
    scaleFactor = 0.9;
  } else if (width < 414) {
    scaleFactor = 0.95;
  } else if (width < 768) {
    scaleFactor = 1;
  }
  
  // Adjust for high DPI displays
  if (devicePixelRatio > 2) {
    scaleFactor *= 0.9;
  }
  
  return Math.max(baseSize * scaleFactor, 12); // Minimum 12px
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
