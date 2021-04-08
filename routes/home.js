const {Router} = require('express')
const router = Router()


router.get('/', (req, res)=>{
    let user_name;

    if (req.session.user) {
        user_name = req.session.user.name
    } else {
        user_name = undefined
    }
    res.render('index', {
        title: 'Главная страница',
        isHome: true,
        user: user_name

    })
})

module.exports = router