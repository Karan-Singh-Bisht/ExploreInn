const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const validateListing = require("../middlewares/validateListing.middleware");
const {
  createListing,
  showListings,
  listing,
  renderCreateForm,
  renderEditForm,
  updateListing,
  deleteListing,
} = require("../controllers/listing.controller");

router.get("/listings/new", renderCreateForm);
router.post(
  "/listings/create",
  validateListing,
  upload.single("image"),
  createListing
);
router.get("/listings", showListings);
router.get("/listings/:id", listing);
router.get("/listings/edit/:id", renderEditForm);
router.put("/listings/update/:id", validateListing, updateListing);
router.delete("/listings/delete/:id", deleteListing);

module.exports = router;
