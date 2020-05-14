const config = require("./../config");
const jwt = require("jsonwebtoken");
const { GecoUserModel } = require("./../models");
const bcrypt = require("bcrypt");

const UserService = require("./user");
const StoreService = require("./store");
const sendEmail = require("./../utils/sendEmail");

const createForgotPassword = async ({ filter }) => {
  const { email } = filter;

  const resetPasswordToken = require("crypto").randomBytes(32).toString("hex");
  const resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await UserService.updateOne({
    filter: { email },
    data: {
      resetPasswordToken,
      resetPasswordExpires,
    },
  });

  sendEmail({
    to: email,
    subject: "Reiniciar contraseña - GECO",
    text: `Haga clic en el siguiente enlace o péguelo en su navegador para completar el proceso:

${config.frontUrl}/auth/reset/${resetPasswordToken}`,
  });
};

const getResetPasswordToken = async ({ filter }) => {
  const { resetPasswordToken } = filter;
  const resetPasswordExpires = Date.now();

  const foundUser = await UserService.getOne({
    filter: {
      resetPasswordToken,
      resetPasswordExpires: { $gte: resetPasswordExpires },
    },
  });

  const user = foundUser.toJSON();
  return {
    email: user.email,
    _id: user._id,
  };
};

const createResetPasswordToken = async ({ filter, data }) => {
  const { resetPasswordToken } = filter;
  const { password } = data;

  const resetPasswordExpires = Date.now();

  return UserService.updateOne({
    filter: {
      resetPasswordToken,
      resetPasswordExpires: { $gte: resetPasswordExpires },
    },
    data: { password, resetPasswordExpires },
  });
};

const getToken = ({ data, req }) => {
  const { user } = data;

  return new Promise((res, rej) => {
    req.login(user, { session: false }, (error) => {
      if (error) rej(error);
      const payload = user;

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: "365d",
      });

      res(token);
    });
  });
};

const register = async ({ data }) => {
  const { password, email, storeName, storePhone } = data;
  const createdUser = await UserService.createOne({
    data: { password, email },
  });

  const createdStore = await StoreService.createOne({
    data: {
      name: storeName,
      phone: storePhone,
      owner: createdUser._id,
    },
  });

  createdUser.stores.push(createdStore._id);
  await createdUser.save();
  return true;
};

module.exports = {
  createForgotPassword,
  getResetPasswordToken,
  createResetPasswordToken,
  getToken,
  register,
};
