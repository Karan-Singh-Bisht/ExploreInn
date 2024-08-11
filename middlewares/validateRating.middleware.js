const { ratingSchemaJoi } = require("../schema");
const ApiError = require("../utils/apiError");

const validateRating = (req, res, next) => {
  console.log(req.body);
  const { error } = ratingSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ApiError(400, errMsg);
  } else {
    next();
  }
};

module.exports = validateRating;
