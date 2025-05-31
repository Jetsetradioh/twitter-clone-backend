import express from "express";
import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

const router = express.Router();

// Hämta tweets för en användare
router.get("/tweets/:id", async (req, res) => {
  const id = req.params.id;
  const tweets = await Tweet.find({ userId: id })
    .sort({ createdAt: -1 })
    .lean();
  res.json(tweets);
});

// Visa ForYou-flödet (tweets från andra användare)
router.get("/tweet/forYou/:id", async (req, res) => {
  const tweets = await Tweet.find({ userId: { $ne: req.params.id } })
    .sort({ createdAt: -1 })
    .limit(15)
    .lean();
  res.json(tweets);
});

// Visa tweets från personer användaren följer
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

// Skapa en tweet
router.post("/tweet/:id", async (req, res) => {
  try {
    const newTweet = await Tweet.create({
      userId: req.params.id,
      name: req.body[0].name,
      image: req.body[0].profileImage,
      username: req.body[0].username,
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

// 🟢 SKAPA KOMMENTAR TILL EN TWEET
router.post("/tweet/:tweetId/comment", async (req, res) => {
  try {
    const { userId, content } = req.body;
    const tweetId = req.params.tweetId;

    console.log("MOTTAGEN kommentar:");
    console.log("tweetId:", tweetId);
    console.log("userId:", userId);
    console.log("content:", content);

    const tweet = await Tweet.findById(tweetId);
    const user = await User.findById(userId).lean();

    if (!tweet) {
      console.log("Tweet hittades inte");
      return res.status(404).json({ message: "Tweet ej hittad." });
    }

    if (!user) {
      console.log("Användare hittades inte");
      return res.status(404).json({ message: "Användare ej hittad." });
    }

    const newComment = {
      userId,
      content,
      createdAt: new Date(),
      name: user.name,
      username: user.username,
    };

    tweet.comments.push(newComment);
    await tweet.save();

    res.status(201).json({
      message: "Kommentar tillagd",
      comment: newComment,
    });
  } catch (err) {
    console.error("Fel vid skapande av kommentar:", err.message);
    res
      .status(500)
      .json({ message: "Kunde inte spara kommentaren.", error: err.message });
  }
});

// Trender baserat på tweet-innehåll
router.get("/tweet/trends", async (req, res) => {
  try {
    const tweets = await Tweet.find({}).select("content").lean();

    const wordCount = {};
    const STOPWORDS = [
      "och",
      "att",
      "det",
      "som",
      "en",
      "på",
      "i",
      "för",
      "är",
      "med",
      "till",
      "av",
      "de",
      "har",
      "vi",
      "du",
      "jag",
      "han",
      "hon",
      "dom",
      "man",
      "kan",
      "ska",
      "var",
      "så",
      "om",
      "inte",
      "bara",
      "men",
      "från",
      "utan",
      ..."abcdefghijklmnopqrstuvwxyz".split(""),
      ..."abcdefghijklmnopqrstuvwxyz".split().map((letter) => letter + letter),
    ];

    tweets.forEach((tweet) => {
      const words = tweet.content
        .toLowerCase()
        .replace(/[^\wåäöÅÄÖ]/g, " ")
        .split(/\s+/)
        .filter((word) => word && !STOPWORDS.includes(word));

      words.forEach((word) => {
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
      }))
      .filter((trend) => trend.topic.length >= 3);

    res.json(trends);
  } catch (err) {
    console.error("Error fetching trends:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
