const { BaseModel } = require("../models");

const boom = require("@hapi/boom");

const createOne = ({ filter, data }) => {
  return BaseModel.create(data);
};

const getAll = () => {
  return BaseModel.find({ isActive: true });
};

const getOne = ({ filter }) => {
  return BaseModel.findOne({
    _id: filter._id,
    isActive: true,
  }).orFail(boom.notFound("¡Type of country not found!"));
};

const updateOne = async ({ filter, data }) => {
  await getOne({ filter });

  return BaseModel.findOneAndUpdate(filter, data, {
    new: true,
    runValidators: true,
    context: "query",
  });
};

const deleteOne = async ({ filter }) => {
  await getOne({ filter });

  return BaseModel.findOneAndUpdate(
    filter,
    { isActive: false },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
};

module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
