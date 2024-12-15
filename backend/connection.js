const { Pool } = require("pg");
const { logMessage } = require("./utils/system.utils");

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME_TEMP,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  max: 20,
  connectionTimeoutMillis: 3000,
};

let pool = new Pool(poolConfig);

function reconnectPool() {
  logMessage("Attempting to reconnect to the database...", "", "Debug");
  pool = new Pool(poolConfig);
  setupErrorHandler();
}

function setupErrorHandler() {
  pool.on("error", (err) => {
    logMessage(
      "Unexpected database error",
      `Error: ${JSON.stringify(err)}`,
      "Error"
    );
    pool
      .end()
      .catch((e) =>
        logMessage("Error closing pool", `Error: ${JSON.stringify(e)}`, "Error")
      );

    setTimeout(reconnectPool, 5000);
  });
}

setupErrorHandler();

module.exports = { pool };
