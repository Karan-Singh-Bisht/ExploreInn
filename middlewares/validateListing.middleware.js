const listingSchemaJoi = require("../schema");
const ApiError = require("../utils/apiError");

const validateListing = (req, res, next) => {
  const { error } = listingSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ApiError(400, errMsg);
  } else {
    next();
  }
};

module.exports = validateListing;
