const express = require("express");
const router = express();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    return res
      .status(403)
      .json({ error: "User With This Email Already Exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserData = { email, password: hashedPassword, firstname, lastname };
  const newUser = await User.create(newUserData);
  const token = await getToken(email, newUser);
  const userToReturn = { ...newUser.toJSON(), token };
  delete userToReturn.password;
  return res.json(userToReturn);
});

module.exports = router;
