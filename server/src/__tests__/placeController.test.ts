import request from "supertest";
import mongoose, { Schema } from "mongoose";
import app from "../app";
import { config } from "../config";

let token: string;
let testUserId: mongoose.Types.ObjectId;
let placeId: mongoose.Types.ObjectId;

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

describe("Place Controller", () => {
  it("should create a new place", async () => {
    const newUser = {
      first_name: "John",
      last_name: "Doe",
      age: 30,
      phone_number: "9876543210",
      address: "123 rue de l'utilisateur testeur",
      password: "password123",
      pass_level: 3,
    };

    const resUser = await request(app).post("/api/auth/register").send(newUser);
    console.log("resUser", resUser.body);

    token = resUser.body.token;

    testUserId = resUser.body.user._id;
    console.log("testUserId", testUserId);

    const res = await request(app)
      .post("/api/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "456 rue testing",
        phone_number: "0987654321",
        required_pass_level: 3,
        required_age_level: 21,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("address", "456 rue testing");
    expect(res.body).toHaveProperty("phone_number", "0987654321");
    expect(res.body).toHaveProperty("required_pass_level", 3);
    expect(res.body).toHaveProperty("required_age_level", 21);

    placeId = res.body._id;
    console.log("placeId", placeId);
  });

  it("should get all places", async () => {
    const res = await request(app)
      .get("/api/places")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a place by id", async () => {
    const res = await request(app)
      .get(`/api/places/${placeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id", placeId.toString());
  });

  it("should update a place by id", async () => {
    const res = await request(app)
      .put(`/api/places/${placeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ address: "789 rue update" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("address", "789 rue update");
  });

  it("should check user access to a place", async () => {
    const res = await request(app)
      .get(`/api/places/access/${testUserId}/${placeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("access", true);
  });

  it("should get accessible places for a user", async () => {
    const res = await request(app)
      .get(`/api/places/accessible/${testUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should delete a place by id", async () => {
    const res = await request(app)
      .delete(`/api/places/${placeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Place deleted");
  });

  it("should return 404 for a non-existing place", async () => {
    const nonExistingPlaceId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/places/${nonExistingPlaceId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Place not found");
  });

  it("should not create a place with a pass level not between 1 and 5", async () => {
    const res = await request(app)
      .post("/api/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "456 rue testing",
        phone_number: "0987654321",
        required_pass_level: 6,
        required_age_level: 21,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "Pass level must be between 1 and 5"
    );
  });

  it("should not create a place without required_pass_level and required_age_level", async () => {
    const res = await request(app)
      .post("/api/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "456 rue testing",
        phone_number: "0987654321",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "address, phone_number, required_pass_level, and required_age_level are required"
    );
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
