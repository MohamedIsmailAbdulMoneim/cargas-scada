import styles from './Select.module.scss';

const Select = ({
  htmlFor,
  title,
  width,
  hasBorder = false,
  examForm = false,
  placeholder = '',
  options = [],
  selectedOption,
  ...rest
}) => {

  return (
    <div className={examForm ? `${styles['input-container_column']}` : `${styles['input-container']}`} >
      <label className={styles['input-label']} htmlFor={htmlFor}>
        {title}:
      </label>

      <select
        className={`${styles['select']} ${width === 'small' ? styles['small-input'] : width === "med" ? styles["med-input"] : width === "bigger" ? styles['bigger-input'] : styles['big-input']}`}
        name={htmlFor}
        id={htmlFor}
        defaultValue={selectedOption}
        style={hasBorder && examForm ? { border: "3px solid #2440a2", borderRadius: "0" } : null}
        {...rest}
      >
        <option value="Select">
          Select
        </option>
        {options.map((row) => {
          return (
            <option key={row} value={row}>
              {row}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
