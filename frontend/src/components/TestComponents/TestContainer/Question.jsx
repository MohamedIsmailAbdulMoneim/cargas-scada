import Image from 'next/image';

import styles from './TestContainer.module.scss';

const ImageQuestion = ({ imgSrc }) => {
  return (
    <div>
      <Image
        src={imgSrc}
        width={0}
        height={0}
        priority={true}
        sizes="100vw"
        className={styles['question_img']}
        alt="question_image"
      />
    </div>
  );
};

const ImageOption = ({ imgSrc }) => {
  return (
    <Image
      className={styles['option_img']}
      width={0}
      height={0}
      priority={true}
      sizes="100vw"
      src={imgSrc}
      alt="question_image"
    />
  );
};

const Question = ({
  question_text,
  question_format,
  question_type,
  options,
  handleGetAnswer,
  questionAnswer,
  related_picture
}) => {

  return (
    <div className={styles['question']}>
      {question_format === 'image' ? (
        <ImageQuestion imgSrc={question_text} />
      ) : (
        <>
          <h2>{question_text}</h2>
          {related_picture ? <Image src={related_picture} width={300} height={300} alt='Question Image' /> : ''}
        </>
      )}
      {question_type === 'short_answer' ? (
        <input
          onChange={(e) => handleGetAnswer(e)}
          className={styles['short-answer']}
          type="text"
        />
      ) : (
        <form
          className={
            options[0]?.option_format === 'image'
              ? styles['image-options']
              : styles['options']
          }
        >
          {options?.map((option, index) => (
            <label
              key={index}
              htmlFor={option.option_id}
              className={
                option?.option_format === 'image'
                  ? styles['image-option']
                  : styles['option']
              }
            >
              <input
                onChange={handleGetAnswer}
                onClick={(e) => handleGetAnswer(e)}
                value={option.option_text}
                name="question"
                id={option.option_id}
                type="radio"
                checked={questionAnswer === option.option_text}
              />
              {option.option_format === 'image' ? (
                <ImageOption imgSrc={option.option_text} />
              ) : (
                option.option_text
              )}
            </label>
          ))}
        </form>
      )}
    </div>
  );
};

export default Question;
