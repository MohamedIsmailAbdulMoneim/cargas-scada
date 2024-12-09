const { pool } = require("../connection")


async function createStudentsAnswersTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.student_answers
    (
        id integer NOT NULL DEFAULT nextval('student_answers_id_seq'::regclass),
        student_test_id integer NOT NULL,
        question_id integer NOT NULL,
        student_answer text COLLATE pg_catalog."default",
        CONSTRAINT student_answers_pkey PRIMARY KEY (id),
        CONSTRAINT questions_fk FOREIGN KEY (question_id)
            REFERENCES public.questions (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        CONSTRAINT students_tests_fk FOREIGN KEY (student_test_id)
            REFERENCES public.student_tests (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )

    `;

    try {
        client.query("CREATE SEQUENCE IF NOT EXISTS student_answers_id_seq;")
        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createStudentsAnswersTable
}