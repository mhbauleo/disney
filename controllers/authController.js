const authService = require("../services/authService");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.register(email, password);
  user
    ? res.status(201).json({ status: "success", data: null })
    : res.status(409).json({
        status: "fail",
        data: { message: "User already exists." },
      });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const jwt = await authService.login(email, password);
  jwt
    ? res.json({ status: "success", data: jwt })
    : res.status(401).json({
        status: "fail",
        data: { message: "The username or password is incorrect" },
      });
};

module.exports = { register, login };
