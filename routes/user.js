//Profiler, vänner? followers?
import express from "express";
import User from "../models/User.js";

const router = express.Router();

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
