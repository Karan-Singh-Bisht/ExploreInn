const listingSchemaJoi = require("../schema");
const ApiError = require("../utils/apiError");

const validateListing = (req, res, next) => {
  const { error } = listingSchemaJoi.validate(req.body);
  if (error) {
    throw new ApiError(400, error.message);
  } else {
    next();
  }
};

module.exports = validateListing;
