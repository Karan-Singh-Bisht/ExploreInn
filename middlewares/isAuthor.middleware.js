const ratingModel = require("../models/rating.model");

async function isAuthor(req, res, next) {
  const { id } = req.params;
  const { ratingId } = req.params;
  const rating = await ratingModel.findById(ratingId);
  if (!(rating.author == res.locals.currUser.id)) {
    req.flash("error", "Unauthorized User!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports = isAuthor;
