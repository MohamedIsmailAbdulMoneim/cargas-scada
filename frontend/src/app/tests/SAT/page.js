import { Suspense } from 'react';

import TestChoiceContainer from '@/components/TestChoiceContainer/TestChoiceContainer';
import styles from './tests.module.scss';
import { decodeExamLinkId } from '@/lib/utils';
import { getAstudentExamId, getAstudentExamStatus, getLinkData } from '@/lib/tests/testsLib';

const exams = [
  {
    id: 1,
    img_src: '/tests/logos/SAT-MATH1.png',
    test_name: 'MATH',
    test_description:
      'In this test we will determine your level in MATH. The exam is designed to test your mathematical knowledge in various topics such as, Algebra, Geometry, Statistics, and various other topics. Click down below to start your test!',
    link: '/tests/1?part=1',
  },
  {
    id: 2,
    img_src: '/tests/logos/SAT-English.png',
    test_name: 'ENGLISH',
    test_description:
      'In this test we will determine your level of English, and which course will be suitable for you. The exam is designed mainly to test your knowledge in Grammar and vocabulary. Click down below to start your test',
    link: '/tests/2?part=2',
  },
];

const SatPage = async ({ searchParams }) => {
  const examParam = searchParams?.a

  const decodedId = decodeExamLinkId(examParam?.slice(3))
  const randChars = examParam?.slice(0, 3)
  const examData = await getLinkData(decodedId, randChars)

  if (examData?.message === "the requested id is not found") {
    return <div style={{ margin: "auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>This is an invalid link</h1>
      <h1>هذا الرابط غير صحيح</h1>
    </div>
  }

  const studentId = examData.data.student_id;
  const mathStudentexamId = await getAstudentExamId(1, studentId)
  const englishStudentexamId = await getAstudentExamId(2, studentId)

  const mathExamStatus = mathStudentexamId ? await getAstudentExamStatus(mathStudentexamId) : "Not started"
  const englishExamStatus = englishStudentexamId ? await getAstudentExamStatus(englishStudentexamId) : "Not started"





  return (
    <>
      <header
        style={{
          margin: '0 auto',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <h1 style={{ fontSize: '2.5em', color: '#333' }}>SAT Tests</h1>
        <p style={{ fontSize: '1.2em', color: '#777' }}>
          Determine your level and find the right course for you!
        </p>
      </header>
      <div className={styles['container']}>
        <Suspense fallback={<h1>Loading...</h1>}>
          {exams.map((exam, index) => (
            <TestChoiceContainer searchParams={searchParams} key={index} {...exam} examStatus={index === 0 ? mathExamStatus : englishExamStatus} examParam={examParam} studentId={studentId} />
          ))}
        </Suspense>
      </div>
    </>
  );
};

export default SatPage;
