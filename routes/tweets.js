//Skapa/ta bort tweets

import express from "express";
import Tweet from "../models/Tweet.js";

const router = express.Router();

router.get("/tweets/:id", async (req, res) => {
  const id = req.params.id;
  const tweets = await Tweet.find({ userId: id }).lean();
  res.json(tweets);
});

//visa foryou
router.get("/tweet/forYou/:id", async (req, res) => {
  const tweets = await Tweet.find({ userId: { $ne: req.params.id } })
    .limit(15)
    .lean();
  res.json(tweets);
});

router.get("/tweet/following/:id", async (req, res) => {});

//Skapa en tweet
router.post("/tweet/:id", async (req, res) => {
  const newTweet = Tweet.create({
    userId: req.params.id,
    name: req.body[0].name,
    image: req.body[0].profileImage,
    username: req.body[0].username,
    image: req.body[0].profileImage,
    content: req.body[1].message,
  });
});

export default router;
