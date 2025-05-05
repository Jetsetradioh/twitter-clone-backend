<<<<<<< HEAD
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
=======
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
>>>>>>> 8f2c29c (updates)

dotenv.config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
//app.use("/api", Routes);

const users = [
  { name: "Anders", password: "hej123" },
  { name: "Karl", password: "hej1" },
];

app.post("/login", async (req, res) => {
  const user = req.body;

  const { name, password } = user;

  for (let i = 0; i < users.length; i++) {
    if (users[i].name === name) {
      if (users[i].password === password) {
        res.json(user);
      } else {
        res.status(401).json({ message: "Wrong password" });
      }
      break;
    }
  }
});

app.get("/test", async (req, res) => {
  console.log(req.body);
});

app.listen(PORT, () => console.log("Server is up and runnning!"));
