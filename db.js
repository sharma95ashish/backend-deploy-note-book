const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = process.env.mongoURI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    // Handle the error appropriately (e.g., throw an error or exit the application)
  }
};

module.exports = connectToMongo;
