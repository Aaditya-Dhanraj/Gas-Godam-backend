const express = require("express");
const authControllers = require("../controllers/authControllers");
const userControllers = require("../controllers/userControllers");

const router = express.Router();

//for these four we do not need to log in
router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);
router.use(authControllers.protect);
router.get("/logout", authControllers.logout);

router.get("/me", userControllers.getMe, userControllers.getUser);

router.delete("/deleteMe", userControllers.deleteMe);

router.use(authControllers.restrictTo("admin"));

router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route("/:tourId")
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
