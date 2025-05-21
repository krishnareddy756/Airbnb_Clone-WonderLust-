const Joi=require('joi');

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().min(0).required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        image:Joi.string().allow("",null),
        country:Joi.string().required(),
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().min(1).max(5).required(),
    }).required()       
});