const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url);

    res.write('<h1>Hello from Node.js</h1>');
    res.write(`<a href="/aaa">Link</a>`);

    if(req.url === '/aaa') {
        res.write('<h1>aaa page</h1>');
    }

    res.end(`
    <div style="background: red; width: 200px; height: 200px;">
        <h1>Test</h1>
    </div>`);
});

server.listen(3000, () => {
    console.log('Server is running...');
});
