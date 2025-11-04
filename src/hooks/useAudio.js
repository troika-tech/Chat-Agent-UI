import { useState, useCallback, useRef, useEffect } from "react";

export const useAudio = (isMuted, hasUserInteracted = true, onAudioEnded = null) => {
  const [audioObject, setAudioObject] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const currentAudioRef = useRef(null);

  const playAudio = useCallback(
    (audioData, messageIndex) => {
      
      // If clicking the same message that's currently playing, stop it
      if (currentlyPlaying === messageIndex) {
        if (audioObject) {
          audioObject.pause();
          URL.revokeObjectURL(audioObject.src);
        }
        setCurrentlyPlaying(null);
        setAudioObject(null);
        currentAudioRef.current = null;
        return;
      }

      // Stop any currently playing audio
      if (audioObject) {
        audioObject.pause();
        URL.revokeObjectURL(audioObject.src);
      }

      let byteArray = null;
      
      if (audioData?.data) {
        // Local TTS format: { data: byteArray, contentType: "audio/mpeg" }
        byteArray = Array.isArray(audioData.data)
          ? audioData.data
          : audioData.data.data;
      } else if (typeof audioData === 'string') {
        // Backend might send base64 string directly
        try {
          const base64Data = audioData.replace("data:audio/mpeg;base64,", "");
          byteArray = Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        } catch (error) {
          console.error("Failed to process base64 audio:", error);
          return;
        }
      } else if (audioData?.audio) {
        // Backend might send { audio: "base64string" }
        try {
          const base64Data = audioData.audio.replace("data:audio/mpeg;base64,", "");
          byteArray = Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        } catch (error) {
          console.error("Failed to process backend audio:", error);
          return;
        }
      } else {
        // Try to handle it as a direct base64 string if it's a string
        if (typeof audioData === 'string' && audioData.includes('data:audio')) {
          try {
            const base64Data = audioData.replace("data:audio/mpeg;base64,", "");
            byteArray = Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          } catch (error) {
            console.error("Failed to process direct base64 string:", error);
          }
        }
      }

      if (!byteArray) {
        console.warn("Could not extract audio data from:", audioData);
        return;
      }

      try {
        const audioBuffer = new Uint8Array(byteArray);
        const mimeType = audioData.contentType || "audio/mpeg";
        const audioBlob = new Blob([audioBuffer], { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newAudio = new Audio(audioUrl);

        // Respect mute state
        newAudio.muted = isMuted;

        setAudioObject(newAudio);
        setCurrentlyPlaying(messageIndex);
        currentAudioRef.current = newAudio;

        // Play audio if user has interacted, otherwise just prepare it for manual play
        if (hasUserInteracted) {
          
          // Apply mute state before playing
          newAudio.muted = isMuted;
          
          const playPromise = newAudio.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Ensure mute state is still applied after play starts
                newAudio.muted = isMuted;
              })
              .catch((err) => {
                if (err.name === 'NotAllowedError') {
                  // Don't reset state - audio is ready for manual play
                } else {
                  console.error("Audio play failed", err);
                  // Reset state if play fails for other reasons
                  setCurrentlyPlaying(null);
                  setAudioObject(null);
                }
              });
          }
        } else {
          // Apply mute state even when not playing
          newAudio.muted = isMuted;
        }

        newAudio.onended = () => {
          setCurrentlyPlaying(null);
          setAudioObject(null);
          currentAudioRef.current = null;
          URL.revokeObjectURL(audioUrl);

          // Call the onAudioEnded callback if provided
          if (onAudioEnded) {
            onAudioEnded(messageIndex);
          }
        };
      } catch (error) {
        console.error("Error processing audio:", error);
      }
    },
    [audioObject, currentlyPlaying, isMuted, hasUserInteracted, onAudioEnded]
  );

  const stopAudio = useCallback(() => {
    const audioToStop = currentAudioRef.current || audioObject;
    if (audioToStop && currentlyPlaying !== null) {
      audioToStop.pause();
      URL.revokeObjectURL(audioToStop.src);
      setAudioObject(null);
      setCurrentlyPlaying(null);
      currentAudioRef.current = null;
    } else {
    }
  }, [audioObject, currentlyPlaying]);

  const toggleMuteForCurrentAudio = useCallback((newMutedState) => {
    const audioToMute = currentAudioRef.current || audioObject;
    if (audioToMute && currentlyPlaying !== null) {
      // Set the audio's muted state to the provided value
      audioToMute.muted = newMutedState;
      return true;
    } else {
      return false;
    }
  }, [audioObject, currentlyPlaying]);

  // Enhanced mute function that works with any currently playing audio
  const muteCurrentAudio = useCallback((mutedState) => {
    const audioToMute = currentAudioRef.current || audioObject;
    if (audioToMute && currentlyPlaying !== null) {
      audioToMute.muted = mutedState;
      return true;
    }
    return false;
  }, [audioObject, currentlyPlaying]);

  // Function to ensure audio is muted when it starts playing
  const ensureAudioMuted = useCallback((audioElement, mutedState) => {
    if (audioElement) {
      audioElement.muted = mutedState;
    }
  }, []);

  // Apply mute state to currently playing audio when mute state changes
  useEffect(() => {
    const audioToUpdate = currentAudioRef.current || audioObject;
    if (audioToUpdate && currentlyPlaying !== null) {
      audioToUpdate.muted = isMuted;
    } else {
    }
  }, [isMuted, audioObject, currentlyPlaying]);

  // Additional effect to ensure mute state is applied when audio starts playing
  useEffect(() => {
    if (audioObject && currentlyPlaying !== null) {
      audioObject.muted = isMuted;
    }
  }, [audioObject, currentlyPlaying, isMuted]);

  return { playAudio, stopAudio, currentlyPlaying, audioObject, toggleMuteForCurrentAudio, muteCurrentAudio, ensureAudioMuted };
};
