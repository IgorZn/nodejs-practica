// Validator
const {body} = require('express-validator/check')

// User schema
const User = require('../models/user')

exports.registerValidators = [
    body('email', 'Хуево e-mail написал! Еще разок давай и без ошибок.')
        .isEmail()
        .custom(
        async (value, {req}) => {
            try {
                const user = await User.find({email: value})
                console.log(user)
                if (user.length) {
                    return Promise.reject('Пользователь с таким email уже зарегестрирован')
                }
            } catch (e) {
                console.log(e)
            }
        }
    ).normalizeEmail(),

    body('password', 'Че PASSWORD такой короткий, мля?')
        .isLength({min:6})
        .trim(),

    body('confirm')
        .custom( (value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают')
        }
        return true
    } )
        .trim(),

    body('name', 'Имя минимум два символа')
        .isLength({min: 2})
        .trim()
]

exports.loginValidators = [
    body('email', 'email еще разок и давай без ошибок.')
        .isEmail()
        .normalizeEmail(),
]

exports.courseValidators = [
    body('title').isLength({min: 3}).withMessage('Минимальная длина названия 3 символа').trim(),
    body('price').isNumeric().withMessage('Введите корректное число').trim(),
    body('img', 'Введите корректный URL картинки').isURL()
]