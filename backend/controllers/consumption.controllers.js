const { pool } = require("../connection");

const { logMessage } = require("../utils/system.utils");

const insetConsumptionController = async (req, res) => {
  const client = await pool.connect();
  const {
    governorate_name = null,
    area_name = null,
    station_name = null,
    total_consumption = null,
  } = req.body;

  logMessage("Hit insert consumption endpoint", "Success", "Info", req.body);

  try {
    if (!req.body) {
      logMessage(
        "No data was provided to insert",
        "Missing form body in request",
        "warn"
      );
      return res.status(400).json({ error: "form body is required" });
    }

    const query = `
      insert into scada (governorate_name, area_name, station_name, total_consumption) values ($1, $2, $3, $4)
      `;

    logMessage("Creating query to insert consumption data", "Success", "Info", {
      query,
    });

    await client.query(query, [
      governorate_name,
      area_name,
      station_name,
      total_consumption,
    ]);

    logMessage("consumption data was inserted successfuly", "Success", "Info");

    res.json({ status: "success" });
  } catch (err) {
    logMessage(
      "Faild to insert consumption data",
      `Error: data insertion faild`,
      "Error",
      { err }
    );
    return res.status(500).json({ status: "failed" });
  } finally {
    client.release();
  }
};

module.exports = {
  insetConsumptionController,
};
