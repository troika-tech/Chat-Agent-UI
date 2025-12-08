/**
 * Sound utility functions for chat notifications
 */

/**
 * Generate a simple beep sound using Web Audio API
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in milliseconds
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
const generateBeep = (frequency = 800, duration = 100, volume = 0.3) => {
  try {
    // Create or reuse audio context
    let audioContext = window.audioContext;
    if (!audioContext || audioContext.state === 'closed') {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      window.audioContext = audioContext;
    }

    // Resume audio context if suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {
        // Ignore resume errors
      });
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.debug('Web Audio API error:', error);
  }
};

/**
 * Play a sound effect
 * @param {string} soundName - Name of the sound file (without extension)
 * @param {boolean} enabled - Whether sounds are enabled
 * @param {number} volume - Volume level (0.0 to 1.0), default 0.4
 */
export const playSound = (soundName, enabled = true, volume = 0.4) => {
  if (!enabled) {
    return;
  }

  // First, try to use Web Audio API fallback (works even without files)
  // This ensures sounds work immediately without requiring sound files
  if (soundName === 'send-sound') {
    // Short, high-pitched beep for send
    generateBeep(1000, 80, volume * 0.6);
  } else if (soundName === 'receive-sound') {
    // Slightly longer, lower-pitched beep for receive
    generateBeep(600, 150, volume * 0.6);
  } else {
    // Generic beep
    generateBeep(800, 100, volume * 0.6);
  }

  // Also try to load and play the audio file if it exists (will play in addition to beep)
  // This allows users to replace with custom sounds later
  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    
    // Set up error handler before attempting to play
    audio.onerror = () => {
      // File doesn't exist or can't load - that's okay, we already played the beep
    };
    
    // Try to play the audio file
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Can't play (autoplay restrictions, file missing, etc.) - that's okay
        // We already played the beep sound above
      });
    }
  } catch (error) {
    // Audio constructor failed - that's okay, we already played the beep
  }
};

/**
 * Play send message sound
 * @param {boolean} enabled - Whether sounds are enabled
 */
export const playSendSound = (enabled = true) => {
  if (!enabled) {
    return;
  }
  playSound('send-sound', enabled, 0.4);
};

/**
 * Play receive message sound
 * @param {boolean} enabled - Whether sounds are enabled
 */
export const playReceiveSound = (enabled = true) => {
  if (!enabled) {
    return;
  }
  playSound('receive-sound', enabled, 0.4);
};

