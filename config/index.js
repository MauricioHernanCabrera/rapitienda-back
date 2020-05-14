require("dotenv").config();

const config = {
  port: process.env.PORT,
  dev: process.env.NODE_ENV !== "production",
  db: {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    hasAuth: process.env.DB_USER || process.env.DB_PASSWORD ? true : false,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  nodemailer: {
    user: process.env.NODEMAILER_USER,
    clientId: process.env.NODEMAILER_CLIENT_ID,
    clientSecret: process.env.NODEMAILER_CLIENT_SECRET,
    accessToken: process.env.NODEMAILER_ACCESS_TOKEN,
    refreshToken: process.env.NODEMAILER_REFRESH_TOKEN,
    expires: process.env.NODEMAILER_EXPIRES,
  },

  frontUrl: process.env.FRONT_URL,
};

module.exports = config;
