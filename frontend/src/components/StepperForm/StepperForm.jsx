'use client';

import HorizontalLinearStepper from '@/components/Stepper/Stepper';
import { useAppContext } from '@/context/SubmissionFormProvider';
import { useEffect, useState } from 'react';
import { handleCheckRequire, stepSkipper, getLastStep } from '@/lib/utils';
import { handleSubmitData } from '@/lib/guestLib/guestLib';

const StepperForm = ({ steps, examForm, searchParams }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const { updateState, setIsFormSubmitted, setIsSubmitting } = useAppContext();

  const handleSubmit = () => {
    handleSubmitData(
      { updateState, setIsFormSubmitted, setIsSubmitting },
      examForm,
    );
  };

  const handleNext = () => {
    // Check the requirements for the next step

    const check = handleCheckRequire(currentStep + 1, updateState);
    if (check === 'stop') return; // Exit if the requirements aren't met

    // Check if we need to skip a step
    const stepSkipCount = stepSkipper(currentStep + 1, 'next');

    // Move to the next step
    setCurrentStep((prevStep) =>
      prevStep < steps.length - 1 ? prevStep + 1 : prevStep,
    );
    localStorage.setItem('formLastStep', currentStep);

    // If we need to skip one step, move forward again
    if (stepSkipCount === 'skip one step') {
      setCurrentStep((prevStep) =>
        prevStep < steps.length - 1 ? prevStep + 1 : prevStep,
      );
      localStorage.setItem('formLastStep', currentStep + 1);
    }

    if (stepSkipCount === 'skip two step') {
      setCurrentStep((prevStep) =>
        prevStep < steps.length - 1 ? prevStep + 2 : prevStep,
      );
      localStorage.setItem('formLastStep', currentStep + 2);
    }
    if (stepSkipCount === 'skip three step') {
      setCurrentStep((prevStep) =>
        prevStep < steps.length - 1 ? prevStep + 3 : prevStep,
      );
      localStorage.setItem('formLastStep', currentStep + 3);
    }
  };

  const handlePrev = () => {
    // Check if we need to skip a step
    const stepSkipCount = stepSkipper(currentStep + 1, 'back');

    // Move to the previous step
    setCurrentStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));

    // If we need to skip one step, move backward again
    if (stepSkipCount === 'skip one step') {
      setCurrentStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    }

    if (stepSkipCount === 'skip two step') {
      setCurrentStep((prevStep) =>
        prevStep < steps.length - 1 ? prevStep - 2 : prevStep,
      );
    }

    if (stepSkipCount === 'skip three step') {
      setCurrentStep((prevStep) =>
        prevStep < steps.length - 1 ? prevStep - 3 : prevStep,
      );
    }

    updateState({
      msg: '',
      error: false,
    });
  };

  useEffect(() => {
    const expiry = localStorage.getItem('itemsExpireDate');

    if (expiry) {
      const expiryDate = parseInt(expiry, 10); // Parse expiry timestamp
      const now = new Date().getTime(); // Current timestamp

      // Check if current time is greater than expiry date
      if (now > expiryDate) {
        // Perform actions after expiry, e.g., remove items from localStorage
        localStorage.removeItem('submissionForm');
        localStorage.removeItem('formLastStep');
        localStorage.removeItem('usrUploadData');
        localStorage.removeItem('itemsExpireDate');
        localStorage.removeItem('26');
        localStorage.removeItem('27');
        localStorage.removeItem('32');
        localStorage.removeItem('35');
      }
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const expiry = now.getTime() + 259200000; // Calculate expiry in milliseconds

    const itemsExpireDateFound = localStorage.getItem('itemsExpireDate');
    if (!itemsExpireDateFound)
      localStorage.setItem('itemsExpireDate', expiry.toString());
  }, []);

  useEffect(() => {
    const usrUploadData = localStorage.getItem('usrUploadData');

    if (!usrUploadData || usrUploadData !== searchParams) {
      localStorage.removeItem('submissionForm');
      localStorage.removeItem('formLastStep');
      localStorage.removeItem('itemsExpireDate');
      localStorage.setItem('usrUploadData', searchParams);
    }
  }, []);

  useEffect(() => {
    setCurrentStep(getLastStep());
  }, []);

  return (
    <div>
      <HorizontalLinearStepper
        handleSubmit={(e) => handleSubmit(e)}
        handleNext={handleNext}
        handlePrev={handlePrev}
        currentStep={currentStep}
        steps={steps}
      />
    </div>
  );
};

export default StepperForm;
