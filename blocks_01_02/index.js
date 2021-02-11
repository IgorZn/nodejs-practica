// const chalk = require('chalk')
// const text = require('./data')
//
//
// let igo = 'My name is Igor'
// let toto = "Петух"
// console.log(`hello node-js --- здесь будет IGO: ${igo}`)
// console.log(`Тут будет слово: ${chalk.blue(toto)}`)
// text()
//
// // 14:28 -- stop
//
// console.log("тут будет __dirname: "+__dirname);
// console.log("тут будет __filename: "+__filename);

const fs = require('fs')
const path = require('path')
const http = require('http')

const server = http.createServer((req, res) => {

    const pageName = {
        '/': 'index',
        'contact': 'contact',
        'undefined': 'index'
    }

    let _url = req.url === undefined ? '/' : req.url
    console.log('_url', _url)

    let filePath = path.join(__dirname, 'public', `${pageName[_url]}.html`)
    console.log('filePath',filePath)

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err
        }
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(data)
    })


})

const PORT = process.env.PORT || 3000

server.listen(3000, () => {
    console.log(`Server has been started on ${PORT}....`)
})