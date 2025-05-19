//Skapa/ta bort tweets

import express from "express";
import Tweet from "../models/Tweet.js";

const router = express.Router();

router.get("/tweets/:id", async (req, res) => {
  const id = req.params.id;
  const tweets = await Tweet.find({ userId: id }).lean();
  res.json(tweets);
});

router.get("/tweet/forYou", async (req, res) => {
  const tweets = await Tweet.find().limit(15).lean();
  res.json(tweets);
  console.log("test");
});
router.get("/tweet/following", async (req, res) => {
  console.log("test");
});

//Skapa en tweet
router.post("/tweet/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  const newTweet = Tweet.create({
    userId: req.params.id,
    name: req.body[0].name,
    username: req.body[0].username,
    content: req.body[1].message,
  });
});

export default router;
