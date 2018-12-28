module.exports = (options) => (req, res, next) => {
  const requestTime = Date.now();
  req.requestTime = requestTime
  next()
}