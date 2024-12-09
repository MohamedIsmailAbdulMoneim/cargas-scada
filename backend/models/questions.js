const { pool } = require("../connection")


async function createQuestionsTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.questions
    (
        id integer NOT NULL DEFAULT nextval('questions_id_seq'::regclass),
        question_text text COLLATE pg_catalog."default" NOT NULL,
        question_type text COLLATE pg_catalog."default" NOT NULL,
        test_id integer NOT NULL,
        question_format text COLLATE pg_catalog."default",
        correct_answer text COLLATE pg_catalog."default",
        CONSTRAINT questions_pkey PRIMARY KEY (id),
        CONSTRAINT tests_fk FOREIGN KEY (test_id)
            REFERENCES public.tests (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )

    `;

    try {
        client.query("CREATE SEQUENCE IF NOT EXISTS questions_id_seq;")
        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createQuestionsTable
}