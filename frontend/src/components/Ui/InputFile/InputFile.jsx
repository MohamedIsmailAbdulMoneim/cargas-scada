import Image from 'next/image';
import styles from './InputFile.module.scss';
import uploadIcon from '@/assets/cloud-upload-icon.svg';
import ErrorMessage from '../ErrorMSg/ErrorMSg';

const InputFile = ({
  name,
  label,
  multiple = false,
  handleFileChange,
  width,
  style,
  isFileUploaded,
  file,
  allowedExtensions = '',
  errMsg = '',
}) => {
  return (
    <div className={styles['container']}>
      <label className={styles['input-label']}>{label}</label>
      <div className={styles['input-like-container']}>
        <div style={style ? { style } : null} className={styles['input-like']}>
          <input
            accept="application/.pdf, image/*"
            onChange={handleFileChange}
            multiple={multiple}
            name={name}
            type="file"
            className={styles['file-input']}
            id={name}
          />

          {isFileUploaded ? (
            <h3 className={styles['input-placeholder']}>
              {multiple
                ? Object.values(file)
                    .map((file) => file)
                    .join(', ')
                : file}
            </h3>
          ) : (
            <h3 className={styles['input-placeholder']}>{allowedExtensions}</h3>
          )}
        </div>
        <label htmlFor={name}>
          <div
            style={isFileUploaded ? { backgroundColor: 'green' } : {}}
            className={styles['btn']}
          >
            <Image
              className={styles['upload-svg']}
              height="0"
              width="0"
              src={uploadIcon}
              alt="upload-icon"
            />
            <span>{isFileUploaded ? 'Uploaded' : 'Upload'}</span>
          </div>
        </label>
        {/* <label className={styles["input-label"]} htmlFor={name}>Upload {label}</label> */}
      </div>
      {errMsg && (
        <div style={{ textAlign: 'center', width: '100%' }}>
          {' '}
          <ErrorMessage fontSize="1.4rem" message={errMsg} />{' '}
        </div>
      )}
    </div>
  );
};

export default InputFile;
