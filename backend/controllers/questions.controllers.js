const { pool } = require("../connection");

const { logMessage } = require("../utils/system.utils");

const getQuestionsController = async (req, res) => {
  const client = await pool.connect();
  const { testId } = req.query;
  


  logMessage("Hit getQuestions endpoint", "Success", "Info", {
    testId
  });


  try {

    if (!testId) {
      logMessage("No testId provided", "Missing testId parameter in request", "warn", { testId });
      return res.status(400).json({ error: "testId parameter is required" });
    }

    const query = `
        SELECT 
          q.id, 
          q.question_text,
          q.question_type,
          q.question_format,
          q.related_picture,
          COALESCE(
            json_agg(
              json_build_object(
                'option_id', o.id, 
                'option_text', o.option_text,
                'option_format', o.option_format
              )
            ) FILTER (WHERE o.id IS NOT NULL), 
            '[]'
          ) AS options
        FROM 
          Questions q
        LEFT JOIN 
          Options o ON q.id = o.question_id
        WHERE
          q.test_id = $1
        GROUP BY 
          q.id, q.question_text
        ORDER BY 
          q.id;
      `;


    logMessage("Creating query to fetch exam questions", "Success", "Info", {
      query
    });



    const resQuery = await client.query(query, [testId]);

    if (resQuery.rows.length === 0) {
      logMessage("No questions found", "No questions returned for the provided testId", "warn", { testId });
    }

    logMessage("Exam questions fetched successfuly", "Success", "Info", {
      questions: resQuery.rows[0]
    });

    res.json(resQuery.rows);
  } catch (err) {
    logMessage("Faild to fetch exam questions", `Error: ${err}`, "Error");
    return res.status(500).json({ data: `${err} getQuestions` });
  } finally {
    client.release();
  }
}

module.exports = {
  getQuestionsController
}