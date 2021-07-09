const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const exphds = require('express-handlebars');
const staticRouter = require('./routes/staticPages');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const ordersRouters = require('./routes/orders');
const User = require('./models/user');

const app = express();

const hbs = exphds.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('60e6ee59faef74ef26e0a7f7');
    
    req.user = user;

    next();
  } catch (e) {
    console.warn(e);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRouters);

// StaticPages
app.use('/static', staticRouter);


const PORT = process.env.PORT || 3000;
const password = '3U4fxZU3cchM3BMP';
const mongodbUrl = `mongodb+srv://Eshmanski:${password}@cluster0.lr9ll.mongodb.net/shop`;

async function start() {
  try {
    await mongoose.connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const candidate = await User.findOne();
    
    if (!candidate) {
      const user = new User({
        email: 'eshmanski@gmail.com',
        name: 'Eshmanski',
        cart: { items: [] }
      });

      await user.save();
    }

    app.listen(3000, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.warn(e);
  }
}

start();