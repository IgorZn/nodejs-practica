if (process.env.NODE_ENV === 'production') {
    module.exports = require('dotenv').config()
} else {
    module.exports = require('./keys.dev')
}