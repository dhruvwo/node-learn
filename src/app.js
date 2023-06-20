require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/userRoutes");
const contacts = require("./routes/contactRoutes");
const feeds = require("./routes/feedRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/users", users);
app.use("/contacts", contacts);
app.use("/feeds", feeds);

module.exports = app;
