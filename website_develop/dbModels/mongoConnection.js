// mongoConnection.js
require("dotenv").config();
const mongoose = require("mongoose");

// TODO: delete the URL after finished the ENV file. Need testing.
const connectionString = process.env.MONGODB_URI;

mongoose
  .connect(connectionString)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// TODO: add the JWT to the database for the user. Prevent the server shutdown from losing the JWT.
