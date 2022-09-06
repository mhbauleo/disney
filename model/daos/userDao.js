const User = require("../models/userModel");

const createNewUser = async (newUser) => {
  try {
    return await User.create(newUser);
  } catch (e) {
    console.log(e);
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({
      where: {
        email,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { createNewUser, getUserByEmail };
