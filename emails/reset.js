const keys = require('../keys/index');

module.exports = function(email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Восстановление доступа',
    text: '123',
    html: `
    <h1>Вы забыли пароль?</h1>
    <p>Если нет то проигнорируйте данное письмо.</p>
    <p>Иначе перейдите по ссылке</p>
    <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить пароль</a></p>
    <hr />
    <a href="${keys.BASE_URL}">Магазин курсов</a>
    `
  };
}