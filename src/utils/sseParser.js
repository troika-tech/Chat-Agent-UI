/**
 * SSE Parser Utility
 * Parses Server-Sent Events from a text stream
 */

/**
 * Parse SSE formatted text into events
 * @param {string} text - Raw SSE text
 * @returns {Array} Array of parsed events
 */
export function parseSSE(text) {
  const events = [];
  const lines = text.split('\n');
  let currentEvent = {};

  for (const line of lines) {
    if (line.startsWith('event:')) {
      currentEvent.type = line.substring(6).trim();
    } else if (line.startsWith('data:')) {
      const dataString = line.substring(5).trim();
      try {
        currentEvent.data = JSON.parse(dataString);
      } catch (e) {
        // If JSON parsing fails, store as plain text
        currentEvent.data = dataString;
      }
    } else if (line === '' && currentEvent.type) {
      // Empty line signals end of event
      events.push({ ...currentEvent });
      currentEvent = {};
    }
  }

  // Handle case where stream ends without final empty line
  if (currentEvent.type && Object.keys(currentEvent).length > 0) {
    events.push({ ...currentEvent });
  }

  return events;
}

/**
 * SSE Stream Reader
 * Handles streaming fetch requests with SSE parsing
 */
export class SSEStreamReader {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.abortController = null;
    this.buffer = '';
  }

  /**
   * Start streaming and process events
   * @param {Object} handlers - Event handlers
   * @param {Function} handlers.onText - Called when text event received
   * @param {Function} handlers.onAudio - Called when audio event received
   * @param {Function} handlers.onDone - Called when done event received
   * @param {Function} handlers.onError - Called when error event received
   * @param {Function} handlers.onConnectionError - Called on connection errors
   */
  async start(handlers) {
    this.abortController = new AbortController();

    try {
      const response = await fetch(this.url, {
        ...this.options,
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is not readable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Process any remaining buffered data
          if (this.buffer.trim()) {
            this.processBuffer(handlers);
          }
          break;
        }

        // Decode chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        this.buffer += chunk;

        // Process complete events in buffer
        this.processBuffer(handlers);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
      } else {
        console.error('Stream error:', error);
        handlers.onConnectionError?.(error);
      }
    }
  }

  /**
   * Process buffered SSE data
   * @private
   */
  processBuffer(handlers) {
    // Process ALL complete events in the buffer, not just the first one
    while (this.buffer.indexOf('\n\n') !== -1) {
      const doubleNewlineIndex = this.buffer.indexOf('\n\n');

      // Extract complete events
      const completeData = this.buffer.substring(0, doubleNewlineIndex + 2);
      this.buffer = this.buffer.substring(doubleNewlineIndex + 2);

      // Parse events
      const events = parseSSE(completeData);

      // Handle each event
      for (const event of events) {
        switch (event.type) {
          case 'text':
            // Extract token from data - handle both string and object formats
            let token = event.data;
            if (typeof event.data === 'object' && event.data !== null) {
              // Try common property names - 'content' is most common
              token = event.data.content || event.data.token || event.data.text || event.data.chunk || '';
            }
            handlers.onText?.(token);
            break;
          case 'audio':
            // Pass audio chunk with sequence number for ordered playback
            // Backend sends: { chunk: "base64...", sequence: 0 }
            const audioChunk = event.data.chunk || event.data.audioContent;
            const sequence = event.data.sequence !== undefined ? event.data.sequence : event.data.index;
            handlers.onAudio?.(audioChunk, sequence);
            break;
          case 'done':
          case 'complete':
            // Handle both 'done' and 'complete' event types
            handlers.onDone?.(event.data);
            break;
          case 'error':
            handlers.onError?.(event.data);
            break;
          case 'connected':
            // Connection established event - log but don't warn
            break;
          case 'status':
            // Status update event - log but don't warn
            break;
          case 'suggestions':
            // Suggestions event - pass to handler
            handlers.onSuggestions?.(event.data);
            break;
          case 'metadata':
            // Metadata event - pass to handler for special actions like showing Calendly
            handlers.onMetadata?.(event.data);
            break;
          case 'close':
            // Close event - log but don't warn
            break;
          default:
            console.warn('Unknown event type:', event.type, event.data);
        }
      }
    }
  }

  /**
   * Stop streaming
   */
  stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.buffer = '';
  }
}

/**
 * Helper function to start streaming with simplified API
 * @param {string} url - Endpoint URL
 * @param {Object} requestData - Request body data
 * @param {Object} handlers - Event handlers
 * @returns {SSEStreamReader} Reader instance for control
 */
export function startStreaming(url, requestData, handlers) {
  const reader = new SSEStreamReader(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  reader.start(handlers);
  return reader;
}
