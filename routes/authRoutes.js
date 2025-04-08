// routes/authRoutes.js
const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 *1024 *1024 },
}).fields([{ name: "logo", maxCount: 1 }]);

router.post("/register", upload, authController.register);
router.post("/login", authController.login);

module.exports = router;