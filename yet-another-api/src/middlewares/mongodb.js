var MongoClient = require('mongodb').MongoClient

module.exports = (options) => (req, res, next) => {

  try {
    if (options) {
      req.DB = (cb) => {
        MongoClient.connect(options, (err, db) => {
          if (err) throw err;

          req.DB = db
          cb(null, db)

          db.close();
        });
      }
    }

    next();

  } catch (error) {
    console.log(error);
    throw err
  }
}