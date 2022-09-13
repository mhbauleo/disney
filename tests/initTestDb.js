const dotenv = require("dotenv");
dotenv.config();
const { dbConnection } = require("../model/db/connection");

(async function () {
  await dbConnection();
})();
