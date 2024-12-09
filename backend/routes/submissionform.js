const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { pool } = require("../connection");
const {
  logMessage,
  generateRandomChars,
  encodeRedirectUrl,
  deleteFile,
  buildUpdateQuery,
} = require("../utils/system.utils");
const { uploadMiddleware } = require("../utils/upload.utils");
const { UPLOADS_DIR } = require("../config");
const {
  getStudent,
  sendBitrixNotification,
  assignBitrixTask,
} = require("../utils/bitrix.utils");

const findGuest = async (req, res, next) => {
  let client;
  const student_id = req.body?.student_id || req.query?.student_id;

  // Handle bad request: Missing student_id
  if (!student_id) {
    logMessage("Bad request", "Error: Missing student id", "Error");
    return res.status(400).json({ msg: "Bad request: Missing student_id" });
  }

  try {
    client = await pool.connect();
    const query = `SELECT COUNT(guest_id), random_chars FROM forms_guests WHERE guest_id = $1 GROUP BY random_chars`;
    const response = await client.query(query, [student_id]);

    req.guestExists = response.rows[0]?.count > 0;
    req.random_chars = response.rows[0]?.random_chars;
    next();
  } catch (error) {
    next(error); // Pass any database errors to the error-handling middleware
  } finally {
    if (client) client.release(); // Ensure the client is released
  }
};

router.post("/studentexists", findGuest, async (req, res) => {
  try {
    logMessage("Hit student exists endpoint", "Success", "Info", {
      student_id: req.body.student_id,
    });

    if (req.guestExists) {
      logMessage("Student was found", "", "Debug", {
        student_id: req.body.student_id,
      });
      return res.json({ msg: "User exists" });
    }

    logMessage("Student was not found", "", "Debug", {
      student_id: req.body.student_id,
    });
    res.status(404).json({ msg: "User was not found" }); // Use 404 if not found
  } catch (error) {
    logMessage("Internal error", `Error: ${JSON.stringify(error)}`, "Error", {
      student_id: req.body.student_id,
      error,
    });
    res.status(500).json({ msg: "Internal error happened" });
  }
});

router.post("/sendformlink", findGuest, async (req, res) => {
  let client;
  logMessage("Hit studentid endpoint", "Success", "Info");

  const { student_id } = req.query;

  try {
    client = await pool.connect();

    const rand_chars = generateRandomChars(3);
    const encodedGuestId = encodeRedirectUrl(Number(student_id));

    let link = `https://${process.env.LINK}/forms/university-application/?e=${rand_chars}${encodedGuestId}`;

    // Check if guest already exists
    if (req.guestExists) {
      link = `https://${process.env.LINK}/forms/university-application/?e=${req.random_chars}${encodedGuestId}`;
      logMessage("Guest already exists", "", "Info", { student_id });
      return res.status(400).json({ error: "Guest already exists", link });
    }

    try {
      // Insert new guest into the database
      const query = `INSERT INTO forms_guests (guest_id, random_chars) VALUES ($1, $2);`;
      logMessage(
        "Constructing a SQL INSERT query to add a new guest.",
        "",
        "Debug",
        { query }
      );

      await client.query(query, [student_id, rand_chars]);

      logMessage("New guest has been added successfully", "Success", "Info", {
        student_id,
      });
      return res.json({ msg: "done", link });
    } catch (err) {
      logMessage(
        "Database insertion error while adding new guest",
        `Error: ${err}`,
        "Error",
        { student_id }
      );
      return res.status(500).json({ error: "Database error occurred", link });
    }
  } catch (error) {
    logMessage(
      "Internal server error while handling the request",
      `Error: ${error}`,
      "Error",
      { student_id }
    );
    return res.status(500).json({ error: "Internal server error occurred" });
  } finally {
    if (client) client.release();
  }
});

router.post("/studentinfo", async (req, res) => {
  let client;
  const uploadFiles = [
    "7",
    "8",
    "9",
    "10",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "39",
    "40",
    "41",
    "50",
  ];
  try {
    client = await pool.connect();
    const { studentInfo, guest_id, random_chars } = req.body;

    const insertQuery = `
                INSERT INTO forms_data (data_content, field_id, guest_id) 
                VALUES ($1, $2, $3)
              `;

    logMessage(
      "Creating query to insert student info into db",
      "Success",
      "Info",
      {
        query: insertQuery,
      }
    );

    const filteredObject = Object.keys(studentInfo)
      //exclude upload fileds
      .filter((key) => !uploadFiles.includes(key))
      .reduce((obj, key) => {
        obj[key] = studentInfo[key];
        return obj;
      }, {});

    const studentInfoKeysArr = Object.keys(filteredObject);

    for (const row of studentInfoKeysArr) {
      const field_id = row;
      let data_content;
      if (field_id === "2" || field_id === "37") {
        data_content = studentInfo[field_id].join();
      } else {
        data_content = studentInfo[field_id];
      }
      if (!data_content) continue;

      // Execute the query with parameters
      await client.query(insertQuery, [data_content, field_id, guest_id]);
    }

    // await regFormUniversity(filteredObject)

    logMessage("Student info inserted successfully", "Success", "Info");
    return res.json({
      data: { guest_id, random_chars },
      msg: "Student info inserted successfully",
    });
  } catch (error) {
    logMessage(
      "there are internal error while inserting guest info",
      `Error: ${error}`,
      "Error"
    );
    return res.status(500).json({ error });
  } finally {
    if (client) {
      client.release();
    }
  }
});

router.post("/upload", (req, res) => {
  logMessage("Hit post geust upload files endpoint", "Success", "Info");
  let client;
  // Track progress using streams
  try {
    let uploadedBytes = 0;

    req.on("data", (chunk) => {
      uploadedBytes += chunk.length;
    });
    uploadMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        logMessage("File too large or invalid file type", err, "Error");
        return res
          .status(400)
          .json({ error: "File too large or invalid file type" });
      } else if (err) {
        logMessage("Error while uploading", err, "Error");
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || Object.entries(req.files).length === 0) {
        logMessage("No files uploaded", err, "Error");
        return res.status(400).json({ error: "No files uploaded" });
      }

      const filesArray = Object.values(req.files);

      try {
        client = await pool.connect();
        // Process each file in the request
        const studentImagesKeysObj = {};
        for (const file of filesArray) {
          if (file[0].fieldname === "41") {
            studentImagesKeysObj[file[0].fieldname] = file.map(
              (file) => file.filename
            );
          } else if (file[0].fieldname !== "41")
            studentImagesKeysObj[file[0].fieldname] = file[0].filename;
        }

        const insertQuery = `
                    INSERT INTO forms_data (data_content, field_id, guest_id) 
                    VALUES ($1, $2, $3) RETURNING data_id
                `;

        logMessage(
          "Creating query to insert file paths into db",
          "Success",
          "Info",
          {
            query: insertQuery,
          }
        );

        const studentImageKeysArr = Object.keys(studentImagesKeysObj);

        for (const row of studentImageKeysArr) {
          const field_id = row;
          const data_content = studentImagesKeysObj[field_id];

          // Execute the query with parameters
          if (row === "41") {
            const multipleRow = await client.query(insertQuery, [
              "multiple",
              field_id,
              req.body.guest_id,
            ]);

            for (const row of data_content) {
              await client.query(
                `insert into forms_mdata (filename, formsdata_id) values ($1, $2)`,
                [row, multipleRow.rows[0].data_id]
              );
            }
          } else {
            await client.query(insertQuery, [
              data_content,
              field_id,
              req.body.guest_id,
            ]);
          }
        }
        logMessage("files uploaded successfuly", "Success", "Info", {
          query: insertQuery,
        });
        return res.status(200).json({
          message: "Files uploaded successfully!",
        });
      } catch (error) {
        logMessage(
          "there are internal error while uploading files and inserting paths into db",
          `Error: ${error}`,
          "Error"
        );
        return res.status(500).json({ error: "Processing failed." });
      } finally {
        if (client) client.release();
      }
    });
  } catch (error) {
    logMessage(
      "Error while post uploading a file",
      `Error: ${JSON.stringify(error)}`,
      "Error",
      {
        error,
      }
    );
  }
});

router.put("/upload", (req, res) => {
  logMessage("Hit put geust upload files endpoint", "Success", "Info");
  let client;
  // Track progress using streams
  try {
    let uploadedBytes = 0;

    req.on("data", (chunk) => {
      uploadedBytes += chunk.length;
    });
    uploadMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        logMessage("File too large or invalid file type", err, "Error");
        return res
          .status(400)
          .json({ error: "File too large or invalid file type" });
      } else if (err) {
        logMessage("Error while uploading", err, "Error");
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || Object.entries(req.files).length === 0) {
        logMessage("No files uploaded", err, "Error");
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Array to store sanitized file information
      // const scannedFiles = [];

      const filesArray = Object.values(req.files);
      const guestId = req.body.guest_id;

      try {
        client = await pool.connect();
        // Process each file in the request
        const studentImagesKeysObj = {};
        for (const file of filesArray) {
          if (file[0].fieldname === "41") {
            const res = await client.query(
              `select filename from forms_mdata fm join forms_data fd on fm.formsdata_id = fd.data_id where fd.field_id = 41 and fd.guest_id = $1`,
              [guestId]
            );
            for (let i = 0; i < res.rows.length; i++) {
              deleteFile(path.join(UPLOADS_DIR, res.rows[i].filename));
            }
            studentImagesKeysObj[file[0].fieldname] = file.map(
              (file) => file.filename
            );
          } else if (file[0].fieldname !== "41") {
            const res = await client.query(
              `select data_content from forms_data fd where fd.field_id = $1 and fd.guest_id = $2 `,
              [file[0].fieldname, guestId]
            );
            deleteFile(path.join(UPLOADS_DIR, res.rows[0].data_content));
            studentImagesKeysObj[file[0].fieldname] = file[0].filename;
          }

          // const filePath = path.join(UPLOADS_DIR, file.filename);

          // Scan the sanitized file with VirusTotal
          // const virusTotalResponse = await scanFileWithVirusTotal(filePath);
          // scannedFiles.push({
          //     original: file.originalname,
          //     virusTotalResult: virusTotalResponse
          // });
        }
        const updateQuery = `
                UPDATE forms_data SET data_content = $1 WHERE field_id = $2 and guest_id = $3
                `;
        logMessage(
          "Creating query to update file paths into db",
          "Success",
          "Info",
          {
            query: updateQuery,
          }
        );
        const studentImageKeysArr = Object.keys(studentImagesKeysObj);
        for (const row of studentImageKeysArr) {
          const field_id = row;
          const data_content = studentImagesKeysObj[field_id];
          // Execute the query with parameters
          if (row === "41") {
            await client.query(
              `
                            DELETE FROM forms_mdata fm
                            USING forms_data fd
                            WHERE fm.formsdata_id = fd.data_id
                            AND fd.guest_id = $1;
                            `,
              [guestId]
            );

            const multipleRow = await client.query(
              "select data_id from forms_data where field_id = $1 and guest_id = $2",
              [field_id, guestId]
            );

            for (const row of data_content) {
              await client.query(
                `insert into forms_mdata (filename, formsdata_id) values ($1, $2)`,
                [row, multipleRow.rows[0].data_id]
              );
            }
          } else {
            await client.query(updateQuery, [data_content, field_id, guestId]);
          }
        }
        logMessage("files uploaded successfuly", "Success", "Info", {
          query: updateQuery,
        });
        return res.status(200).json({
          message: "Files uploaded successfully!",
        });
      } catch (error) {
        logMessage(
          "there are internal error while uploading files and inserting paths into db",
          `Error: ${error}`,
          "Error"
        );
        return res.status(500).json({ error: "Processing failed." });
      } finally {
        if (client) client.release();
      }
    });
  } catch (error) {
    logMessage(
      "Error while update uploading a file",
      `Error: ${JSON.stringify(error)}`,
      "Error",
      {
        error,
      }
    );
  }
});

router.post("/examuniversitydiffs", async (req, res) => {
  let client;
  const { student_id, data, link } = req.body;

  if (!data) {
    logMessage(
      "Bad request",
      "Error: Missing data in the request body",
      "Error"
    );
    return res
      .status(400)
      .json({ error: "No data in the request body", status: "faild" });
  }

  try {
    client = await pool.connect();
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO university_exams_diffs (${columns}) VALUES (${placeholders}) RETURNING university_exams_diffs_id`;
    logMessage(
      "Creating a sql insert query into university_exams_diffs table",
      "",
      "Debug",
      {
        data,
      }
    );

    const response = await client.query(query, values);

    const { assignedById } = await getStudent(
      process.env.ENTITY_ID,
      student_id
    );
    await sendBitrixNotification(
      assignedById,
      `There are information conflict between exam form and university form for student ${student_id}`
    );
    await assignBitrixTask(
      `There are information conflict between exam form and university form for student ${student_id}`,
      `Please visit this link for more information: ${link}${encodeRedirectUrl(
        response.rows[0].university_exams_diffs_id
      )}`,
      assignedById
    );
    return res.json({ status: "success" });
  } catch (error) {
    logMessage(
      "Internal error happened while inserting a new university exams diffs",
      `Error: ${JSON.stringify(error)}`,
      "Error",
      { error }
    );
    return res.status(500).json({ error, status: "faild" });
  } finally {
    if (client) client.release();
  }
});

router.get("/examuniversitydiffs", async (req, res) => {
  let client;
  try {
    client = await pool.connect();

    const query = `SELECT student_id, university_exams_diffs_id as id, university_form_first_name as first_name, university_form_last_name as last_name, random_chars FROM university_exams_diffs WHERE difss_is_resolved IS false;`;
    logMessage("Creating a sql select query to fetch all diffs", "", "Debug");

    const response = await client.query(query);

    return res.json({ data: response.rows });
  } catch (error) {
    logMessage(
      "Internal error happened while fetching all university exams diffs",
      `Error: ${JSON.stringify(error)}`,
      "Error",
      {
        error,
      }
    );
    return res.status(500).json({ error, data: [] });
  } finally {
    if (client) client.release();
  }
});

router.get("/examuniversitydiff", async (req, res) => {
  let client;
  const { studentId } = req.query;

  if (!studentId) {
    logMessage("Bad request", "Error: Missing student id", "Error");
    return res.status(400).json({ error: "Bad request", data: {} });
  }

  try {
    client = await pool.connect();

    const query = `SELECT * FROM university_exams_diffs WHERE university_exams_diffs_id = $1;`;
    logMessage(
      "Creating a sql select query to fetch student diff",
      "",
      "Debug",
      {
        studentId,
      }
    );

    const response = await client.query(query, [studentId]);

    return res.json({ data: response.rows[0] || {} });
  } catch (error) {
    logMessage(
      "Internal error happened while fetching a student university exams diffs",
      `Error: ${JSON.stringify(error)}`,
      "Error",
      {
        error,
      }
    );
    return res.status(500).json({ error, data: {} });
  } finally {
    if (client) client.release();
  }
});

router.post("/resolveconflict", async (req, res) => {
  const {  data, university_exams_diffs_id, student_id } = req.body;


  if (!data || !university_exams_diffs_id, !student_id) {
    logMessage("Bad request", "Error: No data or id or studentId sent with request", "Error"), {
      data, university_exams_diffs_id, student_id
    };
    return res.status(400).json({ msg: "faild to resolve conflict" });
  }

  const extraData = []


  const keyMap = {};


  data.forEach(item => {
    if(!keyMap[item.key]){
      keyMap[item.key] = item.value
    }else if(keyMap[item.key]){
      const uniDup = data.find(row => row.source === 'University Form' && row.key === item.key)
      extraData.push({[item.dbKey]: uniDup.value})
    }
  });

  
  const valueCount = data.reduce((acc, item) => {
    acc[item.key] = (acc[item.key] || 0) + 1;
    return acc;
  }, {});

  const noDuplicates = data.filter(item => valueCount[item.key] === 1);



  const noDuplicatesWithoutGuardians = noDuplicates.filter(row => !row.dbKey.includes('guradian'))
  const noDuplicatesGuardians = noDuplicates.filter(row => row.dbKey.includes('guradian'))

  const extraDataWithoutGuardians = extraData.filter(row => !Object.keys(row)[0].includes('guradian'))
  const extraDataGuardians = extraData.filter(row => Object.keys(row)[0].includes('guradian'))
  let client;



  try {
    client = await pool.connect();
    await client.query(
      `UPDATE university_exams_diffs set difss_is_resolved = true where university_exams_diffs_id = ${university_exams_diffs_id}`
    );

  if(noDuplicatesWithoutGuardians.length > 0){
      try {
        const universityFormData = noDuplicatesWithoutGuardians.filter(item => item.source === 'University Form');

        if(universityFormData.length > 0){
          // Construct the SET clause dynamically
          const setClauses = universityFormData.map(item => `${item.dbKey} = $${noDuplicatesWithoutGuardians.indexOf(item) + 1}`);
          const values = universityFormData.map(item => item.value);

          // Construct SQL query
          const query = `
            UPDATE students
            SET ${setClauses.join(', ')}
            WHERE student_id = $${setClauses.length + 1}
          `;

          // Execute query
          await pool.query(query, [...values, student_id]);
        }
        
    
        
        

      } catch (error) {
        console.error(error);
        
        return res.status(500).send('Error updating student data');
      }
    }

    if(noDuplicatesGuardians.length > 0){
      try {
        const universityFormData = noDuplicatesGuardians.filter(item => item.source === 'University Form');
          if(universityFormData.length > 0){
            const response = await client.query(`select count(id) from guradians where student_id = $1`, [student_id])
            if(response.rows[0].count > 0){
            // Construct the SET clause dynamically
            const setClauses = universityFormData.map(item => `${item.dbKey} = $${noDuplicatesGuardians.indexOf(item) + 1}`);
            const values = universityFormData.map(item => item.value);
        
            // Construct SQL query
            const query = `
              UPDATE guradians
              SET ${setClauses.join(', ')}
              WHERE student_id = $${setClauses.length + 1}
            `;
    
            // Execute query
            await pool.query(query, [...values, student_id]);
            } else if(response.rows[0].count == 0) {
              
              const columns = [...universityFormData.map(item => item.dbKey), 'student_id']; // dbKey represents the column names
              const values = [...universityFormData.map(item => item.value), student_id]; // value represents the data to insert
    
              // Generate placeholders dynamically
              const placeholders = values.map((_, index) => `$${index + 1}`);
    
              // Construct the INSERT query
              const query = `
                INSERT INTO guradians (${columns.join(', ')})
                VALUES (${placeholders.join(', ')})
              `;
              // Execute query
              await pool.query(query, values);
            }
        }
        
      } catch (error) {
        console.error(error);
        
        return res.status(500).send('Error updating guardian data');
      }
    }


    if (extraDataWithoutGuardians.length > 0) {
      try {
        const fieldsToUpdate = extraDataWithoutGuardians.reduce((acc, item) => {
          const key = Object.keys(item)[0];
          const value = Object.values(item)[0];
          acc[key] = value;
          return acc;
        }, {});
    
    
        // Define the fields that are part of the composite type
        const compositeFields = ['first_name_en', 'last_name_en', 'email', 'phone_number'];
    


        const setClause = Object.keys(fieldsToUpdate).map(key => `(additional_info).${key}`).concat(Object.keys(fieldsToUpdate).map((_, index) => `$${index + 1}`))
    
        // Values for placeholders in the query
        const values = compositeFields.map(field => fieldsToUpdate[field] || null).filter(value => value !== null);
    
        // Add student_id to the values array for the WHERE clause
        const studentId = student_id; // Replace this with the actual dynamic student_id
        values.push(studentId); // Push student_id as the last value
    
        // Construct the SQL query
        const query = `
          UPDATE students
          SET additional_info = ROW(${setClause.join(', ')})
          WHERE student_id = $${values.length};
        `;
    
    
        // Execute the query
        try {
          await pool.query(query, values);
        } catch (error) {
          console.error('Error updating record:', error);
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send('Error updating student data');
      }
    }
    
    
    

   
    

    if(extraDataGuardians.length > 0){
      try{

        client.query('update guradians set additional_info = ROW($1::TEXT) where student_id = $2',[extraDataGuardians[0].guradian_number, student_id] )
        
      } catch (error){
        console.error(error);
        
      }
    }

      
      return res.json({ msg: "done" });
 
  } catch (error) {
    logMessage(
      "Error while resolving conflict",
      `Error: ${JSON.stringify(error)}`,
      "Error",
      {
        error,
      }
    );
  } finally {
    if (client) client.release();
  }
});

router.use((error, req, res, next) => {
  logMessage(
    "Internal server error while handling the request",
    `Error: ${error}`,
    "Error",
    {
      student_id: req.body.student_id,
    }
  );
  res.status(500).json({ msg: "Internal server error occurred" });
});

module.exports = router;
