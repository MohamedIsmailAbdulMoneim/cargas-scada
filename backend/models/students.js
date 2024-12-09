const { pool } = require("../connection")

async function createStudentsTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.students
    (
        student_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        first_name_en text COLLATE pg_catalog."default",
        middle_name_en text COLLATE pg_catalog."default",
        last_name_en text COLLATE pg_catalog."default",
        phone_number text COLLATE pg_catalog."default",
        email text COLLATE pg_catalog."default",
        student_country text COLLATE pg_catalog."default",
        birth_of_date date,
        CONSTRAINT users_pkey PRIMARY KEY (student_id)
    )
    `;

    try {
        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createStudentsTable
}