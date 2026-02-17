const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/productivityDB");

const Usage = mongoose.model("Usage", {
  website: String,
  timeSpent: Number,
  category: String,
  date: { type: Date, default: Date.now }
});

app.post("/save", async (req, res) => {
  await Usage.create(req.body);
  res.json({ message: "Saved successfully" });
});

app.listen(5000, () => console.log("Backend running on 5000"));
