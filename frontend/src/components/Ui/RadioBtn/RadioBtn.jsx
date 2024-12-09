import Image from "next/image"
import styles from "./RadioBtn.module.scss"
import checkSign from "@/assets/check-mark.svg"

const RadioBtn = ({
    label,
    htmlFor,
    ...other
}) => {
    return (
        <div className={styles["container"]}>
            <input className={styles["radio-input"]} type="radio" {...other} />
            <label className={styles["check"]} htmlFor={htmlFor}><Image className={styles["check-sign"]} src={checkSign} alt="check sign" width={14} /></label>
            <label className={styles["radio-lablel"]} htmlFor={htmlFor}>{label}</label>
        </div>
    )
}

export default RadioBtn