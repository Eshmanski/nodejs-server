const path = require('path');
const express = require('express');
const exphds = require('express-handlebars');
const staticRouter = require('./routes/staticPages');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');

const app = express();

const hbs = exphds.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
 
// StaticPages
app.use('/static', staticRouter);


const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
