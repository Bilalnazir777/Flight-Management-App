const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authController");

router.post("/signup", authControllers.userSignupController);

router.post("/login", authControllers.userLoginController);

module.exports = router;
