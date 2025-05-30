import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";
import app from "../server.js";
import User from "../models/User.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "verifyUSER" });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User Routes", () => {
  it("ska registrera en ny användare via POST /signup", async () => {
    const res = await request(app).post("/api/signup").send({
      username: "filip",
      email: "filip@example.com",
      password: "superhemligt",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Användare registrerad");

    const user = await User.findOne({ username: "filip" });
    expect(user).not.toBeNull();
  });

  it("ska returnera alla användare via GET /signup", async () => {
    await User.create({
      username: "anna",
      email: "anna@example.com",
      password: "något",
    });

    const res = await request(app).get("/api/signup");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].username).toBe("anna");
  });

  it("ska hitta användare via POST /checkUser (username)", async () => {
    await User.create({
      username: "kalle",
      email: "kalle@example.com",
      password: "något",
    });

    const res = await request(app)
      .post("/api/checkUser")
      .send({ name: "kalle" });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("kalle");
  });

  it("ska neka inloggning med fel lösenord via POST /login", async () => {
    const hashed = await bcrypt.hash("rättlösen", 10);
    await User.create({
      username: "lisa",
      email: "lisa@example.com",
      password: hashed,
    });

    const res = await request(app).post("/api/login").send({
      name: "lisa",
      password: "fellösen",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Fel lösenord!");
  });

  it("ska logga in korrekt användare via POST /login", async () => {
    const hashed = await bcrypt.hash("hemligt", 10);
    await User.create({
      username: "stina",
      email: "stina@example.com",
      password: hashed,
    });

    const res = await request(app).post("/api/login").send({
      name: "stina",
      password: "hemligt",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.foundUser.username).toBe("stina");
  });
});
