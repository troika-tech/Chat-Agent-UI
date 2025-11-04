import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
      font-family: "Hanken Grotesk", "Amaranth", "Poppins", sans-serif;
      box-sizing: border-box;
    }
    
    /* Normalize font sizes between dev and production */
    html {
      font-size: 16px !important;
    }
    
    body {
      font-size: 16px !important;
      line-height: 1.5 !important;
    }

    /* Mobile viewport optimization - Enhanced */
    html {
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
      text-size-adjust: 100% !important;
      /* Prevent horizontal scroll on mobile */
      overflow-x: hidden;
      /* Smooth scrolling */
      scroll-behavior: smooth;
      /* Better touch scrolling on iOS */
      -webkit-overflow-scrolling: touch;
      /* Ensure background covers full viewport on mobile */
      background: url('/new-bg.svg') center/cover no-repeat fixed, #3a3a3a;
      min-height: 100vh;
      background-attachment: fixed;
      background-size: cover;
      background-position: center center;
      /* Prevent browser zoom differences */
      zoom: 1 !important;
      transform: scale(1) !important;
    }


    body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      /* Prevent zoom on double tap */
      touch-action: manipulation;
      /* Better text rendering */
      text-rendering: optimizeLegibility;
      /* Prevent horizontal scroll */
      max-width: 100vw;
      /* Use the new-bg.svg as background */
      background: url('/new-bg.svg') center/cover no-repeat fixed, #3a3a3a;
      min-height: 100vh;
      background-attachment: fixed;
      background-size: cover;
      background-position: center center;
      /* Ensure consistent scaling */
      zoom: 1 !important;
      transform: scale(1) !important;
    }

    /* Prevent zoom on input focus for mobile */
    input[type="text"], 
    input[type="email"], 
    input[type="tel"], 
    textarea {
      font-size: 16px !important;
      
      @media (max-width: 480px) {
        font-size: 16px !important; /* Prevents zoom on iOS */
      }
    }
    
    /* Ensure consistent sizing across all elements */
    *, *::before, *::after {
      box-sizing: border-box !important;
      font-size: inherit !important;
    }
    
    /* Reset any browser-specific scaling */
    #root {
      zoom: 1 !important;
      transform: scale(1) !important;
      font-size: 16px !important;
    }

    /* Touch optimization - Enhanced for mobile */
    button, 
    input, 
    textarea, 
    select {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      /* Better touch responsiveness */
      touch-action: manipulation;
      /* Prevent text selection on double tap */
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      user-drag: none;
    }

    /* Enhanced touch targets for mobile */
    @media (max-width: 768px) {
      button, 
      input, 
      textarea, 
      select {
        min-height: 44px; /* iOS recommended minimum touch target */
        min-width: 44px;
      }
    }

    /* Allow text selection in input fields */
    input[type="text"], 
    input[type="email"], 
    input[type="tel"], 
    textarea {
      -webkit-user-select: text;
      -khtml-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
  
    /* Cosmic Circle Pulse Animation */
  .cosmic-circle {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cosmic-core {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(circle, #ffffff 0%, #60a5fa 30%, #a855f7 70%, transparent 100%);
    box-shadow: 
      0 0 20px #60a5fa,
      0 0 40px #a855f7,
      0 0 60px #ffffff,
      inset 0 0 20px rgba(255, 255, 255, 0.3);
    animation: core-glow 2s ease-in-out infinite alternate;
    z-index: 3;
  }
  
  .pulse-ring {
    position: absolute;
    border: 2px solid transparent;
    border-radius: 50%;
    animation: pulse-expand 3s ease-out infinite;
  }
  
  .pulse-ring-1 {
    width: 80px;
    height: 80px;
    border-color: rgba(96, 165, 250, 0.6);
    animation-delay: 0s;
  }
  
  .pulse-ring-2 {
    width: 120px;
    height: 120px;
    border-color: rgba(168, 85, 247, 0.4);
    animation-delay: 1s;
  }
  
  .pulse-ring-3 {
    width: 160px;
    height: 160px;
    border-color: rgba(255, 255, 255, 0.3);
    animation-delay: 2s;
  }
  
  @keyframes core-glow {
    0% {
      transform: scale(0.9);
      opacity: 0.8;
      box-shadow: 
        0 0 15px #60a5fa,
        0 0 30px #a855f7,
        0 0 45px #ffffff,
        inset 0 0 15px rgba(255, 255, 255, 0.2);
    }
    100% {
      transform: scale(1.1);
      opacity: 1;
      box-shadow: 
        0 0 25px #60a5fa,
        0 0 50px #a855f7,
        0 0 75px #ffffff,
        inset 0 0 25px rgba(255, 255, 255, 0.4);
    }
  }
  
  @keyframes pulse-expand {
    0% {
      transform: scale(0.5);
      opacity: 0.8;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
  
    /* Mobile background optimization */
    @media (max-width: 768px) {
      html, body {
        background: url('/new-bg.svg') center/cover no-repeat fixed, #3a3a3a;
        background-attachment: fixed;
        background-size: cover;
        background-position: center center;
        min-height: 100vh;
        height: 100vh;
      }
    }

    @media (max-width: 480px) {
      html, body {
        background: url('/new-bg.svg') center/cover no-repeat fixed, #3a3a3a;
        background-attachment: fixed;
        background-size: cover;
        background-position: center center;
        min-height: 100vh;
        height: 100vh;
      }
    }

    /* Enhanced mobile responsive adjustments - Comprehensive breakpoints */
  @media (max-width: 1200px) {
    .cosmic-circle {
      width: 190px;
      height: 190px;
    }
    
    .cosmic-core {
      width: 37px;
      height: 37px;
    }
    
    .pulse-ring-1 {
      width: 75px;
      height: 75px;
    }
    
    .pulse-ring-2 {
      width: 110px;
      height: 110px;
    }
    
    .pulse-ring-3 {
      width: 140px;
      height: 140px;
    }
  }

  @media (max-width: 1024px) {
    .cosmic-circle {
      width: 180px;
      height: 180px;
    }
    
    .cosmic-core {
      width: 35px;
      height: 35px;
    }
    
    .pulse-ring-1 {
      width: 70px;
      height: 70px;
    }
    
    .pulse-ring-2 {
      width: 100px;
      height: 100px;
    }
    
    .pulse-ring-3 {
      width: 130px;
      height: 130px;
    }
  }

  @media (max-width: 900px) {
    .cosmic-circle {
      width: 165px;
      height: 165px;
    }
    
    .cosmic-core {
      width: 32px;
      height: 32px;
    }
    
    .pulse-ring-1 {
      width: 65px;
      height: 65px;
    }
    
    .pulse-ring-2 {
      width: 95px;
      height: 95px;
    }
    
    .pulse-ring-3 {
      width: 125px;
      height: 125px;
    }
  }

  @media (max-width: 768px) {
    .cosmic-circle {
      width: 150px;
      height: 150px;
    }
    
    .cosmic-core {
      width: 30px;
      height: 30px;
    }
    
    .pulse-ring-1 {
      width: 60px;
      height: 60px;
    }
    
    .pulse-ring-2 {
      width: 90px;
      height: 90px;
    }
    
    .pulse-ring-3 {
      width: 120px;
      height: 120px;
    }
  }

  @media (max-width: 640px) {
    .cosmic-circle {
      width: 135px;
      height: 135px;
    }
    
    .cosmic-core {
      width: 27px;
      height: 27px;
    }
    
    .pulse-ring-1 {
      width: 55px;
      height: 55px;
    }
    
    .pulse-ring-2 {
      width: 80px;
      height: 80px;
    }
    
    .pulse-ring-3 {
      width: 105px;
      height: 105px;
    }
  }

  @media (max-width: 600px) {
    .cosmic-circle {
      width: 130px;
      height: 130px;
    }
    
    .cosmic-core {
      width: 26px;
      height: 26px;
    }
    
    .pulse-ring-1 {
      width: 52px;
      height: 52px;
    }
    
    .pulse-ring-2 {
      width: 78px;
      height: 78px;
    }
    
    .pulse-ring-3 {
      width: 104px;
      height: 104px;
    }
  }

  @media (max-width: 480px) {
    .cosmic-circle {
      width: 120px;
      height: 120px;
    }
    
    .cosmic-core {
      width: 25px;
      height: 25px;
    }
    
    .pulse-ring-1 {
      width: 50px;
      height: 50px;
    }
    
    .pulse-ring-2 {
      width: 75px;
      height: 75px;
    }
    
    .pulse-ring-3 {
      width: 100px;
      height: 100px;
    }
  }

  @media (max-width: 414px) {
    .cosmic-circle {
      width: 110px;
      height: 110px;
    }
    
    .cosmic-core {
      width: 22px;
      height: 22px;
    }
    
    .pulse-ring-1 {
      width: 45px;
      height: 45px;
    }
    
    .pulse-ring-2 {
      width: 68px;
      height: 68px;
    }
    
    .pulse-ring-3 {
      width: 90px;
      height: 90px;
    }
  }

  @media (max-width: 390px) {
    .cosmic-circle {
      width: 105px;
      height: 105px;
    }
    
    .cosmic-core {
      width: 21px;
      height: 21px;
    }
    
    .pulse-ring-1 {
      width: 42px;
      height: 42px;
    }
    
    .pulse-ring-2 {
      width: 63px;
      height: 63px;
    }
    
    .pulse-ring-3 {
      width: 84px;
      height: 84px;
    }
  }

  @media (max-width: 375px) {
    .cosmic-circle {
      width: 102px;
      height: 102px;
    }
    
    .cosmic-core {
      width: 20px;
      height: 20px;
    }
    
    .pulse-ring-1 {
      width: 40px;
      height: 40px;
    }
    
    .pulse-ring-2 {
      width: 60px;
      height: 60px;
    }
    
    .pulse-ring-3 {
      width: 80px;
      height: 80px;
    }
  }

  @media (max-width: 360px) {
    .cosmic-circle {
      width: 100px;
      height: 100px;
    }
    
    .cosmic-core {
      width: 20px;
      height: 20px;
    }
    
    .pulse-ring-1 {
      width: 40px;
      height: 40px;
    }
    
    .pulse-ring-2 {
      width: 60px;
      height: 60px;
    }
    
    .pulse-ring-3 {
      width: 80px;
      height: 80px;
    }
  }

  @media (max-width: 320px) {
    .cosmic-circle {
      width: 90px;
      height: 90px;
    }
    
    .cosmic-core {
      width: 18px;
      height: 18px;
    }
    
    .pulse-ring-1 {
      width: 36px;
      height: 36px;
    }
    
    .pulse-ring-2 {
      width: 54px;
      height: 54px;
    }
    
    .pulse-ring-3 {
      width: 72px;
      height: 72px;
    }
  }
  
  .cosmic-circle {
    will-change: transform;
  }
  
  .cosmic-core, .pulse-ring {
    will-change: transform, opacity;
  }
  
  /* Dark mode support for auth inputs */
  .auth-input {
    @media (prefers-color-scheme: dark) {
      background: #2d2d2d !important;
      color: #ffffff !important;
      border-color: #4a4a4a !important;
    }
  }
  
  .auth-input::placeholder {
    @media (prefers-color-scheme: dark) {
      color: #999 !important;
    }
  }
`;

export default GlobalStyle;