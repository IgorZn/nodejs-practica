// keys
const keys = require('../keys')

module.exports = function(email, name, token) {
    return {
        api_key: keys.SEND_API,
        email: email,
        sender_name: 'Хан Игорян',
        sender_email: keys.NO_REPLAY_EMAIL,
        subject: 'Дропаем пароль!',
        body: `
            <h1>Вы ахуели дорогой, ${name}</h1>
            <p>Сброс пароля по ссылке ниже</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Сбросить</a></p>
            `,
        list_id: 1,
        lang: 'ru'
    }
}