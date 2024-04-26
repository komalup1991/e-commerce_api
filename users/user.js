const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { Op } = require("sequelize");
const {
  authenticateTokenAndAdmin,
  authenticateTokenAndId,
  authenticateTokenAndAuthorization,
  authenticateTokenAndUserId,
  authenticateWishlist,
  authenticateToken,
} = require("../middlewares/verifyToken");
const User = require("./models/User");
const Wishlist = require("./models/Wishlist");
const Follower = require("./models/Follower");

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
router.get("/all", async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

router.get("/userList", async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

router.get("/userList/:id", authenticateTokenAndId, async (req, res) => {
  const users = await User.findAll();
  const id = req.user.id;
  const following = await Follower.findAll({
    where: {
      followerId: id,
    },
  });
  const followerIdSet = new Set(following.map((follower) => follower.userId));

  console.log(JSON.stringify(typeof followerIdSet));
  const userWithFollowData = users.map((user) => ({
    ...user.dataValues,
    isFollowing: followerIdSet.has(user.id),
  }));
  console.log(JSON.stringify(userWithFollowData));
  res.send(userWithFollowData);
});

// Get user by id
router.get("/:id", async (req, res) => {
  console.log("id = ", req.params.id);
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

router.post("/addToWishlist", authenticateWishlist, async (req, res) => {
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

router.get("/following/:userId", authenticateToken, async (req, res) => {
  try {
    const followerId = req.params.userId;
    const following = await Follower.findAll({
      where: {
        followerId: followerId,
      },
    });

    const followingUsers = await User.findAll({
      where: {
        id: following.map((f) => f.userId),
      },
    });
    res.send(followingUsers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/followers/:userId", authenticateToken, async (req, res) => {
  try {
    const followingId = req.params.userId;
    const followers = await Follower.findAll({
      where: {
        userId: followingId,
      },
    });

    const followerUsers = await User.findAll({
      where: {
        id: followers.map((f) => f.followerId),
      },
    });
    res.send(followerUsers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/follow/:followeeId", authenticateToken, async (req, res) => {
  try {
    const { followeeId } = req.params;
    const followerId = req.user.id;
    const exists = await Follower.findOne({
      where: { userId: followeeId, followerId },
    });
    if (!exists) {
      await Follower.create({ userId: followeeId, followerId });
      res.send("Followed successfully");
    } else {
      res.status(400).send("Already following this user");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/unfollow/:followeeId", authenticateToken, async (req, res) => {
  try {
    const { followeeId } = req.params;
    const followerId = req.user.id;
    const result = await Follower.destroy({
      where: { userId: followeeId, followerId },
    });
    if (result > 0) {
      res.send("Unfollowed successfully");
    } else {
      res.status(404).send("Not following this user");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
