module.exports = (req, res, next) => {
  res.send('get user');
  next();
}