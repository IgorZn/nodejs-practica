const {Router} = require('express')
const router = Router()
const Course = require('../models/course')


router.get('/', async (req, res)=>{
    const courses = await Course.getAll()
    console.log('ROUTER', courses)
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req, res) => {
   const course = await Course.getById(req.params.id)
   console.log(req.params, course.title)
   res.render('course', {
       layout: 'empty',
       course
   })
})

module.exports = router