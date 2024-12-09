'use client';
import { useState, useEffect, useMemo } from 'react';

import styles from './TestContainer.module.scss';
import { LocalStorageManager } from '@/lib/localStorage/localStorage';
import TestNavigation from './Navigation';
import ProgressBar from './ProgressBar';
import Question from './Question';

import {
  calcAStudentExamScore,
  calcAStudentPracticeScore,
  getExamScore,
  insertStudentAnswers,
} from '@/lib/tests/testsLib';
import CountdownTimer from '../Countdown/CountdownTimer';

const TestContainer = ({ questions = [], studentTestId, handleSubmitexam, testName, duration, student, sat = false }) => {

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionAnswer, setQuestionAnswer] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for spinner

  const lastQuestion = questions.length - 1;

  const getNextQuestion = () => {
    if (currentQuestion === lastQuestion) return
    setCurrentQuestion((old) => old + 1);
    quizStorage.handleAnswerChange(
      questions[currentQuestion]?.id,
      questionAnswer,
      studentTestId,
    );

    const nextQuestionHasAnswer =
      quizStorage.data[`${testName}_quiz`][currentQuestion + 1]?.student_answer;
    if (nextQuestionHasAnswer) {
      setQuestionAnswer(nextQuestionHasAnswer);
      return;
    }
    setQuestionAnswer(null);
  };

  const getPreviousQuestion = () => {
    setCurrentQuestion((old) => old - 1);
    const previousQuestionHasAnswer =
      quizStorage.data[`${testName}_quiz`][currentQuestion - 1]?.student_answer;
    if (previousQuestionHasAnswer) {
      setQuestionAnswer(previousQuestionHasAnswer);
      return;
    }
  };

  const handleStudentAnswer = (e) => {
    setQuestionAnswer(e.target.value);
  };

  const handleSubmitExam = (e) => {
    e.preventDefault();

    setLoading(true); // Start loading spinner

    quizStorage.handleAnswerChange(
      questions[currentQuestion]?.id,
      questionAnswer,
      studentTestId,
    );

    const studentAnswers = quizStorage.data[[`${testName}_quiz`]];
    quizStorage.removeItem();

    insertStudentAnswers(studentAnswers, studentTestId).then((data) => {
      if (testName === "PRACTICE") {
        setLoading(false);
        handleSubmitexam()
        calcAStudentPracticeScore(student, studentTestId).then(data => {



        })
      } else if (testName !== "PRACTICE") {
        setLoading(false);
        handleSubmitexam()
        calcAStudentExamScore(studentTestId).then(data => {
          getExamScore(student, testName, studentTestId).then((data) => {

          })
        });
      }
    }).catch(err => {

    });
  };



  const quizStorage = useMemo(() => {
    return new LocalStorageManager(`${testName}_quiz`);
  }, []);

  useEffect(() => {
    quizStorage.saveToLocalStorage();
    if (quizStorage.data[`${testName}_quiz`]?.length > 0) {
      const savedQuestions = quizStorage.data[`${testName}_quiz`];
      const lastQuestionIndex = savedQuestions.length - 1;
      setCurrentQuestion(lastQuestionIndex);
      setQuestionAnswer(savedQuestions[lastQuestionIndex].student_answer);
    } else setCurrentQuestion(0);
  }, []);



  return (
    studentTestId &&
    <>
      {currentQuestion !== null && questions.length > 0 ? (
        <section className={styles['test-container']}>
          <header className={styles['header-container']}>
            <h2>{testName} Test</h2>
            <h2>{currentQuestion + 1}/{questions.length}</h2>
          </header>
          <div style={{ textAlign: 'center' }}>
            <CountdownTimer
              duration={duration} // Reset to 40 seconds for each question
              questionId={questions[currentQuestion]?.id} // Track current question ID
              action={getNextQuestion} // Move to the next question when time is up
              color="black"
            />
          </div>
          <ProgressBar
            currentQuestion={currentQuestion}
            questionsLength={questions.length}
          />
          <Question
            questionAnswer={questionAnswer}
            handleGetAnswer={handleStudentAnswer}
            {...questions[currentQuestion]}
          />
          <TestNavigation
            currentQuestion={currentQuestion}
            questionsLength={questions.length}
            getNextQuestion={getNextQuestion}
            getPreviousQuestion={getPreviousQuestion}
          />
          {lastQuestion === currentQuestion && (
            <button
              onClick={(e) => handleSubmitExam(e)}
              className={styles['submit-button']}
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </section>
      ) : ""}
    </>
  );

};

export default TestContainer;
