const os = require('os')

console.log('OS: ', os.platform())
console.log('Returns the amount of free system memory: ', os.freemem() / 1024 / 1024)