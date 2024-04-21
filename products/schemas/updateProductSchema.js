module.exports = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    image: {
      type: "string",
    },
    price: {
      type: "number",
    },
    priceUnit: {
      type: "string",
    },
    stockQuantity: {
      type: "number",
    },
    category: {
      type: "string",
    },
    rating: {
      type: "number",
    },
    size: {
      type: "string",
    },
    color: {
      type: "string",
    },
  },
  additionalProperties: false,
};
