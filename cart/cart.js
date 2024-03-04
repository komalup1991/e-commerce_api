const Cart = require("./models/Cart");
const router = require("express").Router();
const { Op } = require("sequelize");
const ProductController = require("../products/controller/ProductController");

const {
  authenticateTokenAndAdmin,
  authenticateTokenAndAuthorization,
} = require("../middlewares/verifyToken");

const User = require("../users/models/User");

// add product to cart
router.post("/c/addToCart", authenticateTokenAndAdmin, async (req, res) => {
  const cart = await Cart.create(req.body);
  if (!cart) {
    // using status 500 for this case
    return res.status(500).send("Cannot add product to cart");
  }

  res.send(cart);
});

// Update cart product quantity
router.put(
  "/userId=:userId/productId=:productId",
  [authenticateTokenAndAuthorization],
  async (req, res) => {
    try {
      let cart = await Cart.findOne({
        where: {
          userId: parseInt(req.params.userId),
          productId: parseInt(req.params.productId),
        },
      });
      cart.set({ quantity: req.body.quantity });
      cart.save();
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  },
);

// Get products in cart by user id
router.get(
  "/userId=:userId",
  authenticateTokenAndAuthorization,
  async (req, res) => {
    let user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).send("Invalid userId");
    } else {
      let carts = await Cart.findAll({
        where: { userId: parseInt(req.params.userId) },
      });

      let productId = [];
      carts.forEach((cart) => {
        productId.push(cart.productId);
      });
      let products = await ProductController.findAllProducts(productId);
      res.send(products);
    }
  },
);

// Delete cart item
router.delete(
  "/userId=:userId/productId=:productId",
  authenticateTokenAndAuthorization,
  async (req, res) => {
    try {
      await Cart.destroy({
        where: {
          userId: parseInt(req.params.userId),
          productId: parseInt(req.params.productId),
        },
      });
      res.status(200).json("Product is deleted from cart");
    } catch (err) {
      res.status(500).json(err);
    }
  },
);

module.exports = router;
