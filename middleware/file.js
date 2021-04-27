const multer = require('multer')

const genFileName = (filename) => {
    return new Date().toISOString().replaceAll(':','-') + '__' + file.originalname
}
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'images')
    },
    filename(req, file, cb){
        cb(null, genFileName(file))
    }
})
const allowTypes = ['image/png', 'image/jpg', "image/jpeg"]
const fileFilter = (req, file, cb) => {
    if (file.mimeType in allowTypes) {
        // валидация прошла успешно
        cb(null, true)
    } else {
        // проблемы с валидацией
        cb(null, false)
    }
}

module.exports = multer({
    storage, fileFilter
})