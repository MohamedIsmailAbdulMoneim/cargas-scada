import styles from "./HeadingSix.module.scss"

const HeadingSix = ({ content, style }) => {
    return (
        <h6 style={style} className={styles["content"]}>{content}</h6>
    )
}

export default HeadingSix