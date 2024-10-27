const bcrypt = require("bcryptjs");
const crypto = require("crypto-js");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// const verifyToken = (token) => {
//   return jwt.verify(token, process.env.SECRET);
// };
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    //console.log("Token decoded:", decoded);
    return decoded;
  } catch (error) {
    //console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
};

const authenticate = (req, res, next) => {
  const {
    authentication_microservice_account_user_id,
    authentication_microservice_ecosystem_admin,
  } = req.headers;
  const { value } = req.params;

  if (authentication_microservice_ecosystem_admin === "dashboards") {
    // If the user is an admin, grant access to all methods
    next();
  } else if (
    req.method === "GET" ||
    req.method === "PUT" ||
    req.method === "DELETE"
  ) {
    // Check for the Authorization header
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Token missing" });
    }

    if (!authentication_microservice_account_user_id) {
      return res
        .status(401)
        .json({ error: "Unauthorized Access - User Id is required" });
    }

    try {
      // Verify the token
      const decoded = verifyToken(token);

      // Prevent users from using tokens that do not belong to them
      if (authentication_microservice_account_user_id !== decoded?._id) {
        return res.status(401).json({
          error:
            "Unauthorized Access - Token provided does not belong to the currently logged-in user",
        });
      }

      // Prevent users from requesting information that does not belong to them
      if (value !== decoded?._id) {
        // Access the 'key' and 'value' parameters from the URL
        return res.status(401).json({
          error:
            "Unauthorized Access - You are trying to access information that does not belong to you",
        });
      }

      //req.user = decoded; // Attach user information to the request object
      next(); // Continue to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  } else {
    // For other HTTP methods, no authentication is needed
    next();
  }
};

module.exports = authenticate;

const validateEmail = (email) => {
  if (!email) {
    return { error: "Email is required!" };
  } else if (!validator.isEmail(email)) {
    return { error: "Email is invalid" };
  } else {
    return { message: "Success" };
  }
};

const validatePassword = (password) => {
  if (!password) {
    return { error: "Password is required!" };
  } else if (!validator.isStrongPassword(password)) {
    return { error: "Password is invalid" };
  } else {
    return { message: "Success" };
  }
};
const encryptData = async (key, value) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(value, salt);
  return {
    [key]: hash,
  };
};
module.exports = {
  createToken,
  verifyToken,
  validateEmail,
  validatePassword,
  encryptData,
  authenticate,
};
