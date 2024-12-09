import { useEffect, useState } from 'react';
import { customList } from 'country-codes-list';
import styles from './SubmissionPhoneInput.module.scss';

const SubmissionPhoneInput = ({
  label = 'Student Contact Number',
  htmlFor = 'student_contact_number',
  name = 'student_phone_number',
  inputHandler,
  defaultValue = '',
}) => {
  const list = customList('countryNameEn', '+{countryCallingCode}');
  list['Algeria'] = '+213';
  const [phoneNumber, setPhoneNumber] = useState(defaultValue.slice(1));
  const [phoneNumberFieldName, setPhoneNumberFieldName] = useState('');
  const [countryCode, setCountryCode] = useState('Select');

  const handleChange = (e) => {
    const formattedVal = e.target.value.replace(/\D/g, '');
    setCountryCode(formattedVal);
  };

  useEffect(() => {
    if (countryCode === 'Select') return;

    const hasCountryCode = phoneNumber.startsWith(countryCode);
    const inputWithoutCountryCode = hasCountryCode
      ? phoneNumber.slice(countryCode.length)
      : phoneNumber;
    const newValue = '+' + countryCode + inputWithoutCountryCode;

    inputHandler({ target: { value: newValue, name } });
  }, [phoneNumber, phoneNumberFieldName, countryCode]);

  const countryCodeList = Object.values(list).map((code) =>
    code.replace(/\D/g, ''),
  );
  useEffect(() => {
    if (defaultValue) {
      const matchingCode = countryCodeList.find((code) =>
        defaultValue.startsWith('+' + code),
      );
      if (matchingCode) {
        setCountryCode(matchingCode);
        setPhoneNumber(defaultValue.slice(matchingCode.length + 1));
      }
    }
  }, []);

  const handlePhoneInputChange = (e) => {
    setPhoneNumber(e.target.value.replace(/\D/g, ''));
    inputHandler(e);
  };

  return (
    <div className={styles['input-container']}>
      <label className={styles['input-label']} htmlFor={htmlFor}>
        {label}:
      </label>
      <div className={styles['phone-container']}>
        <select
          value={countryCode}
          name={name}
          onChange={handleChange}
          className={styles['input']}
        >
          <option value="Select">Select</option>
          {Object.entries(list).map(([key, value]) => (
            <option value={value.replace(/\D/g, '')} key={key}>
              {key}: {value}
            </option>
          ))}
        </select>
        <input
          value={phoneNumber.trim()}
          type="number"
          onChange={handlePhoneInputChange}
          name={name}
          className={`${styles['input-phone']}`}
          id={htmlFor}
        />
      </div>
    </div>
  );
};

export default SubmissionPhoneInput;
