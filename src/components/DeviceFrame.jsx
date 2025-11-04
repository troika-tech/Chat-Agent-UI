import React from "react";
import styled from "styled-components";

/* iPhone-like device frame (bezel) - Enhanced mobile responsiveness with font scaling */
const DeviceFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px; /* Clean chat width */
  margin: 5px auto; /* Center the frame on all screen sizes */
  padding: 0; /* No padding needed */
  border-radius: 30px; /* Adjusted for slimmer profile */
  background: transparent; /* Transparent background */
  box-shadow: none; /* No shadow or border */
  display: flex;
  // align-items: stretch;
  justify-content: center;
  overflow: visible; /* Ensure buttons are not clipped */
  -webkit-mask-image: none; /* Remove mask to prevent button clipping */
  
  /* Responsive font size system - Base font size scaling */
  font-size: 16px; /* Base font size for optimal readability */
  
  /* Font size scaling for different screen sizes */
  @media (max-width: 1200px) {
    font-size: 15.5px;
  }
  
  @media (max-width: 1024px) {
    font-size: 15px;
  }
  
  @media (max-width: 900px) {
    font-size: 14.5px;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 640px) {
    font-size: 13.5px;
  }
  
  @media (max-width: 600px) {
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    font-size: 12.5px;
  }
  
  @media (max-width: 414px) {
    font-size: 12px;
  }
  
  @media (max-width: 390px) {
    font-size: 11.5px;
  }
  
  @media (max-width: 375px) {
    font-size: 11px;
  }
  
  @media (max-width: 360px) {
    font-size: 10.5px;
  }
  
  @media (max-width: 320px) {
    font-size: 10px;
  }

  /* Enhanced mobile breakpoints */
  @media (max-width: 1200px) {
    max-width: 400px;
    border-radius: 34px;
  }

  @media (max-width: 1024px) {
    max-width: 400px;
    border-radius: 32px;
  }

  @media (max-width: 900px) {
    max-width: 80%;
    border-radius: 30px;
  }

  @media (max-width: 768px) {
    max-width: 90%;
    border-radius: 28px;
  }

  @media (max-width: 640px) {
    max-width: 90%;
    border-radius: 26px;
  }

  @media (max-width: 600px) {
    max-width: 90%;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    max-width: 95%;
    border-radius: 22px;
  }

  @media (max-width: 414px) {
    max-width: 95%;
    border-radius: 20px;
  }

  @media (max-width: 390px) {
    max-width: 95%;
    border-radius: 18px;
  }

  @media (max-width: 375px) {
    max-width: 95%;
    border-radius: 16px;
  }

  @media (max-width: 360px) {
    max-width: 95%;
    border-radius: 14px;
  }

  @media (max-width: 320px) {
    max-width: 95%;
    border-radius: 12px;
  }

  /* Landscape mobile optimization */
  @media (max-height: 500px) and (orientation: landscape) {
    max-width: 95%;
    border-radius: 20px;
  }

  @media (max-height: 400px) and (orientation: landscape) {
    max-width: 95%;
    border-radius: 18px;
  }
`;


const DeviceFrameComponent = ({ children }) => {
  return (
    <DeviceFrame>
      {children}
    </DeviceFrame>
  );
};

export default DeviceFrameComponent;
