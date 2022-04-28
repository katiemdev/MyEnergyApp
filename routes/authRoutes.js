const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { ensureAuth, authorise } = require("../middleware/auth");

// router.get("/user", ensureAuth, authController.getUser);

router.post("/login", authController.postLogin);
router.post("/register", authController.registerUser);
router.get("/:id", authorise, authController.getUser);

module.exports = router;
