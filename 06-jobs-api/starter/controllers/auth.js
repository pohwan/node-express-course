const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  // [optional] because we will have moongoose validator to check without writing code in controller
  /*
    const { name, email, password } = req.body; 
    if (!name || !email || !password) {
    throw new BadRequestError("Please provide name, email and password");
  } */

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  // check user from db
  const user = await User.findOne({ email });

  // if the user exists, return response with created JWT
  // else, throw error (UnauthenticatedError)

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  
  // compare hashed password
  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
