<<<<<<< HEAD
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
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
app.use("/api", authRoutes);

mongoose
  .connect("mongodb://localhost:27017/twitter")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () =>
  console.log(`Server is up and running really fast on port ${PORT}!`)
);
