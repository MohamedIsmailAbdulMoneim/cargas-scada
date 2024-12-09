const { logMessage } = require("./system.utils");
const axios = require("axios");

const BITRIX_INFO_WEBHOOK = process.env.BITRIX_GET_STUDENT;
const entity_id = process.env.ENTITY_ID;
const BITRIX_URL = process.env.BITRIX_UPDATE_STUDENT;
const nextStage = process.env.NEXTSTAGE;
const BITRIX_URL_DEAL = process.env.BITRIX_URL_DEAL;
const newSTAGE_ID = process.env.STAGE_ID_DEAL;
const bitrixUrl = process.env.BITRIX_UPDATE_STUDENT;
const BITRIX_INTEREST_SERVICE = process.env.BITRIX_SERVICE_OF_INTEREST;
const BITRIX_ENGLISH_SCORE = process.env.BITRIX_ENGLISH_SCORE;
const BITRIX_MATH_SCORE = process.env.BITRIX_MATH_SCORE;
const BITRIX_GURADIAN_NUMBER = process.env.BITRIX_GURADIAN_NUMBER;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendUniversityFormLink = async (link, id) => {
  try {
    const response = await fetch(
      `${bitrixUrl}/?entityTypeId=${entity_id}&id=${id}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application:json",
        },
        body: JSON.stringify({
          fields: {
            [process.env.BITRIX_UNIVERSITY_FORM_LINK]: link,
          },
        }),
      }
    );
    const data = await response.json();
    logMessage(
      "university form link sent to bitrix is successfuly",
      "Success",
      "INFO",
      {
        link,
        id,
      }
    );
    return data;
  } catch (error) {
    logMessage(
      "Internal error while sending university form link to Bitrix failed",
      `Error sending exam: ${error}`,
      "Error",
      {
        link,
        id,
        entityTypeId,
      }
    );
  }
};

const sendExamLink = async (link, id, entityTypeId) => {
  try {
    const response = await fetch(
      `${bitrixUrl}/?entityTypeId=${entityTypeId}&id=${id}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            [process.env.BITRIX_EXAM_LINK]: link,
          },
        }),
      }
    );

    const data = await response.json();

    logMessage("Exam sent to bitrix is successfuly", "Success", "INFO", {
      link,
      id,
      entityTypeId,
    });

    return data; // Return the response data as an object
  } catch (error) {
    logMessage(
      "Internal error while sending exam to Bitrix failed",
      `Error sending exam: ${error}`,
      "Error",
      {
        link,
        id,
        entityTypeId,
      }
    );
  }
};

const regFormExam = async (formData) => {
  const {
    email,
    first_name_english,
    last_name_english,
    phone_number,
    birth_of_date,
    student_country,
    student_id,
    guardian_name,
    guardian_number,
    guradian_relation,
  } = formData;

  try {
    const response = await fetch(
      `${bitrixUrl}/?entityTypeId=1068&id=${student_id}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: student_id,
          fields: {
            [process.env
              .BITRIX_FULL_NAME]: `${first_name_english} ${last_name_english}`,
            [process.env.BITRIX_PHONE_NUMBER]: phone_number,
            [process.env.BITRIX_EMAIL]: email,
            [process.env.BITRIX_STUDENT_COUNTERY]: student_country,
            [process.env.BITRIX_BIRTHDATE]: birth_of_date,
            [process.env.BITRIX_GURADIAN_NAME]: guardian_name,
            [process.env.BITRIX_GURADIAN_NUMBER]: guardian_number,
            [process.env.BITRIX_GURADIAN_RELATIONSHIP]: guradian_relation,
          },
        }),
      }
    );
    const data = await response.json();
    logMessage(
      "Registration form data sent to bitrix is successfuly",
      "Success",
      "Info",
      formData
    );
    await syncDealWithContactAndStudent(student_id, {
      first_name_english,
      last_name_english,
      email,
      phone_number,
      guardian_name,
      guardian_number,
      guradian_relation,
    });

    return data; // Return the response data as an object
  } catch (error) {
    logMessage(
      "Internal error while sending Registration form data to Bitrix failed",
      `Error registering  exam form: ${error}`,
      "Error",
      formData
    );
  }
};

const regFormUniversity = async (formData) => {
  // const { email, first_name_english, last_name_english, phone_number, birth_of_date, student_country, student_id, guardian_name, guardian_number, guradian_relation } = formData
  const degree = formData["1"],
    countriesApplyingTo = formData["2"].join(),
    studyLanguage = formData["3"],
    fullName = `${formData["21"]} ${formData["22"]}`,
    sex = formData["23"],
    bod = formData["24"],
    email = formData["25"],
    phoneNumber = formData["26"],
    whatsAppNumber = formData["27"],
    passportNumber = formData["28"],
    nationality = formData["29"],
    residencyCountry = formData["30"],
    guardianName = formData["31"] || null,
    guardianNumber = formData["32"] || null,
    guardianRelation = formData["33"] || null,
    secondGuardianName = formData["34"] || null,
    secondGuardianNumber = formData["35"] || null,
    secondGuardianRelation = formData["36"] || null,
    major = formData["37"].join(),
    fatherName = formData["45"],
    motherName = formData["46"];

  try {
    const response = await fetch(
      `${bitrixUrl}/?entityTypeId=1068&id=${student_id}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: student_id,
          fields: {
            [process.env
              .BITRIX_FULL_NAME]: `${first_name_english} ${last_name_english}`,
            [process.env.BITRIX_PHONE_NUMBER]: phone_number,
            [process.env.BITRIX_EMAIL]: email,
            [process.env.BITRIX_STUDENT_COUNTERY]: student_country,
            [process.env.BITRIX_BIRTHDATE]: birth_of_date,
            ...(guardianName && {
              [process.env.BITRIX_GURADIAN_NAME]: guardian_name,
              [process.env.BITRIX_GURADIAN_NUMBER]: guardian_number,
              [process.env.BITRIX_GURADIAN_RELATIONSHIP]: guradian_relation,
            }),
            ...(secondGuardianName && {
              [process.env.BITRIX_GURADIAN_NAME]: guardian_name,
              [process.env.BITRIX_GURADIAN_NUMBER]: guardian_number,
              [process.env.BITRIX_GURADIAN_RELATIONSHIP]: guradian_relation,
            }),
          },
        }),
      }
    );
    const data = await response.json();
    logMessage(
      "Registration form data sent to bitrix is successfuly",
      "Success",
      "Info",
      formData
    );
    await syncDealWithContactAndStudent(student_id, {
      first_name_english,
      last_name_english,
      email,
      phone_number,
      guardian_name,
      guardian_number,
      guradian_relation,
    });

    return data; // Return the response data as an object
  } catch (error) {
    logMessage(
      "Internal error while sending Registration form data to Bitrix failed",
      `Error registering  exam form: ${error}`,
      "Error",
      formData
    );
  }
};

const sendBitrixNotification = async (userId, message) => {
  const url = `${process.env.BITRIX_API_LINK_WITH_TOKEN}/im.notify`;
  const payload = {
    USER_ID: Number(userId),
    MESSAGE: message,
  };

  try {
    logMessage("sending a notification to an employee", "", "Debug", {
      userId,
      message,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    await response.json();
    logMessage(`notification sent to ${userId} successfuly`, "Success", "Info");
  } catch (error) {
    logMessage(
      `An error happened while sending a notification to ${userId}`,
      `Error: ${JSON.stringify(error)}`,
      "Error",
      { error }
    );
  }
};

const assignBitrixTask = async (title, description, responsibleUserId) => {
  const url = `${process.env.BITRIX_API_LINK_WITH_TOKEN}/tasks.task.add`;
  const payload = {
    fields: {
      TITLE: title,
      DESCRIPTION: description,
      RESPONSIBLE_ID: Number(responsibleUserId),
    },
  };

  try {
    logMessage("sending a task to an employee", "", "Debug", {
      title,
      description,
      responsibleUserId,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    await response.json();
    logMessage(
      `a task sent to ${responsibleUserId} successfuly`,
      "Success",
      "Info"
    );
  } catch (error) {
    logMessage(
      `An error happened while sending a notification to ${responsibleUserId}`,
      `Error: ${JSON.stringify(error)}`,
      "Error",
      {
        error,
      }
    );
  }
};

const sendExamScore = async (score, id, entityTypeId, examName) => {
  const examsEnv = {
    MATH: process.env.BITRIX_MATH_SCORE,
    ENGLISH: process.env.BITRIX_ENGLISH_SCORE,
  };

  try {
    const response = await fetch(
      `${bitrixUrl}/?entityTypeId=${entityTypeId}&id=${id}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            [examsEnv[examName]]: score,
          },
        }),
      }
    );

    const data = await response.json();
    await delay(3000);
    await updateStageAfterFetch(id);
    logMessage("Exam score sent to bitrix is successfuly", "Success", "Info", {
      score,
      id,
      entityTypeId,
      examName,
    });

    return data; // Return the response data as an object
  } catch (error) {
    logMessage(
      "internal error sending exam score to Bitrix failed",
      `Error sending exam score: ${error}`,
      "Error",
      {
        score,
        id,
        entityTypeId,
        examName,
      }
    );
  }
};

const getDeal = async (dealId) => {
  const url = process.env.BITRIX_GET_DEAL;

  const requestData = {
    id: dealId,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (result.error) {
      logMessage(
        `error while fetching deal ${dealId}`,
        `Error: ${result.error_description}`,
        "Error",
        {
          dealId,
        }
      );
    } else {
      logMessage(`Deal ${dealId} fetched successfuly`, "Success", "Info", {
        dealId,
      });
      return result.result;
    }
  } catch (error) {
    logMessage("Internal while fetching deal", `Error: ${error}`, "Error");
  }
};

const fetchCustomEntityForDeal = async (dealId, entityTypeId) => {
  
  const url = process.env.BITRIX_DEAL_STUDENTS;

  // Define the body of the request with proper filter formatting
  const body = {
    filter: { parentId2: dealId }, // Proper JSON structure for filter
    select: ['id'],              // Retrieve all fields
    entityTypeId: entityTypeId, // Entity type ID
  };

  try {
    const response = await fetch(url, {
      method: 'POST', // Use POST for passing a JSON body
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // Send the body as a JSON string
    });

    const data = await response.json();

    if (data.error) {
      logMessage("Error happened while fetching deal students", `Error: ${json.stringify(data.error_description)}`, 'Error');
      return [];
    } else {
      logMessage('deal students was fetched successfuly', 'Success', 'debug', {
        data: data.result
      })
      return data.result.items;
    }
  } catch (error) {
    logMessage("Request failed:", `Error: ${error}`, 'Error');
    return [];
  }
};

const fetchDealContacts = async (dealId) => {
  const url = process.env.BITRIX_DEAL_CONTACTS;
  const params = new URLSearchParams({
    id: dealId
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    if (data.error) {
      logMessage("Error happened while fetching deal contacts", `Error: ${json.stringify(data.error_description)}`, 'Error');
      return []
    } else {
      logMessage('deal contacts was fetched successfuly', 'Success', 'debug', {
        data: data.result
      })
      return data.result
    }
  } catch (error) {
    logMessage("Request failed:", `Error: ${error}`, 'Error');
    return []
  }
};

const updateContact = async (contactId, fields) => {
  try {
    const webhookUrl = process.env.BITRIX_UPDATE_CONTACT;
    const params = {
      id: contactId, // Fields you want to fetch
      fields,
    };

    const response = await axios.post(webhookUrl, params);
    const contact = response.data;

    if (contact.result) {
      logMessage(
        `contact ${contactId} updated successfuly`,
        "Succcess",
        "Info",
        {
          contactId,
          fields,
        }
      );
      return contact.result;
    } else {
      logMessage(
        `contact ${contactId} was not updated`,
        `Error: ${contact}`,
        "Error"
      );
      return false;
    }
  } catch (error) {
    logMessage(
      `Internal error while updating contact ${contactId}`,
      `Error: ${error}`,
      "Error"
    );
  }
};

const updateDeal = async (dealId, fields) => {
  const bitrix24Domain = process.env.BITRIX_URL_DEAL; // Replace with your Bitrix24 domain
  const endpoint = bitrix24Domain;
  const updateData = {
    entityTypeId: 1068,
    id: dealId,
    fields,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (result.result) {
      logMessage;
      return result.result;
    } else {
      logMessage;
      return "item not found";
    }
  } catch (error) {}
};

const updateStudent = async (studentId, fields) => {
  const bitrix24Domain = process.env.BITRIX_UPDATE_STUDENT; // Replace with your Bitrix24 domain
  const endpoint = bitrix24Domain;
  const updateData = {
    entityTypeId: 1068,
    id: studentId,

    fields,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (result.result) {
      logMessage(
        `student ${studentId} updated successfuly`,
        "Success",
        "Info",
        {
          studentId,
          fields,
        }
      );
      return result.result;
    } else {
      logMessage(`student ${studentId} was not found`, "", "warn", {
        studentId,
        fields,
      });
      return "item not found";
    }
  } catch (error) {
    logMessage(
      `Internal error while updating student`,
      `Error: ${error}`,
      "Error"
    );
  }
};

const getContact = async (contactId) => {
  try {
    // Replace with your actual webhook URL or access token
    const webhookUrl = process.env.BITRIX_GET_CONTACT;

    // Make the API call with the contact ID
    const response = await axios.get(webhookUrl, {
      params: {
        id: contactId,
      },
    });

    if (response.data.result) {
      logMessage(`contact ${contactId} fetched successfuly`, `Success`, `Info`);
      return response.data.result.PHONE[0].VALUE;
    } else {
      logMessage(`contact ${contactId} was not found`, ``, `Info`);
    }
  } catch (error) {
    logMessage(
      `Internal error while fetching contact ${contactId} `,
      `Error: ${error} `,
      `Error`
    );
  }
};

async function getStudent(entityTypeId, itemId) {
  try {
    // Set up the API endpoint URL
    const apiUrl = process.env.BITRIX_GET_STUDENT;

    // Prepare the request payload
    const params = {
      entityTypeId: entityTypeId,
      id: itemId,
    };


    // Make the GET request to Bitrix24 API
    const response = await axios.get(apiUrl, { params });

    logMessage(
      `student ${itemId} fetched succsessfuly successfuly`,
      "Success",
      "Info",
      {
        entityTypeId,
        itemId,
      }
    );

    // Handle success response
    return response.data.result?.item;
  } catch (error) {
    // Handle error response
    logMessage(
      `Internal error fetching student ${itemId} with ${entityTypeId} entity `,
      `Error getting student: ${error} `,
      "Error"
    );

    throw error;
  }
}

const addContactToStudent = async (studentId, contactId) => {
  const bitrix24Domain = process.env.BITRIX_UPDATE_STUDENT; // Replace with your Bitrix24 domain
  const endpoint = bitrix24Domain;

  try {
    const { contactIds: contacts } = await getStudent(1068, studentId);

    const updateData = {
      entityTypeId: 1068,
      id: studentId,
      fields: {
        contactIds: [...contacts, contactId],
      },
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    // Check for success or handle errors
    if (result.result) {
      logMessage(
        `contact ${contactId} added to student ${studentId} successfuly`,
        "Success",
        "INFO"
      );

      return result.result;
    } else {
      logMessage(
        `Studnet not found`,
        `Error adding contact to student`,
        "Error"
      );
      return "item not found";
    }
  } catch (error) {
    logMessage(
      `Internal error while linking Contact ${contactId} to student ${studentId} `,
      `Error adding contact to student: ${error} `,
      "Error"
    );
  }
};

const linkContactToSPA = async (dealId, contactId) => {
  const url = process.env.BITRIX_ADD_CONTACT_TO_DEAL;

  const linkData = {
    id: dealId,
    fields: {
      CONTACT_ID: contactId,
      IS_PRIMARY: "N",
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(linkData),
    });

    const result = await response.json();

    if (result.error) {
      logMessage(
        `error while linking contact ${contactId} with deal ${dealId} `,
        `Error: ${result.error_description} `,
        "Error"
      );
    } else {
      logMessage(
        `contact ${contactId} linked with deal ${dealId} successfuly`,
        "Success",
        "Info",
        {
          dealId,
          contactId,
        }
      );
    }
  } catch (error) {
    logMessage(
      `Internal error while linking contact ${contactId} with deal ${dealId} `,
      `Error: ${error} `,
      "Error"
    );
  }
};

async function fetchContacts(contactNumber) {
  const webhookUrl = process.env.BITRIX_CONTACT_LIST;
  const params = {
    select: ["*"],
    filter: { PHONE: contactNumber },
  };
  try {
    const response = await axios.post(webhookUrl, params);
    const contact = response.data;
    if (contact.result.length > 0) {
      logMessage(
        `phone number ${contactNumber} found in contacts`,
        "Success",
        "INFO"
      );
      return contact.result[0];
    } else {
      logMessage(
        `phone number ${contactNumber} is not found in contacts`,
        "",
        "INFO"
      );

      return false;
    }
  } catch (error) {
    logMessage(
      "Internal error while serching in contacts",
      `Error getting contact: ${error} `,
      "Error"
    );
  }
}

const updateParentNumberAndLinkToDeal = async (guardianData) => {
  const {
    student_id,
    guardian_name,
    guardian_number,
    guradian_relation,
    ASSIGNED_BY_ID,
  } = guardianData;
  try {
    let contactId;
    let result = await fetchContacts(guardian_number);
    await delay(1000);
    if (!result) {
      contactId = await addCrmContact({
        NAME: `${guardian_name} -`,
        LAST_NAME: guradian_relation,
        PHONE: [{ VALUE: guardian_number, VALUE_TYPE: "" }],
        ASSIGNED_BY_ID,
      });
    } else if (result) {
      // logMessage
      contactId = result.ID;
      await updateContact(contactId, {
        NAME: `${guardian_name} -`,
        LAST_NAME: guradian_relation,
        ASSIGNED_BY_ID,
      });
    }
    await delay(1000);

    await addContactToStudent(student_id, contactId);

    return contactId;
  } catch (error) {
    logMessage(
      `Ineternal error while updating parent contact and adding to student and deal`,
      `Error: ${error} `,
      "Error"
    );
  }
};

// Function to add a CRM contact using Bitrix24 REST API
const addCrmContact = async (fields) => {
  const bitrix24Domain = process.env.BITRIX_ADD_CONTACT; // Replace with your Bitrix24 domain

  // Bitrix24 API endpoint for adding a CRM contact
  const endpoint = bitrix24Domain;

  // Prepare the request body (contact data)
  const requestBody = {
    fields,
    params: { REGISTER_SONET_EVENT: "Y" }, // Optional: To log the action in the Activity Stream
  };

  try {
    const response = await axios.post(endpoint, requestBody);
    const result = await response.data;

    // Check for success or handle errors
    if (result.result) {
      logMessage(
        "contact created successfuly",
        "Success",
        "INFO",
        result.result
      );
      return result.result;
    } else {
      logMessage(
        "Error when adding a new contact",
        `Error creating contact: ${result.error_description} `,
        "Error"
      );
    }
  } catch (error) {
    logMessage(
      "Internal error while creating a new contact",
      `Error creating contact: ${error} `,
      "Error"
    );
  }
};

const syncDealWithContactAndStudent = async (student_id, contactData) => {
  const {
    first_name_english,
    last_name_english,
    email,
    phone_number,
    guardian_name,
    guardian_number,
    guradian_relation,
  } = contactData;
  let contactId;
  try {
    let result = await fetchContacts(phone_number);

    if (!result) {
      contactId = await addCrmContact({
        NAME: first_name_english,
        LAST_NAME: last_name_english,
        EMAIL: [{ VALUE: email, VALUE_TYPE: "" }],
        PHONE: [{ VALUE: phone_number, VALUE_TYPE: "" }],
      });
    } else if (result) {
      contactId = result.ID;
    }

    const studentBitrixData = await addContactToStudent(student_id, contactId);

    await linkContactToSPA(studentBitrixData.item.parentId2, contactId);

    const { ASSIGNED_BY_ID } = await getDeal(studentBitrixData.item.parentId2);

    for (const contactId of studentBitrixData.item.contactIds) {
      await delay(3000);
      await updateContact(contactId, {
        NAME: first_name_english,
        LAST_NAME: last_name_english,
        EMAIL: [{ VALUE: email, VALUE_TYPE: "" }],
        ASSIGNED_BY_ID,
      });
    }
    if (guardian_name) {
      const parentContactId = await updateParentNumberAndLinkToDeal({
        student_id,
        guardian_name,
        guardian_number,
        guradian_relation,
        ASSIGNED_BY_ID,
      });
      await linkContactToSPA(studentBitrixData.item.parentId2, parentContactId);
    }

    await updateStudent(student_id, { assignedById: ASSIGNED_BY_ID });
  } catch (error) {
    logMessage(
      "Internal error while syncing between contacts, studentd and deal",
      `Error: ${error} `,
      "Error"
    );
  }
};

const updateStageAfterFetch = async (studentId) => {
  try {
    const url = `${BITRIX_INFO_WEBHOOK}?id=${studentId}& entityTypeId=${entity_id} `;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });

    const data = response.data.result.item;

    const parentId2 = data.parentId2;

    const categoryId = data.categoryId;

    const newStageId = `DT1068_${categoryId}:${nextStage}`;

    const { ASSIGNED_BY_ID: firstEmp } = await getDeal(parentId2);

    if (
      data[BITRIX_INTEREST_SERVICE] == 5745 &&
      (data[BITRIX_ENGLISH_SCORE] == null || data[BITRIX_MATH_SCORE] == null)
    ) {
      logMessage(
        `student ${studentId} did not finish all exams to move`,
        "",
        "Info"
      );
      return;
    }

    const updateResponseDeal = await fetch(`${BITRIX_URL_DEAL} `, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: parentId2,
        fields: {
          STAGE_ID: newSTAGE_ID,
        },
      }),
    });

    if (!updateResponseDeal.ok) {
      throw new Error(
        `Failed to update deal stage: ${updateResponseDeal.statusText} `
      );
    }

    await updateResponseDeal.json();

    logMessage("Stage ID updated successfully to deal", "Success", "INFO", {
      studentId,
      parentId2,
      newSTAGE_ID,
    });

    await delay(35000);

    const { ASSIGNED_BY_ID: secondEmp } = await getDeal(parentId2);

    if (firstEmp === secondEmp) {
      logMessage(
        "Responsible person was not changed after moving deal",
        "",
        `warn`,
        {
          firstEmp,
          studentId,
        }
      );
    }

    await updateStudent(studentId, { assignedById: secondEmp });

    for (const id of data.contactIds) {
      await delay(3000);
      await updateContact(id, { ASSIGNED_BY_ID: secondEmp });
    }

    await delay(5000);

    const updateResponse = await fetch(
      `${BITRIX_URL}/?entityTypeId=${entity_id}&id=${studentId}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            stageId: newStageId,
          },
        }),
      }
    );

    const newStudent = await getStudent(entity_id, studentId);

    if (!updateResponse.ok) {
      throw new Error(
        `Failed to update entity stage: ${updateResponse.statusText}`
      );
    }

    await updateResponse.json();
    logMessage("Stage ID updated successfully to entity", "Success", "INFO", {
      studentId,
      entity_id,
      nextStage,
      newStageId,
    });

    return "done";
  } catch (error) {
    logMessage(
      "Internal error while updating stageId to deal and student function",
      `Error: ${error}`,
      "Error",
      {
        studentId,
        entity_id,
        nextStage,
      }
    );
  }
};

module.exports = {
  sendExamLink,
  sendBitrixNotification,
  assignBitrixTask,
  sendExamScore,
  regFormExam,
  regFormUniversity,
  getStudent,
  updateStudent,
  addCrmContact,
  getDeal,
  sendUniversityFormLink,
  fetchCustomEntityForDeal,
  updateContact,
  fetchDealContacts
};
