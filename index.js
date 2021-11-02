const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const csrf = require('csurf');
const flash = require('connect-flash');
const express = require('express');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const keys = require('./keys');
const app = express();

const PORT = process.env.PORT || 3000;

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
});

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      scriptSrc: ["'self'", "cdnjs.cloudflare.com"],
      imgSrc: "*"
    }
  }
}));

app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.warn(err);
  }
}

start();
