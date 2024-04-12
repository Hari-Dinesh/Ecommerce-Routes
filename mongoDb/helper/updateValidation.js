import Joi from "joi";

const authUpdateSchema = Joi.object({
    Name: Joi.string().min(3).max(30),
    Email: Joi.string().email(),
    Address: Joi.string(),
    Gender: Joi.string()
});

export default authUpdateSchema;