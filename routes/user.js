//Profiler, vänner? followers?
import express from "express";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";

const router = express.Router();

//för att hämta alla users i postman
router.get("/users", async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

//visa profilen man klickar på
router.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  const tweets = await Tweet.find({ userId: req.params.id });
  res.json([user, tweets]);
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Serverfel: " + err.message });
  }
});

export default router;
