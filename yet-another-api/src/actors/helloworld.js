const Joi = require('joi');

module.exports = {
  middlewares: [

  ],
  body: {
    name: Joi.string()
  },
  action: ({
    name
  }) => {
    return {
      name,
      mensagem: 'oi'
    }
  },
  tiggers: [

  ]
}