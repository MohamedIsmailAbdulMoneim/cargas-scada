import styles from './StepperProgressbar.module.scss'

const StepperProgressbar = ({ currentStep }) => {
    const progressWidth = ((currentStep) / 11) * 100;



    return (
        <footer className={styles["progress-bar-container-mobview"]}>
            <span>{currentStep + 1} to {11} step</span>
            <div className={styles["progress-bar-mobview"]}>
                <div
                    className={styles["progress-bar-fill-mobview"]}
                    style={{ width: `${progressWidth}%` }}
                ></div>
            </div>
        </footer>
    )
}

export default StepperProgressbar