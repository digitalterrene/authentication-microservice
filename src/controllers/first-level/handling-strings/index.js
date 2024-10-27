const { connectToDatabase } = require("../../../utils/db");
const { ObjectId } = require("mongodb");

// processing creds
require("dotenv").config();

const set_single_data_strings = async (req, res) => {
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
      $set: {
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
const set_multiple_data_strings = async (req, res) => {
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
      $set: {
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
const fetch_single_data_strings = async (req, res) => {
  const { key, value, keyn_req } = req.params;
  //keyn_req is short for key_in_requeste
  //it is the key that has the data we are requesting
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
    const accounts = await db.collection("accounts").findOne(query);

    //Validate the required fields before creating the dashboard
    if (accounts) {
      return res.status(200).json(accounts[keyn_req]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  set_single_data_strings,
  set_multiple_data_strings,
  fetch_single_data_strings,
};
