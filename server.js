import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import tweetRoutes from "./routes/tweets.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tweetRoutes);

export default app;
