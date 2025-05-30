import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";
import User from "../models/User.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("GET /api/users", () => {
  beforeEach(async () => {
    await User.create([
      { username: "user1", email: "user1@example.com", password: "pass1234" },
      { username: "user2", email: "user2@example.com", password: "pass5678" },
    ]);
  });

  it("ska returnera en lista med alla users", async () => {
    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: "user1",
          email: "user1@example.com",
        }),
        expect.objectContaining({
          username: "user2",
          email: "user2@example.com",
        }),
      ])
    );
  });
});

describe("PUT /api/edit-user/:id", () => {
  it("ska uppdatera användarens profil", async () => {
    const user = await User.create({
      username: "test",
      email: "test@example.com",
      password: "test1234",
    });

    const res = await request(app)
      .put(`/api/edit-user/${user._id}`)
      .send({ bio: "Jag gillar backend", location: "Stockholm" });

    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe("Jag gillar backend");
    expect(res.body.location).toBe("Stockholm");
  });

  it("ska ignorera tomma strängar", async () => {
    const user = await User.create({
      username: "edittest",
      email: "edittest@example.com",
      password: "test1234",
      bio: "Gammal bio",
    });

    const res = await request(app)
      .put(`/api/edit-user/${user._id}`)
      .send({ bio: "" });
    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe("Gammal bio");
  });
});
