const AppError = require("../utils/create-error.js");


/* This middleware returns to the user all errors that have occurred or have been generated */
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, success: false });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
      success: false,
    });
  } else if (err.code === 11000) {
    const usedData = err.keyValue.email || err.keyValue.username
    return res.status(400).json({
      message: usedData + " is already used.",
      success: false,
    });
  } else {
    return res.status(500).json({
      message: "Something went wrong, please try again.",
      success: false,
    });
  }
};

module.exports = errorHandler;
