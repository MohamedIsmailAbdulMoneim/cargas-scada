const { pool } = require("../connection")

async function createTestsTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.tests
    (
        id integer NOT NULL DEFAULT nextval('test_id_seq'::regclass),
        test_name text COLLATE pg_catalog."default" NOT NULL,
        test_description text COLLATE pg_catalog."default",
        link text COLLATE pg_catalog."default",
        img_src text COLLATE pg_catalog."default",
        CONSTRAINT entry_test_pkey PRIMARY KEY (id)
    )
    `;

    try {
        client.query("CREATE SEQUENCE IF NOT EXISTS test_id_seq;")
        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createTestsTable
}