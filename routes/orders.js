const {Router} = require('express')
const router = Router()
const Order = require('../models/order')

router.get('/', async (req, res) => {
    try {
        const orders = Order.find({'user.userId': req.user.userId})
            .populate('user.userId')

        res.render('orders', {
        isOrders: true,
        title: 'Заказы',
        orders: orders.map(o => {
            return {
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return total += c.count * c.courses.price
                }, 0)
            }
        })
    })
    } catch (e) {

    }

})

router.post('/', async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate()

        console.log('Orders_post', user)

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')

    } catch (e) {
        console.log(e)
    }

})

module.exports = router