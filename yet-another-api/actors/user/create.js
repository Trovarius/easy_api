module.exports = {
  method: 'POST',
  middlewares: [

  ],
  body: {

  },
  action: (req, res, next) => {
    res.ok('create action');
    next();
  },
  tiggers: [

  ]
}