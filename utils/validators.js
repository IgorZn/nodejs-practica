// Validator
const {body} = require('express-validator/check')

// User schema
const User = require('../models/user')

exports.registerValidators = [
    body('email', 'Хуево e-mail написал! Еще разок давай и без ошибок.').isEmail().custom(
        async (value, {req}) => {
            try {
                const user = User.findOne({email: value})
                if (user) {
                    return Promise.reject('Пользователь с таким email уже зарегестрирован')
                }
            } catch (e) {
                console.log(e)
            }
        }
    ),
    body('password', 'Че PASSWORD такой короткий, мля?').isLength({min:6}),
    body('confirm').custom( (value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают')
        }
        return true
    } ),
    body('name', 'Имя минимум два символа').isLength({min: 2})
]