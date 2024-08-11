const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const validateListing = require("../middlewares/validateListing.middleware");
const validateRating = require("../middlewares/validateRating.middleware");
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

router.get("/new", renderCreateForm);
router.post("/create", validateListing, upload.single("image"), createListing);
router.get("/", showListings);
router.get("/:id", listing);
router.get("/edit/:id", renderEditForm);
router.put("/update/:id", validateListing, updateListing);
router.delete("/delete/:id", deleteListing);
router.post("/ratings/:id", validateRating, listingRating);
router.delete("/:id/ratings/:ratingId", deleteRating);

module.exports = router;
