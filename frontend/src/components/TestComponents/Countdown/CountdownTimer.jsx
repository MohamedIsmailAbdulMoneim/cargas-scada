import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';

const CountdownTimer = ({
  duration, // Duration in seconds for each question
  action = () => { }, // Action to perform when timer ends
  questionId = null, // To track the current question
  color = 'black',
  autoRestart = false, // Restart automatically when finished
}) => {
  const TIMER_KEY = 'countdown_timer_endTime'; // Single key for localStorage
  const [endTime, setEndTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(duration); // Initialize with full duration
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [key, setKey] = useState(0); // Key to force re-render of ProgressBar

  useEffect(() => {
    // Reset the timer every time a new question is loaded
    resetTimer();
  }, [questionId]);

  useEffect(() => {
    let timer;
    if (isCountingDown && endTime) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance > 0) {
          setRemainingTime(Math.ceil(distance / 1000)); // Use Math.ceil to ensure no off-by-one errors
        } else {
          clearInterval(timer);
          handleTimerEnd();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isCountingDown, endTime]);

  const calculateEndDate = (duration) => {
    const start = new Date();
    return start.getTime() + duration * 1000; // duration in seconds
  };

  const startCountdown = () => {
    const end = calculateEndDate(duration);
    setEndTime(end);
    setRemainingTime(duration); // Set initial remaining time to full duration
    setIsCountingDown(true);
    localStorage.setItem(TIMER_KEY, end.toString());
    setKey(prevKey => prevKey + 1); // Update key to force re-render of ProgressBar
  };

  const resetTimer = () => {
    localStorage.removeItem(TIMER_KEY); // Remove existing timer from localStorage
    startCountdown(); // Start a new timer
  };

  const handleTimerEnd = () => {
    setIsCountingDown(false);
    setRemainingTime(0);
    action();
    localStorage.removeItem(TIMER_KEY);

    if (autoRestart) {
      resetTimer(); // Restart the countdown if needed
    } else {
      setKey(prevKey => prevKey + 1); // Update key to force re-render
    }
  };

  return (
    endTime && (
      <div style={{ backgroundColor: 'transparent', marginTop: '1rem' }}>
        <ProgressBar key={key} duration={duration * 1000} color={color} remainingTime={remainingTime} />
      </div>
    )
  );
};

export default CountdownTimer;
