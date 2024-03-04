const Ajv = require("ajv").default,
  AJV_OPTIONS = { allErrors: true };

module.exports = {
  validate: (schema) => {
    if (!schema) {
      throw new Error("Schema not provided");
    }

    return (req, res, next) => {
      const { body } = req;
      const ajv = new Ajv(AJV_OPTIONS);
      const validate = ajv.compile(schema);
      const isValid = validate(body);

      if (isValid) {
        return next();
      }

      return res.send({
        status: false,
        error: {
          message: `Invalid Payload: ${ajv.errorsText(validate.errors)}`,
        },
      });
    };
  },
};
