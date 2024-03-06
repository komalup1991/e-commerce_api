const router = require("express").Router();
const User = require("../users/models/User");
const CryptoJS = require("crypto-js");
const { roles, jwtExpirationInSeconds } = require("../config");
const jwt = require("jsonwebtoken");

const generateAccessToken = (username, id, role) => {
  return jwt.sign(
    {
      id,
      username,
      role,
    },
    process.env.JWT_KEY,
    {
      expiresIn: jwtExpirationInSeconds,
    },
  );
};

router.post("/register", async (req, res) => {
  const password = CryptoJS.AES.encrypt(
    req.body.password,
    process.env.SECRET_KEY,
  ).toString();
  req.body.password = password;
  const user = await User.create(req.body);
  if (!user) {
    // using status 500 for this case
    return res.status(500).send("User not created");
  }

  res.send("User inserted");
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
    });

    if (!user) {
      return res.status(401).json("Wrong User Name");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY,
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    const inputPassword = req.body.password;

    if (originalPassword !== inputPassword) {
      return res.status(401).json("Wrong Password");
    }

    const accessToken = generateAccessToken(user.username, user.id, user.role);

    // const { password, ...others } = user.dataValues;

    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
