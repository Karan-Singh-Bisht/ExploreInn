const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const validateListing = require("../middlewares/validateListing.middleware");
const validateRating = require("../middlewares/validateRating.middleware");
const isLoggedIn = require("../middlewares/isLoggedIn.middleware");
const {
  createListing,
  showListings,
  listing,
  renderCreateForm,
  renderEditForm,
  updateListing,
  deleteListing,
  listingRating,
  deleteRating,
  getListingByCategory,
} = require("../controllers/listing.controller");
const isOwner = require("../middlewares/isOwner.middleware");
const isAuthor = require("../middlewares/isAuthor.middleware");

router.get("/new", isLoggedIn, renderCreateForm);
router.post("/create", upload.single("image"), validateListing, createListing);
router.get("/", showListings);
router.get("/:id", listing);
router.get("/edit/:id", isOwner, renderEditForm);
router.get("/category/:category", getListingByCategory);
router.put(
  "/update/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  updateListing
);
router.delete("/delete/:id", isLoggedIn, isOwner, deleteListing);
router.post("/ratings/:id", isLoggedIn, validateRating, listingRating);
router.delete("/:id/ratings/:ratingId", isLoggedIn, isAuthor, deleteRating);

module.exports = router;
