//Skapa/ta bort tweets

import express from "express";
import Tweet from "../models/Tweet.js";

const router = express.Router();

router.get("/tweets/:id", async (req, res) => {
  const id = req.params.id;
  const tweets = await Tweet.find({ userId: id }).lean();
  res.json(tweets);

  /*

  const alltweets = await Tweet.find().lean();
  res.json(alltweets);
  */
});

//Skapa en tweet
router.post("/tweet/:id", async (req, res) => {
  const newTweet = Tweet.create({
    userId: req.params.id,
    name: req.body[0].name,
    image: req.body[0].profileImage,
    username: req.body[0].username,
    content: req.body[1].message,
  });
});

export default router;
