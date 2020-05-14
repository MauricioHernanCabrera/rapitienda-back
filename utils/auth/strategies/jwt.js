const passport = require("passport");
const boom = require("@hapi/boom");
const { Strategy, ExtractJwt } = require("passport-jwt");
const config = require("../../../config");
const { UserService } = require("./../../../services");

passport.use(
  "jwt",
  new Strategy(
    {
      secretOrKey: config.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },

    async (tokenPayload, cb) => {
      try {
        const filter = {
          email: tokenPayload.email,
        };

        const user = await UserService.getOne({ filter });

        return cb(null, user);
      } catch (err) {
        return cb(boom.unauthorized(err));
      }
    }
  )
);
