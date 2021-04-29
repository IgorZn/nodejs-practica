// Main components
const User = require('../models/user')
const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const fileMiddleware = require('../middleware/file')

// const multer  = require('multer')
// const fileMiddleware = multer({ dest: 'images' })


// Routers
router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.session.user
    })
})

router.post('/', fileMiddleware.single('avatar'), auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const toChange = {
            name: req.body.name
        }

        console.log(req.file)
        if (req.file) {
            toChange.avatarURL = req.file.path
        }

        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (e) {
        
    }
})

module.exports = router