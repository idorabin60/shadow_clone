const fetch = require('node-fetch');
// node fetch requires installing or we can use native http
const http = require('http');

const postData = JSON.stringify({
    businessName: "Test Run",
    description: "Write a complete chat application clone"
});

const req = http.request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/orchestrate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log("Response:", body);
        const { sandboxId } = JSON.parse(body);
        
        http.get(`http://localhost:4000/api/orchestrate/stream/${sandboxId}`, (streamRes) => {
            streamRes.on('data', chunk => process.stdout.write(chunk));
        });
    });
});
req.write(postData);
req.end();
