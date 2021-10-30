const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
  body('email')
    .isEmail().withMessage('Введи корректный email')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })

        if (user) {
          return Promise.reject('Такой email уже занят');
        }
      } catch (e) {
        console.log(e)
      }
    }),
  body('password', 'Пароль должен быть минимум из 6 символов')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Пароли должны совпадать');
      return true;
    })
    .trim(),
  body('name')
    .isLength({min: 3})
    .withMessage('Имя должно быть минимум из 3 символов')
    .trim()
];

exports.loginValidators = [
  body('email')
    .isEmail().withMessage('Введи корректный email')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value })

        if (!user) {
          return Promise.reject('Неправильный логин или пароль');
        }
      } catch (e) {
        console.log(e)
      }
    }),
    body('password', 'Пароль должен быть минимум из 6 символов')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
];

exports.courseValidators = [
  body('title').isLength({min: 3}).withMessage('Минимальная длинна названия 3 символа').trim(),
  body('price').isNumeric().withMessage('Введите корректную цену'),
  body('imgURL', 'Введите корректный Url картинки').isURL()
]