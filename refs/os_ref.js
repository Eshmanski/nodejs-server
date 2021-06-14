const os = require('os');

console.log('Platform:', os.platform());

console.log('Architecture:', os.arch());

console.log('CPU cores:', os.cpus());

console.log('Free memory:', os.freemem());

console.log('All memory', os.totalmem());

console.log('Home dir:', os.homedir());

console.log('Time of work:', os.uptime());