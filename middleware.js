const Listing = require("./models/listing");
const {listingSchema} = require("./schema.js");  //Joi Schema
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js"); //Joi Schema
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){               //Authenticates user
        req.session.redirectUrl = req.originalUrl;   
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

//Saving req.session.redirectUrl in locals so that passport does not delete it while running.

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized");
        return res.redirect(`/listing/${id}`)
    }

    next();
}

//Middleware for listing validation

module.exports.validateListing = (req,res,next) => {  //after joi validation code
    let {error} = listingSchema.validate(req.body);//Joi validation code
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");  //element mapping 
        throw new ExpressError(400, errMsg);
    }else{
        next();
    } 
};

//Middleware for review validation.

module.exports.validateReview = (req,res,next) => {  //after joi validation code
    let {error} = reviewSchema.validate(req.body);//Joi validation code
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");  //element mapping 
        throw new ExpressError(400, errMsg);
    }else{
        next();
    } 
}

//middleware for deleting review authorization

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;          //error->"reviewId" ko "reviewid" likh diya tha.
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized");
        return res.redirect(`/listing/${id}`)
    }
    next();
}
