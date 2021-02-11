const fs = require('fs')
const path = require('path')

// fs.mkdir(path.join(__dirname, 'test1'), () => {})

const filePath = path.join(__dirname, 'test1', 'testFile.txt')
const getErr = (err) =>{
    if (err) {
        throw err
    }
}

fs.writeFile(filePath, 'Hello Catty!', err => {
    getErr(err)
    console.log('File was created')
})

fs.appendFile(filePath, '\tHello Catty!', err => {
    getErr(err)
    console.log('File was created')
})

fs.readFile(filePath, 'utf-8', (err, content) => {
    getErr(err)

    console.log(content)

    // const data = Buffer.from(content)
    // console.log(data.toString())
})