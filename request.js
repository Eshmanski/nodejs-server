const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 80,
  method: 'GET',
});

req.on('response', (res) => {
  console.log('Hello from event');
  console.log(res);
})

req.end();
