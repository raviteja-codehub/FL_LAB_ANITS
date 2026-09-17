const os = require('os');
const path = require('path');
const dns = require('dns');
const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// ---------- OS MODULE ----------
console.log('--- OS Info ---');
console.log('Platform:', os.platform());
console.log('CPU Architecture:', os.arch());
console.log('CPU Info:', os.cpus()[0].model, `(${os.cpus().length} cores)`);
console.log('Total Memory:', (os.totalmem() / (1024 ** 3)).toFixed(2), 'GB');
console.log('Free Memory:', (os.freemem() / (1024 ** 3)).toFixed(2), 'GB');
console.log();

// ---------- PATH MODULE ----------
rl.question('Enter a file path: ', (filePath) => {
  console.log('\n--- Path Info ---');
  console.log('Directory Name:', path.dirname(filePath));
  console.log('File Name:', path.basename(filePath));
  console.log('Extension:', path.extname(filePath));
  console.log('Normalized Path:', path.normalize(filePath));
  console.log();

  // ---------- DNS MODULE ----------
  rl.question('Enter a domain name: ', (domain) => {
    dns.lookup(domain, (err, address) => {
      console.log('\n--- DNS Info ---');
      if (err) {
        console.log('Error resolving domain:', err.message);
      } else {
        console.log(`IP address of ${domain}:`, address);
      }
      rl.close();

      // ---------- NET MODULE ----------
      startServer();
    });
  });
});

// ---------- NET MODULE (TCP Server) ----------
function startServer() {
  const server = net.createServer((socket) => {
    console.log('\n--- Net Info ---');
    console.log('Client connected:', socket.remoteAddress + ':' + socket.remotePort);
    socket.write('Welcome to the server!\n');

    socket.on('end', () => {
      console.log('Client disconnected');
    });
  });

  const PORT = 5000;
  server.listen(PORT, () => {
    console.log(`\nTCP server running on port ${PORT}`);
    console.log('Connect using: telnet localhost 5000');
  });
}