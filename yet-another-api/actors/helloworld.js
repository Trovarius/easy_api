const Joi = require('joi');

module.exports = {
  middlewares: [

  ],
  body: {
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