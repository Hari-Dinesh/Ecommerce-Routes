import Joi from "joi";
const authAdminJoi = Joi.object({
    Password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    Email:Joi.string().email().required(),
});

export default authAdminJoi;