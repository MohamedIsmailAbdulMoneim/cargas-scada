'use client';

import correct from "@/assets/correct.svg"
import styles from './TestContainer/TestContainer.module.scss';
import { useEffect, useState } from 'react';

import TestContainer from '@/components/TestComponents/TestContainer/TestContainer';
import {
  getQuestionsWithOptions,
  startStudentExam,
  getAstudentExamId,
  getAstudentExamStatus,
  logStudentAnswers,
} from '@/lib/tests/testsLib';
import Image from 'next/image';
import ContactUs from "./ContactUs/ContactUs";


const TestComponents = ({ student, testId, testName, part = null, duration, sat = false, examParam }) => {
  const [questions, setQuestions] = useState([]);
  const [studentExamId, setStudentExamId] = useState(null);
  const [examStatus, setExamStatus] = useState(null);
  const [examDone, setExamDone] = useState(false);
  const [startExamMsg, setStartExamMsg] = useState(false)



  const handleReSubmit = () => {
    startStudentExam(testId, student).then(() => {
      window.location.reload();
    })
  }

  useEffect(() => {
    getAstudentExamId(testId, student).then((data) => {

      if (!data) startStudentExam(testId, student).then(result => {

        setStudentExamId(result.insertedId)
        if (result?.msg === "success") setStartExamMsg(true)
      })
      if (data) {
        setStudentExamId(data)

        if (studentExamId) {

          getAstudentExamStatus(data).then((data) => {
            if (data !== 'completed') getQuestionsWithOptions(part === "1" ? 1 : (part ? 2 : testId)).then((data) => setQuestions(data));

            setExamStatus(data)
          })
        };
      }

    });
  }, [testId, student, studentExamId]);

  useEffect(() => {

    const interval = setInterval(() => {
      const studentAnswers = localStorage.getItem(testName + '_quiz')

      if (examStatus !== "completed" && !examDone)
        logStudentAnswers(student, studentAnswers).then()
    }, 10000)

    return () => clearInterval(interval)
  }, [examDone, examStatus])

  const handleSubmitexam = () => {
    setExamDone(true);
  };




  if (examDone) {
    return (
      <div className={styles["submission-container"]}>
        <Image src={correct} alt='done' />
        <h1>Completed!</h1>
        {part &&
          <div className={styles["different-exam-link-container"]}>
            <a href={`/tests/SAT?a=${examParam}`} className={styles["different-exam-link"]}>Pick a Different Exam</a>
          </div>
        }

        <ContactUs />
      </div>
    );
  }

  // Early return if the exam is completed
  if (examStatus === 'completed') {
    return (
      <div className={styles["submission-container"]}>
        <h3 style={{ fontSize: "1.3rem" }}>Attention: Retaking the exam could impact your final score!</h3>
        <button className={styles["submition-btn"]} onClick={handleReSubmit}>Retake the exam</button>
        {part &&
          <div className={styles["different-exam-link-container"]}>
            <a href={`/tests/SAT?a=${examParam}`} className={styles["different-exam-link"]}>Pick a Different Exam</a>
          </div>
        }


      </div>
    );
  }



  return (
    examStatus === "in_progress" &&
    <TestContainer
      questions={questions}
      testId={testId}
      studentTestId={studentExamId}
      handleSubmitexam={handleSubmitexam}
      testName={testName}
      duration={duration}
      student={student}
      sat={sat}
      examParam={examParam}
    />
  );
};

export default TestComponents;
