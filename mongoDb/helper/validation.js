import Joi from "joi";

const authSchema = Joi.object({
    Name: Joi.string().min(3).max(30).required(),
    Email: Joi.string().email(),
    Password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    Phone: Joi.number().required(),
    Address: Joi.string(),
    Gender: Joi.string()
});

export default authSchema;
