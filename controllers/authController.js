const authService = require("../services/authService");

const register = async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.register(username, password);
  user
    ? res.status(201).json({ status: "success", data: null })
    : res.status(409).json({
        status: "fail",
        data: { message: "User already exists." },
      });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const jwt = await authService.login(username, password);
  jwt
    ? res.json({ status: "success", data: jwt })
    : res.status(401).json({
        status: "fail",
        data: { message: "The username or password is incorrect" },
      });
};

module.exports = { register, login };
