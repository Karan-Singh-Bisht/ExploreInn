const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");

router.post("/register", upload.single("avatar"), registerUser);

module.exports = router;
