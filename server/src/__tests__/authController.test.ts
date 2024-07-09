import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { config } from "../config";

let token: string;

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

describe("Auth Controller", () => {
  it("should register a new user", async () => {
    const newUser = {
      first_name: "John",
      last_name: "Doe",
      age: 30,
      phone_number: "9876543210",
      address: "123 rue de l'utilisateur testeur",
      password: "password123",
      pass_level: 2,
    };

    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("first_name", "John");
  });

  it("should login an existing user", async () => {
    const newTestingUser = {
      first_name: "John",
      last_name: "Doe",
      age: 30,
      phone_number: "9876543210",
      address: "123 rue de l'utilisateur testeur",
      password: "password123",
      pass_level: 2,
    };

    await request(app).post("/api/auth/register").send(newTestingUser);
    const res = await request(app).post("/api/auth/login").send(newTestingUser);

    if (res.statusCode !== 200) {
      console.error("Response Body:", res.body);
    }

    token = res.body.token;

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should get the current user", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("first_name", "John");
    expect(res.body).toHaveProperty("last_name", "Doe");
  });

  it("should return 404 for a non-existing user on login", async () => {
    const loginData = {
      first_name: "NonExisting",
      last_name: "User",
      password: "password12345689",
    };

    const res = await request(app).post("/api/auth/login").send(loginData);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });

  it("should return 400 for invalid password on login", async () => {
    const loginData = {
      first_name: "John",
      last_name: "Doe",
      password: "wrongpassword",
    };

    const res = await request(app).post("/api/auth/login").send(loginData);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Invalid password");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
