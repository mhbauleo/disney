const userDao = require("../model/daos/userDao");
const { createHash, isValidPassword } = require("../helpers/bcrypt");
const { createJWT } = require("../helpers/jwt");
const { sendEmail } = require("../helpers/mail")

const register = async (email, password) => {
  const user = await userDao.getUserByEmail(email);
  if (user) return null;

  const hashedPassword = await createHash(password);
  const createdUser = await userDao.createNewUser({
    email,
    password: hashedPassword,
  });
  console.log(createdUser)
  if(createdUser) sendEmail('Welcome', '<h1>Welcome!</h1>', createdUser.email);
  return createdUser;
};

const login = async (email, password) => {
  try {
    const user = await userDao.getUserByEmail(email);
    if (!user) {
      console.log("User doesn't exist");
      return null;
    }
    const isValid = await isValidPassword(user, password);
    if (!isValid) {
      console.log("Invalid password");
      return null;
    }

    const jwt = createJWT({ id: user.id, email: user.email });
    return jwt;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { register, login };
