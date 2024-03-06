const router = require("express").Router();
const AnalyticsController = require("./controller/AnalyticsController");

const { authenticateTokenAndAdmin } = require("../middlewares/verifyToken");

router.get(
  "/getPopularProducts",
  authenticateTokenAndAdmin,
  AnalyticsController.getPopularProducts,
);

router.get(
  "/getTotalSales",
  authenticateTokenAndAdmin,
  AnalyticsController.getTotalSales,
);

router.get(
  "/getTotalSalesByCategory",
  authenticateTokenAndAdmin,
  AnalyticsController.getTotalSalesByCategory,
);

module.exports = router;
