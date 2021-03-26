// keys
const keys = require('../keys')

module.exports = function(email, name) {
    return {
        api_key: keys.SEND_API,
        email: email,
        sender_name: 'Book-Shop',
        sender_email: keys.NO_REPLAY_EMAIL,
        subject: 'Успешная регистрация!',
        body: `
            <h1>Добро пожаловать в наш магазин, ${name}</h1>
            <p>Вы успешно создали аккаунт - ${email}</p>
            `,
        list_id: 1,
        lang: 'ru'
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