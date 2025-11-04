// Service for integrating with backend conversation transcript API
// Handles sending conversation transcripts to WhatsApp

class ConversationTranscriptService {
  /**
   * Send conversation transcript to WhatsApp via backend API
   * @param {string} phoneNumber - Phone number to send transcript to
   * @param {Array} chatHistory - Chat conversation history
   * @param {string} sessionId - Session ID for the conversation
   * @param {string} chatbotId - Chatbot ID
   * @param {string} apiBase - API base URL
   * @returns {Promise<Object>} API response
   */
  async sendConversationTranscript(phoneNumber, chatHistory, sessionId, chatbotId, apiBase) {
    try {

      // Format messages for backend API
      // Backend expects 'user' and 'bot' (lowercase) with 'content' field
      const formattedMessages = chatHistory.map(msg => ({
        sender: msg.sender === 'user' ? 'user' : 'bot',
        content: msg.text,  // Backend uses 'content' field, not 'text'
        timestamp: msg.timestamp || new Date().toISOString()
      }));

      const payload = {
        sessionId: sessionId,
        phone: phoneNumber,
        chatbotId: chatbotId,
        customMessage: 'Your conversation transcript has been generated and sent to your WhatsApp!',
        chatHistory: formattedMessages // Send formatted chat history with 'content' field
      };



      const response = await fetch(`${apiBase}/conversation-transcript/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });


      const result = await response.json();


      if (response.ok && result.success) {
        return {
          success: true,
          message: '📱 Conversation transcript sent to your WhatsApp!',
          data: result.result,
          s3Url: result.s3Url,
          messageCount: result.messageCount
        };
      } else {
        console.error('❌ [TRANSCRIPT DEBUG] API Error:', result);
        console.error('❌ [TRANSCRIPT DEBUG] Response not OK or success=false');
        return {
          success: false,
          message: result.error || `Failed to send conversation transcript (${response.status})`,
          error: result.error,
          status: response.status
        };
      }

    } catch (error) {
      console.error('❌ [TRANSCRIPT DEBUG] Conversation transcript error:', error);
      console.error('❌ [TRANSCRIPT DEBUG] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return {
        success: false,
        message: 'Failed to send conversation transcript. Please try again.',
        error: error.message
      };
    }
  }

  /**
   * Check S3 connectivity
   * @param {string} apiBase - API base URL
   * @returns {Promise<Object>} S3 status
   */
  async checkS3Status(apiBase) {
    try {
      const response = await fetch(`${apiBase}/conversation-transcript/s3-status`);
      const result = await response.json();

      return {
        success: result.success,
        accessible: result.s3Accessible,
        message: result.message
      };

    } catch (error) {
      console.error('❌ S3 status check error:', error);
      return {
        success: false,
        accessible: false,
        message: `S3 check failed: ${error.message}`
      };
    }
  }

  /**
   * Get active timer count
   * @param {string} apiBase - API base URL
   * @returns {Promise<Object>} Timer status
   */
  async getActiveTimers(apiBase) {
    try {
      const response = await fetch(`${apiBase}/conversation-transcript/timers`);
      const result = await response.json();

      return {
        success: result.success,
        activeTimers: result.activeTimers,
        message: result.message
      };

    } catch (error) {
      console.error('❌ Timer check error:', error);
      return {
        success: false,
        activeTimers: 0,
        message: `Timer check failed: ${error.message}`
      };
    }
  }
}

// Export the class and create a singleton instance
const conversationTranscriptService = new ConversationTranscriptService();
export { ConversationTranscriptService };
export default conversationTranscriptService;
