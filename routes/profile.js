// Main components
const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()


// Routers
router.get('/', async (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.session.user
    })
})

router.post('/', async (req, res) => {})

module.exports = router