// Create LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f3f4f6'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #e5e7eb',
      borderTop: '5px solid #10b981',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;