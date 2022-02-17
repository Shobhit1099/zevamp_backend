const express = require("express");
const cookieParser = require("cookie-parser");
const appRoutes = require("./routes/app.js");
const landingRoutes = require("./routes/landing.js");
const mongoose = require("mongoose");
const passport = require("passport");
const fetch = require("cross-fetch");
const generator = require("generate-password");
const Auth = require("./models/Auth");
const User = require("./models/User");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/app", appRoutes);
app.use("/", landingRoutes);

mongoose.connect(
  "mongodb+srv://admin-Shobhit:buggatti@cluster0.vypaw.mongodb.net/Zevamp",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

var API_URL = "";
if (process.env.LAST_RESPONSE_TOKEN == "")
  API_URL = `https://api.typeform.com/forms/IxhcTSuG/responses?page_size=1000`;
else
  API_URL = `https://api.typeform.com/forms/IxhcTSuG/responses?page_size=1000`;

fetch(API_URL, {
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
          process.env.LAST_RESPONSE_TOKEN = item.token;
          var randomPassword = generator.generate({
            length: 10,
            numbers: true,
          });
          Auth.findOne({ username: item.answers[1].email }, (err, user) => {
            if (err) console.log("ERROR WHILE FINDING THE USER", err);
            // if (user) console.log("USER ALREADY REGISTERED", user);
            else if (!user) {
              const newAuth = new Auth({
                username: item.answers[1].email,
                password: randomPassword,
              });
              const newUser = new User({
                Name: item.answers[0].text,
                Email: item.answers[1].email,
                Phone_Number: item.answers[2].phone_number,
                Spend_Days: item.answers[3].choice.label,
                Meet_Stranger: item.answers[4].choice.label,
                Centre_Of_Attraction: item.answers[5].choice.label,
                Discipline: item.answers[6].number,
              });
              async function createAuth() {
                return await newAuth.save();
              }
              async function createUser() {
                return await newUser.save();
              }
              createAuth()
                .then((res) => {
                  console.log("RESULT AUTH", res, "PASSWORD", randomPassword);
                  res.status(201).json({
                    message: {
                      msgBody: "Account successfully created",
                      msgError: false,
                    },
                  });
                })
                .catch((err) => {
                  console.log("ERROR AUTH", err);
                  res.status(500).json({
                    message: { msgBody: "Error has occured", msgError: true },
                  });
                });
              createUser()
                .then((res) => console.log("RESULT", res))
                .catch((err) => {
                  console.log("USER ERR", err);
                });
            }
          });
          // Auth.register(
          //   { username: item.answers[1].email },
          //   password,
          //   function (err, auth) {
          //     if (err) {
          //       console.log("AUTH ERR", err);
          //     } else {
          //       var newUser = new User({
          //         Name: item.answers[0].text,
          //         username: item.answers[1].email,
          //         Phone_Number: item.answers[2].phone_number,
          //         Spend_Days: item.answers[3].choice.label,
          //         Meet_Stranger: item.answers[4].choice.label,
          //         Centre_Of_Attraction: item.answers[5].choice.label,
          //         Discipline: item.answers[6].number,
          //       });
          //       async function createUser() {
          //         return await newUser.save();
          //       }
          //       createUser()
          //         .then((res) => console.log("RESULT", res))
          //         .catch((err) => {
          //           console.log("USER ERR", err);
          //         });
          //       passport.authenticate("local");
          //       console.log("PASSWORD", password);
          //     }
          //   }
          // );
        }
      });
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Up and running on ${port}`);
});
