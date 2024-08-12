const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  renderRegisterPage,
} = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");

router.get("/register", renderRegisterPage);
router.post("/registerUser", registerUser);
router.post("/login", loginUser);

module.exports = router;
