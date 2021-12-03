const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => {
  const str = {
    testimonials: [
      {
        img: "images/user1.jpg",
        uname: "Sachin Kaul",
        review:
          "Would love to appreciate the idea that addresses some legit student/work life problems in self development and growth",
        rate: 5,
      },
      {
        img: "images/user2.jpeg",
        uname: "Shivansh",
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
          "Zevamp brings to you an entirely innovative experience by pairing you with a completely different personality as that of yours. We carry you to the most fantastic video talk with them, delivering an experience that can indeed advise your better future.",
      },
      {
        question:
          "Is it necessary to keep my camera switched on throughout the session?",
        answer:
          "No, it is not necessary. But we would prefer you to keep it on for better interaction.",
      },
      {
        question: "Can I schedule my meeting as per my choice of time?",
        answer:
          "Yes. We at Zevamp care about our users and are happy to assist you.",
      },
      {
        question: "What happens if any of us loses network connection midway?",
        answer:
          "Without any hurry, you can rejoin the meet once your connectivity is regained. Else our team will connect to you through a normal voice call and continue the rest of the meet.",
      },
    ],
  };
  res.end(JSON.stringify(str));
});

router.get("/", (req, res) => {
  const str = {
    testimonials: [
      {
        img: "images/user1.jpg",
        uname: "Sachin Kaul",
        review:
          "Would love to appreciate the idea that addresses some legit student/work life problems in self development and growth",
        rate: 5,
      },
      {
        img: "images/user2.jpeg",
        uname: "Shivansh",
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
          "Zevamp brings to you an entirely innovative experience by pairing you with a completely different personality as that of yours. We carry you to the most fantastic video talk with them, delivering an experience that can indeed advise your better future.",
      },
      {
        question:
          "Is it necessary to keep my camera switched on throughout the session?",
        answer:
          "No, it is not necessary. But we would prefer you to keep it on for better interaction.",
      },
      {
        question: "Can I schedule my meeting as per my choice of time?",
        answer:
          "Yes. We at Zevamp care about our users and are happy to assist you.",
      },
      {
        question: "What happens if any of us loses network connection midway?",
        answer:
          "Without any hurry, you can rejoin the meet once your connectivity is regained. Else our team will connect to you through a normal voice call and continue the rest of the meet.",
      },
    ],
  };
  res.end(JSON.stringify(str));
});

module.exports = router;
