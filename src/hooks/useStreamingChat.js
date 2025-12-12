import { useState, useRef, useCallback, useEffect } from 'react';
import { SSEStreamReader } from '../utils/sseParser';
import { WebAudioPlayer } from '../utils/WebAudioPlayer';

/**
 * Custom hook for streaming chat functionality
 * @param {Object} options - Configuration options
 * @param {string} options.apiBase - Base API URL
 * @param {string} options.chatbotId - Chatbot ID
 * @param {string} options.sessionId - Session ID
 * @param {boolean} options.enableTTS - Enable text-to-speech
 * @param {boolean} options.isMuted - Audio mute state
 * @param {Function} options.onComplete - Callback when streaming completes
 * @param {Function} options.onError - Callback on error
 * @returns {Object} Streaming chat state and controls
 */
export function useStreamingChat(options) {
  const {
    apiBase,
    chatbotId,
    sessionId,
    phone,
    name,
    enableTTS = true,
    isMuted = false,
    onComplete,
    onError,
  } = options;

  // State
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [metrics, setMetrics] = useState(null);

  // Refs - Store latest name and phone values so they're always current when sendMessage is called
  const nameRef = useRef(name);
  const phoneRef = useRef(phone);
  const audioPlayerRef = useRef(null);
  const streamReaderRef = useRef(null);
  const lastQueryRef = useRef(null);
  const startTimeRef = useRef(null);
  const firstTokenTimeRef = useRef(null);
  const firstAudioTimeRef = useRef(null);
  const updateThrottleRef = useRef(null);

  // Update refs whenever name or phone changes
  useEffect(() => {
    nameRef.current = name;
    phoneRef.current = phone;
    console.log('🔄 Updated refs - name:', name, 'phone:', phone);
  }, [name, phone]);
  const suggestionsRef = useRef(null);
  const completedRef = useRef(false); // Flag to prevent duplicate onComplete calls
  const currentMetadataRef = useRef(null); // ✨ Use ref for immediate access to metadata

  // Initialize Web Audio player
  useEffect(() => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new WebAudioPlayer();

      // Set up event handlers
      audioPlayerRef.current.onPlaybackStateChange = (state) => {
        setAudioPlaying(state.isPlaying);
      };

      audioPlayerRef.current.onError = (error) => {
        console.error('Audio player error:', error);
      };
    }

    return () => {
      // Cleanup on unmount
      if (audioPlayerRef.current) {
        audioPlayerRef.current.destroy();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  // Update audio player mute state
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.setMuted(isMuted);
    }
  }, [isMuted]);

  /**
   * Send a message and start streaming
   * @param {string} query - The message to send
   * @param {Object} userData - Optional user data to include in request
   * @param {string} userData.name - User's name
   * @param {string} userData.phone - User's phone
   * @param {string} userData.email - User's email
   */
  const sendMessage = useCallback(
    async (query, userData = null) => {
      if (!apiBase || !chatbotId || !sessionId) {
        console.error('Missing required parameters for streaming');
        return;
      }

      if (isStreaming) {
        console.warn('Already streaming, ignoring new request');
        return;
      }

      // Reset state
      setStreamingResponse('');
      setError(null);
      setIsStreaming(true);
      setMetrics(null);
      currentMetadataRef.current = null; // Reset metadata ref
      lastQueryRef.current = query;
      startTimeRef.current = Date.now();
      firstTokenTimeRef.current = null;
      firstAudioTimeRef.current = null;
      suggestionsRef.current = null;
      completedRef.current = false; // Reset completion flag

      // Stop any existing audio
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stop();
      }

      // Create streaming endpoint URL
      const streamUrl = `${apiBase}/troika/intelligent-chat/stream`;

      // Determine final user data to send
      // Priority: 1. Passed userData, 2. Refs (updated by useEffect), 3. Original props
      // Normalize null/undefined to empty string to ensure consistent backend handling
      let finalName;
      if (userData?.name !== undefined) {
        // UserData.name was explicitly provided - use it, but normalize null to empty string
        finalName = userData.name || "";
      } else {
        // Fall back to ref (most up-to-date) or prop
        finalName = nameRef.current || name || "";
      }
      
      let finalPhone;
      if (userData?.phone !== undefined) {
        finalPhone = userData.phone || "";
      } else {
        finalPhone = phoneRef.current || phone || "";
      }
      
      const finalEmail = userData?.email !== undefined ? (userData.email || "") : '';

      // Request data
      // TEMPORARILY DISABLED TTS - forcing enableTTS to false
      const requestData = {
        chatbotId,
        query,
        sessionId,
        enableTTS: false, // Temporarily disabled
        phone: finalPhone || "",
        name: finalName || "",
        email: finalEmail || "",
      };

      // DEBUG: Log request data being sent
      console.log('🔍 useStreamingChat sending request with data:', requestData);
      console.log('🔍 User data sources:', {
        passed: userData,
        refs: { name: nameRef.current, phone: phoneRef.current },
        props: { name, phone },
        final: { name: finalName, phone: finalPhone }
      });

      // Create stream reader
      const reader = new SSEStreamReader(streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      streamReaderRef.current = reader;

      // Start streaming with handlers
      try {
        await reader.start({
          onText: (token) => {
            // Token is already a string from sseParser

            // Track first token time
            if (!firstTokenTimeRef.current) {
              firstTokenTimeRef.current = Date.now();
              const firstTokenLatency = firstTokenTimeRef.current - startTimeRef.current;
            }

            // Update state immediately and filter out [SUGGESTIONS] and suggestion button text
            setStreamingResponse((prev) => {
              const newText = prev + token;
              let cleaned = newText;

              // Only remove explicit [SUGGESTIONS] or [SUGGESTION] markers at the end
              // Be very specific to avoid cutting off legitimate content

              // Remove complete [SUGGESTIONS] or [SUGGESTION] patterns (with optional content after)
              cleaned = cleaned.replace(/\[SUGGESTIONS?\][\s\S]*$/gi, '');
              cleaned = cleaned.replace(/\[SUGGESTIONS?:\s*[^\]]*\][\s\S]*$/gi, '');

              // Only trim leading spaces, preserve trailing spaces as they might be intentional
              return cleaned.replace(/^\s+/, '');
            });
          },

          onAudio: (audioContent, sequence) => {
            // TEMPORARILY DISABLED: TTS Audio playback
            /* // Track first audio time
            if (!firstAudioTimeRef.current) {
              firstAudioTimeRef.current = Date.now();
              const firstAudioLatency = firstAudioTimeRef.current - startTimeRef.current;
            }

            // Add sequenced audio chunk to player if enabled and not muted
            if (enableTTS && audioPlayerRef.current && !isMuted) {
              setAudioPlaying(true);
              // Use new sequenced API for proper ordering of audio chunks
              audioPlayerRef.current.addSequencedChunk(audioContent, sequence);
            } else {
            } */
          },

          onSuggestions: (suggestionsData) => {
            // Store suggestions to be included in completion
            suggestionsRef.current = suggestionsData.items || suggestionsData;
          },

          onMetadata: (metadataData) => {

            // Store metadata in ref for immediate access (not state to avoid timing issues)
            currentMetadataRef.current = metadataData;
          },

          onDone: (data) => {

            // Use functional update to get the current accumulated response
            setStreamingResponse((currentResponse) => {
              // Prevent duplicate onComplete calls - check INSIDE setState callback
              if (completedRef.current) {
                console.warn('⚠️ setState callback called multiple times - ignoring duplicate');
                return currentResponse; // Return current value without triggering onComplete again
              }
              completedRef.current = true;


              const endTime = Date.now();
              const totalDuration = endTime - startTimeRef.current;
              const firstTokenLatency = firstTokenTimeRef.current
                ? firstTokenTimeRef.current - startTimeRef.current
                : null;
              const firstAudioLatency = firstAudioTimeRef.current
                ? firstAudioTimeRef.current - startTimeRef.current
                : null;

              // Use backend's fullAnswer if available, otherwise use accumulated response
              let finalAnswer = data.fullAnswer || currentResponse;

              // Clean up only explicit [SUGGESTIONS] or [SUGGESTION] markers from final answer
              // Be very specific to avoid cutting off legitimate content
              finalAnswer = finalAnswer.replace(/\[SUGGESTIONS?\][\s\S]*$/gi, '');
              finalAnswer = finalAnswer.replace(/\[SUGGESTIONS?:\s*[^\]]*\][\s\S]*$/gi, '');
              finalAnswer = finalAnswer.trim();
              const wordCount = finalAnswer ? finalAnswer.split(/\s+/).filter(Boolean).length : 0;

              const streamingMetrics = {
                duration: totalDuration,
                firstTokenLatency,
                firstAudioLatency,
                wordCount,
                ...data.metrics,
              };

              setMetrics(streamingMetrics);


              // TEMPORARILY DISABLED: Finalize audio stream - flush any remaining audio chunks
              /* if (audioPlayerRef.current) {
                audioPlayerRef.current.finalizeStream();
              } */

              // Call completion callback with the final answer, suggestions, and metadata
              // This callback will set currentStreamingMessageId to null
              const metadataToAttach = currentMetadataRef.current; // Get from ref (immediate access)


              const completeData = {
                ...data,
                fullAnswer: finalAnswer,
                suggestions: suggestionsRef.current || [],
                metrics: streamingMetrics,
                metadata: metadataToAttach, // Attach metadata from ref
              };

              onComplete?.(completeData);

              // Set isStreaming to false AFTER onComplete to ensure proper state sync
              setIsStreaming(false);

              return finalAnswer;
            });
          },

          onError: (errorData) => {
            console.error('Streaming error:', errorData);
            setError(errorData.message || 'An error occurred during streaming');
            setIsStreaming(false);

            // Check for session ban error
            if (errorData?.error === 'SESSION_BANNED') {
              const banMessage = errorData.message || 'Your Session Ban so now you cannot chat for further information';
              onError?.({ ...errorData, message: banMessage });
              return;
            }

            // Call error callback
            onError?.(errorData);
          },

          onConnectionError: (error) => {
            console.error('Connection error:', error);
            setError(error.message || 'Connection error');
            setIsStreaming(false);

            const errorMessage = error?.message || String(error || '');
            
            // Check if it's a session ban error
            const isSessionBanError = error?.error === 'SESSION_BANNED' || 
                                     errorMessage.toLowerCase().includes('session ban') ||
                                     errorMessage.toLowerCase().includes('banned');
            
            // Check if it's a credit error
            const isCreditError = errorMessage.toLowerCase().includes('credit') || 
                                 errorMessage.toLowerCase().includes('exhausted');
            
            // Call error callback with proper format
            if (isSessionBanError) {
              onError?.({ 
                message: 'Your Session Ban so now you cannot chat for further information', 
                error: 'SESSION_BANNED' 
              });
            } else if (isCreditError) {
              onError?.({
                message: 'Credit Exhausted Please Contact to support team', 
                error: 'CREDITS_EXHAUSTED' 
              });
            } else {
              onError?.({ message: error.message, code: 'CONNECTION_ERROR' });
            }
          },
        });
      } catch (error) {
        console.error('Failed to start streaming:', error);
        setError(error.message || 'Failed to start streaming');
        setIsStreaming(false);
        
        const errorMessage = error?.message || String(error || '');
        
        // Check if it's a session ban error
        const isSessionBanError = error?.error === 'SESSION_BANNED' || 
                                 errorMessage.toLowerCase().includes('session ban') ||
                                 errorMessage.toLowerCase().includes('banned');
        
        // Check if it's a credit error
        const isCreditError = errorMessage.toLowerCase().includes('credit') || 
                             errorMessage.toLowerCase().includes('exhausted');
        
        if (isSessionBanError) {
          onError?.({ 
            message: 'Your Session Ban so now you cannot chat for further information', 
            error: 'SESSION_BANNED' 
          });
        } else if (isCreditError) {
          onError?.({
            message: 'Credit Exhausted Please Contact to support team', 
            error: 'CREDITS_EXHAUSTED' 
          });
        } else {
          onError?.({ message: error.message, code: 'STREAM_START_ERROR' });
        }
      }
    },
    [apiBase, chatbotId, sessionId, phone, name, enableTTS, isMuted, isStreaming, onComplete, onError]
  );

  /**
   * Stop streaming
   */
  const stopStreaming = useCallback(() => {

    if (streamReaderRef.current) {
      streamReaderRef.current.stop();
      streamReaderRef.current = null;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
    }

    setIsStreaming(false);
    setAudioPlaying(false);
  }, []);

  /**
   * Retry last query
   */
  const retry = useCallback(() => {
    if (lastQueryRef.current) {
      sendMessage(lastQueryRef.current);
    }
  }, [sendMessage]);

  /**
   * Pause audio playback
   */
  const pauseAudio = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
  }, []);

  /**
   * Resume audio playback
   */
  const resumeAudio = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.resume();
    }
  }, []);

  /**
   * Get current audio state
   */
  const getAudioState = useCallback(() => {
    if (audioPlayerRef.current) {
      return audioPlayerRef.current.getState();
    }
    return {
      isPlaying: false,
      queueLength: 0,
      isMuted: false,
      hasCurrentAudio: false,
    };
  }, []);

  return {
    // State
    streamingResponse,
    isStreaming,
    error,
    audioPlaying,
    metrics,

    // Controls
    sendMessage,
    stopStreaming,
    retry,
    pauseAudio,
    resumeAudio,
    getAudioState,
  };
}

export default useStreamingChat;
