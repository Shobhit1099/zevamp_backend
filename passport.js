const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const Auth = require("./models/Auth");
require("dotenv").config();

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.SECRET,
    },
    (payload, done) => {
      console.log("PAYLOAD", payload);
      Auth.findById({ _id: payload.sub }, (err, auth) => {
        if (err) return done(err, false);
        if (auth) return done(null, auth);
        else return done(null, false);
      });
    }
  )
);

passport.use(
  new LocalStrategy((username, password, done) => {
    Auth.findOne({ username: username }, (err, auth) => {
      if (err) return done(err);
      if (!auth) return done(null, false);
      auth.comparePassword(password, done);
    });
  })
);
