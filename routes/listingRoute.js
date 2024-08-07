const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const { createListing } = require("../controllers/listing.controller");

router.post("/create", upload.single("image"), createListing);

module.exports = router;
