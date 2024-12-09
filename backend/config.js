// config.js
const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.join(process.env.UPLOAD_DIR, "university_application"); // Update this to your desired directory

module.exports = { UPLOADS_DIR };
