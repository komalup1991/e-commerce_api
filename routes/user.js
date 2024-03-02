const router = require("express").Router();
router.get("/test", (req, res) => {
  res.send("User test successful");
});

router.post("/userposttest", (req, res) => {
  const username = req.body.username;
  res.send("User test successful. Username: " + username);
});
module.exports = router;
