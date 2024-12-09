const { pool } = require("../connection")


async function createStudentTestsResultTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.student_test_result
    (
        id integer NOT NULL DEFAULT nextval('student_test_result_id_seq'::regclass),
        status text COLLATE pg_catalog."default" NOT NULL,
        score text COLLATE pg_catalog."default" NOT NULL,
        student_test_id integer NOT NULL,
        CONSTRAINT student_test_result_pkey PRIMARY KEY (id),
        CONSTRAINT student_test_fk FOREIGN KEY (student_test_id)
            REFERENCES public.student_tests (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )
    `;

    try {
        client.query("CREATE SEQUENCE IF NOT EXISTS student_test_result_id_seq;")
        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
        console.error('Error creating table', err);
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createStudentTestsResultTable
}