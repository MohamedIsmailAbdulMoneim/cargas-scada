'use client'

import Image from 'next/image';

import styles from './TestChoiceContainer.module.scss';

import Link from 'next/link';


const TestChoiceContainer = ({
  img_src = '',
  test_name = '',
  test_description = '',
  link = '',
  examStatus,
  examParam,
}) => {


  return (
    <div className={styles['card-style']}>
      <h1 style={{ textTransform: "capitalize" }}>{examStatus}</h1>
      <Image
        width={0}
        height={0}
        priority={true}
        sizes="100vw"
        src={img_src}
        alt={test_name}
        className={styles['icon-style']}
      />
      <div>
        <h2 className={styles['title-style']}>{test_name}</h2>
        <p className={styles['description-style']}>{test_description}</p>
      </div>

      <Link
        href={`${link}&a=${examParam}`}
        className={styles['button-style']}
      >
        Let&apos;s Start
      </Link>

    </div>
  );
};

export default TestChoiceContainer;
