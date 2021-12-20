const Joi = require('joi');

module.exports.wsSchema = Joi.object({
    watchingspot: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        typeOfOwl: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});