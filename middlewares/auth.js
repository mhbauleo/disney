const { verifyJWT } = require("../helpers/jwt");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const tokenNotProvidedResponse = {
      status: "fail",
      data: { message: "Token not provided" },
    };
    if (!authorization) return res.status(400).json(tokenNotProvidedResponse);
    const token = authorization.split(" ")[1];
    if (!token) return res.status(400).json(tokenNotProvidedResponse);
    if (verifyJWT(token)) next();
  } catch (e) {
    console.log(e);
    res.status(401).json({
      status: "fail",
      data: { message: "Invalid token" },
    });
  }
};

module.exports = { auth };
