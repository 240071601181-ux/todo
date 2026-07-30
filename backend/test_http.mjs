import { spawn } from 'child_process';
import http from 'http';

const server = spawn('npx', ['tsx', 'src/server.ts'], {
  cwd: 'backend',
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
});

let serverOutput = '';
server.stdout.on('data', (d) => { serverOutput += d.toString(); });
server.stderr.on('data', (d) => { serverOutput += d.toString(); });

await new Promise(r => setTimeout(r, 4000));

function postLogin(email, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Test 1: correct password (I don't know it, so this will 401, not 500)
const r1 = await postLogin('santhosh@gmail.com', 'wrongpassword');
console.log('Test 1 (wrong pw):', r1.status, r1.body);

// Test 2: empty password
try {
  const r2 = await postLogin('santhosh@gmail.com', '');
  console.log('Test 2 (empty pw):', r2.status, r2.body);
} catch(e) { console.log('Test 2 error:', e.message); }

// Test 3: missing fields
try {
  const r3 = await postLogin('', '');
  console.log('Test 3 (empty email):', r3.status, r3.body);
} catch(e) { console.log('Test 3 error:', e.message); }

// Test 4: register then login
const registerData = JSON.stringify({ name: 'Test500', email: 'test500@test.com', password: 'test123456' });
const regReq = http.request({
  hostname: 'localhost', port: 3001, path: '/api/auth/register', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(registerData) },
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', async () => {
    console.log('Register:', res.statusCode, body);
    const r4 = await postLogin('test500@test.com', 'test123456');
    console.log('Test 4 (login after reg):', r4.status, r4.body.substring(0, 200));
    
    server.kill();
    console.log('\n=== SERVER OUTPUT ===');
    console.log(serverOutput);
  });
});
regReq.write(registerData);
regReq.end();