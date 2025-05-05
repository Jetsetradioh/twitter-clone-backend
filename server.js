import express from "express";
import mongoose from "mongoose";

const PORT = 3000;
const app = express();

app.use(express.json());

const users = [
  { name: "Anders", password: "hej123" },
  { name: "Karl", password: "hej1" },
];

app.post("/login", async (req, res) => {
  console.log(req.body);
});

app.listen(PORT, () => console.log("Server is up and runnning!"));
