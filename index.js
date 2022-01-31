const express = require("express");
const bodyParser = require("body-parser");
const routesHandler = require("./routes/handler.js");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const fetch = require("cross-fetch");
const generator = require("generate-password");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routesHandler);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb+srv://admin-Shobhit:buggatti@cluster0.vypaw.mongodb.net/Zevamp",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const authSchema = new mongoose.Schema({
  Email: String,
  Password: String,
});
authSchema.plugin(passportLocalMongoose);
const Auth = new mongoose.model("Auth", authSchema);

const userSchema = new mongoose.Schema({
  Email: { type: String, required: true },
  Name: { type: String, required: true },
  Phone_Number: { type: Number, required: true },
  Spend_days: { type: String, required: false },
  Meet_Stranger: { type: String, required: false },
  Centre_Of_Attraction: { type: String, required: false },
  Discipline: { type: Number, required: false },
});
const User = new mongoose.model("User", userSchema);

fetch("https://api.typeform.com/forms/IxhcTSuG/responses", {
  method: "GET",
  headers: {
    authorization: `bearer ${process.env.ACCESS_TOKEN}`,
  },
})
  .then(function (response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }
    response.json().then(function (data) {
      data.items.map((item) => {
        if (item.answers.length === 7) {
          var password = generator.generate({
            length: 10,
            numbers: true,
          });
          Auth.register(
            { username: item.answers[1].email },
            password,
            function (err, auth) {
              if (err) {
                console.log("AUTH ERR", err);
              } else {
                var newUser = new User({
                  Name: item.answers[0].text,
                  Email: item.answers[1].email,
                  Phone_Number: item.answers[2].phone_number,
                  Spend_Days: item.answers[3].choice.label,
                  Meet_Stranger: item.answers[4].choice.label,
                  Centre_Of_Attraction: item.answers[5].choice.label,
                  Discipline: item.answers[6].number,
                });
                async function createUser() {
                  return await newUser.save();
                }
                createUser()
                  .then((res) => console.log("RESULT", res))
                  .catch((err) => {
                    console.log("USER ERR", err);
                  });
                passport.authenticate("local");
                console.log("PASSWORD", password);
              }
            }
          );
        }
      });
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

app.get("/app/home", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  var userMap = {};
  if (req.isAuthenticated()) {
    fetch("https://api.typeform.com/forms/IxhcTSuG/responses", {
      method: "GET",
      headers: {
        authorization: `bearer ${process.env.ACCESS_TOKEN}`,
      },
    })
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          data.items.map((item) => {
            if (item.answers.length === 7) {
              User.find({}, function (err, users) {
                users.forEach(function (user) {
                  userMap[user._id] = user;
                });
              });
            }
          });
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
    console.log("USER DATA", userMap);
    res.send(JSON.stringify(userMap));
  } else res.render("/");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Up and running on ${PORT}`);
});
