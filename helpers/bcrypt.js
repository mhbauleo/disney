const bcrypt = require("bcrypt");

const createHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (e) {
    console.log(e);
  }
};

const isValidPassword = async (user, password) => {
  try {
    return await bcrypt.compare(password, user.password);
  } catch (e) {
    console.log(e);
  }
};

module.exports = { createHash, isValidPassword };
