import conversationTranscriptService from './conversationTranscriptService';

class FrontendInactivityManager {
  constructor() {
    this.activeTimers = new Map();
    this.INACTIVITY_TIMEOUT = 30000; // 30 seconds
    this.TRANSCRIPT_TRACKING_KEY = 'supa_transcript_sent_sessions';

    // Load previously sent sessions from localStorage
    this.transcriptSentSessions = this.loadTranscriptTracking();
  }

  /**
   * Load transcript tracking from localStorage
   * @returns {Set} Set of session IDs that have received transcripts
   */
  loadTranscriptTracking() {
    try {
      const stored = localStorage.getItem(this.TRANSCRIPT_TRACKING_KEY);
      if (stored) {
        const sessions = JSON.parse(stored);
        return new Set(sessions);
      }
    } catch (error) {
      console.error('❌ [TRANSCRIPT DEBUG] Error loading transcript tracking:', error);
    }
    return new Set();
  }

  /**
   * Save transcript tracking to localStorage
   */
  saveTranscriptTracking() {
    try {
      const sessions = Array.from(this.transcriptSentSessions);
      localStorage.setItem(this.TRANSCRIPT_TRACKING_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('❌ [TRANSCRIPT DEBUG] Error saving transcript tracking:', error);
    }
  }

  /**
   * Start inactivity timer for a session
   * @param {String} sessionId - Session ID
   * @param {String} phone - User phone number
   * @param {String} chatbotId - Chatbot ID
   * @param {Array} chatHistory - Current chat history
   * @param {String} apiBase - API base URL
   */
  startInactivityTimer(sessionId, phone, chatbotId, chatHistory, apiBase) {
    
    // Clear existing timer if any
    if (this.activeTimers.has(sessionId)) {
      clearTimeout(this.activeTimers.get(sessionId));
    }


    // Set new timer
    const timerId = setTimeout(() => {
      this.handleInactivity(sessionId, phone, chatbotId, chatHistory, apiBase);
      this.activeTimers.delete(sessionId);
    }, this.INACTIVITY_TIMEOUT);

    this.activeTimers.set(sessionId, timerId);
  }

  /**
   * Reset inactivity timer (clear and restart)
   * @param {String} sessionId - Session ID
   * @param {String} phone - User phone number
   * @param {String} chatbotId - Chatbot ID
   * @param {Array} chatHistory - Current chat history
   * @param {String} apiBase - API base URL
   */
  resetInactivityTimer(sessionId, phone, chatbotId, chatHistory, apiBase) {
    this.startInactivityTimer(sessionId, phone, chatbotId, chatHistory, apiBase);
  }

  /**
   * Handle user inactivity - send conversation transcript
   * @param {String} sessionId - Session ID
   * @param {String} phone - User phone number
   * @param {String} chatbotId - Chatbot ID
   * @param {Array} chatHistory - Current chat history
   * @param {String} apiBase - API base URL
   */
  async handleInactivity(sessionId, phone, chatbotId, chatHistory, apiBase) {
    try {

      // Check if transcript was already sent for this session
      if (this.transcriptSentSessions.has(sessionId)) {
        return;
      }

      if (!chatHistory || chatHistory.length === 0) {
        console.warn(`⚠️ [INACTIVITY DEBUG] No chat history found for session: ${sessionId}`);
        return;
      }

      // Send conversation transcript via backend API
      const result = await conversationTranscriptService.sendConversationTranscript(
        phone,
        chatHistory,
        sessionId,
        chatbotId,
        apiBase
      );


      if (result.success) {
        // Mark this session as having received a transcript
        this.transcriptSentSessions.add(sessionId);
        this.saveTranscriptTracking(); // Persist to localStorage
      } else {
        console.error(`❌ [INACTIVITY DEBUG] Failed to send conversation transcript: ${result.message}`);
        console.error(`❌ [INACTIVITY DEBUG] Error details:`, result.error);
      }

    } catch (error) {
      console.error('❌ [INACTIVITY DEBUG] Error handling inactivity:', error);
      console.error('❌ [INACTIVITY DEBUG] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
  }

  /**
   * Enable/disable the inactivity manager
   * @param {Boolean} enabled - Whether to enable the manager
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Clear inactivity timer for a session
   * @param {String} sessionId - Session ID
   */
  clearInactivityTimer(sessionId) {
    if (this.activeTimers.has(sessionId)) {
      clearTimeout(this.activeTimers.get(sessionId));
      this.activeTimers.delete(sessionId);
    } else {
    }
  }

  /**
   * Clear all active timers
   */
  clearAllTimers() {
    this.activeTimers.forEach((timerId) => {
      clearTimeout(timerId);
    });
    this.activeTimers.clear();
  }

  /**
   * Get count of active timers
   * @returns {Number} Number of active timers
   */
  getActiveTimerCount() {
    return this.activeTimers.size;
  }

  /**
   * Check if transcript was already sent for a session
   * @param {String} sessionId - Session ID
   * @returns {Boolean} True if transcript was sent
   */
  isTranscriptSent(sessionId) {
    return this.transcriptSentSessions.has(sessionId);
  }

  /**
   * Clear transcript sent tracking for a session
   * @param {String} sessionId - Session ID
   */
  clearTranscriptTracking(sessionId) {
    if (this.transcriptSentSessions.has(sessionId)) {
      this.transcriptSentSessions.delete(sessionId);
      this.saveTranscriptTracking(); // Update localStorage
    }
  }

  /**
   * Clear all transcript tracking
   */
  clearAllTranscriptTracking() {
    this.transcriptSentSessions.clear();
    this.saveTranscriptTracking(); // Update localStorage
  }

  /**
   * Get count of sessions with sent transcripts
   * @returns {Number} Number of sessions with sent transcripts
   */
  getTranscriptSentCount() {
    return this.transcriptSentSessions.size;
  }
}

// Create and export singleton instance
const frontendInactivityManager = new FrontendInactivityManager();
export { FrontendInactivityManager };
export default frontendInactivityManager;
