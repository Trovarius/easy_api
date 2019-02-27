const Joi = require('joi');

const timeMiddleware = (req, res, next) => {
  console.log('personal timer log')
  next();
}

module.exports = {
  route: ':name',
  middlewares: [
    timeMiddleware
  ],
  validations: {
    name: Joi.string()
  },
  action: async ({
    name,
    $event
  }) => {
    console.log(this);

    const userGetEvent = await $event.dispatch('userGet');
    const userCReateEvent = await $event.dispatch('userCreate', {
      name
    });

    return {
      name,
      mensagem: 'oi',
      userGetEventResult: userGetEvent,
      userCReateEvent
    }
  },
  tiggers: [

  ]
}