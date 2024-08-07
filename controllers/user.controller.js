const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const userModel = require("../models/user.models");
const uploadOnCloudinary = require("../utils/cloudinary.js");

module.exports.registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const existedUser = await userModel.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }
  const avatarLocalPath = req.file?.path;

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await userModel.create({
    userName,
    email,
    password,
    avatar:
      avatar?.url ||
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=826&t=st=1723037395~exp=1723037995~hmac=88fe535ef9ac7e7658d485f74eaf8ffe444366fb43fb67ba7719c1969f068fad",
  });

  const findUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  if (!findUser) {
    throw new ApiError(404, "User not found!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, findUser, "User Registered successfully!"));
});
