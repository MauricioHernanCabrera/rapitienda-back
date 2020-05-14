const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const { UserService } = require("./../../../services");

passport.use(
  "basic",
  new BasicStrategy(async (email, password, cb) => {
    try {
      const filter = { email };
      const foundUser = await UserService.getOne({ filter });

      if (!foundUser) return cb(boom.unauthorized(), false);
      if (!(await bcrypt.compare(password, foundUser.password)))
        return cb(boom.unauthorized(), false);

      const user = {
        _id: foundUser._id,
        email: foundUser.email,
      };
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);
