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

app.get("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const str = {
    testimonials: [
      {
        img: "images/user1.jpeg",
        uname: "Arunesh Singh",
        review:
          "Would love to appreciate the idea that addresses some legit student/work life problems in self development and growth",
        rate: 5,
      },
      {
        img: "images/user2.jpeg",
        uname: "Vedansh Rai",
        review:
          "When the pandemic is limiting socialization, a platform like this can help students and professionals to connect with each other and develop themselves without any restrictions.",
        rate: 5,
      },
      {
        img: "images/user3.jpeg",
        uname: "Shreya",
        review: "Amazing hour. A great utilization of the online platform.",
        rate: 5,
      },
    ],
    faqs: [
      {
        question: "What is Zevamp?",
        answer:
          "Zevamp is a spot for distinct personalities to indulge into deep conversations, helping the real 'You' to prosper.",
      },
      {
        question:
          "What will be the form of talk- Audio meet or a video meeting?",
        answer:
          "Zevamp aims at relieving social anxiety and awkwardness; henceforth, having a video experience will aid in better interaction. So, it is preferable if the users try to connect with the device supporting video.",
      },
      {
        question: "Can I schedule my meeting as per my choice of time?",
        answer:
          "Yes. We at Zevamp prioritize the comfort and the valuable time of the users and hereby are happy to assist you.",
      },
      {
        question: "What happens if any of us loses network connection midway?",
        answer:
          "Without any hurry, you can rejoin the meet once your connectivity is stabilized. If not, our team will connect  you to the meet through a normal voice call.",
      },
    ],
  };
  res.send(JSON.stringify(str));
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
