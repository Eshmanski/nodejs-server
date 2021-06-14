const fs = require('fs');
const path = require('path');

// File System

fs.mkdir(path.join(__dirname, 'notes'), (err) => {
  if (err) throw err;

  console.log('Папка была создана');
});

fs.writeFile(
  path.join(__dirname, 'notes', 'mynotes.txt'),
  'Hello world'
)
