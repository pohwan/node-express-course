const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");

const login = async (req, res) => {
  const { username, password } = req.body;
  // check username, password in post(login) request
  // have 3 options to check
  // 1. mongo (while connecting to db)
  // 2. Joi
  // 3. check in controller (current method using)
  if (!username || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // just for demo, normally provided by db!!!
  const id = new Date().getDate();

  // try to keep payload small, better experience for user
  // for secret key, just for demo, in production use long, complex, and unguessable string value
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.status(200).json({ msg: "user created", token: token });
};

// setup authentication so only the request with JWT can access the dashboard
const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);
  res
    .status(200)
    .json({
      msg: `Hello, ${req.user.username}`,
      secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
    });
};

module.exports = {
  login,
  dashboard,
};
