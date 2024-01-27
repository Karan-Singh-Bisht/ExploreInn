const Listing = require("../models/listing");
const Review = require("../models/review");

//Create Review Route
module.exports.createReview = async(req,res) => {   //No need to create show or update route for reviews.
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listing/${listing._id}`);
};

//Delete Review Route
module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //Pull is to remove an entry and all its data.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`); //redirect to the show page.
};