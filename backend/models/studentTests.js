const { pool } = require("../connection")


async function createStudentTestsTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.student_tests
    (
        id integer NOT NULL DEFAULT nextval('student_tests_id_seq'::regclass),
        test_id integer NOT NULL,
        student_id integer NOT NULL,
        CONSTRAINT student_tests_pkey PRIMARY KEY (id),
        CONSTRAINT tests_fk FOREIGN KEY (test_id)
            REFERENCES public.tests (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        CONSTRAINT students_fk FOREIGN KEY (student_id)
            REFERENCES public.students (student_id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )
    `;

    try {
        client.query("CREATE SEQUENCE IF NOT EXISTS student_tests_id_seq;")
        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
        console.error('Error creating table', err);
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createStudentTestsTable
}