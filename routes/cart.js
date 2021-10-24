const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();

function mapCartItems(cart) {
  return cart.items.map(c => {
    const { _id, __v, userId, ...rest } = c.courseId;

    return {
      count: c.count,
      id: _id.toString(),
      ...rest,
      userId: userId.toString()
    };
  });
}

function computePrice(courses) {
  return courses.reduce((accum, item) => {
    return accum += +item.price * +item.count;
  }, 0);
}

router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course);

  res.redirect('/cart');
});

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.remoteFromCart(req.params.id);

  const cart = await req.user.cart
    .populate('items.courseId')
    .then(cart => cart.toObject());

  const courses = mapCartItems(cart);

  res.status(200).json({ courses, price: computePrice(courses) });
});

router.get('/', auth, async (req, res) => {
  const cart = await req.user.cart
    .populate('items.courseId')
    .then(cart => cart.toObject());

  const courses = mapCartItems(cart);

  res.render('cart', {
    title: 'Корзина',
    isCart: true,
    courses,
    price: computePrice(courses)
  });
});

module.exports = router;
