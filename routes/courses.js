const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', async(req, res) => {
  res.status(200);

  const courses = await Course.find().lean();

  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses,
  });
});

router.get('/:id/edit', auth, async(req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  const course = await Course.findById(req.params.id).lean();

  res.render('course-edit', {
    title: `Редактировать ${course.title}`,
    course,
  });
});

router.post('/remove', auth, async(req, res) => {
  try {
    await Course.deleteOne({ _id: req.body._id });

    res.redirect('/courses');
  } catch (e) {
    console.warn(e);
  }
});

router.post('/edit', auth, async(req, res) => {
  const { id } = req.body;
  delete req.body.id;

  await Course.findByIdAndUpdate(id, req.body);

  res.redirect('/courses');
});

router.get('/:id', async(req, res) => {
  const course = await Course.findById(req.params.id).lean();

  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course,
  });
});

module.exports = router;
