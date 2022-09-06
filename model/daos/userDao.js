const User = require("../models/userModel");

const createNewUser = async (newUser) => {
  try {
    return await User.create(newUser);
  } catch (e) {
    console.log(e);
  }
};

const getUserByUsername = async (username) => {
  try {
    return await User.findOne({
      where: {
        username,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { createNewUser, getUserByUsername };
