const { sendError } = require('../utils/apiResponse');

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const messages = Object.entries(errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join('; ');
      return sendError(res, messages, 400, errors);
    }
    req.body = result.data;
    next();
  };
};

module.exports = validate;
