const express = require("express");
const router = express.Router();
const userController = require("../src/controllers/UserController");
const auth = require("../src/middlewares/authorizeMiddleware");
const valid = require("../src/middlewares/validationInfo");


router.post("/register", valid, userController.create);

router.post("/login", valid, userController.login);

router.post("/logout", auth, userController.logout);

router.get("/me", auth, userController.getUserInfo);

module.exports = router;
