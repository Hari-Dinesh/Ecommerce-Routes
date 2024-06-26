import Joi from "joi";
const authSchema = Joi.object({
    Password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    Phone:Joi.string().required(),
});

export default authSchema;