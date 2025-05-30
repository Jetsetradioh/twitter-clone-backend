//Skapa/ta bort tweets

import express from "express";
import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/tweets/:id", async (req, res) => {
  const id = req.params.id;
  const tweets = await Tweet.find({ userId: id })
    .sort({ createdAt: -1 })
    .lean();
  res.json(tweets);
});

//visa foryou
router.get("/tweet/forYou/:id", async (req, res) => {
  const tweets = await Tweet.find({ userId: { $ne: req.params.id } })
    .sort({ createdAt: -1 })
    .limit(15)
    .lean();
  res.json(tweets);
});

router.get("/tweet/following/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  let tweets = [];

  for (let i = 0; i < user.friends.length; i++) {
    let tweet = await Tweet.find({ userId: user.friends[i] })
      .sort({ createdAt: -1 })
      .lean();
    tweets.push(tweet);
  }
  const flatTweets = tweets.flat();
  res.json(flatTweets);
});

//Skapa en tweet
router.post("/tweet/:id", async (req, res) => {
  try {
    const newTweet = await Tweet.create({
      userId: req.params.id,
      name: req.body[0].name,
      image: req.body[0].profileImage,
      username: req.body[0].username,
      image: req.body[0].profileImage,
      content: req.body[1].message,
    });

    const user = await User.findById(req.params.id);
    if (user) {
      user.tweetsCount += 1;
      await user.save();
    }
    res.status(200).json(newTweet);
  } catch (err) {
    console.error("Fel vid skapande av tweet:", err);
    res.status(500).json({ error: "Något gick fel" });
  }
});
router.get("/tweet/trends", async (req, res) => {
  try {
    const tweets = await Tweet.find({}).select("content").lean();

    const wordCount = {};
    const STOPWORDS = [
      "och", "att", "det", "som", "en", "på", "i", "för", "är", "med", "till", "av",
      "de", "har", "vi", "du", "jag", "han", "hon", "dom", "man", "kan", "ska", "var",
      "så", "om", "inte", "bara", "men", "från", "utan",
      
      ..."abcdefghijklmnopqrstuvwxyz".split(""),

      ..."abcdefghijklmnopqrstuvwxyz".split("").map(letter => letter + letter)
    ];

    tweets.forEach(tweet => {
      const words = tweet.content
        .toLowerCase()
        .replace(/[^\wåäöÅÄÖ]/g, " ")
        .split(/\s+/)
        .filter(word => word && !STOPWORDS.includes(word));

      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
    });

    let trends = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([word, count]) => ({
        type: "trend",
        topic: word,
        tweets: `${count} Tweets`,
        location: "Global",
      }));

    trends = trends.filter(trend => {
      const topic = trend.topic;
      if (topic.startsWith("#")) {
        return topic.slice(1).length >= 3;
      }
      return trend.topic.length >= 3; 
    });

    res.json(trends);
  } catch (err) {
    console.error("Error fetching trends:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;
