const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
require("dotenv").config();
const connectionString = process.env.MONGO_URI || "";
const client = new MongoClient(connectionString);

const connectToDatabase = async () => {
  try {
    await client.connect();
    // console.log("Connected to MongoDB in controller");
    return client.db("users");
  } catch (error) {
    console.error("MongoDB connection error in controller:", error);
  }
};

module.exports = { connectToDatabase };
