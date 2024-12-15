const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors());
const consumptionRoutes = require("./routes/consumption");
const { logMessage } = require("./utils/system.utils");

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || "tiny";

app.use(express.json());

app.use(morgan(logLevel));

app.use("/api/v1/consumption", consumptionRoutes);

app.listen(port, () => {
  logMessage(`Forms is running on http://localhost:${port}`, "Success", "INFO");
});
