const path = require('path')

console.log("название файла: ", path.basename(__filename))
console.log("имя директори: ", path.basename(__dirname))
console.log("расширение файла: ", path.extname(__filename))
console.log("Parse: ", path.parse(__filename))
console.log("Parse: ", path.parse(__filename).dir)
console.log(path.join(__dirname, 'server', 'index'))