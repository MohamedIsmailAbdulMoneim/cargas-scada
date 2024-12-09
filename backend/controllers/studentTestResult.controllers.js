const { pool } = require("../connection");
const { sendExamScore } = require("../utils/bitrix.utils");

const { logMessage } = require("../utils/system.utils");

const getStudentExamStatusController = async (req, res) => {
    const { studentTestId } = req.query;

    logMessage("Hit getStudentExamStatus endpoint", "Success", "Info", {
        studentTestId
    });
    const client = await pool.connect();

    try {

        if (!studentTestId) {
            logMessage("Missing studentTestId", "studentTestId query parameter is missing", "warn");
            return res.status(400).json({ error: "studentTestId is required" });
        }

        const query =
            `SELECT status FROM student_test_result WHERE student_test_id = $1;`

        logMessage("Creating a query to fetch studentexamstatus", "Success", "Info", {
            query
        });

        const resQuery = await client.query(query, [studentTestId])

        if (resQuery.rowCount === 0) {
            // Warn if no status is found for the studentTestId
            logMessage("No student exam status found", "No records found for the given studentTestId", "warn", { studentTestId });
            return res.status(404).json({ msg: "No status found for the given studentTestId" });
        }

        logMessage(`Studentexamid fetched successfuly ${resQuery.rows[0]}`, "Success", "Info", {
            query
        });

        return res.json({ data: resQuery.rows[0]?.status });

    } catch (err) {
        logMessage(`Error fetching studentexamstatus`, `Error: ${err}`, "Error");
        return res.status(500).send(err);
    } finally {
        client.release();
    }
}

const examScoreController = async (req, res) => {
    const { id, examName, studentTestId } = req.query
    const client = await pool.connect();

    logMessage("Hit exam_score endpoint", "Success", "Info", {
        id, examName, studentTestId
    });

    try {

        if (!studentTestId) {
            logMessage("Warning: Missing studentTestId in request", "Warning: studentTestId is required but not provided", "warn");
            return res.status(400).json({ status: 'error', message: "Missing studentTestId in request" });
        }

        const query = `SELECT score FROM student_test_result WHERE student_test_id = $1;`
        logMessage("Constructing an SQL INSERT query to select exam score from database", "Success", "Info", {
            query
        });

        const resQuery = await client.query(
            query, [studentTestId]
        );

        if (resQuery.rows.length === 0) {
            logMessage("Warning: No score found for the given studentTestId", "Warning: No score found in the database", "warn");
            return res.status(404).json({ status: 'error', message: "No score found for the given studentTestId" });
        }


        logMessage("Exam information has been selected successfuly", "Success", "Info");


        const result = await sendExamScore(resQuery.rows[0]?.score, id, 1068, examName)
        return res.json(result);
    } catch (err) {
        logMessage("Error when selecting exam score", `Error: ${err}`, "Error");

        res.status(500).json({ status: 'error', error: err.message });
    } finally {
        client.release();
    }

}

module.exports = {
    getStudentExamStatusController,
    examScoreController
}