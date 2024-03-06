const Review = require("../models/Review");

const addReview = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const exitingReview = await findReviewForUserAndProductIds(userId, productId);
  if (exitingReview) {
    res.status(400).send("Review already exists");
    return;
  }
  const review = {
    userId: userId,
    productId: productId,
    ...req.body,
  };

  try {
    const newReview = await Review.create(review);
    res.status(200).json(newReview);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateReview = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    const review = await findReviewForUserAndProductIds(userId, productId);
    if (!review) {
      res.status(404).send("Review not found");
      return;
    }
    review.set({ ...req.body });
    review.save();
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteReview = async (req, res) => {
  try {
    await Review.destroy({
      where: { userId: req.params.userId, productId: req.params.productId },
    });
    res.status(200).json("Review is deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

const findReviewForUserAndProductIds = async (userId, productId) => {
  return await Review.findOne({
    where: {
      userId: parseInt(userId),
      productId: parseInt(productId),
    },
  });
};

const averageRatingForProduct = async (productId) => {
  const reviews = await Review.findAll({
    where: {
      productId: productId,
    },
  });
  if (reviews.length === 0) {
    return 0;
  }

  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  return sum / reviews.length;
};

module.exports = {
  addReview,
  updateReview,
  averageRatingForProduct,
  deleteReview,
};
