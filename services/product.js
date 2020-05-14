const { ProductModel, StoreModel, CategoryModel } = require("../models");

const boom = require("@hapi/boom");

const createOne = async ({ filter, data }) => {
  /*
    1. check if exist category and store
    2. load product in category and store
  */
  const [foundStore, foundCategory] = await Promise.all([
    StoreModel.findOne({ _id: data.store, isActive: true }),
    CategoryModel.findOne({ _id: data.category, isActive: true }).populate({
      path: "store",
      select: "_id name owner",
    }),
  ]);

  if (!foundStore)
    return Promise.reject(boom.notFound("¡No se encontro la tienda!"));
  if (String(foundStore.owner) != String(filter.owner))
    return Promise.reject(
      boom.forbidden("¡No podes cargar productos en tiendas que no son tuyas!")
    );

  if (!foundCategory)
    return Promise.reject(boom.notFound("¡No se encontro la categoria!"));
  if (String(foundCategory.store.owner) != String(filter.owner))
    return Promise.reject(
      boom.forbidden("¡No podes usar categorias de tiendas que no son tuyas!")
    );

  const createdProduct = await ProductModel.create(data);
  foundStore.products.push(createdProduct._id);
  foundCategory.products.push(createdProduct._id);

  await Promise.all([foundStore.save(), foundCategory.save()]);

  return createdProduct;
};

const getOne = async ({ filter }) => {
  const foundCategory = await ProductModel.findOne({
    _id: filter._id,
    isActive: true,
  }).populate({
    path: "store",
    select: "_id name owner",
  });

  if (!foundCategory)
    return Promise.reject(boom.notFound("¡No se encontro la categoria!"));

  if (String(foundCategory.store.owner) != String(filter.owner))
    return Promise.reject(
      boom.forbidden("¡No podes obtener productos de tiendas que no son tuyas!")
    );

  const category = foundCategory.toJSON();

  return {
    ...category,
    store: undefined,
  };
};

const updateOne = async ({ filter, data }) => {
  /* 1, 2 */
  const foundProduct = await getOne({ filter });

  const newCategoryId = data.category;
  const oldCategoryId = foundProduct.category;

  if (data.category && String(newCategoryId) != String(oldCategoryId)) {
    /*
      1. buscar categoria anterior
      2. validar que sea mia
      3. buscar nueva categoria
      4. validar que sea mia
      5. eliminar producto de la anterior categoria
      6. cargar producto en la nueva categoria
    */

    /* 3, 4, 5, 6 */
    const [foundNewCategory, foundOldCategory] = await Promise.all([
      CategoryModel.findOne({ _id: newCategoryId, isActive: true }).populate({
        path: "store",
        select: "_id name owner",
      }),
      CategoryModel.findOne({
        _id: oldCategoryId,
        isActive: true,
      }).populate({
        path: "store",
        select: "_id name owner",
      }),
    ]);

    if (!foundNewCategory)
      return Promise.reject(boom.notFound("¡No se encontro la categoria!"));
    if (String(foundNewCategory.store.owner) != String(filter.owner))
      return Promise.reject(
        boom.forbidden("¡No podes usar categorias de tiendas que no son tuyas!")
      );

    const indexOldProductCategory = foundOldCategory.products.findIndex(
      (_id) => String(_id) == String(foundProduct._id)
    );

    if (indexOldProductCategory != 1) {
      foundOldCategory.products.splice(indexOldProductCategory, 1);
    }

    foundNewCategory.products.push(foundProduct._id);

    await Promise.all([foundOldCategory.save(), foundNewCategory.save()]);
  }

  const updatedProduct = await ProductModel.findOneAndUpdate(
    { _id: filter._id },
    data,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  return updatedProduct;
};

const deleteOne = async ({ filter }) => {
  await getOne({ filter });

  return ProductModel.findOneAndUpdate(
    { _id: filter._id },
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
  getOne,
  updateOne,
  deleteOne,
};
