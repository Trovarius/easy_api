const Joi = require('joi');

module.exports = (options) => (req, res, next) => {
    if (options && options.body && Object.keys(options.body).length) {
        const schema = Joi.object().keys(options.body);
        const {
            error,
            value
        } = Joi.validate({
            ...req.query,
            ...req.body
        }, schema);

        if (error) {
            return res.badRequest(error.details.map(d => d.message));
        }
    }

    next();
}