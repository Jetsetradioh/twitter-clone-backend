import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Tweet.deleteMany({});
});

describe("POST /api/tweet/:id", () => {
  let user;

  beforeEach(async () => {
    user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "pass123",
      tweetsCount: 0,
    });
  });

  it("ska skapa en tweet och öka tweetsCount", async () => {
    const tweetData = [
      {
        name: "Test User",
        username: "testuser",
        profileImage: "https://example.com/image.png",
      },
      {
        message: "Detta är en testtweet",
      },
    ];

    const res = await request(app)
      .post(`/api/tweet/${user._id}`)
      .send(tweetData);

    expect(res.statusCode).toBe(200);

    const tweets = await Tweet.find({});
    expect(tweets.length).toBe(1);
    expect(tweets[0].content).toBe("Detta är en testtweet");
    expect(tweets[0].username).toBe("testuser");

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.tweetsCount).toBe(1);
  }, 15000);

  it("ska returnera tweets från andra användare än den inloggade", async () => {
    const loggedInUser = await User.create({
      username: "user1",
      email: "user1@example.com",
      password: "pass1",
    });

    const otherUser = await User.create({
      username: "user2",
      email: "user2@example.com",
      password: "pass2",
    });

    await Tweet.create({
      userId: otherUser._id,
      username: "user2",
      name: "User 2",
      content: "Tweet från annan användare",
    });

    await Tweet.create({
      userId: loggedInUser._id,
      username: "user1",
      name: "User 1",
      content: "Min egen tweet",
    });

    const res = await request(app).get(`/api/tweet/forYou/${loggedInUser._id}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe("user2");
  });
});
