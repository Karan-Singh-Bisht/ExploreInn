const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  renderRegisterPage,
  logoutUser,
  renderLoginPage,
} = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");
const saveRedirectUrl = require("../middlewares/saveRedirectUrl");

router.get("/register", renderRegisterPage);
router.post("/registerUser", upload.single("avatar"), registerUser);
router.get("/login", renderLoginPage);
router.post("/loginUser", saveRedirectUrl, loginUser);
router.get("/logout", logoutUser);

module.exports = router;
