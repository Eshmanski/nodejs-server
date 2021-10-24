const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить страницу',
    isAdd: true
  });
});

router.post('/', auth, async (req, res) => {
  // const course = new Course(req.body.title, req.body.price, req.body.imgURL);

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
