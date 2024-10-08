const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  renderRegisterPage,
  logoutUser,
  renderLoginPage,
  userInfo,
  editUserInfo,
  updatedUser,
} = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");
const saveRedirectUrl = require("../middlewares/saveRedirectUrl");
const isLoggedIn = require("../middlewares/isLoggedIn.middleware");

router.get("/register", renderRegisterPage);
router.post("/registerUser", upload.single("avatar"), registerUser);
router.get("/login", renderLoginPage);
router.post("/loginUser", saveRedirectUrl, loginUser);
router.get("/logout", logoutUser);
router.get("/:id/dashboard", isLoggedIn, userInfo);
router.get("/:id/editUserProfile", isLoggedIn, editUserInfo);
router.put("/:id/updateUser", upload.single("avatar"), updatedUser);

module.exports = router;
