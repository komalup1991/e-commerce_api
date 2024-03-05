module.exports = {
  jwtExpirationInSeconds: 60 * 60, // 1 hour
  roles: {
    USER: "user",
    ADMIN: "admin",
  },
  productPriceUnit: {
    DOLLAR: "dollar",
  },
  paymentStatus: {
    PENDING: "pending",
    SUCCESS: "success",
    DECLINED: "declined",
  },
  paymentMethod: {
    CREDIT_CARD: "credit-card",
    DEBIT_CARD: "debit-card",
  },
};
