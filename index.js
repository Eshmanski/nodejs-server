const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const express = require('express');
const exphds = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const staticRouter = require('./routes/staticPages');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const PORT = process.env.PORT || 3000;
const MONGODB_PASS = '3U4fxZU3cchM3BMP';
const MONGODB_URI = `mongodb+srv://Eshmanski:${MONGODB_PASS}@cluster0.lr9ll.mongodb.net/shop`;

const app = express();

const hbs = exphds.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI,
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes)
// StaticPages
app.use('/static', staticRouter);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(3000, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.warn(e);
  }
}

start();
