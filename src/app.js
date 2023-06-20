const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/userRoutes");
const contacts = require("./routes/contactRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/users", users);
app.use("/contacts", contacts);

module.exports = app;
