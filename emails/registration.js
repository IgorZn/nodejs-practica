// keys
const keys = require('../keys')

module.exports = function(email) {
    return {
        email: email,
        sender_name: 'Book-Shop',
        sender_email: keys.NO_REPLAY_EMAIL,
        subject: 'Успешная регистрация!',
        body: `
            <h1>Добро пожаловать в наш магазин</h1>
            <p>Вы успешно создали аккаунт - ${email}</p>
            <hr />
            <a href="#">Магазин книг</a>
        `,
        lang: 'ru',
        list_id: 20716981,
        code: 'invalid_arg',
        error: '',
        result: ''
    }
}


// module.exports = function (to) {
//     return {
//             to: to,
//             from: keys.NO_REPLAY_EMAIL,
//             subject: 'Учетная запись создана',
//             html: `<h1>Hello world!</h1>`
//     }
// }