const express = require("express");
const router = express.Router();

const {
  insetConsumptionController,
} = require("../controllers/consumption.controllers");

router.post("/insert", insetConsumptionController);

module.exports = router;
