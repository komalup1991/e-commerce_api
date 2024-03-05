// Mock cards
const VALID_CARD = {
  paymentCardNumber: "1234567890123456",
  paymentCardExpiry: "12/24",
  paymentCardCvv: "123",
  paymentCardZipCode: "12345",
};

// Emulates card correctness
const validateCard = (card) => {
  console.log(JSON.stringify(card));
  console.log(JSON.stringify(VALID_CARD));
  return JSON.stringify(card) === JSON.stringify(VALID_CARD);
};

module.exports = { validateCard };
