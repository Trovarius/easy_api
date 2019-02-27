const Joi = require('joi');

module.exports = (options) => (req, res, next) => {
    if (options && options.validations && Object.keys(options.validations).length) {
        const schema = Joi.object().keys(options.validations);
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