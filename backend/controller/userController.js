const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");
const crypto = require("crypto");

// user register or create user account

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    const newUser = await User.create(req.body); // Use await here to wait for user creation
    res.json({ newUser });
  } else {
    throw new Error("user already exists");
  }
});

// user login

const loginUserCntrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if user exist or not
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser?.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstname,
      lastName: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("invalid credentials");
  }
});

//handle refresh token
// prettier-ignore
/* eslint-disable arrow-parens */

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error(" no refresh token in cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("no refresh token in db of not matched");
  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_KEY,
    (err, decoded )=> {
      if (err || user.id !== decoded.id) {
        throw new Error("there is something wrong with the refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    })
  
});
/* eslint-enable arrow-parens */

//logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.sendStatus(204); //forbidden
});
// update user

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    const updateuser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json({ updateuser });
  } catch (error) {
    throw new Error(error);
  }
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getusers = await User.find();
    res.json({ getusers });
  } catch (error) {}
});

// single user
const getSingleUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getuser = await User.findById(id);
    res.json({ getuser });
  } catch (error) {
    throw new Error(error);
  }
});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteuser = await User.findByIdAndDelete(id);
    res.json({ deleteuser });
  } catch (error) {
    throw new Error(error);
  }
});

// //forgot password token
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

// blocked user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json(block);
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const unBlock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json(unBlock);
  } catch (error) {
    throw new Error(error);
  }
});

//update password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});
module.exports = {
  createUser,
  loginUserCntrl,
  getAllUsers,
  getSingleUsers,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  logout,
};
