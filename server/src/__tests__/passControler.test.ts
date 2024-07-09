import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { config } from "../config";

let token: string;
let testUserId: mongoose.Types.ObjectId;
let testPassId: mongoose.Types.ObjectId;

beforeAll(async () => {
  if (!config.mongoURITest) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }
  try {
    await mongoose.connect(config.mongoURITest, {
      authSource: "admin",
      dbName: "PassMgtDB-TEST",
    });
    console.log("Connected to test database");
  } catch (error) {
    console.log("Error connecting to test database", error);
  }
});

describe("Pass Controller", () => {
  beforeEach(async () => {
    const newUser = {
      first_name: "John",
      last_name: "Doe",
      age: 30,
      phone_number: "9876543210",
      address: "123 Test Street",
      password: "password123",
      pass_level: 2,
    };

    const registerRes = await request(app)
      .post("/api/auth/register")
      .send(newUser);
    testUserId = registerRes.body.user._id;

    const loginRes = await request(app).post("/api/auth/login").send(newUser);
    token = loginRes.body.token;
  });

  it("should create a new pass", async () => {
    const newPass = {
      userId: testUserId,
      level: 3,
    };

    const res = await request(app)
      .post("/api/passes")
      .set("Authorization", `Bearer ${token}`)
      .send(newPass);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("level", 3);
    testPassId = res.body._id;
  });

  it("should get all passes", async () => {
    const res = await request(app)
      .get("/api/passes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a specific pass", async () => {
    const res = await request(app)
      .get(`/api/passes/${testPassId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id", testPassId.toString());
  });

  it("should update a pass", async () => {
    const updatedPass = {
      level: 4,
    };

    const res = await request(app)
      .put(`/api/passes/${testPassId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedPass);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("level", 4);
  });

  it("should delete a pass", async () => {
    const res = await request(app)
      .delete(`/api/passes/${testPassId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Pass deleted");
  });

  it("should get user passes", async () => {
    const res = await request(app)
      .get("/api/passes/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBe("");
  });

  it("should return 400 for invalid pass level", async () => {
    const invalidPass = {
      userId: testUserId,
      level: 6,
    };

    const res = await request(app)
      .post("/api/passes")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidPass);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Level must be between 1 and 5");
  });

  it("should return 404 for non-existing pass", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/passes/${nonExistingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Pass not found");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
