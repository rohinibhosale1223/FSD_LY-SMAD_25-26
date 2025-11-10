const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello from test server!');  
  console.log('Test server received a request');
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});

// Handle any errors
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close the other application or use a different port.`);
  } else {
    console.error('Server error:', e);
  }
  process.exit(1);
});
