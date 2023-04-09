const User = require("../models/userModel.js");
const Blog = require("../models/blogModel.js");
const asyncWrapper = require("../utils/trycatch-wrapper.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/create-error.js");

/* POST */
exports.createUser = asyncWrapper(async (req, res, next) => {
  const newUser = req.body;
  hashedPassword = await bcrypt.hash(newUser.password, 10);
  newUser.password = hashedPassword;
  await User.create(newUser).then((resp) => {
    res
      .status(201)
      .json({ message: resp.email + " is created.", success: true });
  });
});

exports.loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(new AppError(404, "Couldn't find user who using this email."));
  } else {
    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      next(new AppError(400, "Password is wrong."));
    } else {
      // creating token for authentication
      const token = await jwt.sign(
        { id: user._id, username: user.username, name: user.name, lastname: user.lastname, admin: user.admin },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );
      user.password = null; // the password is sent as empty for security
      res.status(200).json({
        message: "Logged in",
        userData: user,
        token: token,
        success: true,
      });
    }
  }
});

/* GET */
exports.getUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId
  const user = await User.findOne({ _id: userId }).select({
    _id: 1,
    name: 1,
    lastname: 1,
    username: 1,
  });
  // returns only _id, name, lastname, username of user
  return res.status(200).json(user);
});

/* UPDATE */
exports.updateUser = asyncWrapper(async (req, res, next) => {
  const tokenDataId = req.headers.tokenData.id;
  const userIdForUpdate = req.params.id;
  const isAdmin = req.headers.tokenData.admin;
  const newUserData = req.body;

  if (newUserData?.admin) // The user cannot become admin via http request. manually through the database.
    return next(new AppError(400, "You can only be admin via database!"));
  if (newUserData?.email) // The user cannot change his/her email via http request. It happens manually through the database via support.
    return next(new AppError(400, "Email is not a changable data!"));

  // To change a user's information you must be only the user's itself.
  if (userIdForUpdate !== tokenDataId) {
    return next(new AppError(400, "You don't have an authorization!"));
  }
  // check have user
  const userForUpdate = await User.findById(userIdForUpdate);
  if (!userForUpdate) {
    return next(new AppError(404, "User couldn't find for updating."));
  }
  //update user profile
  await User.findByIdAndUpdate(userIdForUpdate, newUserData)

  /* With the following two update operations, the authorData object and comments object of the blogs 
  are updated and the comments and blogs created with
  the old username, name, surname remain up to date.  */

  //update blog author 
  await Blog.updateMany({ 'author': userIdForUpdate }, { 'authorData': newUserData })
  //update blog comment username
  await Blog.updateMany({
    "comments.commentOwnerID": userIdForUpdate
  },
    { $set: { "comments.$[elem].commentOwnerUsername": newUserData.username } },
    { arrayFilters: [{ "elem.commentOwnerID": userIdForUpdate }] }
  )

  return res.status(200).json({
    message: `Your account has been updated.`,
    success: true,
  });
});

/* DELETE */
exports.deleteUser = asyncWrapper(async (req, res, next) => {
  const userIdForDelete = req.params.id;
  const tokenDataId = req.headers.tokenData.id;
  if (userIdForDelete !== tokenDataId) {
    return next(new AppError(400, "You don't have an authorization!"));
  }
  const userForDelete = await User.findById(userIdForDelete);
  if (!userForDelete) {
    return next(new AppError(404, "User couldn't find for deleting."));
  }

  await User.deleteOne({ _id: userIdForDelete }); // delete user
  await Blog.deleteMany({ author: userIdForDelete }); // delete user blogs
  await Blog.updateMany({}, { $pull: { commets: { commentOwnerID: userIdForDelete } } }); // delete user comments

  return res.status(200).json({
    message: `Your account has been deleted.`,
    success: true,
  });
});
