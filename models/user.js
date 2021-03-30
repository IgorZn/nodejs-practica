const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: String,
    password: {
        type: String,
        required: true,
    },
    cart: {
        items:[
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true,
                }
            }
        ]
    },
    resetToken: String,
    resetTokenExp: Date
})


userSchema.methods.addToCart = function (course) {
    // concat() -- вернут новый (копию) массив
    // es6 использовать троиточие или оператор развертки [...this.cart.items]
    const items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })

    // если инедекс, то увеличить на 1
    if (idx >= 0) {
        items[idx].count++
    } else {
        // иначе добавь объект с id and count
        items.push({
            courseId: course._id.toString(),
            count: 1
        })
    }

    // длинный вариант
    // const newCart = model({items: items})
    // this.cart = newCart

    // короткий
    // this.cart = {items: items}

    // что эквивалент, т.к. в случае совпадения ключа и значения, можно записать
    // только ключ
    this.cart = {items}

    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []}
    return this.save()
}

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.courseId.toString() === id.toString()
    })

    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items}
    return this.save()
}


module.exports = model('User', userSchema)