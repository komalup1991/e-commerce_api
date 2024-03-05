const Cart = require("../models/Cart");
const User = require("../../users/models/User");

const ProductController = require("../../products/controller/ProductController");

const addToCart = async (req, res) => {
  let isQuantityAvailable =
    await ProductController.checkAndReduceProductQuantity(
      req.body.productId,
      req.body.quantity,
    );
  if (!isQuantityAvailable) {
    return res.status(400).send("Cannot add to cart. Quantity not available.");
  }

  let cart = await findCartForUserAndProductIds(
    req.body.userId,
    req.body.productId,
  );
  if (cart) {
    // if cart already exists, update the quantity of the product in it.
    cart.set({ quantity: cart.quantity + req.body.quantity });
    cart.save();
    return res.status(200).json(cart);
  } else {
    cart = await Cart.create(req.body);
    if (!cart) {
      // using status 500 for this case
      return res.status(500).send("Cannot add product to cart");
    }

    res.send(cart);
  }
};

const getCartDetailsForUser = async (req, res) => {
  res.send(await getDetails(req.params.userId));
};

const getDetails = async (userId) => {
  let user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).send("Invalid userId");
  }

  let carts = await Cart.findAll({
    where: { userId: parseInt(userId) },
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
  let totalQuantity = 0;

  products.forEach((product) => {
    let itemQuantity = productInfo.get(product.id);
    let itemTotalPrice = product.price * itemQuantity;
    productWithPriceTotal.push({ product, itemQuantity, itemTotalPrice });
    total += itemTotalPrice;
    totalQuantity += itemQuantity;
  });

  return { productWithPriceTotal, total, totalQuantity };
};

const updateCart = async (req, res) => {
  try {
    if (req.body.quantity == 0) {
      deleteProductFromCart(req, res);
      return;
    }

    let cart = await findCartForUserAndProductIds(
      req.params.userId,
      req.params.productId,
    );

    if (!cart) {
      return res.status(404).send("Product not found in cart");
    }

    if (cart.quantity == req.body.quantity) {
      return res.status(200).send("No updates to cart");
    }

    let quantityToUpdate;
    if (cart.quantity < req.body.quantity) {
      quantityToUpdate = req.body.quantity - cart.quantity;
      let isQuantityAvailable =
        await ProductController.checkAndReduceProductQuantity(
          req.params.productId,
          quantityToUpdate,
        );

      if (!isQuantityAvailable) {
        return res
          .status(400)
          .send("Cannot add to cart. Quantity not available.");
      }
    } else {
      quantityToUpdate = cart.quantity - req.body.quantity;
      ProductController.increaseProductQuantity(
        req.params.productId,
        quantityToUpdate,
      );
    }

    cart.set({ quantity: req.body.quantity });
    cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    let cart = await findCartForUserAndProductIds(
      req.params.userId,
      req.params.productId,
    );

    await ProductController.increaseProductQuantity(
      req.params.productId,
      cart.quantity,
    );

    cart.destroy();
    res.status(200).json("Product is deleted from cart");
  } catch (err) {
    res.status(500).json(err);
  }
};

const findCartForUserAndProductIds = async (userId, productId) => {
  return await Cart.findOne({
    where: {
      userId: parseInt(userId),
      productId: parseInt(productId),
    },
  });
};

const clearCartForUser = async (userId) => {
  let carts = await Cart.findAll({
    where: { userId: parseInt(userId) },
  });

  carts.forEach(async (cart) => {
    cart.destroy();
    // console.log("cart destroyed = " + cart.id);
  });
};

module.exports = {
  addToCart,
  updateCart,
  deleteProductFromCart,
  getCartDetailsForUser,
  getDetails,
  clearCartForUser,
};
