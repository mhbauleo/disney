const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Disney API",
      description: "API to explore the world of Disney.",
    },
  },
  apis: ["./docs/**/*.yaml"],
};

module.exports = swaggerConfig;
