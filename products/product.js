const Product = require("./models/Product");
const ProductController = require("./controller/ProductController");
const router = require("express").Router();
const { Op } = require("sequelize");

const {
  authenticateTokenAndAdmin,
  authenticateTokenAndAuthorization,
} = require("../middlewares/verifyToken");

const validateSchema = require("../middlewares/validateSchema");
const updateProductSchema = require("../products/schemas/updateProductSchema");

// Create new product
router.post(
  "/addProduct",
  authenticateTokenAndAdmin,
  // ProductController.uploadProductImage,
  ProductController.addProduct,
);

// Update product
router.put(
  "/:id",
  [
    authenticateTokenAndAuthorization,
    validateSchema.validate(updateProductSchema),
  ],
  ProductController.updateProduct,
);

//Get product by Id
router.get(
  "/find/:id",
  // authenticateTokenAndAdmin,
  ProductController.findProductById,
);

// Get all products
router.get(
  "/",
  // authenticateTokenAndAuthorization,
  ProductController.getProductById,
);

// Delete product
router.delete(
  "/:id",
  authenticateTokenAndAuthorization,
  ProductController.deleteProduct,
);

// search with keyword
router.get("/p/search", ProductController.searchProduct);

// filter by category and price
router.get("/p/filter", ProductController.filterProduct);

module.exports = router;
