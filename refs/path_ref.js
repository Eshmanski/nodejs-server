const path = require('path');

console.log('Directory:',path.dirname(__filename));
console.log('Filename:', path.basename(__filename));
console.log('Extname', path.extname(__filename));

console.log('Common info:', path.parse(__filename));

console.log('Path one:', path.join(__dirname, 'test', '/second.html'));
console.log('Path two:', path.resolve(__dirname, './test', '/second.html'));
