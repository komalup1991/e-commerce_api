const Cart = require("./models/Cart");
const router = require("express").Router();
const { Op } = require("sequelize");
const ProductController = require("../products/controller/ProductController");
const CartController = require("./controller/CartController");

const {
  authenticateTokenAndAdmin,
  authenticateTokenAndAuthorization,
} = require("../middlewares/verifyToken");

const User = require("../users/models/User");

// add product to cart
router.post(
  "/c/addToCart",
  authenticateTokenAndAdmin,
  CartController.addToCart,
);

// Update cart product quantity
router.put(
  "/userId=:userId/productId=:productId",
  [authenticateTokenAndAuthorization],
  CartController.updateCart,
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

      const productInfo = new Map();
      carts.forEach((cart) => {
        productInfo.set(cart.productId, cart.quantity);
      });

      let products = await ProductController.findAllProducts(
        Array.from(productInfo.keys()),
      );

      let productWithPriceTotal = [];
      let total = 0;

      products.forEach((product) => {
        let itemQuantity = productInfo.get(product.id);
        let itemTotalPrice = product.price * itemQuantity;
        productWithPriceTotal.push({ product, itemQuantity, itemTotalPrice });
        total += itemTotalPrice;
      });

      res.send({ productWithPriceTotal, total });
    }
  },
);

// Delete cart item
router.delete(
  "/userId=:userId/productId=:productId",
  authenticateTokenAndAuthorization,
  CartController.deleteProductFromCart,
);

module.exports = router;
