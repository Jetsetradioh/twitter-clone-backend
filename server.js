import express from "express";
import mongoose from "mongoose";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/test", async (req, res) => {
  console.log("test!");
});

app.listen(PORT, () => console.log("Server is up and runnning!"));
