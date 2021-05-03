if (process.env.NODE_ENV === 'production') {
    require('dotenv').config()
} else {
    module.exports = require('./keys.dev')
}