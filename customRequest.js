const http = require('http');

const options = {
  host: 'localhost',
  port: 80,
  path: '/test',
  method: 'GET',
};

const req = http.request(options, (res) => {
  const body = [];

  res.on('data', (data) => {
    console.log('taked data from buffer');

    body.push(Buffer.from(data))
  });

  res.on('end', () => {
    console.log('end stream');

    console.log(body.toString());
  })

});

req.end();
