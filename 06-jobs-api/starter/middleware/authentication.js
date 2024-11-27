const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];
  try {
    // jwt.verify - to verify the created JWT token with the same secret key
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the job routes
    // inside payload attributes are created since JWT token created by using jwt.sign() method
    req.user = {userId: payload.userId, name: payload.name}
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
};

module.exports = auth
