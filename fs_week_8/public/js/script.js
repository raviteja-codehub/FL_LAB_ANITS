const SERVICES = [
  { id: 'plumber', name: 'Plumber', icon: '🔧', desc: 'Leaks, taps, pipes & fittings' },
  { id: 'electrician', name: 'Electrician', icon: '⚡', desc: 'Wiring, switches, fans & lights' },
  { id: 'salon', name: 'Home Salon', icon: '💇', desc: 'Haircut, facial & grooming at home' },
  { id: 'makeup', name: 'Home Makeup', icon: '💄', desc: 'Party & bridal makeup artists' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', desc: 'Deep cleaning for home & kitchen' },
  { id: 'laundry', name: 'Laundry', icon: '🧺', desc: 'Wash, dry & iron pickup service' }
];

const user = JSON.parse(localStorage.getItem('user') || 'null');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const serviceName = id => (SERVICES.find(s => s.id === id) || { name: id }).name;

async function post(url, data) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return r.json();
}

function showMsg(r) {
  const msg = document.getElementById('msg');
  msg.className = 'msg ' + (r.success ? 'ok' : 'error');
  msg.innerText = r.message;
}

function logout() { localStorage.removeItem('user'); location.href = 'login.html'; }
function requireLogin() { if (!user) { location.href = 'login.html'; return false; } return true; }

function renderNav() {
  const links = user
    ? '<a href="dashboard.html">Dashboard</a><a href="#" onclick="logout()">Logout</a>'
    : '<a href="register.html">Register</a><a href="login.html">Login</a>';
  document.getElementById('nav').innerHTML =
    '<a class="brand" href="index.html">Premium<span>Fix</span></a><div><a href="index.html">Home</a>' + links + '</div>';
}

function showServices(id) {
  document.getElementById(id).innerHTML = SERVICES.map(s =>
    '<a class="service" href="service.html?type=' + s.id + '"><div class="icon">' + s.icon + '</div><h4>' + s.name + '</h4><p>' + s.desc + '</p></a>'
  ).join('');
}

async function loadBookings(id, service) {
  const url = '/bookings?username=' + encodeURIComponent(user.username) + (service ? '&service=' + service : '');
  const list = (await (await fetch(url)).json()).reverse();
  document.getElementById(id).innerHTML = list.length ? list.map(b =>
    '<div class="booking"><span class="tag">' + esc(b.status) + '</span><b>' + esc(serviceName(b.service)) + '</b><br>' +
    esc(b.date) + ' at ' + esc(b.time) + '<br>' + esc(b.address) + (b.notes ? '<br><i>' + esc(b.notes) + '</i>' : '') + '</div>'
  ).join('') : '<p>No bookings yet.</p>';
}

renderNav();
if (document.getElementById('services')) showServices('services');

// Register page
const regForm = document.getElementById('registerForm');
if (regForm) regForm.addEventListener('submit', async e => {
  e.preventDefault();
  const r = await post('/register', Object.fromEntries(new FormData(regForm)));
  showMsg(r);
  if (r.success) setTimeout(() => location.href = 'login.html', 1200);
});

// Login page
const loginForm = document.getElementById('loginForm');
if (loginForm) loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const r = await post('/login', Object.fromEntries(new FormData(loginForm)));
  if (r.success) {
    localStorage.setItem('user', JSON.stringify(r.user));
    location.href = 'dashboard.html';
  } else showMsg(r);
});

// Dashboard page
if (document.getElementById('welcome') && requireLogin()) {
  document.getElementById('welcome').innerText = 'Welcome, ' + user.name + '!';
  loadBookings('list');
}

// Service booking page
const bookForm = document.getElementById('bookForm');
if (bookForm && requireLogin()) {
  const svc = SERVICES.find(s => s.id === new URLSearchParams(location.search).get('type')) || SERVICES[0];
  document.getElementById('title').innerText = svc.icon + ' Book ' + svc.name;
  document.getElementById('desc').innerText = svc.desc;
  document.getElementById('date').min = new Date().toISOString().split('T')[0];
  loadBookings('list', svc.id);
  bookForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(bookForm));
    const r = await post('/book', { ...data, username: user.username, service: svc.id });
    showMsg(r);
    if (r.success) { bookForm.reset(); loadBookings('list', svc.id); }
  });
}
