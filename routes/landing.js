const express = require("express");
const router = express.Router();
require("dotenv").config();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

// router.use(cors(corsOptions));

router.get("/", (req, res) => {
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

module.exports = router;
