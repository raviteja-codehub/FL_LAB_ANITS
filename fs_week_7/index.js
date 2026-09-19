const express = require('express');
const fs = require('fs');
const os = require('os');
const dns = require('dns');

const app = express();
const getStudents = () => JSON.parse(fs.readFileSync('students.json', 'utf-8'));

// Home page with CSS (kept inside index.js, no extra files)
const page = `
<!DOCTYPE html>
<html>
<head>
  <title>Student Course Management</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f0f2f5; margin: 0; }
    header { background: #4f46e5; color: white; text-align: center; padding: 25px; }
    .box { max-width: 900px; margin: 25px auto; padding: 0 15px; }
    input, button { padding: 10px; font-size: 15px; border-radius: 6px; border: 1px solid #ccc; }
    button { background: #4f46e5; color: white; border: none; cursor: pointer; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-top: 20px; }
    .card { background: white; padding: 18px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
    .card h3 { margin: 0 0 8px; color: #4f46e5; }
    .card p { margin: 4px 0; color: #555; }
    pre { background: white; padding: 15px; border-radius: 10px; }
  </style>
</head>
<body>
  <header><h1>Student Course Management</h1></header>
  <div class="box">
    <input id="course" placeholder="Search by course (e.g. Node.js)">
    <button onclick="load('/search?course=' + document.getElementById('course').value)">Search</button>
    <button onclick="load('/students')">Show All</button>
    <button onclick="info('/system')">System</button>
    <button onclick="info('/dns')">DNS</button>
    <div class="cards" id="out"></div>
  </div>
  <script>
    async function load(url) {
      const data = await (await fetch(url)).json();
      document.getElementById('out').innerHTML = data.map(s =>
        '<div class="card"><h3>' + s.name + '</h3><p>ID: ' + s.id + '</p><p>Course: ' + s.course + '</p><p>Year: ' + s.year + '</p></div>'
      ).join('');
    }
    async function info(url) {
      const data = await (await fetch(url)).json();
      document.getElementById('out').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    }
    load('/students');
  </script>
</body>
</html>`;

app.get('/', (req, res) => res.send(page));

app.get('/students', (req, res) => res.json(getStudents()));

app.get('/students/:id', (req, res) => {
  const s = getStudents().find(s => s.id == req.params.id);
  s ? res.json(s) : res.status(404).send('Student not found');
});

app.get('/search', (req, res) => {
  res.json(getStudents().filter(s => s.course === req.query.course));
});

app.get('/system', (req, res) => {
  res.json({ platform: os.platform(), hostname: os.hostname(), totalMemory: os.totalmem(), freeMemory: os.freemem() });
});

app.get('/dns', (req, res) => {
  dns.lookup('google.com', (err, address) => res.json({ host: 'google.com', address }));
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));