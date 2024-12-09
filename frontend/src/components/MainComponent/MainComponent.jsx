'use server';

import ProfileComponents from '../ProfileComponents/ProfileComponents';
import TestComponents from '../TestComponents/TestComponents';
import { checkStudentIdExists, getLinkData } from '@/lib/tests/testsLib';
import { decodeExamLinkId } from '@/lib/utils';

const MainComponent = async ({ testId, duration, searchParams }) => {
  const examParam = searchParams?.a;
  const part = searchParams?.part;
  const decodedId = decodeExamLinkId(examParam?.slice(3));
  const randChars = examParam?.slice(0, 3);

  const examData = await getLinkData(decodedId, randChars);

  if (examData?.message === 'the requested id is not found') {
    return (
      <div
        style={{
          margin: 'auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h1>This is an invalid link</h1>
        <h1>هذا الرابط غير صحيح</h1>
      </div>
    );
  }

  let testName = examData?.data.bitrix_request;
  if (examData?.data.bitrix_request === 'SAT' && part === '1') {
    testName = 'MATH';
  } else if (examData?.data.bitrix_request === 'SAT' && part === '2') {
    testName = 'ENGLISH';
  } else {
    testName = examData?.data.bitrix_request;
  }

  const student = examData?.data.student_id;

  const studentCount = await checkStudentIdExists(student);

  const examTimes = examData?.data.exam_times;

  const sameExam =
    (testId === 1 && (testName === 'MATH' || testName === 'SAT')) ||
    (testId === 2 && (testName === 'ENGLISH' || testName === 'SAT')) ||
    (testId === 3 && testName === 'PRACTICE');

  const studentRegestered = +studentCount?.res.student_count;

  return sameExam ? (
    studentRegestered === 0 ? (
      <ProfileComponents student={student} testId={testId} />
    ) : studentRegestered === 1 ? (
      <TestComponents
        testId={testId}
        student={student}
        testName={testName}
        part={part}
        duration={duration}
        sat={examData?.data?.test_name === 'SAT' ? true : false}
        examTimes={examTimes}
        examParam={examParam}
      />
    ) : (
      ''
    )
  ) : (
    <div style={{ margin: 'auto', textAlign: 'center' }}>
      <h1>You are not authorised to enter this exam</h1>
    </div>
  );
};

export default MainComponent;
