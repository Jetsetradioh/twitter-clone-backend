import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes); // <--- viktigt!

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
        return res.json(user);
      } else {
        return res.status(401).json({ message: "Wrong password" });
      }
    }
  }

  res.status(404).json({ message: "User not found" });
});

app.get("/test", async (req, res) => {
  console.log("test!");
  res.send("API is working!");
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server is up and runnning!"));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
