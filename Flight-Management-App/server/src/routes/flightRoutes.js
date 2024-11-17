const express = require("express");
const flightController = require("../controllers/flightController");
const { authentication, authorization } = require("../middlewares/auth");
const router = express.Router();

router.get("/", flightController.getFlightsController);

router.put(
  "/update",
  authentication,
  authorization("admin"),
  flightController.updateFlightStatusController
);

module.exports = router;
