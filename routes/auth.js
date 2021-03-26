// keys
const keys = require('../keys')

const {Router} = require('express')
const router = Router()
var bcrypt = require('bcryptjs')

// email sender
const nodemailer = require('nodemailer')
const unisend = require('unisender')
// const transporter = nodemailer.createTransport(unisend({
//     api_key: keys.SEND_API,
//     lang: 'ru'
// }))
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
            // теперь эту ошибку надо передать на клиента, т.е. в GET
            req.flash('errorRegister', 'Пользователь с таким адресом уже существует')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart:{items: []}
            })
            await user.save()
        }

        res.redirect('/auth/login#login')

        await uniSender.sendEmail(regEmail(email, name))
        // await transporter.sendMail(regEmail(email))

    } catch (e) {
        console.log(e)
    }
})

module.exports = router