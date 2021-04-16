// Validator
const {body} = require('express-validator/check')

exports.registerValidators = [
    body('email', 'Хуево e-mail написал! Еще разок давай и без ошибок.').isEmail(),
    body('password', 'Че PASSWORD такой короткий, мля?').isLength({min:6}),
    body('confirm').custom( (value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли не совпадают')
        }
        return true
    } ),
    body('name', 'Имя минимум два символа').isLength({min: 2})
]