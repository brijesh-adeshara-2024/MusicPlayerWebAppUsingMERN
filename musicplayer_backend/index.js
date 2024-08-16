const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const port = 8000;

mongoose
  .connect(
    "mongodb+srv://Brijesh:" +
      encodeURIComponent(process.env.PASSWORD) +
      "@cluster0.td0p9e7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("not connected");
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("app is running on port " + port);
});
