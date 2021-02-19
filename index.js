const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')


// Routers
const homeRoutes = require('./routes/home')
const homeAdd = require('./routes/add')
const homeCourses = require('./routes/courses')
const homeCard = require('./routes/card')


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
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

// PORT for server
const PORT = process.env.PORT || 3000


// ROUTER
// app.get(первым принимает URL, вторым обработчик,)
app.use('/', homeRoutes)
app.use('/add', homeAdd)
app.use('/courses', homeCourses)
app.use('/card', homeCard)

// MONGODB

async function start(){
    try {
        // Connect to DB
        const pwd = 'QhdiCOhl6tFVHmBW'
        const db_url = `mongodb+srv://igor_zn:${pwd}@cluster0.eyljf.mongodb.net/my_shop`
        await mongoose.connect(db_url, { useUnifiedTopology: true })

        // Start server
        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${PORT}`)
    })
    } catch (e) {
        console.log(e)
    }



}

start()

