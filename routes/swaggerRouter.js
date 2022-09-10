const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerConfig = require("../config/swaggerConfig");

const specs = swaggerJsdoc(swaggerConfig);

router.use("/", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;
