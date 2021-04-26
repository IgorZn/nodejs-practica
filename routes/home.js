const {Router} = require('express')
const router = Router()


router.get('/', (req, res)=>{
    let user_name;

    res.render('index', {
        title: 'Главная страница',
        isHome: true,
        user: req.session.user

    })
})

module.exports = router