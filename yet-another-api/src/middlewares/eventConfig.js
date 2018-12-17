module.exports = (options) => (req, res, next) => {
  req.eventConfig = options
  next()
}