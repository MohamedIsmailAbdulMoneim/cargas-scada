import React, { useState } from 'react';
import styles from './Checkbox.module.scss'; // Import the CSS styles

const CustomCheckbox = ({
  label,
  name,
  value,
  onChange,
  defaultChecked,
  ...other
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleCheckboxChange = (e) => {
    setIsChecked(!isChecked);
    onChange(e, !isChecked);
  };

  return (
    <label className={styles['custom-checkbox']}>
      <input
        className={styles['checkbox']}
        type="checkbox"
        checked={isChecked}
        onChange={(e) => handleCheckboxChange(e)}
        name={name}
        value={value}
        {...other}
      />
      <span className={styles['checkmark']}></span>
      {label}
    </label>
  );
};

export default CustomCheckbox;
