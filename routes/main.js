const express = require("express");
const router = express.Router();

const characterRouter = require("./characterRouter");
const movieRouter = require("./movieRouter");
const genreRouter = require("./genreRouter");
const authRouter = require("./authRouter");
const swaggerRouter = require("./swaggerRouter");
const mainPage = require("./mainPage");

router.use("/characters", characterRouter);
router.use("/movies", movieRouter);
router.use("/genres", genreRouter);
router.use("/auth", authRouter);
router.use("/api-docs", swaggerRouter);
router.use("/", mainPage)

module.exports = router;
