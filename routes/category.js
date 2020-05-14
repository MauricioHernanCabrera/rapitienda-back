const express = require("express");
const router = express();

const { CategoryService } = require("../services");

const {
  validationMiddleware,
} = require("../utils/middlewares/validationHandler");
const { BaseSchema, CategorySchema } = require("../schemas");
const passport = require("passport");
require("../utils/auth/strategies/jwt");

router.post(
  "/",
  validationMiddleware(CategorySchema.createOne),
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const data = await CategoryService.createOne({
        data: req.body,
        filter: { owner: req.user._id },
      });

      res.status(201).json({
        data,
        message: "¡Categoria creada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:_id/",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await CategoryService.getOne({
        filter: { _id, owner: req.user._id },
      });

      res.status(200).json({
        data,
        message: "¡Categoria recuperada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:_id/",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  validationMiddleware(CategorySchema.updateOne),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await CategoryService.updateOne({
        filter: { _id, owner: req.user._id },
        data: req.body,
      });

      res.status(200).json({
        data,
        message: "¡Categoria actualizada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:_id/",
  validationMiddleware({ _id: BaseSchema.id.required() }, "params"),
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const { _id } = req.params;
      const data = await CategoryService.deleteOne({
        filter: { _id, owner: req.user._id },
      });

      res.status(200).json({
        data,
        message: "¡Categoria eliminada!",
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
