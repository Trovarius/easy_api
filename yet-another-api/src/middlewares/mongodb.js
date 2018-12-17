var MongoClient = require('mongodb').MongoClient
var config = require("../config");

module.exports = (options) => async (req, res, next) => {
  const dbConfig = config.get('DATABASE');

  try {
    MongoClient.connect(db.config.url, (err, db) => {
      if (err) throw err;

      req.DB = db
      next();

      db.close();
    })
  } catch (error) {
    console.log(error);
    throw err
  }
}