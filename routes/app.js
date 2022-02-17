const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const User = require("../models/User");
const Auth = require("../models/Auth");
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3000","https://zevamp.com"],
  credentials: true,
  optionSuccessStatus: 200,
};

router.use(cors(corsOptions));
router.use(cookieParser());

const signToken = (userID) => {
  return JWT.sign(
    { iss: process.env.SECRET, sub: userID },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
};

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ Email: req.user.username }, (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: { msgBody: "Error has occured", msgError: true },
        });
      } else res.status(200).json({ userDetails: user, authenticated: true });
    });
  }
);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res.status(200).json({ isAuthenticated: true, auth: { username } });
    } else console.log("FAIL");
  }
);

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { username: "" }, success: true });
  }
);

router.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { username } = req.auth;
    res.status(200).json({ isAuthenticated: true, user: { username } });
  }
);

module.exports = router;
