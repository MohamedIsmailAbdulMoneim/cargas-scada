'use client';
import { motion } from 'framer-motion';
import styles from './Stepper.module.scss'; // Your existing styles
import { useAppContext } from '@/context/SubmissionFormProvider';

const variants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const Stepper = ({
  handleSubmit,
  handleNext,
  handlePrev,
  currentStep,
  steps,
}) => {
  const { isFormSubmitted } = useAppContext();

  const renderStepInputs = () => {
    const StepComponent = steps[currentStep].stepInputs;
    return <StepComponent>{renderButtons()}</StepComponent>;
  };

  const renderButtons = () =>
    !isFormSubmitted && (
      <div className={styles['stepper-controls']}>
        {currentStep > 0 ? (
          <button
            type="submit"
            className={styles['btn']}
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Previous
          </button>
        ) : (
          <span></span>
        )}
        {currentStep === steps.length - 1 ? (
          <button
            type="submit"
            className={styles['last-btn']}
            onClick={handleSubmit}
          >
            Submit
          </button>
        ) : (
          <button
            type="submit"
            className={styles['btn']}
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </button>
        )}
      </div>
    );

  const progressWidth = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={styles['stepper-container']}>
      <motion.div
        key={currentStep}
        initial="enter"
        animate="center"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.2 }}
        className={styles['step-container']}
      >
        {renderStepInputs()}
      </motion.div>

      <div className={styles['stepper']}>
        {steps?.map((step, index) => (
          <div
            key={index}
            className={`${styles['step']} ${index <= currentStep ? styles['active'] : ''}`}
          >
            <div className={styles['step-number']}>{index + 1}</div>
          </div>
        ))}
        <footer className={styles['progress-bar-container']}>
          <span>
            {currentStep + 1} to {steps.length} steps
          </span>
          <div className={styles['progress-bar']}>
            <div
              className={styles['progress-bar-fill']}
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Stepper;
