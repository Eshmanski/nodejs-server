const { Router } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const  sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const { registerValidators, loginValidators } = require('../utils/validators')
const router = Router();

sgMail.setApiKey(keys.SENDGRID_API_KEY);

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  });
});

router.post('/login', loginValidators, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg);
      return res.redirect('/auth/login#login');
    }

    const {email, password} = req.body;

    const user = await User.findOne({ email });
    const areSame = await bcrypt.compare(password, user.password);

    if (areSame) {
      req.session.userId = user._id;
      req.session.isAuthenticated = true;
    
      return req.session.save((err) => {
        if (err) throw err;
    
        res.redirect('/');
      });
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

router.post('/register', registerValidators, async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.flash('registerError', errors.array()[0].msg);
        return res.status(422).redirect('/auth/login#register');
      }
 
      const {email, name, password} = req.body;
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email, name, password: hashPassword, cart: {items: []}
      });
    
      await user.save();
      await sgMail.send(regEmail(email))
          .then((res) => console.log(res))
          .catch((e) => console.log(e.response.body));
      return res.redirect('/auth/login#login');
    } catch (e) {
      console.log(e);
    }

});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Забыли пароль?',
    error: req.flash('error')
  });
});

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Что-то пошло нет так повторите попытку позже');
        return res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({email: req.body.email});

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 360000;

        await candidate.save();
        await sgMail.send(resetEmail(candidate.email, token));
        
        res.redirect('/auth/login#login');
      } else {
        req.flash('Пользователь с дуказанным email не найден')
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    });

    if(!user) {
      return res.redirect('/auth/login');
    } else {
      res.render('auth/password', {
        title: 'Восстановить доступ',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToke = undefined;
      user.resetTokenExp = undefined;

      await user.save();

      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Время жизни токена истекло');
      res.redirect('/auth/login');
    }
  } catch (e) {
    console.log(e)
  }
});

module.exports = router;
