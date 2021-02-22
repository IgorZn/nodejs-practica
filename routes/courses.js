const {Router} = require('express')
const router = Router()
const Course = require('../models/course')


router.get('/', async (req, res)=>{
    const courses = await Course.find().lean()
    console.log('ROUTER', courses)
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req, res) => {
   const course = await Course.findById(req.params.id).lean()
   console.log(req.params, course.title)
   res.render('course', {
       layout: 'empty',
       course
   })
})

router.get('/:id/edit', async (req, res) => {
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

router.post('/edit', async (req, res) => {
    await Course.findByIdAndUpdate(req.body.id, req.body)
    res.redirect('/courses')
})


module.exports = router