import { unstable_noStore as noStore } from 'next/cache';
import { decodeExamLinkId, encodeString, getSubmissionEntered } from '../utils';
const isBrowser = () => typeof window !== 'undefined';

const checkStudentExists = (student_id) => {
  noStore();
  return fetch('/api/v1/submissionform/studentexists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      student_id,
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

const getCustomStudent = (student_id) => {
  noStore();
  return fetch(`/api/v1/students/customstudent/?student_id=${student_id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('An error happened');
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
};

const sendExamUniversityDiffs = (
  universityForm,
  examForm,
  student_id,
  randChars,
) => {
  if (!examForm) return;
  const diffs = {};

  if (universityForm['21'] !== examForm['21']) {
    diffs.exam_form_first_name = examForm['21'];
    diffs.university_form_first_name = universityForm['21'];
  }
  if (universityForm['22'] !== examForm['22']) {
    diffs.exam_form_last_name = examForm['22'];
    diffs.university_form_last_name = universityForm['22'];
  }
  if (universityForm['24'] !== examForm['24']) {
    diffs.exam_form_bod = examForm['24'];
    diffs.university_form_bod = universityForm['24'];
  }
  if (universityForm['25'] !== examForm['25']) {
    diffs.exam_form_email = examForm['25'];
    diffs.university_form_email = universityForm['25'];
  }
  if (universityForm['26'] !== examForm['26']) {
    diffs.exam_form_phone_number = examForm['26'];
    diffs.university_form_phone_number = universityForm['26'];
  }
  if (universityForm['30'] !== examForm['30']) {
    diffs.exam_form_country = examForm['30'];
    diffs.university_form_country = universityForm['30'];
  }
  if (
    universityForm['33'] &&
    examForm['33'] &&
    universityForm['33'] === examForm['33']
  ) {
    let guardianDiffer = false;

    if (universityForm['31'] !== examForm['31']) {
      guardianDiffer = true;
      diffs.exam_form_guardian_name = examForm['31'];
      diffs.university_form_guardian_name = universityForm['31'];
    }
    if (universityForm['32'] !== examForm['32']) {
      guardianDiffer = true;
      diffs.university_form_guardian_phone_number = universityForm['32'];
      diffs.exam_form_guardian_phone_number = examForm['32'];
    }

    if (guardianDiffer) {
      diffs.university_form_guardian_relationship = universityForm['33'];
      diffs.exam_form_guardian_relationship = examForm['33'];
    }
  }

  if (
    universityForm['36'] &&
    examForm['33'] &&
    universityForm['36'] === examForm['33']
  ) {
    let guardianDiffer = false;

    if (universityForm['34'] !== examForm['31']) {
      guardianDiffer = true;
      diffs.exam_form_guardian_name = examForm['31'];
      diffs.university_form_guardian_name = universityForm['34'];
    }
    if (universityForm['35'] !== examForm['32']) {
      guardianDiffer = true;
      diffs.university_form_guardian_phone_number = universityForm['35'];
      diffs.exam_form_guardian_phone_number = examForm['32'];
    }

    if (guardianDiffer) {
      diffs.university_form_guardian_relationship = universityForm['36'];
      diffs.exam_form_guardian_relationship = examForm['33'];
    }
  }

  if ((universityForm['31'] || universityForm['34']) && !examForm['31']) {
    if (universityForm['31']) {
      diffs.exam_form_guardian_name = examForm['31'];
      diffs.university_form_guardian_name = universityForm['31'];
      diffs.university_form_guardian_phone_number = universityForm['32'];
      diffs.exam_form_guardian_phone_number = examForm['32'];
      diffs.university_form_guardian_relationship = universityForm['33'];
      diffs.exam_form_guardian_relationship = examForm['33'];
    }
    if (universityForm['34'] && !universityForm['31']) {
      diffs.exam_form_guardian_name = examForm['31'];
      diffs.university_form_guardian_name = universityForm['34'];
      diffs.university_form_guardian_phone_number = universityForm['35'];
      diffs.exam_form_guardian_phone_number = examForm['32'];
      diffs.university_form_guardian_relationship = universityForm['36'];
      diffs.exam_form_guardian_relationship = examForm['33'];
    }
  }

  const diffsLength = Object.keys(diffs).length;

  if (diffsLength > 0) {
    diffs.exam_form_first_name = examForm['21'];
    diffs.university_form_first_name = universityForm['21'];
    diffs.exam_form_last_name = examForm['22'];
    diffs.university_form_last_name = universityForm['22'];
    diffs.student_id = student_id;
    diffs.random_chars = randChars;
  } else if (diffsLength === 0) return;

  return fetch('/api/v1/submissionform/examuniversitydiffs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      student_id,
      data: diffs,
      link: `${process.env.NEXT_PUBLIC_APOSTROPHE_PORTAL}/${randChars}`,
    }),
  }).then();
};

const handleSubmitData = (setters, examForm) => {
  const { updateState, setIsFormSubmitted, setIsSubmitting } = setters;
  if (!isBrowser) return;
  const submissionForm = localStorage.getItem('submissionForm')
    ? JSON.parse(localStorage.getItem('submissionForm'))
    : {};

  noStore();
  if (
    submissionForm['3'] === 'English' &&
    (!submissionForm['47'] || !submissionForm['48'])
  ) {
    updateState({
      msg: 'please answer questions',
      error: true,
    });

    return;
  } else if (submissionForm['3'] === 'Turkish' && !submissionForm['51']) {
    updateState({
      msg: 'please answer questions',
      error: true,
    });

    return;
  } else if (submissionForm['47'] === 'yes' && !submissionForm['50']) {
    updateState({
      msg: 'please upload toefl certificate',
      error: true,
    });
    return;
  } else if (submissionForm['48'] === 'yes' && !submissionForm['39']) {
    updateState({
      msg: 'please upload ielts certificate',
      error: true,
    });
    return;
  } else if (submissionForm['51'] === 'yes' && !submissionForm['40']) {
    updateState({
      msg: 'please upload tomer certificate',
      error: true,
    });
    return;
  }
  updateState({
    msg: '',
    error: false,
  });
  const usrUploadData = localStorage.getItem('usrUploadData');

  const guestData = {
    guest_id: decodeExamLinkId(usrUploadData.slice(3)),
    random_chars: usrUploadData.slice(0, 3),
  };
  setIsSubmitting(true);
  fetch(`/api/v1/submissionform/studentinfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentInfo: submissionForm,
      guest_id: guestData.guest_id,
      random_chars: guestData.random_chars,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('error while submitting form');
      }

      setIsFormSubmitted(true);
      localStorage.setItem('isFormSubmitted', true);
      localStorage.removeItem('itemsExpireDate');
      localStorage.removeItem('submissionForm');
      localStorage.removeItem('26');
      localStorage.removeItem('27');
      localStorage.removeItem('32');
      localStorage.removeItem('35');

      const universityForm = {
        21: submissionForm['21'],
        22: submissionForm['22'],
        24: submissionForm['24'],
        25: submissionForm['25'],
        26: submissionForm['26'],
        30: submissionForm['30'],
        31: submissionForm['31'],
        32: submissionForm['32'],
        33: submissionForm['33'],
        34: submissionForm['34'],
        35: submissionForm['35'],
        36: submissionForm['36'],
      };

      sendExamUniversityDiffs(
        universityForm,
        examForm,
        guestData.guest_id,
        guestData.random_chars,
      );
      setIsSubmitting(false);
    })
    .catch((error) => {
      localStorage.setItem('isFormSubmitted', false);
      console.error('An error occurred:', error);
      updateState({
        msg: 'error while submiting form',
        error: true,
      });
      setIsSubmitting(false);
      throw new Error(error);
    });
};

const upload = (file, data, setters, method) => {
  if (!isBrowser()) return;
  const { updateProgress, updateState, setIsModalOpen } = setters;
  const submissionEntered = getSubmissionEntered();

  try {
    const formData = new FormData();
    const filesIds = Object.keys(file);
    formData.append('guest_id', decodeExamLinkId(data.guest_id));
    formData.append('random_chars', data.random_chars);

    let fileKey;

    for (let i = 0; i < filesIds.length; i++) {
      const fileFieldName = filesIds[i];
      const fileData = file[fileFieldName];

      fileKey = fileFieldName;

      if (fileFieldName === '41') {
        // Handle '41' as an array of files
        for (let j = 0; j < fileData.length; j++) {
          formData.append(fileFieldName, fileData[j]); // Append each file individually for field '41'
        }
      } else {
        // Append single files for other fields
        formData.append(fileFieldName, fileData);
      }
    }

    const xhr = new XMLHttpRequest();

    xhr.open(method, `/api/v1/submissionform/upload`, true);

    // Track the progress of the upload
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const progress = Math.floor((event.loaded / event.total) * 100);
        updateProgress(progress);
      }
    };

    xhr.onload = function () {
      setIsModalOpen(false);
      updateProgress(0);
      if (xhr.status === 200) {
      } else {
        submissionEntered[fileKey] = null;
        localStorage.setItem(
          'submissionForm',
          JSON.stringify(submissionEntered),
        );
        updateState({
          msg: 'error while uploading form',
          error: true,
        });

        console.error('Upload failed:', xhr.responseText);
      }
    };

    xhr.onerror = function () {
      console.error('Upload error.');
    };

    xhr.send(formData);
  } catch (err) {
    console.log(err);
  }
};

const handleUploadFile = (file, setters) => {
  if (!isBrowser()) return;
  const { updateState } = setters;
  const submissionEntered = getSubmissionEntered();
  const method = submissionEntered[Object.keys(file)[0]] ? 'PUT' : 'POST';

  try {
    noStore();
    const usrUploadData = localStorage.getItem('usrUploadData');
    const guestData = {
      guest_id: usrUploadData.slice(3),
      random_chars: usrUploadData.slice(0, 4),
    };
    upload(file, guestData, setters, method);
  } catch (err) {
    updateState({
      msg: 'error while submiting form',
      error: true,
    });
  }
};

const handleStepSubmit = async (prevState, formData) => {
  if (!isBrowser()) return;
  let submissionForm = localStorage.getItem('submissionForm')
    ? JSON.parse(localStorage.getItem('submissionForm'))
    : {};
  submissionForm = { ...submissionForm, [formData.objKey]: formData.objVal };
  if (formData.objVal === 'Select')
    submissionForm = { ...submissionForm, [formData.objKey]: null };
  if (formData.objVal.length === 0)
    submissionForm = { ...submissionForm, [formData.objKey]: null };
  localStorage.setItem('submissionForm', JSON.stringify(submissionForm));
};

export {
  checkStudentExists,
  getCustomStudent,
  handleSubmitData,
  handleStepSubmit,
  handleUploadFile,
};
