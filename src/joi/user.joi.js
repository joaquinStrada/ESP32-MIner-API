import Joi from 'joi'

export const schemaRegister = Joi.object({
    fullname: Joi.string().min(6).max(100).required(),
    email: Joi.string().min(6).max(255).email().required(),
    user: Joi.string().min(6).max(50).required(),
    password: Joi.string().min(8).max(20).required()
})