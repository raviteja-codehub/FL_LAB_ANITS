const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// JSON files act as the database
const read = file => JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf-8'));
const write = (file, data) => fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));
const page = name => (req, res) => res.sendFile(path.join(__dirname, 'public', name));

app.get('/', page('index.html'));
app.get('/register', page('register.html'));
app.get('/login', page('login.html'));

// Register: add new user to users.json
app.post('/register', (req, res) => {
  const { name, age, dob, gender, email, mobile, username, password, address } = req.body;
  if (!name || !email || !username || !password) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }
  const users = read('users.json');
  if (users.find(u => u.username === username || u.email === email)) {
    return res.status(409).json({ success: false, message: 'Username or email already registered' });
  }
  users.push({ name, age, dob, gender, email, mobile, username, password, address });
  write('users.json', users);
  res.json({ success: true, message: 'Registration successful! Redirecting to login...' });
});

// Login: check username/email + password
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = read('users.json').find(
    u => (u.username === username || u.email === username) && u.password === password
  );
  if (!user) return res.status(401).json({ success: false, message: 'Invalid username or password' });
  res.json({ success: true, user: { name: user.name, username: user.username } });
});

// Book a service: add to bookings.json
app.post('/book', (req, res) => {
  const { username, service, date, time, address, notes } = req.body;
  if (!username || !service || !date || !time || !address) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }
  const bookings = read('bookings.json');
  bookings.push({ id: Date.now(), username, service, date, time, address, notes: notes || '', status: 'Booked' });
  write('bookings.json', bookings);
  res.json({ success: true, message: 'Booking confirmed!' });
});

// List bookings of a user (optionally only one service)
app.get('/bookings', (req, res) => {
  const { username, service } = req.query;
  res.json(read('bookings.json').filter(b => b.username === username && (!service || b.service === service)));
});

app.listen(3000, () => console.log('Premium Fix running at http://localhost:3000'));
