const db = require("./database");

async function dbConnection() {
  try {
    await db.authenticate();
    console.log("Database online");
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { dbConnection };
