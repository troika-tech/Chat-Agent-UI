/**
 * WebAudioPlayer Class
 * Handles gapless audio playback using Web Audio API for streaming TTS responses
 * This provides professional-quality audio with no gaps between chunks
 */

import { decodeBase64Audio } from './wavHeader.js';

export class WebAudioPlayer {
  constructor() {
    // Web Audio API context
    this.audioContext = null;

    // Chunk buffering for sequencing
    this.chunkBuffer = new Map(); // Map<sequence, Uint8Array>
    this.nextSequence = 0; // Next expected sequence number

    // Playback scheduling
    this.scheduledBuffers = []; // Track scheduled source nodes
    this.nextStartTime = 0; // When next chunk should start (in AudioContext time)
    this.isPlaying = false;
    this.isMuted = false;

    // Gain node for volume control
    this.gainNode = null;

    // Audio settings
    this.sampleRate = 24000; // TTS audio sample rate
    this.channels = 1; // Mono audio

    // Callbacks
    this.onPlaybackStateChange = null;
    this.onError = null;

    // Initialize Web Audio API
    this.initializeAudioContext();
  }

  /**
   * Initialize Web Audio API context
   * @private
   */
  initializeAudioContext() {
    try {
      // Create AudioContext (use webkitAudioContext for Safari)
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass({
        sampleRate: this.sampleRate,
        latencyHint: 'interactive', // Low latency for real-time playback
      });

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.isMuted ? 0 : 1;
    } catch (error) {
      console.error('❌ Failed to initialize Web Audio API:', error);
      this.onError?.(error);
    }
  }

  /**
   * Add a sequenced PCM audio chunk
   * @param {string} base64Audio - Base64 encoded PCM audio data
   * @param {number} sequence - Sequence number for ordering chunks
   */
  addSequencedChunk(base64Audio, sequence) {
    try {
      // Decode base64 to PCM audio data
      const pcmData = decodeBase64Audio(base64Audio);

      // Store chunk in buffer
      this.chunkBuffer.set(sequence, pcmData);

      // Process chunks in order
      this.processBufferedChunks();
    } catch (error) {
      console.error('❌ Error adding sequenced audio chunk:', error);
      console.error('Error details:', {
        sequence,
        base64Length: base64Audio?.length,
        errorMessage: error.message,
      });
      // Don't call onError - audio errors should not stop text streaming
    }
  }

  /**
   * Process buffered chunks in sequence order
   * @private
   */
  processBufferedChunks() {
    // Resume AudioContext if suspended (required for autoplay policies)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Process all consecutive chunks starting from nextSequence
    while (this.chunkBuffer.has(this.nextSequence)) {
      const pcmData = this.chunkBuffer.get(this.nextSequence);
      this.chunkBuffer.delete(this.nextSequence);

      // Convert PCM to Float32 and schedule playback
      this.scheduleAudioChunk(pcmData);

      this.nextSequence++;
    }
  }

  /**
   * Schedule an audio chunk for gapless playback
   * @private
   * @param {Uint8Array} pcmData - 16-bit PCM audio data
   */
  scheduleAudioChunk(pcmData) {
    try {
      // Convert 16-bit PCM to Float32Array
      const float32Data = this.pcmToFloat32(pcmData);
      const numSamples = float32Data.length;

      // Create AudioBuffer
      const audioBuffer = this.audioContext.createBuffer(
        this.channels,
        numSamples,
        this.sampleRate
      );

      // Copy data to buffer (channel 0 for mono)
      audioBuffer.getChannelData(0).set(float32Data);

      // Create buffer source node
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      // Calculate when this chunk should start
      const currentTime = this.audioContext.currentTime;
      let startTime;

      if (this.nextStartTime === 0 || this.nextStartTime < currentTime) {
        // First chunk or catching up - start immediately
        startTime = currentTime;
        this.isPlaying = true;
        this.onPlaybackStateChange?.({ isPlaying: true, queueLength: this.chunkBuffer.size });
      } else {
        // Schedule to start exactly when previous chunk ends
        startTime = this.nextStartTime;
      }

      // Schedule playback
      source.start(startTime);

      // Calculate duration and next start time
      const duration = numSamples / this.sampleRate;
      this.nextStartTime = startTime + duration;

      // Handle when chunk finishes
      source.onended = () => {
        // Remove from scheduled list
        const index = this.scheduledBuffers.indexOf(source);
        if (index > -1) {
          this.scheduledBuffers.splice(index, 1);
        }

        // Check if playback is complete
        if (this.scheduledBuffers.length === 0 && this.chunkBuffer.size === 0) {
          this.isPlaying = false;
          this.nextStartTime = 0;
          this.onPlaybackStateChange?.({ isPlaying: false, queueLength: 0 });
        }
      };

      // Track scheduled buffer
      this.scheduledBuffers.push(source);
    } catch (error) {
      console.error('❌ Error scheduling audio chunk:', error);
      this.onError?.(error);
    }
  }

  /**
   * Convert 16-bit PCM to Float32Array for Web Audio API
   * @private
   * @param {Uint8Array} pcmData - 16-bit PCM data (little-endian)
   * @returns {Float32Array} Normalized audio samples (-1.0 to 1.0)
   */
  pcmToFloat32(pcmData) {
    // PCM is 16-bit (2 bytes per sample)
    const numSamples = pcmData.length / 2;
    const float32 = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      // Read 16-bit signed integer (little-endian)
      const offset = i * 2;
      const int16 = (pcmData[offset + 1] << 8) | pcmData[offset];

      // Convert to signed integer
      const signed = int16 > 0x7FFF ? int16 - 0x10000 : int16;

      // Normalize to -1.0 to 1.0
      float32[i] = signed / 32768.0;
    }

    return float32;
  }

  /**
   * Finalize audio streaming - process any remaining chunks
   * Call this when the stream is complete
   */
  finalizeStream() {
    // Process any remaining buffered chunks
    this.processBufferedChunks();

    // Warn about missing chunks
    if (this.chunkBuffer.size > 0) {
      this.chunkBuffer.clear();
    }
  }

  /**
   * Pause audio playback
   */
  pause() {
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend().then(() => {
        this.onPlaybackStateChange?.({ isPlaying: false, queueLength: this.chunkBuffer.size });
      });
    }
  }

  /**
   * Resume audio playback
   */
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        this.onPlaybackStateChange?.({ isPlaying: true, queueLength: this.chunkBuffer.size });
      });
    }
  }

  /**
   * Stop all audio playback and clear queue
   */
  stop() {
    // Stop all scheduled sources
    for (const source of this.scheduledBuffers) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Ignore errors from already stopped sources
      }
    }

    // Clear state
    this.scheduledBuffers = [];
    this.chunkBuffer.clear();
    this.nextSequence = 0;
    this.nextStartTime = 0;
    this.isPlaying = false;

    this.onPlaybackStateChange?.({ isPlaying: false, queueLength: 0 });
  }

  /**
   * Set mute state
   * @param {boolean} muted - Whether to mute audio
   */
  setMuted(muted) {
    this.isMuted = muted;
    if (this.gainNode) {
      // Smooth volume transition
      const now = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 0.05);
    }
  }

  /**
   * Get current playback state
   * @returns {Object} Current state
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      queueLength: this.chunkBuffer.size,
      scheduledChunks: this.scheduledBuffers.length,
      isMuted: this.isMuted,
      audioContextState: this.audioContext?.state,
      currentTime: this.audioContext?.currentTime,
      nextStartTime: this.nextStartTime,
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stop();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.gainNode = null;
    this.onPlaybackStateChange = null;
    this.onError = null;
  }
}
