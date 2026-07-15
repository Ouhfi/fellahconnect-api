const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware validator that checks request data against a Zod schema.
 * Supports validating req.body, req.query, or req.params.
 * 
 * @param {object} schemas - An object containing schemas to validate (e.g. { body: schema, query: schema })
 */
const validate = (schemas) => {
  return async (req, res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      return next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return ApiResponse.error(res, 'Validation error', 400, errors);
      }
      return next(error);
    }
  };
};

module.exports = validate;
