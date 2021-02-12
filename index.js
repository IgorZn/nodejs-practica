const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')


const app = express()
const hbs = exphbs.create({
    // defaultLayout -- основной слой -- будет main
    defaultLayout: 'main',
    // название расширения
    extname: 'hbs'
})

// регистрируем двигло и наз. он 'hbs' т.к. extname: 'hbs'
app.engine('hbs',  hbs.engine)

// а тут мы его УЖЕ можем использовать
app.set('view engine', 'hbs')

// сообщаем переменной 'views', в какой папке будут храниться
// все исп. шаблоны
app.set('views', 'views')

// вызвали use -- подгрузка нов. функционала [midlleware]
// static folder
app.use(express.static('public'))


const PORT = process.env.PORT || 3000


// ROUTER
// app.get(первым принимает URL, вторым обработчик,)
app.get('/', (req, res)=>{
    res.render('index', {
        title: 'Главная страница',
        isHome: true
    })
})

app.get('/add', (req, res)=>{
    res.render('add', {
        title: 'Добавление курсов',
        isAdd: true
    })
})

app.get('/courses', (req, res)=>{
    res.render('courses', {
        title: 'Курсы',
        isCourses: true
    })
})



app.listen(PORT, () => {
    console.log(`Server has been started on port: ${PORT}`)
})