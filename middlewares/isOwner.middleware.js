const listingModel = require("../models/listing.models");

async function isOwner(req, res, next) {
  const { id } = req.params;
  const listing = await listingModel.findById(id);
  if (!(listing.owner == res.locals.currUser.id)) {
    req.flash("error", "Unauthorized User!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports = isOwner;
