import React, { useEffect } from 'react';
import "./floating_window.css"
const FloatingWarning = ({ message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Adjust the time limit (5000 milliseconds = 5 seconds)
  
      return () => {
        clearTimeout(timer);
      };
    }, [onClose]);
  
    return (
      <div className="floating-warning">
        <div className="warning-icon">⚠️</div>
        <span className="warning-message">{message}</span>
        
      </div>
    );
  };
  

export default FloatingWarning;
