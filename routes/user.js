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
  const user = await User.findById(req.params.id).select("-password");
  const tweets = await Tweet.find({ userId: req.params.id }).limit(10);
  res.json({ user, tweets });
});
//denna är så profile får senaste uppdaterde profil
router.get("/update-user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.put("/edit-user/:id", async (req, res) => {
  console.log(req.body);

  const filteredBody = Object.fromEntries(
    Object.entries(req.body).filter(([_, value]) => value !== "")
  );

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody);
  res.json(user);
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
// Lägg till vän
router.post("/add-friend/:id", async (req, res) => {
  const { userId } = req.body;
  const friendId = req.params.id;

  if (userId === friendId) {
    return res.status(400).json({ message: "Du kan inte följa dig själv." });
  }

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "Användare hittades inte." });
    }

    if (!friend.friends.includes(userId)) {
      friend.friends.push(userId);
      friend.followersCount += 1;
      await friend.save();
    }

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      user.followingCount += 1;
      await user.save();
    }

    res.status(200).json({ message: "Du följer nu användaren." });
  } catch (err) {
    res.status(500).json({ message: "Serverfel: " + err.message });
  }
});

// Ta bort vän
router.delete("/remove-friend/:id", async (req, res) => {
  const { userId } = req.body;
  const friendId = req.params.id;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "Användare hittades inte." });
    }

    if (friend.friends.includes(userId)) {
      friend.friends = friend.friends.filter((id) => id.toString() !== userId);
      friend.followersCount = Math.max(0, friend.followersCount - 1);
      await friend.save();
    }

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id.toString() !== friendId);
      user.followingCount = Math.max(0, user.followingCount - 1);
      await user.save();
    }

    res.status(200).json({ message: "Du har slutat följa användaren." });
  } catch (err) {
    res.status(500).json({ message: "Serverfel: " + err.message });
  }
});
// Search users by username (partial match)
router.get("/search/users", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Sökterm krävs." });
  }

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username profileImage name");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Serverfel: " + err.message });
  }
});

export default router;
