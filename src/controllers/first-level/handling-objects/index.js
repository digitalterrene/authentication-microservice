const { connectToDatabase } = require("../../../utils/db");
const { ObjectId } = require("mongodb");

// processing creds
require("dotenv").config();

const set_single_data_objects = async (req, res) => {
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
const set_multiple_data_objects = async (req, res) => {
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
const fetch_single_data_objects = async (req, res) => {
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
    const account = await db.collection("accounts").findOne(query);

    //Validate the required fields before creating the dashboard
    if (account && account[keyn_req]) {
      return res.status(200).json(account[keyn_req]);
    } else {
      res.status(404).json({ error: `Data not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  set_single_data_objects,
  set_multiple_data_objects,
  fetch_single_data_objects,
};
