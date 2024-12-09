const { pool } = require("../connection");
const { logMessage, generateRandomChars, encodeRedirectUrl } = require("../utils/system.utils");
const { sendExamLink } = require("../utils/bitrix.utils")

const link = process.env.LINK;

const examInfoController = async (req, res) => {
    const client = await pool.connect();
    const { student_id, service_of_interest, entity_id } = req.query;



    logMessage("Hit exam_info endpoint", "Success", "Info", {
        student_id, service_of_interest, entity_id
    });


    // Validate and determine test name
    const testNames = {
        "SAT (Full Course - English & Math)": "SAT",
        "General English": "ENGLISH",
        "SAT (Single Subject - English)": "ENGLISH",
        "TOEFL": "ENGLISH",
        "IELTS": "ENGLISH",
        "SAT (Single Subject - Math)": "MATH",
        "SAT Practice": "PRACTICE"
    };



    const testName = testNames[service_of_interest];

    if (!testName) {
        logMessage("Service of interest is not sent from bitrix", "Error: ervice of interest should be sent from bitrix", "Error", {
            student_id, service_of_interest, entity_id
        });
        return res.status(400).send("Service of interest does not exist.");
    }

    const randChars = generateRandomChars(3);

    try {
        // Use parameterized query to prevent SQL injection
        const insertQuery = `
        INSERT INTO students_exams_links (student_id, bitrix_request, random_chars)
        VALUES ($1, $2, $3) 
        RETURNING *`;

        logMessage("Constructing an SQL INSERT query to store exam information from Bitrix in a database.", "Success", "Info", {
            insertQuery
        });

        const insertValues = [student_id, testName, randChars];


        try {
            const result = await client.query(insertQuery, insertValues);
            const encodedId = encodeRedirectUrl(result.rows[0].link_number);
            const redirectUrl = `https://${link}/?e=${result.rows[0].random_chars}${encodedId}`;

            await sendExamLink(redirectUrl, student_id, entity_id);
            logMessage("Exam information has been inserted successfuly", "Success", "Info");

            res.send(redirectUrl);
        } catch (err) {
            logMessage("Error during exam information insertion", `Error: ${err}`, "warn");


            if (err.message.includes("duplicate key")) {
                logMessage("Duplicate key error detected while inserting exam information", "Handling duplicate by fetching existing entry", "warn", {
                    student_id, testName
                });

                const existingQuery = `
            SELECT link_number, random_chars 
            FROM students_exams_links 
            WHERE student_id = $1 AND bitrix_request = $2`;

                const existingResult = await client.query(existingQuery, [student_id, testName]);

                const encodedId = encodeRedirectUrl(existingResult.rows[0].link_number);
                const redirectUrl = `https://${link}/?e=${existingResult.rows[0].random_chars}${encodedId}`;
                await sendExamLink(redirectUrl, student_id, entity_id);
                return res.json({ status: 'duplicate', redirectUrl });
            }

            res.status(500).json({ status: 'error', error: err.message });
        }
    } catch (error) {
        logMessage("Error in inserting exam information", `Error: ${error}`, "Error");


        res.status(500).json({ status: 'error', error: error.message });
    } finally {
        client.release();
    }
}

const linkDataController = async (req, res) => {
    const client = await pool.connect();
    const { id, randChars } = req.query

    logMessage("Hit link_data endpoint", "Success", "Info", {
        id, randChars
    });



    if (isNaN(id)) {
        logMessage("Warning: id is not a number", "Error: id is not a valid number", "warn");
        return res.json({ message: "the requested id is not found" })
    }



    try {
        const query = `
        SELECT student_id, bitrix_request, exam_times from students_exams_links where link_number = $1 and random_chars = $2;
      `

        logMessage("Constructing an SQL INSERT query to select exam info from database", "Success", "Info", {
            query
        });


        try {
            const response = await client.query(query, [id, randChars])
            if (response.rows.length === 0) {
                logMessage("Warning: id not found in the database", "Warning: No records found", "warn");
                return res.json({ message: "the requested id is not found" });
            }
            logMessage("Exam info fetched successfuly", "Success", "Info");

            return res.status(200).json({ message: "success", data: response.rows[0] });
        } catch (error) {
            logMessage("Error when fetching exam info", `Error: ${error}`, "Error");
            res.status(500).json({ status: 'error', error: error.message });
        }



    } catch (err) {
        logMessage("Error when fetching exam info", `Error: ${err}`, "Error");

        res.status(500).json({ status: 'error', error: err.message });
    } finally {
        client.release();

    }
}


module.exports = {
    examInfoController,
    linkDataController
}