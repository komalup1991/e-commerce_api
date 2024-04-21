const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const { Op } = require("sequelize");
const ReviewController = require("../../review/controller/ReviewController");

const findAllProducts = async (productIds) => {
  let allProductsWithGivenIds = await Product.findAll({
    where: {
      id: productIds,
    },
  });
  return allProductsWithGivenIds;
};

const addProduct = async (req, res) => {
  const { id, ...productData } = req.body; // Destructure to exclude 'id'
  try {
    const product = await Product.create(productData); // Create product with the remaining data
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

//const product = await Product.create(req.body);
// if (!product) {
//   return res.status(500).send("Product not created");
// }

// const rating = 0;
// res.send({ rating, ...product.dataValues });

const updateProduct = async (req, res) => {
  try {
    let product = await Product.findByPk(req.params.id);
    product.set({ ...req.body });
    product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json("Product is deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

// const getAllProducts = async (req, res) => {
//   const products = await Product.findAll();
//   const result = [];
//   for (let i = 0; i < products.length; i++) {
//     const rating = await ReviewController.averageRatingForProduct(
//       products[i].id,
//     );
//     result.push({ rating, ...products[i].dataValues });
//   }
//   res.send(result);
// };

const findProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getProductById = async (req, res) => {
  try {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    if (req.params.id) {
      // If ID is provided, fetch single product
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).send("Product not found");
      }
      const rating = await ReviewController.averageRatingForProduct(
        req.params.id,
      );
      res.send({ rating, ...product.toJSON() });
    } else {
      // If no ID is provided, fetch multiple products based on query params
      let products;
      if (qNew) {
        products = await Product.findAll({
          order: [["createdAt", "DESC"]],
          limit: 1,
        });
      } else if (qCategory) {
        products = await Product.findAll({ where: { category: qCategory } });
      } else {
        products = await Product.findAll();
      }
      res.status(200).json(products);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getProduct = async (productId) => {
  return Product.findByPk(productId);
};

const searchProduct = async (req, res) => {
  let product = await Product.findAll({
    where: {
      name: { [Op.like]: `%${req.query.key}%` },
    },
  });
  if (!product || product.length === 0) {
    return res.status(404).send("Products not found");
  } else {
    res.send(product);
  }
};

const filterProduct = async (req, res) => {
  let product = await Product.findAll({
    where: {
      category: req.query.category ? req.query.category : { [Op.ne]: null },
      price:
        req.query.from && req.query.to
          ? { [Op.between]: [`${req.query.from}`, `${req.query.to}`] }
          : { [Op.ne]: null },
    },
  });
  if (!product || product.length === 0) {
    return res.status(404).send("Products not found");
  } else {
    res.send(product);
  }
};

const checkAndReduceProductQuantity = async (productId, quantity) => {
  let product = await getProduct(productId);
  if (product.stockQuantity < quantity) {
    return false;
  }
  product.set({ stockQuantity: product.stockQuantity - quantity });
  await product.save();
  return true;
};

const increaseProductQuantity = async (productId, quantity) => {
  let product = await getProduct(productId);
  product.set({ stockQuantity: product.stockQuantity + quantity });
  await product.save();
};

const getImagePath = (req) => {
  return "Images/" + req.file.filename;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images/");
  },
  filename: (req, file, cb) => {
    cb(null, "product-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadProductImage = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Incorrect file format");
  },
}).single("image");

module.exports = {
  findAllProducts,
  addProduct,
  uploadProductImage,
  updateProduct,
  deleteProduct,
  searchProduct,
  filterProduct,
  getProductById,
  findProductById,
  // getAllProducts,
  checkAndReduceProductQuantity,
  increaseProductQuantity,
};
