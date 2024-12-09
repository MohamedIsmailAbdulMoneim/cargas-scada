import React, { useState, useEffect } from 'react';

const ProgressTimerBar = ({ duration, remainingTime }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate the increment for each interval
    const increment = 100 / (duration / 100); // Assuming duration is in milliseconds

    // Update progress every 100ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div style={styles.container}>
      <span style={{ zIndex: 10, position: "absolute", marginTop: 8, fontSize: "1.2rem" }}>{remainingTime}</span>
      <div style={{ ...styles.progressBar, width: `${progress}%` }} >
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '30px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',

  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.1s ease-in-out',
  },
};

export default ProgressTimerBar;