const Joi = require("joi");

const listingSchemaJoi = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Title should be a string.",
    "string.empty": "Title is required.",
  }),

  description: Joi.string().required().messages({
    "string.base": "Description should be a string.",
    "string.empty": "Description is required.",
  }),

  image: Joi.string().allow("", null),

  category: Joi.string()
    .valid(
      "Villa",
      "Igloo",
      "SwimmingPool",
      "Cabin",
      "PentHouse",
      "Cottage",
      "Apartment",
      "EntirePlace"
    )
    .required()
    .messages({
      "any.only": "Category must be one of the specified values.",
      "string.empty": "Category is required.",
    }),

  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number.",
    "number.empty": "Price is required.",
  }),

  location: Joi.string().required().messages({
    "string.base": "Location should be a string.",
    "string.empty": "Location is required.",
  }),

  country: Joi.string().required().messages({
    "string.base": "Country should be a string.",
    "string.empty": "Country is required.",
  }),
});

const ratingSchemaJoi = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "Rating must be a number.",
    "number.empty": "Rating is required.",
  }),

  comment: Joi.string().required().messages({
    "string.base": "Comment should be a string.",
    "string.empty": "Comment is required.",
  }),
});

module.exports = { listingSchemaJoi, ratingSchemaJoi };
