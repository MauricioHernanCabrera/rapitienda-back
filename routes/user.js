const express = require("express");
const router = express();
const passport = require("passport");

const { UserService } = require("./../services");

require("./../utils/auth/strategies/jwt");

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const data = await UserService.getMe({
        filter: {
          _id: req.user._id,
          role: req.user.role,
        },
      });

      res.status(200).json({
        message: "¡Usuario obtenido!",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
