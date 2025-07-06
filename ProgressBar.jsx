import React from 'react';

const ProgressBar = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
        <span>{Math.round(value)} kcal</span>
        <span>Goal: {max} kcal</span>
      </div>
      <div style={{
        height: '20px',
        backgroundColor: '#e5e7eb',
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            width: `${Math.min(percentage, 100)}%`,
            height: '100%',
            backgroundColor: '#059669',
            transition: 'width 0.5s ease-in-out',
            borderRadius: '9999px'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;