
const http = require('http');
const httpProxy = require('http-proxy');


// These are the addresses of the servers that will do the actual work.
// In a real-world scenario, these would be different machines.
// Here, they are just different ports on your local machine.
const serverAddresses = [
  { host: 'localhost', port: 8001 },
  { host: 'localhost', port: 8002 },
  { host: 'localhost', port: 8003 },
];

// --- 2. CREATE AND START THE BACKEND SERVERS ---

console.log('Starting backend servers...');
serverAddresses.forEach((serverConfig, index) => {
  const serverId = index + 1;
  http.createServer((req, res) => {
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Request was handled by Server ${serverId} at port ${serverConfig.port}`);
    console.log(`[Server ${serverId}] Served a request.`);
  }).listen(serverConfig.port, serverConfig.host, () => {
    console.log(`-> Backend Server ${serverId} is running on http://${serverConfig.host}:${serverConfig.port}`);
  });
});

// --- 3. SETUP THE LOAD BALANCER (PROXY SERVER) ---
const proxy = httpProxy.createProxyServer({});
let currentServerIndex = 0;

console.log('\nStarting load balancer...');
const loadBalancer = http.createServer((req, res) => {
  // --- 4. THE LOAD BALANCING LOGIC (ROUND ROBIN) ---
  

  const target = serverAddresses[currentServerIndex];
  
  console.log(`[Load Balancer] Routing request to Server ${currentServerIndex + 1} (${target.host}:${target.port})`);

  // Forward the incoming request to the selected target server
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` }, (err) => {
    // This callback handles errors, e.g., if a backend server is down.
    console.error(`[Proxy Error] Could not connect to ${target.host}:${target.port}`, err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway: The backend server is not responding.');
  });

  // Update the index for the next request, cycling back to 0 if it reaches the end.
  // This is the "Round Robin" part.
  currentServerIndex = (currentServerIndex + 1) % serverAddresses.length;
});

// --- 5. START THE LOAD BALANCER ---
const balancerPort = 8000;
const balancerHost = 'localhost';
loadBalancer.listen(balancerPort, balancerHost, () => {
  console.log(`-> Load Balancer is running on http://${balancerHost}:${balancerPort}`);
  console.log('\nOpen your browser and navigate to http://localhost:8000. Refresh the page to see the load balancing in action!');
});
