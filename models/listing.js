const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); 

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {                  //Modified image model when we have to save link in mongo
        url:String,                 
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner:
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
});

//jab koi listing delete hogi uske saath uske reviews bhi delete ho jayege
listingSchema.post("findOneAndDelete",async(listing) => {  
    if(listing){
        await Review.deleteMany({_id : {$in:listing.reviews}});  //delete all the reviews which are in the id provided 
    }
});

const Listing = mongoose.model("Listing",listingSchema); // Created a model using listingSchema
module.exports = Listing; // Export the listing