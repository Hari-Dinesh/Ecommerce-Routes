import Joi from "joi";

const authProductSchema = Joi.object({
    ProductName: Joi.string().min(3).max(30),
    actualPrice:Joi.number(),//
    sellingPrice: Joi.number(),
    ProductDescription:Joi.string()
});

export default authProductSchema;