const AuthRouter = require("./auth");
const UserRouter = require("./user");
const StoreRouter = require("./store");
const CategoryRouter = require("./category");
const ProductRouter = require("./product");

module.exports = function (server) {
  server.use("/auth", AuthRouter);
  server.use("/users", UserRouter);
  server.use("/stores", StoreRouter);
  server.use("/categories", CategoryRouter);
  server.use("/products", ProductRouter);
};
