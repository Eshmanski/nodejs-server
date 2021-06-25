const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
	console.log('!');

	if (req.method === 'GET') {
		res.writeHead(200, {
			'Content-Type': 'text/html; charset=utf-8'
		});

		if (req.url === '/') {
			fs.readFile(
				path.join(__dirname, 'views', 'index.html'),
				{ charset: 'utf-8' },
				(err, content) => {
					if (err) {
						throw err;
					}

					res.end(content);
				}
			);
		} else if (req.url === '/about') {
				fs.readFile(
				path.join(__dirname, 'views', 'about.html'),
					{ charset: 'utf-8' },
					(err, content) => {
						if (err) {
							throw err;
						}

						res.end(content);
					}
				);
		} else if (req.url === '/api/users') {
			res.writeHead(200, {
				'Content-Type': 'text/json'
			});

			const users = [
				{name: 'Vlad', age: 25},
				{name: 'Pavel', age: 23}
			];

			res.end(JSON.stringify(users));
		} else if (req.url === '/test') {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});

			res.write(`<h1>This is Test</h1>`);

			res.write(`<h2>Of Buffer</h2>`);

			res.write(`<h3>oooooooooooooo</h3>`);

			res.end(`<h4>End of message</h4>`);
		}
	} else if (req.method === 'POST') {
		const body = [];

		res.writeHead(200, {
			'Content-Type': 'text/html; charset=utf-8'
		});

		req.on('data', data => {
			body.push(Buffer.from(data));
		});

		req.on('end', () => {
			const message = body.toString().split('=')[1];

			res.end(`Your message: ${message}`);
		});
	}
});

server.listen(80, () => {
  console.log('Server is running...');
});
