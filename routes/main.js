const express = require("express");
const router = express.Router();

const characterRouter = require("./characterRouter");
const movieRouter = require("./movieRouter");
const genreRouter = require("./genreRouter");
const authRouter = require("./authRouter");
const swaggerRouter = require("./swaggerRouter");

router.use("/characters", characterRouter);
router.use("/movies", movieRouter);
router.use("/genres", genreRouter);
router.use("/auth", authRouter);
router.use("/api-docs", swaggerRouter);

module.exports = router;
