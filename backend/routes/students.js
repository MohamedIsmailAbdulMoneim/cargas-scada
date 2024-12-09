const express = require("express");
const router = express.Router();
const { pool } = require("../connection");
const { logMessage } = require("../utils/system.utils");

const getCustomStudent = async (student_id) => {
  let client;
  try {
    client = await pool.connect();
    const query = `
        SELECT
            s.first_name_en AS "21",
            s.last_name_en AS "22",
            s.phone_number AS "26",
            s.email AS "25",
            s.student_country AS "30",
            s.birth_of_date AS "24",
            g.guradian_name AS "31",
            g.guradian_number AS "32",
            g.guradian_relationship AS "33"
            FROM
            students s left join guradians g on s.student_id = g.student_id where s.student_id = $1
        `;
    const response = await client.query(query, [student_id]);
    response.rows[0]["33"] = response.rows[0]["33"]?.toLowerCase();
    logMessage("fetched custom student successfuly", "Success", "Info", {
      data: response.rows[0],
    });
    return response.rows[0] || null;
  } catch (error) {
    logMessage("Internal error", `Error: ${JSON.stringify(error)}`, "Error", {
      student_id,
      error,
    });
    throw new Error(error);
  } finally {
    if (client) client.release();
  }
};

router.get("/student", async (req, res) => {
  let client;
  const { id } = req.query;
  logMessage("hit get student endpoint", "Success", "Info", {
    id,
  });
  try {
    client = await pool.connect();
    const query = `
    SELECT
    s.first_name_en || ' ' || s.last_name_en AS student_name,
    s.student_country,
    s.createdat,
    s.phone_number,
    s.email,
    s.birth_of_date,
    COALESCE(
        json_agg(
            json_build_object(
                'guradian_name', g.guradian_name,
                'guradian_number', g.guradian_number,
                'guradian_relationship', g.guradian_relationship
            )
        ) FILTER (WHERE g.student_id IS NOT NULL), 
        json_build_array(
            json_build_object(
                'guradian_name', 'No Guardian',
                'guradian_number', 'N/A',
                'guradian_relationship', 'N/A'
            )
        )
    ) AS guradians
FROM 
    students s 
LEFT JOIN 
    guradians g ON s.student_id = g.student_id 
WHERE 
    s.student_id = $1
GROUP BY 
    s.student_id, s.first_name_en, s.last_name_en, s.student_country, s.createdat, s.phone_number, s.email, s.birth_of_date;

`;
    const response = await client.query(query, [id]);

    return res.json({ data: response.rows });
  } catch (error) {
    res.status(401).json({ error });
    console.error(error);
  }
});

router.get("/customstudent", async (req, res) => {
  try {
    const { student_id } = req.query;
    logMessage("hit customstudent endpoint", "Success", "Info", { student_id });
    const studentData = await getCustomStudent(student_id);
    return res.json({ data: studentData });
  } catch (error) {
    logMessage(
      "internal error while fetching custom student",
      `Error: ${JSON.stringify(error)}`,
      "Error",
      {
        error,
      }
    );
    return res.status(500).json({ data: null });
  }
});

module.exports = router;
