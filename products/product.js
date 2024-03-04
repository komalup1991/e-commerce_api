const Product = require("./models/Product");
const router = require("express").Router();

const {
  authenticateTokenAndAdmin,
  authenticateTokenAndAuthorization,
} = require("../middlewares/verifyToken");

const validateSchema = require("../middlewares/validateSchema");
const updateProductSchema = require("../products/schemas/updateProductSchema");

// Create new product
router.post("/addProduct", authenticateTokenAndAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  if (!product) {
    // using status 500 for this case
    return res.status(500).send("Product not created");
  }

  res.send(product);
});

// Update product
router.put(
  "/:id",
  [
    authenticateTokenAndAuthorization,
    validateSchema.validate(updateProductSchema),
  ],
  async (req, res) => {
    try {
      let product = await Product.findByPk(req.params.id);
      product.set({ password: req.body.password, ...req.body });
      product.save();
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(product);
    }
  },
);

// Get all products
router.get("/all", authenticateTokenAndAdmin, async (req, res) => {
  const product = await Product.findAll();
  res.send(product);
});

// Get product by id
router.get("/:id", authenticateTokenAndAuthorization, async (req, res) => {
  let product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).send("Product not found");
  } else {
    res.send(product);
  }
});

// Delete product
router.delete("/:id", authenticateTokenAndAuthorization, async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json("Product is deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
