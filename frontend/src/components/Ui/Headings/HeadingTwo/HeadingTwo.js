import styles from "./HeadingTwo.module.scss"

const HeadingOne = ({ content, style }) => {
    return (
        <h1 style={style} className={styles["content"]}>{content}</h1>
    )
}

export default HeadingOne