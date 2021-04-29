const multer = require('multer')

const genFileName = (filename) => {
    return new Date().toISOString().replace(/:/g,'-') + '__' + filename.originalname
}
const storage = multer.diskStorage({
     destination: function (req, file, cb){
        cb(null, 'images')
    },
    filename: function (req, file, cb){
        cb(null, genFileName(file))
    }
})
const allowTypes = ['image/png', 'image/jpg', "image/jpeg"]
const fileFilter = (req, file, cb) => {
    if ( allowTypes.indexOf(file.mimetype) !== -1 ) {
        // валидация прошла успешно
        cb(null, true)

    } else {
        // проблемы с валидацией
        cb(null, false)
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
})