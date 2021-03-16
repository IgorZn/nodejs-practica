const user = require('../models/user')

module.exports = async function (req, res, next) {
    // если нет сессии, то значит не залогинился
    // значит может идти лесом
    if (!req.session.user) {
        return next()
    }

    // а если есть сессия, значит залогинился,
    // значит найти его в сессии и доб. аттр. user
    // в req и передать упр. дальше
    req.user = await user.findById(req.session.user._id)
    next()
}