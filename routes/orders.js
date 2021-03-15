const {Router} = require('express')
const router = Router()
const Order = require('../models/order')
const auth = require('../middleware/auth')


router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find(
            {'user.userId': req.user._id})
            .populate('user.userId').lean()

        res.render('orders', {
        isOrders: true,
        title: 'Заказы',
        orders: orders.map(o => {
            return {
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return total += c.count * c.course.price
                }, 0)
            }
        })
    })

        // console.log('ORDERS_GET__orders', orders)
        console.log('ORDERS_GET_MAP__orders', orders.map(o => {
            return {
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return total += c.count * c.course.price
                }, 0)
            }
        }))

    } catch (e) {
        console.log(e)
    }

})

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate()

        console.log('Orders_post', user)

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc}
        }))
        console.log('ORDERS__courses', courses)

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