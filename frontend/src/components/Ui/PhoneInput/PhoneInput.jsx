import { customList } from 'country-codes-list';
import styles from './PhoneInput.module.scss'

const PhoneInput = ({ label = 'Student Contact Number', phoneCodeName = 'student_phone_code', id = 'student_contact_number', inputName = 'student_phone_number',
    phoneCodeHandler, inputHandler, selectDefaultVal, inputDefaultVal }) => {
    const list = customList('countryNameEn', ' +{countryCallingCode}');

    return (
        <div className={styles['input-container']}>
            <label
                className={styles['input-label']}
                htmlFor="student_contact_number"
            >
                {label}
            </label>
            <div className={styles['phone-container']}>
                <select defaultValue={selectDefaultVal} onChange={phoneCodeHandler} name={phoneCodeName} className={styles['input']} id={id}>
                    {Object.entries(list).map(([key, value]) => (
                        <option key={key}>
                            {key}: {value}
                        </option>
                    ))}
                </select>
                <input defaultValue={inputDefaultVal} onBlur={inputHandler} name={inputName} className={`${styles['input-phone']}`} type="text" />
            </div>
        </div>
    )
}

export default PhoneInput