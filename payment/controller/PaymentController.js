const Payment = require("../../payment/models/Payment");
const { paymentStatus } = require("../../config");
const MockCardUtil = require("../MockCardUtil");

const processPayment = async (req, totalPrice, callback) => {
  const status = getPaymentStatus({
    paymentCardNumber: req.body.paymentCardNumber,
    paymentCardExpiry: req.body.paymentCardExpiry,
    paymentCardCvv: req.body.paymentCardCvv,
    paymentCardZipCode: req.body.paymentCardZipCode,
  });

  const payment = await Payment.create({
    paymentStatus: status,
    userId: req.params.userId,
    paymentAmount: totalPrice,
    ...req.body,
  });
  callback.setPayment(payment);
};

const getPaymentStatus = (card) => {
  if (MockCardUtil.validateCard(card)) {
    return paymentStatus.SUCCESS;
  } else {
    return paymentStatus.DECLINED;
  }
};

module.exports = { processPayment };
