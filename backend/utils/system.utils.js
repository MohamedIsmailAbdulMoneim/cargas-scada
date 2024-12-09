const fs = require("fs");
const path = require("path");

function buildUpdateQuery(tableName, data, conditionColumn, conditionValue) {
  const columns = Object.keys(data);
  const values = Object.values(data);

  const setClause = columns
    .map((col, index) => `${col} = $${index + 1}`)
    .join(", ");
  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${conditionColumn} = $${
    columns.length + 1
  }`;

  return { query, values: [...values, conditionValue] };
}

function logMessage(message, error, debugLevel, data) {
  try {
    if (typeof message !== "string") {
      throw new TypeError(
        `Expected 'message' to be a string, but got ${typeof message}`
      );
    }
    if (typeof error !== "string") {
      throw new TypeError(
        `Expected 'error' to be a string, but got ${typeof error}`
      );
    }
    if (typeof debugLevel !== "string") {
      throw new TypeError(
        `Expected 'debugLevel' to be a string, but got ${typeof debugLevel}`
      );
    }

    if (!message || !debugLevel) {
      console.error("Invalid input: message and debugLevel are required.");
      return;
    }
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    let formattedMessage = `${timestamp}: [${debugLevel}] <${message}> : ${error}`;

    if (data) {
      formattedMessage += ` | Data: ${JSON.stringify(data)}`;
    }

    if (debugLevel.toLowerCase() === "error") throw new Error(formattedMessage);
    else if (debugLevel.toLowerCase() === "warn")
      console.info(formattedMessage);
    else console.log(formattedMessage);
  } catch (err) {
    console.error(err);
  }
}

// Example usage

function generateRandomChars(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function encodeRedirectUrl(url) {
  return url.toString("16");
}

const deleteFile = (fileDir) => {
  try {
    fs.unlinkSync(path.join(fileDir));
    console.log("File deleted successfully");
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};

module.exports = {
  logMessage,
  generateRandomChars,
  encodeRedirectUrl,
  deleteFile,
  buildUpdateQuery,
};
