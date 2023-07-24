const {query,param,body} = require('express-validator');

module.exports.createReviewValidator = [
    body('review').notEmpty().withMessage('please enter your review'),
    body('rating').notEmpty().withMessage('please enter your rating').isFloat({min:1,max:5}).withMessage('rating should be from 1 to 5'),
    body('tour').notEmpty().withMessage('please enter your tour id').isMongoId().withMessage('tour id should be mongo id'),
    body('user').optional().notEmpty().withMessage('please enter your user id').isMongoId().withMessage('user id should be mongo id')
];

module.exports.getReviewValidator = [
    param('id').notEmpty().withMessage('please enter your id').isMongoId().withMessage('review id should be mongo id')
]
module.exports.updateReviewValidator = [
    body('review').optional().notEmpty().withMessage('please enter your review'),
    body('rating').optional().notEmpty().withMessage('please enter your rating').isFloat({min:1,max:5}).withMessage('rating should be from 1 to 5'),
    body('tour').notEmpty().withMessage('please enter your tour id').isMongoId().withMessage('tour id should be mongo id'),
    body('user').optional().notEmpty().withMessage('please enter your user id').isMongoId().withMessage('user id should be mongo id')
];

module.exports.deleteReviewValidator = [
    param('id').notEmpty().withMessage('please enter your id').isMongoId().withMessage('review id should be mongo id')
]