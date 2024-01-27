if(process.env.NODE_ENV != "production"){ //If process is production do not require dotenv file
    require('dotenv').config(); 
}    

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
// const Listing = require("./models/listing.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // requiring mongo store // always require session before mongo store
const flash = require("connect-flash");

const passport = require("passport");    //requiring passport
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

/*Just to set up database. wanderlust database won't appear in mongodb just yet cuz we have no modals.*/ 

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl);  //Before it used to be MONGO_URL or local database url.
}
/****************************************************************/ 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({  //MongoStore new wala MongoAtlas wala
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {   //Setting cookies details
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //This is 1 week from now in milliseconds.
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

//Root Route
// app.get("/",(req,res) => {
//     res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

//authentication using passport, always right after session.

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "Delta_Student",
//     })

//     let registeredUser = await User.register(fakeUser,"helloWorld");
//     res.send(registeredUser);
// });

app.use("/listing",listingRouter);  //Using this single line of code for listings.
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);

//Review Route --> transferred to review.js

//Just a sample listing

// app.get("/testListing",async(req,res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "Beautiful and astonishing",
//         price: 15000,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successful testing");
// });
/*************************************************/

app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found!"));   //Error message with code 404 and message page not found.
})

app.use((err,req,res,next) => {   //Yha pr req, res ka order compulsory hai order aage peeche hua to error aa jayega
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,() => {
    console.log("listening to port 8080");
})