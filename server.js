import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import tweetRoutes from "./routes/tweets.js";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tweetRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/twitter")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () =>
  console.log(`Server is up and running really fast on port ${PORT}!`)
);
