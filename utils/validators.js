const { body } = require('express-validator');

exports.registerValidators = [
  body('email').isEmail().withMessage('Введи корректный email'),
  body('password', 'Пароль должен быть минимум из 6 символов').isLength({min: 6, max: 56}).isAlphanumeric(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Пароли должны совпадать');
    return true;
  }),
  body('name').isLength({min: 3}).withMessage('Имя должно быть минимум из 3 символов')
]
