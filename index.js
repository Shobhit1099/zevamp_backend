const express = require("express");
const bodyParser = require("body-parser");
const routesHandler = require("./routes/handler.js");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routesHandler);

// app.use(session({
//   secret: "Our little secret.",
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// mongoose.connect("mongodb+srv://admin-Shobhit:buggatti@cluster0.vypaw.mongodb.net/Zevamp",{useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.set("useCreateIndex", true);

// const authSchema = new mongoose.Schema ({
// 	email: String,
// 	password: String,
//   username: String,
//   phone: Number,
// });
// authSchema.plugin(passportLocalMongoose);
// const Auth = new mongoose.model("Auth",authSchema);

// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Up and running on ${PORT}`);
});
