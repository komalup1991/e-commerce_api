const router = require("express").Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  await User.create(req.body);
  res.send("User inserted");
});

router.get("/all", async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

router.get("/:username", async (req, res) => {
  let user = await User.findByPk(req.params.username);
  if (!user) return res.status(404).send("User not found");
  else res.send(user);
});

module.exports = router;
