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




const PORT = process.env.PORT || 3000

// app.get(первым принимает URL, вторым обработчик,)
app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/about', (req, res)=>{
    res.render('about')
})



app.listen(PORT, () => {
    console.log(`Server has been started on port: ${PORT}`)
})