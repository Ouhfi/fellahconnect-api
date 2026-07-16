import ApiResponse from '../utils/apiResponse.js';

export default function validate(schemas) {
  return async function (req, res, next) {
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
        const errors = error.errors.map(function (err) {
          return {
            field: err.path.join('.'),
            message: err.message,
          };
        });
        return ApiResponse.error(res, 'Validation error', 400, errors);
      }
      return next(error);
    }
  };
}
