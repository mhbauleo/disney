const userDao = require("../model/daos/userDao");
const { createHash, isValidPassword } = require("../helpers/bcrypt");
const { createJWT } = require("../helpers/jwt");

const register = async (username, password) => {
  const user = await userDao.getUserByUsername(username);
  if (user) return null;

  const hashedPassword = await createHash(password);
  const createdUser = await userDao.createNewUser({
    username,
    password: hashedPassword,
  });
  return createdUser;
};

const login = async (username, password) => {
  try {
    const user = await userDao.getUserByUsername(username);
    if (!user) {
      console.log("Username doesn't exist");
      return null;
    }
    const isValid = await isValidPassword(user, password);
    if (!isValid) {
      console.log("Invalid password");
      return null;
    }

    const jwt = createJWT({ id: user.id, username: user.username });
    return jwt;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { register, login };
