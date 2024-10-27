const { connectToDatabase } = require("../../../utils/db");
const { ObjectId } = require("mongodb");

// processing creds
require("dotenv").config();

const add_to_set_single_data_arrays = async (req, res) => {
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
    const accounts = await db.collection("accounts").updateOne(query, {
      $addToSet: {
        [`${req.body.key_to_update}`]: req.body.value_to_update,
      },
    });
    //Validate the required fields before creating the dashboard
    if (accounts) {
      return res.status(200).json(accounts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const add_to_set_multiple_data_arrays = async (req, res) => {
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
    const accounts = await db.collection("accounts").updateMany(query, {
      $addToSet: {
        [`${req.body.key_to_update}`]: req.body.value_to_update,
      },
    });
    //Validate the required fields before creating the dashboard
    if (accounts) {
      return res.status(200).json(accounts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const pull_multiple_data_arrays = async (req, res) => {
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
    const accounts = await db.collection("accounts").updateMany(query, {
      $pull: {
        [`${req.body.key_to_update}`]: req.body.value_to_update,
      },
    });
    //Validate the required fields before creating the dashboard
    if (accounts) {
      return res.status(200).json(accounts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const pull_single_data_arrays = async (req, res) => {
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
    const accounts = await db.collection("accounts").updateOne(query, {
      $pull: {
        [`${req.body.key_to_update}`]: req.body.value_to_update,
      },
    });
    //Validate the required fields before creating the dashboard
    if (accounts) {
      return res.status(200).json(accounts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  add_to_set_single_data_arrays,
  add_to_set_multiple_data_arrays,
  pull_multiple_data_arrays,
  pull_single_data_arrays,
};
