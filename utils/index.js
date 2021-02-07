const utils = (module.exports = exports = {});

/**
 * Catch errors thrown in controllers
 */
utils.catchErrors = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Error handler middleware
 * all errors thrown in controllers goes here
 */
utils.handleErrors = (error, req, res, next) => {
  const { message = 'Something went wrong' } = error;
  console.log(error);
  res.status(500).json({
    error: true,
    message,
  });
};

/**
 * Handle 404 routes
 */
utils.handle404 = (req, res) => {
  res.status(403).json({
    error: false,
    message: 'Empty route',
  });
};
