import Joi from 'joi'

export const schemaCreate = Joi.object({
    name: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(400).required(),
    serie: Joi.string().min(1).max(5).required(),
    password: Joi.string().min(8).max(20).required(),
    poolUrl: Joi.string().min(6).max(100).required(),
    poolPort: Joi.number().integer().min(1).max(65535).required(),
    walletAddress: Joi.string().min(6).max(255).required()
})