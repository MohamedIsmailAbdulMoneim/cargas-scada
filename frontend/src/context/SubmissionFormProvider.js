'use client';

const isBrowser = () => typeof window !== 'undefined';

import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook for consuming the context
export const useAppContext = () => {
  return useContext(AppContext);
};

const getIsFormSubmittedVal = () => {
  if (typeof window === 'undefined') {
    // If it's running on the server (SSR), return a default value
    return false;
  }

  // Now it's safe to access localStorage
  return localStorage.getItem('isFormSubmitted') === 'true';
};

// Create a provider component
export const SubmissionFormProvider = ({ children }) => {
  const [submissionFormState, setSubmissionFormState] = useState({
    msg: '',
    error: false,
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [progress, setProgress] = useState(0);

  const updateProgress = (newState) => {
    setProgress(newState);
  };

  const updateState = (newState) => {
    setSubmissionFormState(newState);
  };

  useEffect(() => {
    setIsFormSubmitted(getIsFormSubmittedVal());
  }, []);

  return (
    <AppContext.Provider
      value={{
        submissionFormState,
        updateState,
        progress,
        updateProgress,
        isFormSubmitted,
        setIsFormSubmitted,
        isSubmitting,
        setIsSubmitting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
