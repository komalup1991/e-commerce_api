const router = require("express").Router();
const Review = require("./models/Review");
const ReviewController = require("./controller/ReviewController");
const {
  authenticateTokenAndAuthorization,
} = require("../middlewares/verifyToken");

router.post(
  "/addReview/userId=:userId/productId=:productId",
  authenticateTokenAndAuthorization,
  ReviewController.addReview,
);

router.post(
  "/updateReview/userId=:userId/productId=:productId",
  authenticateTokenAndAuthorization,
  ReviewController.updateReview,
);

router.post(
  "/deleteReview/userId=:userId/productId=:productId",
  authenticateTokenAndAuthorization,
  ReviewController.deleteReview,
);

module.exports = router;
