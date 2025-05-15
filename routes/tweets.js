//Skapa/ta bort tweets

import express from "express";
import Tweet from "../models/Tweet.js";

const router = express.Router();

router.get("/tweets", async (req, res) => {
  const alltweets = await Tweet.find().lean();
  res.json(alltweets);
});

router.post("/tweet/:id", async (req, res) => {
  console.log(req.params.id);
  const newTweet = Tweet.create({
    userId: req.params.id,
    tweets: req.body.message,
  });
});

export default router;
