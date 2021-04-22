const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Course = require('../models/course')

// Validators
const {courseValidators} = require('../utils/validators')

const isOwner = (course, req, res) => {
    if (course.userId.toString() === req.user._id.toString()){
        return true
    } else {
        return res.redirect('/courses')
    }
}

router.get('/', async (req, res)=>{
    try {
        const courses = await Course.find().lean()
            .populate('userId', 'email name')
            .select('title price img')

    console.log('COURSES get / ', courses)
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        userId: req.user ? req.user._id.toString() : null,
        courses
    })
    } catch (e) {
        return e
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).lean()
        console.log(req.params, course.title)
        res.render('course', {
            layout: 'empty',
            course
        })
    } catch (e) {
        return e
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    // проверка query-параметра, что разрешено редактирование
    if (!req.query.allow) {
        return res.redirect('/')
    }
    try {
        const course = await Course.findById(req.params.id).lean()
        isOwner(course, req, res)
        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e)
    }

})

router.post('/edit', courseValidators, auth, async (req, res) => {
    try {
        const course = await Course.findById(req.body.id).lean()
        if (isOwner(course, req, res)) {
            await Course.findByIdAndUpdate(req.body.id, req.body)
            res.redirect('/courses')
        }
    } catch (e) {
        return e
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.body.id).lean()
        if (isOwner(course, req, res)) {
            await Course.deleteOne({_id: req.body.id})
            res.redirect('/courses')
        }


    } catch (e) {
        console.log(e)
    }
})

module.exports = router