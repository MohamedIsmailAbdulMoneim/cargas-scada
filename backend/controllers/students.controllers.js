const { pool } = require("../connection");

const { regFormExam } = require("../utils/bitrix.utils");
const { logMessage } = require("../utils/system.utils");

const regFormController = async (req, res) => {
    const client = await pool.connect();
    const { email, first_name_english, last_name_english, phone_number, birth_of_date, student_country, student_id, guardian_name, guardian_number, guradian_relation } = req.body.regFormData
    logMessage("Hit reg_form endpoint", "Success", "Info", {
        body: req.body.regFormData
    });
    try {

        if (!email || !first_name_english || !student_id) {
            logMessage("Missing essential fields for student registration", "Some required fields are missing in the registration data", "warn", {
                email, first_name_english, student_id
            });
            return res.status(400).json({ error: "Required fields are missing" });
        }
        if (!phone_number.includes("+") || (guardian_number && !guardian_number.includes("+"))) {
            logMessage("phone number is not correct", "either student or guardian Phone number is not correct", "warn", {
                email, first_name_english, student_id
            });
            return res.status(400).json({ error: "phone number isn't correct" });
        }
        const query = `INSERT INTO students (email, first_name_en, last_name_en, phone_number, birth_of_date, student_country, student_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        logMessage("Creating a query to insert a new student into students table", "Success", "Info", {
            query
        });
        const result = await client.query(query, [email, first_name_english, last_name_english, phone_number, birth_of_date, student_country, student_id]);
        if (result.rowCount === 0) {
            logMessage("Failed to insert a new student", "The insert operation did not affect any rows", "warn", { email, first_name_english, last_name_english, phone_number, birth_of_date, student_country, student_id });
            return res.status(500).json({ error: "Failed to create a new student" });
        }
        logMessage("A new student has been inserted successfuly", "Success", "Info");
        if (guardian_name && guardian_number) {
            const guardianQuery = `INSERT INTO guradians (guradian_name, guradian_number, student_id, guradian_relationship) VALUES ($1, $2, $3, $4)`;
            logMessage("Creating a query to insert a new student's guradians data", "Success", "Info");
            const result = await client.query(guardianQuery, [guardian_name, guardian_number, student_id, guradian_relation]);

            if (result.rowCount === 0) {
                logMessage("Failed to insert a new student guradian", "The insert operation did not affect any rows", "warn", { examId, student_id });
                return res.status(500).json({ error: "Failed to create a new student guradian" });
            }
            logMessage("a new student's guradians data inserted successfuly", "Success", "Info");
        }
        await regFormExam(req.body.regFormData)



        return res.json({ msg: "success" });
    } catch (err) {
        logMessage("Error in inserting a new student into students table", `Error: ${err}`, "Error");
        return res.status(500).json({ err: `${err}` });
    } finally {
        client.release();
    }
}

const checkStudentIdController = async (req, res) => {
    const client = await pool.connect();
    const { studentId } = req.query

    logMessage("Hit checkStudentId endpoint", "Success", "Info", {
        studentId
    });


    try {

        if (!studentId) {
            logMessage("Missing studentId parameter", "studentId is required for checking", "warn", {
                studentId
            });
            return res.status(400).send("studentId is required.");
        }

        const query = `
        SELECT COUNT(*) AS student_count
        FROM students
        WHERE student_id = $1;
      `

        logMessage("Constructing an SQL query to check if student id exists", "Success", "Info", {
            query
        });

        const response = await client.query(query, [studentId])


        logMessage("student id checked successfuly", "Success", "Info");

        return res.json({ res: response.rows[0] });
    } catch (err) {
        logMessage(`Error when checking student id exists", "Error: ${err}`, "Error");
        res.status(500).json({ status: 'error', error: err.message });
    } finally {
        client.release();

    }
}


module.exports = {
    regFormController,
    checkStudentIdController
}