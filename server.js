const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const { dbConnection } = require("./model/db/connection");
const mainRouter = require("./routes/main");

// Database Connection
dbConnection();

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("common"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("./images"));

app.use("/", mainRouter);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (error) => console.log(error));

module.exports = { app, server };
