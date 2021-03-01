const {Schema, model} = require('mongoose')
const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// удаление _id и замена его на id (без н/подчеркивания)
course.method('toClient', function () {
    const _course = this.toObject()

    course.id = _course._id
    delete course._id

    return course
})


module.exports = model('Course', course)