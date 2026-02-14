import Joi from "joi"


export const ValidationSchima = Joi.object({
    DATABASE_URL : Joi.string().required(),

})