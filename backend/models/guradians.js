const { pool } = require("../connection")

async function createGuradiansTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.guradians
    (
        id integer NOT NULL DEFAULT nextval('guadians_id_seq'::regclass),
        guradian_name text COLLATE pg_catalog."default",
        guradian_number text COLLATE pg_catalog."default",
        guradian_relationship text COLLATE pg_catalog."default",
        student_id integer NOT NULL,
        CONSTRAINT guadians_pkey PRIMARY KEY (id),
        CONSTRAINT student_fk FOREIGN KEY (student_id)
            REFERENCES public.students (student_id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )
    `;

    try {
        client.query("CREATE SEQUENCE IF NOT EXISTS guadians_id_seq;")
        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
        console.error('Error creating table', err);
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createGuradiansTable
}