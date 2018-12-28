module.exports = {
  middlewares: [

  ],
  body: {

  },
  action: (req, res, next) => {
    res.send('handler helloworld');
    next();
  },
  tiggers: [

  ]
}