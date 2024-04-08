import Joi from "joi";

const authSchema = Joi.object({
    Name: Joi.string().min(3).max(30).required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    Phone: Joi.string().min(10).max(12).required(),
    Address: Joi.string().required(),
    Gender: Joi.string().required()
});

export default authSchema;
