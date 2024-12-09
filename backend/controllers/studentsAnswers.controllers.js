const { pool } = require("../connection");
const { sendExamScore } = require("../utils/bitrix.utils");

const { logMessage } = require("../utils/system.utils");


const insertStudentAnswersController = async (req, res) => {
    const { answers, studentTestId } = req.body

    

    logMessage("Hit insertAStudentAnswers endpoint", "Success", "Info", {
        answers, studentTestId
    });

    const client = await pool.connect();

    try {

        const insertQuery = `
      INSERT INTO student_answers (question_id, student_answer, student_test_id) 
      VALUES ($1, $2, $3)
    `;

        // Loop through each answer and execute the parameterized query
        for (const answer of answers) {
            const { question_id, student_answer } = answer;

            // Execute the query with parameters
            await client.query(insertQuery, [question_id, student_answer, studentTestId]);
        }

        logMessage("Creating query to insert student answers into db", "Success", "Info", {
            query: insertQuery
        });




        logMessage("Student answers inserted successfully", "Success", "Info");


        const updateResponse = await client.query(
            `UPDATE student_test_result SET status = 'completed' WHERE student_test_id = $1;`, [studentTestId]
        );

        logMessage("Student exam status updated successfully", "Success", "Info", {
            updateResponse
        });

        res.json({ data: 'Answers submitted and exam completed' });
    } catch (error) {
        logMessage("Error inserting student answers", error, "Error");
        return res.status(500).json({ data: `${error} insertAStudentAnswers` });
    } finally {
        client.release();
    }
}

const calcStudentExamScoreController = async (req, res) => {
    const { studentTestId } = req.body;
    const client = await pool.connect();

    logMessage("Hit calcStudentExamScore endpoint", "Success", "Info", {
        studentTestId
    });

    try {

        if (!studentTestId) {
            logMessage("Missing studentTestId", "studentTestId is required but missing", "warn");
            return res.status(400).json({ error: "studentTestId is required" });
        }

        const query = `
        WITH calculated_scores AS (
          SELECT 
            sa.student_test_id,
            COUNT(*) AS score
          FROM 
            student_answers sa
          JOIN 
            questions q
          ON 
            sa.question_id = q.id
          WHERE 
            sa.student_answer = q.correct_answer
            AND sa.student_test_id = $1
          GROUP BY 
            sa.student_test_id
        )
        UPDATE student_test_result str
        SET score = cs.score
        FROM calculated_scores cs
        WHERE str.student_test_id = cs.student_test_id
        RETURNING str.student_test_id, str.score;
      `

        logMessage("Creating a query to calculate examscore", "Success", "Info", {
            query
        });



        const result = await client.query(
            query,
            [studentTestId]
        );

        if (result.rowCount === 0) {
            logMessage("No score calculated", "No exam score was calculated or updated for the given studentTestId", "warn", { studentTestId });
            return res.status(404).json({ message: "No score calculated for the given studentTestId" });
        }

        logMessage("exam score has been calculated successfuly", "Success", "Info", {
            query
        });


        return res.json({ message: "success" });
    } catch (err) {
        logMessage("Error in calculating exam score", `Error: ${err}`, "Error", {
            query
        });
        return res.status(500).json({ err: `${err}` });
    } finally {
        client.release();
    }
}

const calcStudentPracticeScoreController = async (req, res) => {
    const { studentTestId, student } = req.body;
    const client = await pool.connect();

    logMessage("Hit calcStudentExamScore endpoint", "Success", "Info", {
        studentTestId
    });

    try {
        if (!studentTestId) {
            logMessage("Missing studentTestId", "studentTestId is required but missing", "warn");
            return res.status(400).json({ error: "studentTestId is required" });
        }

        const query = `
        WITH calculated_scores AS (
        SELECT 
            sa.student_test_id,
            SUM(CASE WHEN q.grouping = 'math' THEN 1 ELSE 0 END) AS math_score,
            SUM(CASE WHEN q.grouping = 'english' THEN 1 ELSE 0 END) AS english_score
        FROM 
            student_answers sa
        JOIN 
            questions q ON sa.question_id = q.id
        WHERE 
            sa.student_answer = q.correct_answer
            AND sa.student_test_id = $1
        GROUP BY 
            sa.student_test_id
        )
        UPDATE student_test_result str
        SET 
        score = cs.math_score + cs.english_score
        FROM calculated_scores cs
        WHERE str.student_test_id = cs.student_test_id
        RETURNING str.student_test_id, cs.math_score, cs.english_score;

      `

        logMessage("Creating a query to calculate examscore", "Success", "Info", {
            query
        });



        const result = await client.query(
            query,
            [studentTestId]
        );

        if (result.rowCount === 0) {
            logMessage("No score calculated", "No exam score was calculated or updated for the given studentTestId", "warn", { studentTestId });
            return res.status(404).json({ message: "No score calculated for the given studentTestId" });
        }

        logMessage("exam score has been calculated successfuly", "Success", "Info", {
            query
        });


        const { math_score, english_score } = result.rows[0]

        await sendExamScore(math_score, student, 1068, "MATH")
        await sendExamScore(english_score, student, 1068, "ENGLISH")


        return res.json({ message: "success", result });
    } catch (err) {
        logMessage("Error in calculating exam score", `Error: ${err}`, "Error");
        return res.status(500).json({ err: `${err}` });
    } finally {
        client.release();
    }
}

module.exports = {
    insertStudentAnswersController,
    calcStudentExamScoreController,
    calcStudentPracticeScoreController
}