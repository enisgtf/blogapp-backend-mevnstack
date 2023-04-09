const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers.js");
const isAuthorized = require("../middlewares/authorize-check.js");

/* POST */
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

/* GET */
router.get("/:userId", userController.getUser);

/* PUT */
router.put("/:id", isAuthorized, userController.updateUser);

/* DELETE */
router.delete("/:id", isAuthorized, userController.deleteUser);

module.exports = router;
