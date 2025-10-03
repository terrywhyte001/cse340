const triggerError = (req, res, next) => {
  const error = new Error("Intentional server error triggered!");
  error.status = 500;
  throw error;
};

module.exports = { triggerError };
