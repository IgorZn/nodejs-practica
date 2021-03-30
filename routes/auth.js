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
const regEmail = require('../emails/registration')

// User
const User = require('../models/user')

router.get('/login', async (req, res)=>{
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        errorLogin: req.flash('errorLogin'),
        errorRegister: req.flash('errorRegister')
    })
})

router.post('/login', async (req, res)=>{
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

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            // такой пользователь уже есть
            // теперь эту ошибку надо передать на клиента, т.е. в GET
            req.flash('errorRegister', 'Пользователь с таким адресом уже существует')
            res.redirect('/auth/login#register')
        } else {
            // создаем нового пользователя
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart:{items: []}
            })
            await user.save()
        }

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
                return res.redirect()
            }

            const token = buf.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {

            } else {
                req.flash('error', 'Пользователя с таким адресом не зарегестрировано')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router