const { Router } = require('express');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const router = Router();

function isOwner(course, req) {
  return course.userId.equals(req.user._id);
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().lean();

    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userId: req.user ? req.user.id : null,
      courses
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  try {
    const course = await Course.findById(req.params.id).lean();

    if (!isOwner(course, req)) {
      return res.redirect('/courses');
    }
  
    res.render('course-edit', {
      title: `Редактировать ${course.title}`,
      error: req.flash('error'),
      course
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();

    res.render('course', {
      title: `Курс ${course.title}`,
      course
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/edit', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);

  const { id } = req.body;

  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }
  
  try {
    delete req.body.id;

    const course = await Course.findById(id)

    if (!isOwner(course, req)) {
      return res.redirect('/course');
    }
 
    Object.assign(course, req.body);

    await course.save();
  
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    });

    res.redirect('/courses');
  } catch (err) {
    console.warn(err);
  }
});


module.exports = router;
