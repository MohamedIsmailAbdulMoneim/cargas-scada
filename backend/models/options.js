const { pool } = require("../connection")

async function createOptionsTable() {
    const client = await pool.connect(); // Get a client from the connection pool
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.options
    (
        id integer NOT NULL DEFAULT nextval('options_id_seq'::regclass),
        option_text text COLLATE pg_catalog."default" NOT NULL,
        question_id integer NOT NULL,
        option_format text COLLATE pg_catalog."default",
        CONSTRAINT options_pkey PRIMARY KEY (id),
        CONSTRAINT questions_fk FOREIGN KEY (question_id)
            REFERENCES public.questions (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )
    `;

    try {
        client.query("CREATE SEQUENCE IF NOT EXISTS options_id_seq;")
        await client.query(createTableQuery); // Execute the SQL query to create the table
    } catch (err) {
    } finally {
        client.release(); // Release the client back to the pool
    }
}

module.exports = {
    createOptionsTable
}