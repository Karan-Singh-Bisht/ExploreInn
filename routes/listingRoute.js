const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const {
  createListing,
  showListings,
  listing,
  renderCreateForm,
} = require("../controllers/listing.controller");

router.get("/listings/new", renderCreateForm);
router.post("/listings/create", upload.single("image"), createListing);
router.get("/listings", showListings);
router.get("/listings/:id", listing);

module.exports = router;
