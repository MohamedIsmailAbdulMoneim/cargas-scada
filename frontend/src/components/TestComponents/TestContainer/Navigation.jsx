import styles from './TestContainer.module.scss';

const TestNavigation = ({
  currentQuestion,
  questionsLength,
  getNextQuestion,
  getPreviousQuestion,
}) => {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questionsLength - 1;
  return (
    <div className={styles['navigation']}>

      {!isLastQuestion &&
        <button
          onClick={getNextQuestion}
          className={`${styles['nav-button']} ${isLastQuestion && styles['disabled-btn']}}`}
        >
          Next
        </button>}
    </div>
  );
};

export default TestNavigation;
