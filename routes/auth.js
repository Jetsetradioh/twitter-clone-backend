import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/checkUser", async (req, res) => {
  const { name } = req.body;

  try {
    const foundUser = await User.findOne({
      $or: [{ username: name }, { email: name }],
    }).lean();

    if (foundUser) {
      res.json(foundUser);
    } else {
      res.status(401).json({ message: "Ingen användare med det namnet!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const foundUser = await User.findOne({
      $or: [{ username: name }, { email: name }],
    });

    if (!foundUser) {
      return res.status(401).json({ message: "Användaren hittades inte!" });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Fel lösenord!" });
    }

    res.json({ foundUser });
  } catch (error) {
    res.status(500).json({ error: "Inloggning misslyckades" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

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
