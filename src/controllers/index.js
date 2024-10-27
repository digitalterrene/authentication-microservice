const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const {
  validateEmail,
  encryptData,
  createToken,
  validatePassword,
} = require("../utils/creds-checking");
const { connectToDatabase } = require("../utils/db");

const upsert_new_user = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { email, password, access_key, security_key } = req.body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (emailValidation.error) {
      return res.status(400).json({ error: emailValidation.error });
    }
    // Check if email is already in use
    const existingUser = await db.collection("accounts").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is taken!" });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (passwordValidation.error) {
      return res.status(400).json({ error: passwordValidation.error });
    }
    if (!access_key) {
      return res.status(400).json({ error: "Access key is required" });
    }
    if (!security_key) {
      return res.status(400).json({ error: "Security key is required" });
    }
    // Encrypt sensitive data
    const encryptedPassword = await encryptData("password", password);
    const encryptedSecurityKey = await encryptData(
      "security_key",
      security_key
    );

    // Insert the document with encrypted values
    const result = await db.collection("accounts").insertOne({
      ...req.body,
      ...encryptedPassword,
      ...encryptedSecurityKey,
    });

    // Create a token using the document's _id
    const token = createToken(result.insertedId);

    // Update the document with the generated token
    await db
      .collection("accounts")
      .updateOne({ _id: new ObjectId(result.insertedId) }, { $set: { token } });

    // Set a cookie with user information
    const insertedUser = await db
      .collection("accounts")
      .findOne({ _id: new ObjectId(result.insertedId) });
    const { name, username, image, _id } = insertedUser;

    res.status(201).json({ name, email, username, image, _id, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const fetch_single_user = async (req, res) => {
  const { key, value } = req.params;
  try {
    const db = await connectToDatabase();
    let query;

    if (key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      query = { [key]: new ObjectId(value) };
    } else {
      // For other fields like "title," use as is
      query = { [key]: value };
    }
    const dashboard = await db.collection("accounts").findOne(query);
    if (dashboard) {
      res.status(200).json(dashboard);
    } else {
      res
        .status(404)
        .json({ error: `Failed to fetch data with ${key}:${value}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const fetch_single_user_by_admin = async (req, res) => {
  const { key, value } = req.params;
  const { requested_data } = req.headers;
  try {
    const db = await connectToDatabase();
    let query;

    if (key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      query = { [key]: new ObjectId(value) };
    } else {
      // For other fields like "title," use as is
      query = { [key]: value };
    }
    const dashboard = await db.collection("accounts").findOne(query);
    if (dashboard) {
      // Parse the requested_data string into an array
      const requestedDataArray = JSON.parse(requested_data);
      // Filter the data based on the requested fields
      const responseData = {};
      requestedDataArray.forEach((field) => {
        if (dashboard[field]) {
          responseData[field] = dashboard[field];
        }
      });

      res.status(200).json(responseData);
    } else {
      res
        .status(404)
        .json({ error: `Failed to fetch data with ${key}:${value}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update_single_user = async (req, res) => {
  const { key, value } = req.params;

  try {
    const db = await connectToDatabase();
    let query;

    if (key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      query = { [key]: new ObjectId(value) };
    } else {
      // For other fields like "title," use as is
      query = { [key]: value };
    }

    // Check if the keys requiring encryption are present
    const keysToEncrypt = ["password", "security_key"];
    const keysPresent = keysToEncrypt.filter((key) => req.body[key]);

    // If keys are present, perform validation and encryption
    if (keysPresent.length > 0) {
      // Validate password, if present
      if (keysPresent.includes("password")) {
        const passwordValidation = validatePassword(req.body.password);
        if (passwordValidation.error) {
          return res.status(400).json({ error: passwordValidation.error });
        }
      }

      // Encrypt sensitive data
      for (const key of keysPresent) {
        try {
          const encryptedData = await encryptData(key, req.body[key]);
          if (encryptedData.error) {
            return res.status(500).json({ error: encryptedData.error });
          }
          req.body[key] = encryptedData[key];
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      }
    }

    // Update the document
    const dashboard = await db
      .collection("accounts")
      .findOneAndUpdate(query, { $set: req.body });

    if (dashboard) {
      return res.status(200).json({ message: "User updated successfully" });
    } else {
      return res
        .status(404)
        .json({ error: `Failed to fetch data with ${key}:${value}` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const signin_user = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { email, password } = req.body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (emailValidation.error) {
      return res.status(400).json({ error: emailValidation.error });
    }

    // Check if email is already in use
    const existingUser = await db.collection("accounts").findOne({ email });
    if (existingUser) {
      // Validate password
      const passwordValidation = validatePassword(password);
      if (passwordValidation.error) {
        return res.status(400).json({ error: passwordValidation.error });
      }
      //comparing if the password provided matches that of the account
      const validity = await bcrypt.compare(password, existingUser.password);
      if (!validity) {
        res.status(400).json({ error: "Wrong password" });
      }
      if (validity) {
        const { name, image, _id, email } = existingUser;

        const token = createToken(_id);

        // Update the document with the generated token
        await db
          .collection("accounts")
          .updateOne({ _id: new ObjectId(_id) }, { $set: { token } });

        // Set the token in the response
        res.cookie("authToken", token, { maxAge: 86400000, httpOnly: true });
        return res.status(200).json({ name, image, _id, token, email });
      }
    } else {
      return res.status(404).json({ error: "Email does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upsert_new_user,
  signin_user,
  update_single_user,
  fetch_single_user,
  fetch_single_user_by_admin,
};
