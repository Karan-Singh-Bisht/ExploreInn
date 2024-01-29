const User = require("../models/user.js");

//rendering sign up form
module.exports.renderSignUpform = (req,res) => {
    res.render("./users/signup.ejs");
}

//Sign up new user
module.exports.signup = async(req,res) => {
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to ExploreInn");
            res.redirect("/listing");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

//render login form
module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

//login User 
module.exports.login = async(req,res) => {
    req.flash("success","Welcome Back");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

//logout User
module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listing");
    })
};