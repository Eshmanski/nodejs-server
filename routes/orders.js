const { Router } = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({'user': req.user._id})
      .populate('user')
      .populate('courses.courseId')
      .lean();

    res.render('orders', {
      isOrder: true,
      title: 'Заказы',
      orders
    });
  } catch (e) {
    console.warn(e);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = req.user;
    const { items } = await user.cart.populate('items.courseId');
    const price = items.reduce((total, c) => {
      return total += c.count * c.courseId.price;
    }, 0);

    const order = new Order({
      user: user._id,
      courses: user.cart.items,
      price
    });

    await order.save();

    await req.user.clearCart();

    res.redirect('/orders');
  } catch (e) {
    console.warn(e);
  }
});

module.exports = router;
