import React, { useEffect, useRef } from 'react';
import ConfettiGenerator from 'confetti-js';

const Confetti = ({ trigger, onComplete }) => {
  const confettiRef = useRef(null);
  const confettiInstance = useRef(null);

  useEffect(() => {
    if (trigger > 0) {
      createConfetti();
    }

    // Cleanup on unmount
    return () => {
      if (confettiInstance.current) {
        confettiInstance.current.clear();
      }
    };
  }, [trigger]);

  const createConfetti = () => {
    // Clean up existing confetti
    if (confettiInstance.current) {
      confettiInstance.current.clear();
    }

    // Create new confetti instance
    confettiInstance.current = new ConfettiGenerator({
      target: confettiRef.current,
      max: 100,
      size: 1,
      animate: true,
      props: [
        {
          type: 'circle',
          size: 10,
          weight: 6,
          color: '#ff6b9d'
        },
        {
          type: 'circle',
          size: 8,
          weight: 4,
          color: '#8b5cf6'
        },
        {
          type: 'circle',
          size: 6,
          weight: 3,
          color: '#ec4899'
        },
        {
          type: 'circle',
          size: 12,
          weight: 5,
          color: '#f59e0b'
        },
        {
          type: 'circle',
          size: 9,
          weight: 4,
          color: '#10b981'
        },
        {
          type: 'circle',
          size: 7,
          weight: 3,
          color: '#3b82f6'
        },
        {
          type: 'circle',
          size: 11,
          weight: 5,
          color: '#ef4444'
        },
        {
          type: 'circle',
          size: 8,
          weight: 4,
          color: '#f97316'
        },
        {
          type: 'circle',
          size: 6,
          weight: 3,
          color: '#06b6d4'
        }
      ],
      clock: 25,
      rotate: true,
      start_from_edge: true,
      respawn: false
    });

    // Start the confetti
    confettiInstance.current.render();

    // Stop after 3 seconds
    setTimeout(() => {
      if (confettiInstance.current) {
        confettiInstance.current.clear();
      }
      if (onComplete) {
        onComplete();
      }
    }, 3000);
  };

  return (
    <canvas
      ref={confettiRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default Confetti;
