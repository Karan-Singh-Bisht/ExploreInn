const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("./models/user.models");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Specify that we are using email instead of username
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        const isMatch = await user.isPasswordCorrect(password);

        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
