'use server';

import { unstable_noStore as noStore } from 'next/cache';
import * as validator from 'validator';

const insertRegForm = async (prevState, formData) => {
  const reformatPhoneNumber = (countryCode, phoneNumber) => {
    const formattedCountryCode = countryCode.replace(/\D/g, '');
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
    const phoneNumIncCountryCode =
      formattedPhoneNumber.startsWith(formattedCountryCode);

    return phoneNumIncCountryCode
      ? '+' +
          formattedCountryCode +
          formattedPhoneNumber.slice(formattedCountryCode.length)
      : '+' + formattedCountryCode + formattedPhoneNumber;
  };

  const regFormData = {
    email: formData.get('email'),
    first_name_english: formData.get('first_name_english'),
    last_name_english: formData.get('last_name_english'),
    phone_number: reformatPhoneNumber(
      formData.get('student_phone_code'),
      formData.get('student_phone_number'),
    ),
    birth_of_date: formData.get('birth_of_date'),
    guardian_name: formData.get('guradians_name'),
    guardian_number:
      formData.get('parent_phone_code') && formData.get('parent_phone_number')
        ? reformatPhoneNumber(
            formData.get('parent_phone_code'),
            formData.get('parent_phone_number'),
          )
        : null,
    guradian_relation: formData.get('guradian_relation'),
    student_country: formData.get('student_country'),
    student_id: formData.get('student_id'),
  };

  const isInvalidText = (text) => {
    return !text || text.trim().length < 3;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCourseData = () => {
    if (
      isInvalidText(regFormData.first_name_english) ||
      /\d/.test(regFormData.first_name_english)
    ) {
      return { message: 'Invalid first name', severity: 'error' };
    }
    if (
      isInvalidText(regFormData.last_name_english) ||
      /\d/.test(regFormData.last_name_english)
    ) {
      return { message: 'Invalid last name', severity: 'error' };
    }
    if (
      !validator.isMobilePhone(regFormData.phone_number, 'any', {
        strictMode: true,
      })
    ) {
      return { message: 'Invalid phone number', severity: 'error' };
    }
    if (
      isInvalidText(formData.get('student_phone_code')) ||
      formData.get('student_phone_code') === 'Select'
    ) {
      return { message: 'Invalid phone code', severity: 'error' };
    }

    if (isInvalidText(regFormData.email) || !isValidEmail(regFormData.email)) {
      return { message: 'Invalid email', severity: 'error' };
    }
    if (
      isInvalidText(regFormData.student_country) ||
      regFormData.student_country === 'Select'
    ) {
      return { message: 'Invalid country', severity: 'error' };
    }
    if (isInvalidText(regFormData.birth_of_date)) {
      return { message: 'Invalid birth date', severity: 'error' };
    }
    if (formData.get('guradians_name') !== null) {
      if (
        isInvalidText(regFormData.guardian_name) ||
        /\d/.test(regFormData.guardian_name)
      ) {
        return { message: 'Invalid parent name', severity: 'error' };
      }
    }
    if (
      formData.get('guradians_name') &&
      (isInvalidText(formData.get('parent_phone_code')) ||
        formData.get('parent_phone_code') === 'Select')
    ) {
      return { message: 'Invalid parent phone code', severity: 'error' };
    }
    if (formData.get('parent_phone_code')) {
      if (
        !validator.isMobilePhone(regFormData.guardian_number, 'any', {
          strictMode: true,
        })
      ) {
        return { message: 'Invalid guardian phone number', severity: 'error' };
      }
    }
    if (
      `${formData.get('student_phone_code')} - ${formData.get('student_phone_number')}` ===
      `${formData.get('parent_phone_code')} - ${formData.get('parent_phone_number')}`
    ) {
      return {
        message: 'Phone number is the same as parent phone number',
        severity: 'error',
      };
    }
    if (
      formData.get('guradians_name') &&
      (!formData.get('guradian_relation') ||
        formData.get('guradian_relation') === 'Select')
    ) {
      return { message: 'parent relation not found', severity: 'error' };
    }
    return { message: 'Valid data', severity: 'success' };
  };

  try {
    const formValidation = validateCourseData();

    if (formValidation.message === 'Valid data') {
      const studentCount = await checkStudentIdExists(
        formData.get('student_id'),
      );

      if (+studentCount.res.student_count === 1) {
        return formValidation;
      }

      noStore();

      const response = await fetch(`http://${process.env.API_LINK}/reg_form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regFormData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
    }

    return formValidation;
  } catch (error) {
    console.log(error);
  }
};

const getQuestionsWithOptions = async (testId) => {
  try {
    noStore();

    const response = await fetch(
      `http://${process.env.API_LINK}/getQuestions?testId=${testId}`,
    );

    const data = await response.json();
    return data;
  } catch (err) {}
};

const insertStudentAnswers = async (answers, studentTestId) => {
  try {
    noStore();

    const response = await fetch(
      `http://localhost:3005/insertAStudentAnswers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, studentTestId }),
      },
    );

    // if(!response){
    //   throw new Error('')
    // }

    const data = await response.json();
    return data;
  } catch (err) {}
};

const startStudentExam = async (examId, studentId) => {
  try {
    noStore();

    const response = await fetch(
      `http://${process.env.API_LINK}/insertStudentTest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ examId, studentId }),
      },
    );

    return response.json();
  } catch (err) {}
};

const getAstudentExamId = async (examId, studentId) => {
  try {
    noStore();

    const response = await fetch(
      `http://${process.env.API_LINK}/getStudentExamId?examId=${examId}&studentId=${studentId}`,
    );
    const res = await response.json();

    return res;
  } catch (err) {}
};

const getAstudentExamStatus = async (studentTestId) => {
  try {
    noStore();

    const response = await fetch(
      `http://${process.env.API_LINK}/getStudentExamStatus?studentTestId=${studentTestId}`,
    );
    const examStatus = await response.json();

    return examStatus.data;
  } catch (err) {}
};

const calcAStudentExamScore = async (studentTestId) => {
  noStore();

  try {
    const response = await fetch(
      `http://${process.env.API_LINK}/calcStudentExamScore`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentTestId }),
      },
    );
    const studentScore = await response.json();
    return studentScore;
  } catch (err) {}
};

const calcAStudentPracticeScore = async (student, studentTestId) => {
  noStore();

  try {
    const response = await fetch(
      `http://${process.env.API_LINK}/calcStudentPracticeScore`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student, studentTestId }),
      },
    );
    const studentScore = await response.json();

    return studentScore;
  } catch (err) {}
};

const checkStudentIdExists = async (studentId) => {
  try {
    noStore();

    const response = await fetch(
      `http://${process.env.API_LINK}/checkStudentId?studentId=${studentId}`,
    );

    return await response.json();
  } catch (err) {}
};

const getLinkData = async (id, randChars) => {
  try {
    noStore();
    const response = await fetch(
      `http://${process.env.API_LINK}/link_data?id=${id}&randChars=${randChars}`,
    );

    return await response.json();
  } catch (err) {}
};

const getExamScore = async (id, examName, studentTestId) => {
  try {
    noStore();
    const response = await fetch(
      `http://${process.env.API_LINK}/exam_score?id=${id}&examName=${examName}&studentTestId=${studentTestId}`,
    );
    return await response.json();
  } catch (err) {}
};

const logStudentAnswers = async (studentId, studentAnswers) => {
  try {
    noStore();
    const response = await fetch(
      `http://${process.env.API_LINK}/api/v1/localstorage/examform`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, studentAnswers }),
      },
    );

    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export {
  getQuestionsWithOptions,
  insertStudentAnswers,
  startStudentExam,
  getAstudentExamId,
  getAstudentExamStatus,
  calcAStudentExamScore,
  calcAStudentPracticeScore,
  insertRegForm,
  checkStudentIdExists,
  getLinkData,
  getExamScore,
  logStudentAnswers,
};
