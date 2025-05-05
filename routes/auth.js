<<<<<<< HEAD
import express from "express";
import User from "../models/User.js";
=======
import express from 'express';
import User from '../models/User.js';
>>>>>>> 8f2c29c (updates)

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "Användare registrerad" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
export default router;
=======
router.get('/signup', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
>>>>>>> bc47658 (auth.js ändringar)
