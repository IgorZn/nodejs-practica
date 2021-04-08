const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Course = require('../models/course')


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
   const course = await Course.findById(req.params.id).lean()
   console.log(req.params, course.title)
   res.render('course', {
       layout: 'empty',
       course
   })
})

router.get('/:id/edit', auth, async (req, res) => {
    // проверка query-параметра, что разрешено редактирование
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id).lean()
    console.log('edit', course)

    res.render('course-edit', {
        title: `Курс ${course.title}`,
        course
    })
})

router.post('/edit', auth, async (req, res) => {
    await Course.findByIdAndUpdate(req.body.id, req.body)
    res.redirect('/courses')
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router