const NAME =
  process.env.NODE_ENV === "test"
    ? process.env.DB_NAME_TEST
    : process.env.DB_NAME;

const dbConfig = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: NAME,
  DIALECT: process.env.DIALECT,
};

module.exports = dbConfig;
