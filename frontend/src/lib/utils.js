import * as validator from 'validator';
const isBrowser = () => typeof window !== 'undefined';

const checkHumanNames = (name) => {
  console.log(!name || name.trim().length < 3 || /\d/.test(name));
  
  return !name || name.trim().length < 3 || /\d/.test(name);
}

export const getSubmissionEntered = () => {
  if (!isBrowser()) return;
  return localStorage.getItem('submissionForm')
    ? JSON.parse(localStorage.getItem('submissionForm'))
    : {};
};

export function generateRandomChars(length) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function encodeString(str) {
  return str.toString('16');
}

export function decodeExamLinkId(encodedUrl) {
  return parseInt(encodedUrl, 16) || null;
}

export const handleInputChange = (event, formAction, isChecked) => {
  if (!isBrowser()) return;

  let selectedValue;
  if (event.target.name === '2') {
    const countriesChosen = getSubmissionEntered()['2']
      ? getSubmissionEntered()['2']
      : [];
    if (isChecked) {
      selectedValue = [...countriesChosen, event.target.value];
    } else if (!isChecked) {
      if (event.target.value === 'Turkey') {
        const newSubmission = { ...getSubmissionEntered(), 5: 'no', 6: 'no' };
        localStorage.setItem('submissionForm', JSON.stringify(newSubmission));
      }
      selectedValue = countriesChosen.filter(
        (country) => country !== event.target.value,
      );
    }
  } else if (event.target.name === '37') {
    const departmentsChosen = getSubmissionEntered()['37']
      ? getSubmissionEntered()['37']
      : [];
    if (!departmentsChosen.includes(event.target.value))
      selectedValue = [...departmentsChosen, event.target.value];
    else selectedValue = departmentsChosen;
  } else {
    selectedValue = event.target.value;
  }
  // Fire form action
  formAction({ objKey: event.target.name, objVal: selectedValue });
};

export const handleCheckRequire = (curStep, stateSetter) => {
  const submissionForm = getSubmissionEntered();
  if (curStep === 1) {
    if (!submissionForm['1']) {
      stateSetter({
        msg: 'you should choose a degree',
        error: true,
      });

      return 'stop';
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 2) {
    if (!submissionForm['2']) {
      stateSetter({
        msg: 'you should choose a atleast one country',
        error: true,
      });

      return 'stop';
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 3) {
    if (!submissionForm['3']) {
      stateSetter({
        msg: 'you should choose a language',
        error: true,
      });
      return 'stop';
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 4) {
    let msg = 'you should ';
    let error;
    if (submissionForm['5'] === 'yes' && !submissionForm['7']) {
      msg += 'upload passport';
      error = true;
      stateSetter({
        msg: msg,
        error: error,
      });
      return 'stop';
    } else if (
      submissionForm['6'] === 'yes' &&
      !submissionForm['8'] &&
      !submissionForm['9']
    ) {
      msg += 'upload residency permit';
      error = true;
      stateSetter({
        msg: msg,
        error: error,
      });
      return 'stop';
    } else if (
      submissionForm['2'].includes('Turkey') &&
      !submissionForm['5'] &&
      !submissionForm['6']
    ) {
      msg +=
        'answer whether you have Turkish citizenship, a blue card, and a residence permit or not';
      error = true;
      stateSetter({
        msg: msg,
        error: error,
      });
      return 'stop';
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 5) {
    if (submissionForm['1'] === 'Masters') {
      const fieldsToCheck = {
        10: 'recommendation letter',
        11: 'bachelor transcript',
        12: 'bachelor certificate',
      };
      const missingFields = Object.entries(fieldsToCheck)
        .filter(([key]) => !submissionForm[key])
        .map(([, value]) => value);

      if (missingFields.length > 0) {
        stateSetter({
          msg: `You should enter the following: ${missingFields.join(', ')}`,
          error: true,
        });

        return 'stop';
      }
    } else if (
      submissionForm['1'] === 'Bachelor' &&
      submissionForm['2'].includes('Turkey') &&
      (submissionForm['2'].includes('Malaysia') ||
        submissionForm['2'].includes('Cyprus'))
    ) {
      const fieldsToCheck = {
        13: 'high school diploma',
        14: 'high school transcript',
      };
      if (submissionForm['43'] === 'yes')
        fieldsToCheck['16'] = 'sat certificate';
      if (submissionForm['44'] === 'yes')
        fieldsToCheck['17'] = 'igcse certificate';
      const missingFields = Object.entries(fieldsToCheck)
        .filter(([key]) => !submissionForm[key])
        .map(([, value]) => value);

      if (missingFields.length > 0) {
        stateSetter({
          msg: `You should enter the following: ${missingFields.join(', ')}`,
          error: true,
        });

        return 'stop';
      } else if (!submissionForm['42'] || !submissionForm['44']) {
        stateSetter({
          msg: `You should answer questions`,
          error: true,
        });

        return 'stop';
      } else if (submissionForm['42'] === 'yes' && !submissionForm['43']) {
        stateSetter({
          msg: `You should answer questions`,
          error: true,
        });

        return 'stop';
      } else {
        stateSetter({
          msg: '',
          error: false,
        });
      }
    } else if (
      submissionForm['1'] === 'Bachelor' &&
      submissionForm['2'].length === 1 &&
      submissionForm['2'][0] === 'Turkey'
    ) {
      const fieldsToCheck = {
        13: 'high school diploma',
        14: 'high school transcript',
      };
      if (submissionForm['43'] === 'yes')
        fieldsToCheck['16'] = 'sat certificate';
      const missingFields = Object.entries(fieldsToCheck)
        .filter(([key]) => !submissionForm[key])
        .map(([, value]) => value);

      if (!submissionForm['42']) {
        stateSetter({
          msg: `You should answer question`,
          error: true,
        });
        return 'stop';
      } else if (submissionForm['42'] === 'yes' && !submissionForm['43']) {
        stateSetter({
          msg: `You should answer question`,
          error: true,
        });
        return 'stop';
      } else if (missingFields.length > 0) {
        stateSetter({
          msg: `You should enter the following: ${missingFields.join(', ')}`,
          error: true,
        });

        return 'stop';
      } else {
        stateSetter({
          msg: '',
          error: false,
        });
      }
    } else if (
      submissionForm['1'] === 'Bachelor' &&
      !submissionForm['2'].includes('Turkey')
    ) {
      const fieldsToCheck = {
        13: 'high school diploma',
        14: 'high school transcript',
      };
      if (submissionForm['44'] === 'yes')
        fieldsToCheck['17'] = 'igcse certificate';
      const missingFields = Object.entries(fieldsToCheck)
        .filter(([key]) => !submissionForm[key])
        .map(([, value]) => value);
      if (!submissionForm['44']) {
        stateSetter({
          msg: `You should answer question`,
          error: true,
        });

        return 'stop';
      } else if (missingFields.length > 0) {
        stateSetter({
          msg: `You should enter the following: ${missingFields.join(', ')}`,
          error: true,
        });

        return 'stop';
      } else {
        stateSetter({
          msg: '',
          error: false,
        });
      }
    } else if (submissionForm['1'] === 'Phd') {
      const fieldsToCheck = {
        12: 'bachelor certificate',
        11: 'bachelor transcript',
        18: 'masters certificate',
        19: 'masters transcript',
      };
      const missingFields = Object.entries(fieldsToCheck)
        .filter(([key]) => !submissionForm[key])
        .map(([, value]) => value);

      if (missingFields.length > 0) {
        stateSetter({
          msg: `You should enter the following: ${missingFields.join(', ')}`,
          error: true,
        });

        return 'stop';
      }
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 6) {
    const fieldsToCheck = {
      20: 'photo',
      21: 'first name',
      22: 'last name',
      23: 'sex',
      24: 'birthdate',
    };
    const missingFields = Object.entries(fieldsToCheck)
      .filter(([key]) => !submissionForm[key])
      .map(([, value]) => value);

    if (missingFields.length > 0) {
      stateSetter({
        msg: `You should enter the following: ${missingFields.join(', ')}`,
        error: true,
      });

      return 'stop';
    } else if (checkHumanNames(submissionForm['21']) || checkHumanNames(submissionForm['22'])) {
      stateSetter({
        msg: 'Your name is incorrect',
        error: true
      });
      return 'stop'
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 7) {
    const fieldsToCheck = {
      25: 'email',
      26: 'phone number',
      27: 'whatsapp number',
    };
    const missingFields = Object.entries(fieldsToCheck)
      .filter(([key]) => !submissionForm[key])
      .map(([, value]) => value);

    if (missingFields.length > 0) {
      stateSetter({
        msg: `You should enter the following: ${missingFields.join(', ')}`,
        error: true,
      });

      return 'stop';
    } else if (
      !validator.isMobilePhone(submissionForm['26'], 'any', {
        strictMode: true,
      }) ||
      !validator.isMobilePhone(submissionForm['27'], 'any', {
        strictMode: true,
      })
    ) {
      stateSetter({
        msg: `Phone Number is  incorrect`,
        error: true,
      });

      return 'stop';
    } else if (
      !submissionForm['26'].includes('+') ||
      !submissionForm['27'].includes('+')
    ) {
      stateSetter({
        msg: `you should select country code`,
        error: true,
      });

      return 'stop';
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 8) {
    const fieldsToCheck = {
      28: 'passport number',
      29: 'nationality',
      30: 'country of residence',
      7: 'passport',
    };

    const missingFields = Object.entries(fieldsToCheck)
      .filter(([key]) => !submissionForm[key])
      .map(([, value]) => value);

    if (missingFields.length > 0) {
      stateSetter({
        msg: `You should enter the following: ${missingFields.join(', ')}`,
        error: true,
      });

      return 'stop';
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 9) {
    const fieldsToCheck = {
      45: 'father name',
      46: 'mother name',
    };
    const missingFields = Object.entries(fieldsToCheck)
      .filter(([key]) => !submissionForm[key])
      .map(([, value]) => value);

    if (missingFields.length > 0) {
      stateSetter({
        msg: `You should enter the following: ${missingFields.join(', ')}`,
        error: true,
      });

      return 'stop';
    } else if(checkHumanNames(submissionForm['45'] || submissionForm['46'])){
      stateSetter({
        msg: "Your father name is incorrect"
      })
    }else if(checkHumanNames(submissionForm['46'])){
      stateSetter({
        msg: "Your mother name is incorrect"
      })
    }
    else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 10) {
    const fieldsToCheck = {
      31: 'guardian one name',
      32: 'guardian one phone number',
      33: 'guardian one relationship',
    };
    const missingFields = Object.entries(fieldsToCheck)
      .filter(([key]) => !submissionForm[key])
      .map(([, value]) => value);

    if (missingFields.length > 0) {
      stateSetter({
        msg: `You should enter the following: ${missingFields.join(', ')}`,
        error: true,
      });

      return 'stop';
    } else if (
      !validator.isMobilePhone(submissionForm['32'], 'any', {
        strictMode: true,
      })
    ) {
      stateSetter({
        msg: `Phone number is incorrect`,
        error: true,
      });
      return 'stop';
    }
    else if (
      checkHumanNames(submissionForm["31"])
    ) {
      stateSetter({
        msg: `Your guardian one name is incorrect`,
        error: true,
      });
      return 'stop';
    }
    else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 11 && submissionForm['34']) {
    const fieldsToCheck = {
      35: 'guardian two phone number',
      36: 'guardian two relationship',
    };
    const missingFields = Object.entries(fieldsToCheck)
      .filter(([key]) => !submissionForm[key])
      .map(([, value]) => value);

    if (missingFields.length > 0) {
      stateSetter({
        msg: `You should enter the following: ${missingFields.join(', ')}`,
        error: true,
      });
      return 'stop';
    } else if (
      !validator.isMobilePhone(submissionForm['35'], 'any', {
        strictMode: true,
      })
    ) {
      stateSetter({
        msg: `Phone number is incorrect`,
        error: true,
      });
      return 'stop';
    } else if (
      (submissionForm['36'] === 'father' &&
        submissionForm['33'] === 'father') ||
      (submissionForm['36'] === 'mother' && submissionForm['33'] === 'mother')
    ) {
      stateSetter({
        msg: `You chosen your father or mother twice`,
        error: true,
      });
      return 'stop';
    }
    else if (
      checkHumanNames(submissionForm["34"])
    ) {
      stateSetter({
        msg: `Your guardian two name is incorrect`,
        error: true,
      });
      return 'stop';
    }

    else if (
      submissionForm["32"] === submissionForm["35"]
    ) {
      stateSetter({
        msg: `guardian one phone number is same as guardian two phone number`,
        error: true,
      });
      return 'stop';
    }
    else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  } else if (curStep === 12) {
    if (!submissionForm['37']) {
      stateSetter({
        msg: 'you should choose major',
        error: true,
      });

      return 'stop';
    } else {
      stateSetter({
        msg: '',
        error: false,
      });
    }
  }
};

function isOlderThan18(birthdate) {
  const birthDate = new Date(birthdate);
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if the birthdate hasn't occurred yet this year
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
}

export const stepSkipper = (currentStep, action) => {
  let submissionForm = getSubmissionEntered();

  if (
    currentStep === 2 &&
    submissionForm['2']?.length === 1 &&
    submissionForm['2'][0] === 'Malaysia' &&
    submissionForm['1'] === 'Diploma' &&
    action === 'next'
  ) {
    submissionForm = { ...submissionForm, 3: 'English' };
    localStorage.setItem('submissionForm', JSON.stringify(submissionForm));
    return 'skip three step';
  } else if (
    currentStep === 2 &&
    submissionForm['2']?.length === 1 &&
    submissionForm['2'][0] === 'Malaysia' &&
    submissionForm['1'] !== 'Masters' &&
    action === 'next'
  ) {
    submissionForm = { ...submissionForm, 3: 'English' };
    localStorage.setItem('submissionForm', JSON.stringify(submissionForm));
    return 'skip two step';
  } else if (
    currentStep === 2 &&
    submissionForm['2']?.length === 1 &&
    submissionForm['2'][0] === 'Malaysia' &&
    action === 'next'
  ) {
    submissionForm = { ...submissionForm, 15: null };
    localStorage.setItem('submissionForm', JSON.stringify(submissionForm));
  }

  if (
    currentStep === 3 &&
    !submissionForm['2'].includes('Turkey') &&
    submissionForm['1'] === 'Diploma' &&
    action === 'next'
  ) {
    return 'skip two step';
  } else if (
    currentStep === 3 &&
    !submissionForm['2'].includes('Turkey') &&
    submissionForm['1'] !== 'Diploma' &&
    action === 'next'
  ) {
    return 'skip one step';
  } else if (currentStep === 3 && submissionForm['2'].includes('Turkey')) {
    return;
  } else if (
    currentStep === 4 &&
    submissionForm['1'] === 'Diploma' &&
    action === 'next'
  ) {
    return 'skip one step';
  } else if (
    currentStep === 5 &&
    submissionForm['2']?.length === 1 &&
    submissionForm['2'][0] === 'Malaysia' &&
    submissionForm['1'] !== 'Masters' &&
    action === 'back'
  ) {
    submissionForm = { ...submissionForm, 3: 'English' };
    localStorage.setItem('submissionForm', JSON.stringify(submissionForm));
    return 'skip two step';
  } else if (
    currentStep === 5 &&
    !submissionForm['2'].includes('Turkey') &&
    action === 'back'
  ) {
    return 'skip one step';
  } else if (
    currentStep === 6 &&
    submissionForm['2']?.length === 1 &&
    submissionForm['2'][0] === 'Malaysia' &&
    submissionForm['1'] === 'Diploma' &&
    action === 'back'
  ) {
    submissionForm = { ...submissionForm, 3: 'English' };
    localStorage.setItem('submissionForm', JSON.stringify(submissionForm));
    return 'skip three step';
  } else if (
    currentStep === 6 &&
    !submissionForm['2'].includes('Turkey') &&
    submissionForm['1'] === 'Diploma' &&
    action === 'back'
  ) {
    return 'skip two step';
  } else if (
    currentStep === 6 &&
    submissionForm['2'].includes('Turkey') &&
    submissionForm['1'] === 'Diploma' &&
    action === 'back'
  ) {
    return 'skip one step';
  } else if (
    currentStep === 9 &&
    isOlderThan18(submissionForm['24']) &&
    action === 'next'
  ) {
    submissionForm['31'] = null;
    submissionForm['32'] = null;
    submissionForm['33'] = null;
    submissionForm['34'] = null;
    submissionForm['35'] = null;
    submissionForm['36'] = null;
    localStorage.setItem('submissionForm', JSON.stringify(submissionForm));
    return 'skip two step';
  } else if (
    currentStep === 12 &&
    isOlderThan18(submissionForm['24']) &&
    action === 'back'
  ) {
    return 'skip two step';
  }
};

export const getLastStep = () => {
  if (!isBrowser()) return;

  const lastStep = localStorage.getItem('formLastStep')
    ? Number(localStorage.getItem('formLastStep')) + 1
    : 0;

  return Number(lastStep);
};
