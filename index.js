// System
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

// User
const User = require('./models/user')

// Routers
const homeRoutes = require('./routes/home')
const homeAdd = require('./routes/add')
const homeCourses = require('./routes/courses')
const homeCard = require('./routes/card')

// Main APP
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

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('6033da1429a5f05f9c5552d9')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})

// HOST and PORT
const HOST = process.env.HOST || 'http://localhost'
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
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        // User
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'vova@mail.ru',
                name: 'Vovas',
                cart: {items: []}
            })
            await user.save()
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${HOST}:${PORT}`)
    })
    } catch (e) {
        console.log(e)
    }



}

start()

