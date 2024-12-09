const { pool } = require("../connection")


async function createStudentsExamsLinksTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.students_exams_links
    (
        link_number integer NOT NULL DEFAULT nextval('students_exams_links_link_number_seq'::regclass),
        student_id text COLLATE pg_catalog."default" NOT NULL,
        random_chars text COLLATE pg_catalog."default" NOT NULL,
        bitrix_request text COLLATE pg_catalog."default" NOT NULL,
        exam_times integer DEFAULT 1,
        CONSTRAINT students_exams_links_pkey PRIMARY KEY (bitrix_request, student_id)
    )
    `;

    try {
        client.query("CREATE SEQUENCE IF NOT EXISTS students_exams_links_link_number_seq;")

        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createStudentsExamsLinksTable
}