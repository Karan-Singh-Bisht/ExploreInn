const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
// const User = require("../models/user.js");

const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignUpform)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true }),userController.login);
    
//logout User
router.get("/logout",userController.logout);
    
module.exports = router;

//render SignUp form
// router.get("/signup",userController.renderSignUpform);

//Sign Up new user
// router.post("/signup",wrapAsync(userController.signup));

//render login form
// router.get("/login",userController.renderLoginForm);

//login User
// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true }),userController.login);