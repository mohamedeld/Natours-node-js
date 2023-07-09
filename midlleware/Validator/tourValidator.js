const {query,param,body} = require("express-validator");

module.exports.findTourValidator = [
    param("id").notEmpty().withMessage("please enter your id").isMongoId().withMessage("please enter correct id")
]
