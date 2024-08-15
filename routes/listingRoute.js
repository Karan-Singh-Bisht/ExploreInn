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
} = require("../controllers/listing.controller");
const isOwner = require("../middlewares/isOwner.middleware");
const isAuthor = require("../middlewares/isAuthor.middleware");

router.get("/new", isLoggedIn, renderCreateForm);
router.post("/create", validateListing, upload.single("image"), createListing);
router.get("/", showListings);
router.get("/:id", listing);
router.get("/edit/:id", isOwner, renderEditForm);
router.put("/update/:id", isLoggedIn, isOwner, validateListing, updateListing);
router.delete("/delete/:id", isLoggedIn, isOwner, deleteListing);
router.post("/ratings/:id", isLoggedIn, validateRating, listingRating);
router.delete("/:id/ratings/:ratingId", isLoggedIn, isAuthor, deleteRating);

module.exports = router;
