import styles from './TestContainer.module.scss';

const ProgressBar = ({ currentQuestion, questionsLength }) => {

  const questionProgress = (1 / questionsLength) * 100;

  const progress = (currentQuestion + 1) * questionProgress;
  return (
    <div className={styles['progress-bar']}>
      <div
        className={styles['progress']}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
