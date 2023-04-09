const jwt = require("jsonwebtoken"); // Creating token for authentication and authorization
const AppError = require("../utils/create-error.js");
const asyncWrapper = require("../utils/trycatch-wrapper.js");


/* This middleware checks is request has an token and prevents code repetition */
const isAuthorized = asyncWrapper(async (req, res, next) => {
  const token = await req.headers.authorization;
  if (!token) next(new AppError(401, "Please login before this action."))
  const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!verifiedToken) {
    next(new AppError(401, "Something went wrong. Please login again!"))
  } else {
    req.headers.tokenData = verifiedToken
    return next();
  }
});

module.exports = isAuthorized;
