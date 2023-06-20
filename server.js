// server.js
const app = require("./src/app");
const mongoose = require("mongoose");

const { MONGO_URI, API_PORT } = process.env;
const PORT = API_PORT || 3000;
console.log("MONGO_URI", { MONGO_URI, API_PORT });
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
