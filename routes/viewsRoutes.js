const express = require("express");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.use(authControllers.alerts);

router.get("/signup", authControllers.isLoggedIn);
router.get("/login", authControllers.isLoggedIn);

module.exports = router;
