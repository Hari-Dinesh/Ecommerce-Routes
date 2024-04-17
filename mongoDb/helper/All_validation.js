import Joi from "joi";
const AllValidationSchema = Joi.object({
    UserId:Joi.string().length(24),
    location:Joi.string(),
    fromDate: Joi.date(),
    toDate:Joi.date().iso().greater(Joi.ref('fromDate')),
    Name:Joi.string().min(3).max(30),
      Phone: Joi.string().min(10).max(12),
      Address:Joi.string(),
      Gender:Joi.string(),
      Email:Joi.string().email()
});

export default AllValidationSchema;