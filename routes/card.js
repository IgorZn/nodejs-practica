const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

// HELPERS
function mapCartItems(cart){
    return cart.items.map(c => ({
        ...c.courseId._doc,
            count: c.count,
        id: c.courseId.id
    })
    )
}


function calcPrice(courses){
    return courses.reduce((total, course)=>{
        console.log(course)
        return total += course.price * course.count
    }, 0)
}






router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.get('/', async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()

    const courses = mapCartItems(user.cart)

    console.log('CART__courses', courses)

    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: courses,
        price: calcPrice(courses),

    })
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()

    const courses = mapCartItems(user.cart)
    const cart = {
        courses, price: calcPrice(courses)
    }

    res.status(200).json(cart)
})

module.exports = router