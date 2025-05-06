import express from "express";
import User from "../models/User.js";

import mongoose from "mongoose";

const router = express.Router();

router.post("/checkUser", async (req, res) => {
  const user = req.body;
  const { name } = user;
  const allUsers = await User.find();
  console.log(allUsers);

  try {
    const foundUser = await User.findOne({ username: name }).lean();
    if (foundUser) {
      res.json(foundUser);
    }
    if (!foundUser) {
      res.status(401).json({ message: "No User with that NAME was found!" });
    }
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/login", async (req, res) => {
  const user = req.body;
  const { name, password } = user;

  try {
    const foundUser = await User.findOne({
      username: name,
      password: password,
    }).lean();
    if (foundUser) {
      res.json({ foundUser: foundUser.username });
    } else {
      res.status(401).json({ message: "Wrong password!" });
    }
  } catch (error) {
    console.error(error.message);
  }
});

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

router.get("/signup", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
