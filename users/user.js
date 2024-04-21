const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { Op } = require("sequelize");
const {
  authenticateTokenAndAdmin,
  authenticateTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const User = require("./models/User");
const validateSchema = require("../middlewares/validateSchema");
const updateUserSchema = require("../users/schemas/updateUserSchema");

// Update user
router.put(
  "/:id",
  [
    authenticateTokenAndAuthorization,
    validateSchema.validate(updateUserSchema),
  ],
  async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY,
      ).toString();
    }

    try {
      let user = await User.findByPk(req.params.id);
      user.set({ password: req.body.password, ...req.body });
      user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
);

// Get all users
router.get("/all", authenticateTokenAndAdmin, async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

// Get user by id
router.get("/:id", authenticateTokenAndAuthorization, async (req, res) => {
  let user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).send("User not found");
  } else {
    res.send(user);
  }
});

// Delete user
router.delete("/:id", authenticateTokenAndAuthorization, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json("User is deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/stats", authenticateTokenAndAdmin, async (req, res) => {
  const today = new Date();
  const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));

  try {
    const data = await User.findAll({
      where: {
        createdAt: {
          [Op.gte]: lastYear,
        },
      },
      attributes: [
        [Sequelize.fn("strftime", "%m", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
      ],
      group: "month",
      raw: true,
    });
    res.status(200).json(
      data.map((item) => ({
        month: item.month,
        total: item.total,
      })),
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
