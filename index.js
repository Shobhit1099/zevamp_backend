const express = require("express");
const bodyParser = require("body-parser");
const routesHandler = require("./routes/handler.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routesHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Up and running on ${PORT}`);
});
