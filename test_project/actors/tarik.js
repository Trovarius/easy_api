const Joi = require('joi');

module.exports = {
    middlewares: [

    ],
    body: {
        count: Joi.string(),
        teste: Joi.string().required()
    },
    action: async ({
        count,
        teste,
        $event
    }) => {
        console.log(this);

        // const userGetEvent = await $event.dispatch('userGet');
        // const userCReateEvent = await $event.dispatch('userCreate', {
        //   name
        // });
        return {
            count,
            mensagem: 'Teste tarik ' + teste
        }
    },
    tiggers: [

    ]
}