const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const userModel = require("../models/user.models");
const uploadOnCloudinary = require("../utils/cloudinary.js");

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error("Error generating access and refresh tokens");
  }
};

module.exports.renderRegisterPage = asyncHandler(async (req, res) => {
  res.render("register");
});

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
  res.redirect("/listings");
});

module.exports.loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;
  if (!email && !userName) {
    throw new ApiError(400, "Email or Username are required!");
  }
  const user = await userModel.findOne({ $or: [{ email }, { userName }] });
  if (!user) {
    throw new ApiError(404, "User does not exist!");
  }
  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(400, "Password is incorrect!");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .redirect("/listings")
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in Successfully"
      )
    );
});
