const { Router } = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const router = Router();

const transporter = nodemailer.createTransport(sendgrid({
  auth: {api_key: keys.SENDGRID_API_KEY}
}));

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  });
});

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.userId = candidate._id;
        req.session.isAuthenticated = true;
      
        return req.session.save((err) => {
          if (err) throw err;
      
          res.redirect('/');
        });
      }
    }

    req.flash('loginError',  'Неправильный логин или пароль');
    res.redirect('/auth/login#login');
  } catch (e) {
    console.log(e);
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

router.post('/register', async (req, res) => {
    try {
      let errorMessage;
      
      const {email, name, password, confirm} = req.body;
  
      const candidate = await User.findOne({email});
 
      if (!candidate) {
        if (password === confirm) {
          const hashPassword = await  bcrypt.hash(password, 10);
          const user = new User({
            email, name, password: hashPassword, cart: {items: []}
          });
    
          await user.save();

          await transporter.sendMail(regEmail(email));

          return res.redirect('/auth/login#login');
        } else errorMessage = 'Пароли не совпадают';
      } else errorMessage = 'Пользователь с таким email уже существует';
      
      req.flash('registerError', errorMessage);
      res.redirect('/auth/login#register');
    } catch (e) {
      console.log(e);
    }

});

module.exports = router;