// keys
const keys = require('../keys')

const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// email sender
const unisend = require('unisender')
const uniSender = new unisend({
                api_key: keys.SEND_API,
                lang: 'ru'
            })

// emails template
const regEmail = require('../emails/registration')
const resetPWD = require('../emails/reset')

// User
const User = require('../models/user')

// Validator
const {validationResult} = require('express-validator/check')
const {registerValidators, loginValidators} = require('../utils/validators')

router.get('/login', async (req, res)=>{
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        errorLogin: req.flash('errorLogin'),
        errorRegister: req.flash('errorRegister')
    })
})

router.post('/login', loginValidators, async (req, res)=>{
    try {
        // получить логин и пароль из "сессии"
        const {email, password} = req.body

        // найти пользователся в БД
        const candidate = await User.findOne({email})

        // если нашелся
        if (candidate) {
            // сравнить пароль из "сессии" и из БД
            const areSame = await bcrypt.compare(password, candidate.password)
            // если совпали
            if (areSame) {
                // на `user` назначить `candidate`, сохранить
                // и перекинуть на гл. страницу
                const user = await candidate
                req.session.user = user
                req.session.isAuthenticated = true
                req.session.save( err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                } )

            } else {
                req.flash('errorLogin', 'Логин или пароль введены не правильно')
                res.redirect('/auth/login#login')
            }

        } else {
            req.flash('errorLogin', 'Такого пользователя не существует')
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log()
    }


})

router.get('/logout', async (req, res)=>{
        req.session.destroy( ()=> {
        res.redirect('/auth/login#login')
    } )
})

// registerValidators -- добавили как middleware

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errorRegister', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        // создаем нового пользователя
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, name, password: hashPassword, cart:{items: []}
        })
        await user.save()

        // перекинуть на страницу входа
        res.redirect('/auth/login#login')

        // отправит письмо о успешной решистрации
        await uniSender.sendEmail(regEmail(email, name))

    } catch (e) {
        console.log(e)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error'),

    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buf) => {
            if (err) {
                req.flash('error', 'Что-то пошло нетак, попробуйте позднее.')
                return res.redirect('/auth/reset')
            }

            const token = buf.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()

                // отправить письмо на сброс пароля
                const {email, name} = req.body
                await uniSender.sendEmail(resetPWD(candidate.email, candidate.name, candidate.resetToken))
                res.redirect('/auth/login')

            } else {
                req.flash('error', 'Пользователя с таким адресом не зарегестрированно.')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }

    } catch (e) {
        console.log(e)
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время жизни токена истекло')
            res.redirect('/auth/login')
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = router