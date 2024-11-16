// Importing the required libraries
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const cors = require("cors");

// Handling CORS policy
const corsOptions = {
  origin: ["http://localhost:3000", "https://useraccountdashboard.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies and HTTP authentication
  optionsSuccessStatus: 204, // No Content response for preflight requests
};

// Connecting to the Database
require("./utils/db.js");

// Initializing the app and instantiating middleware
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Apply the authentication middleware to all routes starting with /accounts
const dashboardRoutes = require("./routes/accounts.js");
app.use("/", dashboardRoutes);

// Export app for testing purposes
if (process.env.NODE_ENV !== "test") {
  app._router.stack.forEach((route) => {
    if (route.route && route.route.path) {
      console.log(`Route path: ${route.route.path}`);
    }
  });

  // Running the server only if not in test environment
  app.listen(process.env.PORT, () => {
    MongoClient.connect(process.env.MONGO_URI, (error, client) => {
      if (error) {
        console.error(error?.message);
      }
      console.log("App running on port", process.env.PORT);
    });
  });
}

module.exports = app;
