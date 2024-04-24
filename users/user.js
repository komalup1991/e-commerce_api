const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { Op } = require("sequelize");
const {
  authenticateTokenAndAdmin,
  authenticateTokenAndId,
  authenticateTokenAndAuthorization,
  authenticateTokenAndUserId,
} = require("../middlewares/verifyToken");
const User = require("./models/User");
const Wishlist = require("./models/Wishlist");
const validateSchema = require("../middlewares/validateSchema");
const updateUserSchema = require("../users/schemas/updateUserSchema");

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

      group: "createdAt",
      raw: true,
    });
    res.status(200).json(
      data.map((item) => ({
        month: item.createdAt.month,
        total: item.id,
      })),
    );
  } catch (err) {
    res.status(500).json(err);
  }
});
// Update user self profile
router.put(
  "/:id",
  [
    authenticateTokenAndId,
    // authenticateTokenAndAuthorization,
    // validateSchema.validate(updateUserSchema),
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
      const { id, role, ...updatedData } = req.body;
      if (req.body.password) {
        user.set({ password: req.body.password, updatedData });
      } else {
        user.set(updatedData);
      }
      user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
);

// Update user self profile
router.put(
  "/otherUser/:id",
  [
    authenticateTokenAndAdmin,
    //validateSchema.validate(updateUserSchema)
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
      const { id, role, ...updatedData } = req.body;
      if (req.body.password) {
        user.set({ password: req.body.password, updatedData });
      } else {
        user.set(updatedData);
      }
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
router.get("/:id", authenticateTokenAndId, async (req, res) => {
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

router.post("/addToWishlist", authenticateTokenAndUserId, async (req, res) => {
  try {
    const result = await Wishlist.create(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete(
  "/removeFromWishlist/:wishlistItemId/:userId",
  authenticateTokenAndUserId,
  async (req, res) => {
    try {
      const { wishlistItemId } = req.params;
      const result = await Wishlist.destroy({
        where: { id: wishlistItemId },
      });

      if (result > 0) {
        res.status(200).json({ id: wishlistItemId });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
);

router.get(
  "/wishlist/:userId",
  authenticateTokenAndUserId,
  async (req, res) => {
    const userId = req.params.userId;

    let wishlists = await Wishlist.findAll({
      where: {
        userId: userId,
      },
    });

    if (wishlists.length === 0) {
      return res.status(404).send("No wishlist items found for the user");
    } else {
      res.send(wishlists);
    }
  },
);

module.exports = router;
