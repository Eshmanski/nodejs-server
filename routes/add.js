const { Router } = require('express');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const router = Router();

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить страницу',
    isAdd: true
  });
});

router.post('/', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Добавить страницу',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        imgURL: req.body.imgURL,
      }
    });
  }

  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    imgURL: req.body.imgURL,
    userId: req.session.userId
  });

  try {
    await course.save();

    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
