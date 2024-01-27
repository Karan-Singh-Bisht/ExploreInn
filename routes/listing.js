const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const Listing = require("../models/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

const listingController = require("../controllers/listings.js");

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
    
//renderNewForm Route
router.get("/new",isLoggedIn ,listingController.renderNewForm);  //This should always be above the below route otherwise the below route will assume /new to be an id.

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
    
//renderEditForm Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;

//Index Route
// router.get("/",wrapAsync(listingController.index)); // These routes have been transferred to controllers.

//Show Route
// router.get("/:id",wrapAsync(listingController.showListing));

//Create Route
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
