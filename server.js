import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
//import authRoutes from "./routes/auth.js";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

const users = [
  { name: "Anders", password: "hej123" },
  { name: "Karl", password: "hej1" },
];
app.post("/checkUser", async (req, res) => {
  const user = req.body;
  const { name } = user;

  try {
    const foundUser = users.find((user) => user.name === name);

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

app.post("/login", async (req, res) => {
  const user = req.body;
  const { name, password } = user;

  try {
    const foundUser = users.find(
      (user) => user.name === name && user.password === password
    );

    if (foundUser) {
      res.json(foundUser);
    } else {
      res.status(401).json({ message: "Wrong password!" });
    }
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(PORT, () => console.log("Server is up and runnning!"));
