const { pool } = require("../connection");
const { logMessage } = require("../utils/system.utils");

const insertStudentTestController = async (req, res) => {
    const client = await pool.connect();


    const { examId, studentId } = req.body; // Assuming these are passed as query parameters

    logMessage("Hit insertStudentTest endpoint", "Success", "Info", {
        examId, studentId
    });


    try {

        if (!examId || !studentId) {
            logMessage("Missing examId or studentId", "One or more required parameters are missing", "warn", { examId, studentId });
            return res.status(400).json({ error: "Both examId and studentId are required" });
        }

        const query =
            `INSERT INTO student_tests (test_id, student_id) values ($1, $2) RETURNING id`;
        ;

        logMessage(`Creating query to insert a new exam for the fetched student id`, "Success", "Info");

        const result = await client.query(query, [examId, studentId]);

        if (result.rowCount === 0) {
            // Warn if no rows are inserted
            logMessage("Failed to insert a new student test", "The insert operation did not affect any rows", "warn", { examId, studentId });
            return res.status(500).json({ error: "Failed to create a new student test" });
        }

        logMessage(`New exam has been created for ${studentId} student id`, "Success", "Info");


        const insertedId = result.rows[0].id

        const testResultQuery = `insert into student_test_result (status, score, student_test_id) values ('in_progress', '0', $1)`
        const responseTestResQuery = await client.query(testResultQuery, [insertedId])

        if (responseTestResQuery.rowCount === 0) {
            // Warn if no rows are inserted for the test result
            logMessage("Failed to initialize exam result", "The insert operation for the exam result did not affect any rows", "warn", { insertedId });
            return res.status(500).json({ error: "Failed to initialize exam result" });
        }

        logMessage(`Creating a query to initialize an exam result for ${studentId} student id`, "Success", "Info");



        logMessage(`initialized an exam result for ${studentId} student id`, "Success", "Info");

        return res.json({ msg: "success", insertedId });

    } catch (err) {
        logMessage(`Could not creat a new exam`, `Error: ${err}`, "Error");

        res.status(500).json({ msg: "error", data: "err" });
    } finally {
        client.release();
    }
}

const getStudentExamIdController = async (req, res) => {
    const client = await pool.connect();
    try {
        const { examId, studentId } = req.query;

        logMessage("Hit getStudentExamId endpoint", "Success", "Info", {
            examId, studentId
        });

        if (!examId || !studentId) {
            logMessage("Missing examId or studentId", "One or more required query parameters are missing", "warn", { examId, studentId });
            return res.status(404).json(resQuery.rows[0]?.id ?? null);

        }
        const query =
            `SELECT id
        FROM student_tests
        WHERE test_id = $1 
        AND student_id = $2
        ORDER BY id DESC
        LIMIT 1;`

        logMessage("Creating a query to fetch studentexamid", "", "Debug", {
            query
        });

        const resQuery = await client.query(query, [examId, studentId]);


        if (resQuery.rowCount === 0) {
            // Warn if no student exam ID is found
            logMessage("No matching records for the given examId and studentId", "", "Debug", { examId, studentId });

            return res.json(resQuery.rows[0]?.id ?? null);

        }

        logMessage(`Studentexamid fetched successfuly ${resQuery.rows[0]?.id}`, "", "Debug", {
            query
        });

        return res.status(200).json(resQuery.rows[0]?.id ?? null);
    } catch (err) {
        logMessage(`Error fetching studentexamid`, `Error: ${err}`, "Info");
        return res.status(500).json(`{ err: ${err} } `);
    } finally {
        client.release();
    }
}

module.exports = {
    insertStudentTestController,
    getStudentExamIdController
}