import styles from './Input.module.scss';

const Input = ({
  htmlFor,
  title,
  width,
  hasBorder = false,
  examForm = false,
  placeholder,
  small = false,
  error = false,
  style = null,
  ...rest
}) => {

  return (
    <div className={examForm ? `${styles['input-container_column']} ` : `${styles['input-container']}`} >
      <label className={styles['input-label']} htmlFor={htmlFor}>
        {title}:
      </label>
      <input
        style={hasBorder && examForm ? { border: "3px solid #2440a2", borderRadius: "0" } : style}
        className={`${styles['input']} ${error && styles["input-error"]} ${width === 'small' ? styles['small-input'] : width === "med" ? styles["med-input"] : width === "bigger" ? styles["bigger-input"] : styles['big-input']}`}
        placeholder={placeholder ? placeholder : ''}
        {...rest}
      />
    </div >
  );
};

export default Input;
