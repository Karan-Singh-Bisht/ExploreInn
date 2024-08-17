const mongoose = require("mongoose");
const ratingModel = require("../models/rating.model");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Villa",
      "Igloo",
      "SwimmingPool",
      "Cabin",
      "PentHouse",
      "Cottage",
      "Apartment",
      "EntirePlace",
    ],
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

//Delete all the ratings which have the id of the deleted listing
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await ratingModel.deleteMany({ _id: { $in: listing.ratings } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
