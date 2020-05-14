const { UserModel } = require("./../models");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");

const getOne = async ({ filter }) => {
  const user = await UserModel.findOne({
    isActive: true,
    ...filter,
  });

  if (!user) return Promise.reject("¡Usuario no encontrado!");

  return user;
};

const getMe = async ({ filter }) => {
  const user = await UserModel.findOne({
    isActive: true,
    ...filter,
  });

  if (!user) return Promise.reject("¡Usuario no encontrado!");

  return user;
};

const updateOne = async ({ filter, data }) => {
  await getOne({ filter });

  if (data.password) data.password = await bcrypt.hash(data.password, 8);

  return UserModel.findOneAndUpdate(filter, data, {
    new: true,
  });
};

const createOne = async ({ data }) => {
  const foundUser = await UserModel.findOne({ email: data.email });

  if (foundUser)
    return Promise.reject(boom.badRequest("¡El email ya esta en uso!"));

  return UserModel.create({
    ...data,
    password: await bcrypt.hash(data.password, 8),
  });
};

module.exports = {
  getOne,
  getMe,
  updateOne,
  createOne,
};
