// If you want to return an error on request, this class will easily generate an error. (extends Error is important.)
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError
