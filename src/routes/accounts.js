const express = require("express");

const {
  add_to_set_single_data_arrays,
  add_to_set_multiple_data_arrays,
  pull_multiple_data_arrays,
  pull_single_data_arrays,
} = require("../controllers/first-level/handling-arrays");

const {
  set_single_data_objects,
  set_multiple_data_objects,
  fetch_single_data_objects,
} = require("../controllers/first-level/handling-objects");

const {
  set_single_data_strings,
  set_multiple_data_strings,
  fetch_single_data_strings,
} = require("../controllers/first-level/handling-strings");

const { authenticate } = require("../utils/creds-checking");
const {
  upsert_new_user,
  fetch_single_user,
  signin_user,
  update_single_user,
  fetch_single_user_by_admin,
  upsert_new_user_using_auth_provider,
  signin_user_using_auth_provider,
} = require("../controllers");

const router = express.Router();

// Apply authentication middleware to individual endpoints

/* ---------- POST REQUESTS ----------*/

// Create or update a user
router.post("/upsert-new", upsert_new_user);
router.post(
  "/external-auth-provider/upsert-new",
  upsert_new_user_using_auth_provider
);

// Sign in an existing user
router.post("/signin-user", signin_user);
router.post(
  "/external-auth-provider/signin-user",
  signin_user_using_auth_provider
);
/* ---------- GET REQUESTS ----------*/

// Fetch a single user by a given key and value
router.get("/fetch-single-data/:key/:value", authenticate, fetch_single_user);

// Fetch a single user by a given key and value with admin access
router.get(
  "/fetch-single-user/admin-access/:key/:value",
  fetch_single_user_by_admin
);

/* ---------- PUT REQUESTS ----------*/

// Update a single user's data by key and value
router.put("/update-single-data/:key/:value", update_single_user);

// Add a new entry to an array in a single document
router.put(
  "/update-add-to-set-single-data-arrays/:key/:value",

  add_to_set_single_data_arrays
);

// Add a new entry to arrays in multiple documents
router.put(
  "/update-add-to-set-multiple-data-arrays/:key/:value",

  add_to_set_multiple_data_arrays
);

// Remove an entry from arrays in multiple documents
router.put(
  "/update-pull-multiple-data-arrays/:key/:value",

  pull_multiple_data_arrays
);

// Remove an entry from an array in a single document
router.put(
  "/update-pull-single-data-arrays/:key/:value",

  pull_single_data_arrays
);

// Update an object entry in a single document
router.put(
  "/update-set-single-data-objects/:key/:value",

  set_single_data_objects
);

// Update object entries in multiple documents
router.put(
  "/update-set-multiple-data-objects/:key/:value",

  set_multiple_data_objects
);

// Update a string entry in a single document
router.put(
  "/update-set-single-data-strings/:key/:value",

  set_single_data_strings
);

// Update string entries in multiple documents
router.put(
  "/update-set-multiple-data-strings/:key/:value",

  set_multiple_data_strings
);

/* ---------- Additional GET REQUESTS ----------*/

// Fetch a single object by key, value, and an additional key in request (keyn_req)
router.get(
  "/fetch-single-data-objects/:key/:value/:keyn_req",

  fetch_single_data_objects
);

// Fetch a single string by key, value, and an additional key in request (keyn_req)
router.get(
  "/fetch-single-data-strings/:key/:value/:keyn_req",

  fetch_single_data_strings
);

module.exports = router;
