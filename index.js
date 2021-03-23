// System
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const keys = require('./keys')

// var cookieParser = require('cookie-parser')
const csrf = require('csurf')
const flash = require('connect-flash')

// session and MongoStore, go one after another otherwise will NOT work
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)


// MONGODB
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

 // Various
const varMiddleWare = require('./middleware/variables')
const userMiddleWare = require('./middleware/user')

// User
// const User = require('./models/user')

// Routers
const homeRoutes = require('./routes/home')
const homeAdd = require('./routes/add')
const homeCourses = require('./routes/courses')
const homeCard = require('./routes/card')
const homeOrders = require('./routes/orders')
const authRoutes = require('./routes/auth')

// setup route middlewares
// var csrfProtection = csrf({ cookie: true })
// var parseForm = bodyParser.urlencoded({ extended: false })

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
app.use(session({
    secret: keys.SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(csrf())
app.use(flash())
app.use(varMiddleWare)
app.use(userMiddleWare)

// Find user
// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('6033da1429a5f05f9c5552d9')
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e)
//     }
// })

// HOST and PORT
const HOST = process.env.HOST || 'http://localhost'
const PORT = process.env.PORT || 3000


// ROUTER
// app.get(первым принимает URL, вторым обработчик,)
app.use('/', homeRoutes)
app.use('/add', homeAdd)
app.use('/courses', homeCourses)
app.use('/card', homeCard)
app.use('/orders', homeOrders)
app.use('/auth', authRoutes)




async function start(){
    try {
        // Connect to DB
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        // User
        // const candidate = await User.findOne()
        // if (!candidate) {
        //     const user = new User({
        //         email: 'vova@mail.ru',
        //         name: 'Vovas',
        //         cart: {items: []}
        //     })
        //     await user.save()
        // }

        // Start server
        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${HOST}:${PORT}`)
    })
    } catch (e) {
        console.log(e)
    }



}

start()

