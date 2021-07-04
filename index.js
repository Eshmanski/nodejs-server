const path = require('path');
const express = require('express');
const exphds = require('express-handlebars');

const app = express();

const hbs = exphds.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200);

  // res.sendFile(path.join(__dirname, 'views', 'index.html'));

  res.render('index');
});
 
app.get('/about', (req, res) => {
  res.status(200);

  // res.sendFile(path.join(__dirname, 'views', 'about.html'));
  
  res.render('about')
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});