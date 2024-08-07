const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");
const ApiResponse = require("../utils/apiResponse");
const listingModel = require("../models/listing.models");
const ApiError = require("../utils/apiError");
const { model } = require("mongoose");

//Render create form
module.exports.renderCreateForm = asyncHandler(async (req, res) => {
  res.render("new");
});

//create a new listing
module.exports.createListing = asyncHandler(async (req, res) => {
  const { title, description, price, location, country, category } = req.body;

  const imageLocalPath = req.file?.path;
  const image = await uploadOnCloudinary(imageLocalPath);

  const listing = await listingModel.create({
    title,
    description,
    price,
    location,
    country,
    category,
    image:
      image?.url ||
      "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  });

  if (!listing) {
    throw new ApiError(500, "Failed to create listing");
  }
  res.redirect("/listings");
});

//Show all listings on home page (GET /listings)
module.exports.showListings = asyncHandler(async (req, res) => {
  const listings = await listingModel.find({});
  if (!listings) {
    throw new ApiError(500, "Failed to fetch listings");
  }
  res.render("home", { listings });
});

//Show particular listing
module.exports.listing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await listingModel.findById(id);
  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }
  res.render("listing", { listing });
});

//render Edit form
module.exports.renderEditForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await listingModel.findById(id);
  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }
  res.render("edit", { listing });
});

//Update Listing
module.exports.updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country, category } = req.body;

  const updatedListing = await listingModel.findByIdAndUpdate(id, {
    title,
    description,
    price,
    location,
    country,
    category,
  });

  if (!updatedListing) {
    throw new ApiError(500, "Failed to update listing");
  }
  res.redirect(`/listings/${id}`);
});

//Delete a listing
module.exports.deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedListing = await listingModel.findByIdAndDelete(id);

  if (!deletedListing) {
    throw new ApiError(404, "Listing not found");
  }
  res.redirect("/listings");
});
