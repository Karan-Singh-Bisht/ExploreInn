const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");
const ApiResponse = require("../utils/apiResponse");
const listingModel = require("../models/listing.models");
const ApiError = require("../utils/apiError");

module.exports.createListing = asyncHandler(async (req, res) => {
  const { title, description, price, location, country } = req.body;

  const imageLocalPath = req.file?.path;
  const image = await uploadOnCloudinary(imageLocalPath);

  const listing = await listingModel.create({
    title,
    description,
    price,
    location,
    country,
    image:
      image?.url ||
      "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  });

  if (!listing) {
    throw new ApiError(500, "Failed to create listing");
  }

  res.status(201).json(new ApiResponse(200, listing, "Listing Created"));
});
