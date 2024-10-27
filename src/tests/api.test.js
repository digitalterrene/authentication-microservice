const request = require("supertest");
const app = require("../index");

describe("API Endpoint Tests", () => {
  /* ---------- POST REQUESTS ---------- */

  it("POST /upsert-new - should create or update a user", async () => {
    const response = await request(app).post("/upsert-new").send({
      username: "newuser",
      password: "jG@t4dv8drqBSz",
      access_key: "jG@t4dv8drqBSz",
      security_key: "jG@t4dv8drqBSz",
      email: "newuser@example.com",
    });
    expect(response.json).toBe({});
    expect(response.body).toHaveProperty("message", "User created or updated");
  });

  it("POST /signin-user - should sign in a user", async () => {
    const response = await request(app)
      .post("/signin-user")
      .send({ username: "testuser", password: "password123" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  /* ---------- GET REQUESTS ---------- */

  it("GET /fetch-single-data/:key/:value - should fetch a single user", async () => {
    const response = await request(app).get(
      "/fetch-single-data/username/testuser"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
  });

  it("GET /fetch-single-user/admin-access/:key/:value - should fetch a single user by admin access", async () => {
    const response = await request(app).get(
      "/fetch-single-user/admin-access/username/testuser"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
  });

  /* ---------- PUT REQUESTS ---------- */

  it("PUT /update-single-data/:key/:value - should update user data", async () => {
    const response = await request(app)
      .put("/update-single-data/username/testuser")
      .send({ email: "updated@example.com" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "User updated");
  });

  it("PUT /update-add-to-set-single-data-arrays/:key/:value - should add entry to an array in a single document", async () => {
    const response = await request(app)
      .put("/update-add-to-set-single-data-arrays/username/testuser")
      .send({ arrayField: "newArrayEntry" });
    expect(response.statusCode).toBe(200);
  });

  it("PUT /update-add-to-set-multiple-data-arrays/:key/:value - should add entry to arrays in multiple documents", async () => {
    const response = await request(app)
      .put("/update-add-to-set-multiple-data-arrays/role/user")
      .send({ arrayField: "newArrayEntry" });
    expect(response.statusCode).toBe(200);
  });

  it("PUT /update-pull-multiple-data-arrays/:key/:value - should remove entry from arrays in multiple documents", async () => {
    const response = await request(app)
      .put("/update-pull-multiple-data-arrays/role/user")
      .send({ arrayField: "removeThisEntry" });
    expect(response.statusCode).toBe(200);
  });

  it("PUT /update-pull-single-data-arrays/:key/:value - should remove entry from an array in a single document", async () => {
    const response = await request(app)
      .put("/update-pull-single-data-arrays/username/testuser")
      .send({ arrayField: "removeThisEntry" });
    expect(response.statusCode).toBe(200);
  });

  it("PUT /update-set-single-data-objects/:key/:value - should update object entry in a single document", async () => {
    const response = await request(app)
      .put("/update-set-single-data-objects/username/testuser")
      .send({ objectField: { nestedKey: "newValue" } });
    expect(response.statusCode).toBe(200);
  });

  it("PUT /update-set-multiple-data-objects/:key/:value - should update object entries in multiple documents", async () => {
    const response = await request(app)
      .put("/update-set-multiple-data-objects/role/user")
      .send({ objectField: { nestedKey: "newValue" } });
    expect(response.statusCode).toBe(200);
  });

  it("PUT /update-set-single-data-strings/:key/:value - should update string entry in a single document", async () => {
    const response = await request(app)
      .put("/update-set-single-data-strings/username/testuser")
      .send({ stringField: "newStringValue" });
    expect(response.statusCode).toBe(200);
  });

  it("PUT /update-set-multiple-data-strings/:key/:value - should update string entries in multiple documents", async () => {
    const response = await request(app)
      .put("/update-set-multiple-data-strings/role/user")
      .send({ stringField: "newStringValue" });
    expect(response.statusCode).toBe(200);
  });

  /* ---------- Additional GET REQUESTS ---------- */

  it("GET /fetch-single-data-objects/:key/:value/:keyn_req - should fetch a single object", async () => {
    const response = await request(app).get(
      "/fetch-single-data-objects/username/testuser/nestedKey"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("nestedKey");
  });

  it("GET /fetch-single-data-strings/:key/:value/:keyn_req - should fetch a single string", async () => {
    const response = await request(app).get(
      "/fetch-single-data-strings/username/testuser/stringKey"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("stringKey");
  });
});
