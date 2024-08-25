const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const userModel = require("../models/user.models");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const passport = require("passport");

module.exports.renderLoginPage = asyncHandler(async (req, res) => {
  res.render("login");
});

module.exports.renderRegisterPage = asyncHandler(async (req, res) => {
  res.render("register");
});

module.exports.registerUser = asyncHandler(async (req, res, next) => {
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

  if (!user) {
    throw new ApiError(404, "User not found!");
  }
  req.login(user, (err) => {
    if (err) {
      return next(err);
    }
    req.flash(
      "success",
      `Welcome to ExploreInn ${userName},Ready to Blaze New Trails?`
    );
    res.redirect("/listings");
  });
});

module.exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    } // Handle any errors

    if (!user) {
      req.flash("error", info.message || "Login failed.");
      return res.redirect("/user/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      req.flash(
        "success",
        `Welcome Back ${user.userName}, ExploreInn feels better with you!`
      );
      res.redirect(res.locals.redirectUrl || "/listings");
    });
  })(req, res, next); // Call the passport middleware
};

module.exports.logoutUser = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Error logging out.");
    }
    req.flash("success", "You have been logged out successfully.");
    res.redirect("/user/login");
  });
});

module.exports.userInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found!");
  }
  const findUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");
  res.render("userProfile", { user: findUser });
});

module.exports.editUserInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found!");
  }
  var originalUserImage = user.avatar;
  var newImageUrl = originalUserImage.replace("/upload", "/upload/h_500,w_500");
  res.render("editUserProfile", { user, newImageUrl }); // Render the edit user profile template
});

// module.exports.updatedUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { userName, email } = req.body;

//   console.log(userModel.userNameChanged);
//   if (userModel.userNameChanged == true && userName != userModel.userName) {
//     req.flash("error", "Username can only be changed once.");
//     return res.redirect(`/user/${id}/editUserProfile`);
//   }

//   if (userModel.emailChanged == true && email != userModel.email) {
//     req.flash("error", "Email can only be changed once.");
//     return res.redirect(`/user/${id}/editUserProfile`);
//   }

//   // If the username or email is being changed for the first time, mark them as changed
//   if (userName !== userModel.userName) {
//     userModel.userNameChanged = true;
//   }
//   if (email !== userModel.email) {
//     userModel.emailChanged = true;
//   }

//   // Check if the email already exists
//   // const existingEmail = await userModel.findOne({ email });
//   // if (existingEmail) {
//   //   req.flash("error", "User with the particular credentials already exists");
//   //   return res.redirect(`/user/${id}/editUserProfile`);
//   // }

//   const avatarLocalPath = req.file?.path;
//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   const updatedUser = await userModel.findByIdAndUpdate(id, {
//     userName,
//     email,
//     avatar: avatar?.url,
//   });
//   if (!updatedUser) {
//     throw new ApiError(500, "Failed to update user");
//   }
//   req.flash("success", "User Profile Updated Successfully!");
//   res.redirect(`/user/${id}/dashboard`);
// });

module.exports.updatedUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email } = req.body;

    // Fetch the user from the database
    const user = await userModel.findById(id);

    if (!userModel) {
      req.flash("error", "User not found.");
      return res.redirect(`/user/${id}/editUserProfile`);
    }

    // Check if the email already exists
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== id) {
      req.flash("error", "User with this email already exists.");
      return res.redirect(`/user/${id}/editUserProfile`);
    }

    // Check if the username or email is being changed
    if (user.userNameChanged && userName !== user.userName) {
      req.flash("error", "Username can only be changed once.");
      return res.redirect(`/user/${id}/editUserProfile`);
    }

    if (user.emailChanged && email !== user.email) {
      req.flash("error", "Email can only be changed once.");
      return res.redirect(`/user/${id}/editUserProfile`);
    }
    // Update flags if username or email is being changed for the first time
    if (userName !== user.userName || email !== user.email) {
      await userModel.findByIdAndUpdate(id, {
        userNameChanged: true,
        emailChanged: true,
      });
    }

    // Handle avatar upload
    const avatarLocalPath = req.file?.path;
    const avatar = avatarLocalPath
      ? await uploadOnCloudinary(avatarLocalPath)
      : null;

    // Update user information
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        userName,
        email,
        avatar: avatar?.url || userModel.avatar, // Keep old avatar if new one is not uploaded
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user");
    }

    req.flash("success", "User Profile Updated Successfully!");
    res.redirect(`/user/${id}/dashboard`);
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error", "An error occurred while updating the user profile.");
    res.redirect(`/user/${id}/editUserProfile`);
  }
});
