const Cart = require("./models/Cart");
const router = require("express").Router();
const CartController = require("./controller/CartController");

const { authenticateTokenAndId } = require("../middlewares/verifyToken");

const User = require("../users/models/User");

// add product to cart
router.post(
  "/c/addToCart/userId=:userId/productId=:productId",
  authenticateTokenAndId,
  CartController.addToCart,
);

// Update cart product quantity
router.put(
  "/userId=:userId/productId=:productId",
  authenticateTokenAndId,
  CartController.updateCart,
);

// Get products in cart by user id
router.get(
  "/userId=:userId",
  authenticateTokenAndId,
  CartController.getCartDetailsForUser,
);

// Delete cart item
router.delete(
  "/userId=:userId/productId=:productId",
  authenticateTokenAndId,
  CartController.deleteProductFromCart,
);

module.exports = router;
