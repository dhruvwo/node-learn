require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/userRoutes");
const feeds = require("./routes/feedRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/users", users);
app.use("/feeds", feeds);

app.get("/welcome", (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
app.use((req, res) => {
  res.status(404).send("Can not find route!");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
