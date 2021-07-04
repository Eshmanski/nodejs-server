const { Router } = require('express');
const path = require('path');

const router = Router();

const staticDir = path.join(__dirname, '..', 'views', 'static');

console.log(path.join(staticDir, 'index.html'));
router.get('/', (req, res) => {
  res.status(200);
  
  res.sendFile(path.join(staticDir, 'index.html'));
});

router.get('/about', (req, res) => {
  res.status(200);

  res.sendFile(path.join(staticDir, 'about.html'));
});

module.exports = router;
