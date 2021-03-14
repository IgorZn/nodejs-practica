const {Router} = require('express')
const router = Router()

// User
const User = require('../models/user')

router.get('/login', async (req, res)=>{
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    })
})

router.post('/login', async (req, res)=>{
    const user = await User.findById('6033da1429a5f05f9c5552d9')
    req.session.user = user
    req.session.isAuthenticated = true
    req.session.save( err => {
        if (err) {
            throw err
        }
        res.redirect('/')
    } )

})

router.get('/logout', async (req, res)=>{
        req.session.destroy( ()=> {
        res.redirect('/auth/login#login')
    } )
})

module.exports = router