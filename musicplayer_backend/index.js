const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const User = require("./models/User");
require("dotenv").config();
const app = express();
const port = 8000;
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Brijesh:" +
      encodeURIComponent(process.env.PASSWORD) +
      "@cluster0.td0p9e7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {}
  )
  .then((x) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("not connected");
  });

// setup passport jwt

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    const user = await User.findOne({ id: jwt_payload.sub });
    try {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);

app.listen(port, () => {
  console.log("app is running on port " + port);
});
