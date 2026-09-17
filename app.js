const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const USERS_FILE = path.join(__dirname, "users.json");
const BOOKINGS_FILE = path.join(__dirname, "bookings.json");

// Helper: read a JSON file safely (returns [] if empty/missing)
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  const data = fs.readFileSync(file, "utf-8");
  return data ? JSON.parse(data) : [];
}

// Helper: write data back to a JSON file
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ---------- PAGE ROUTES ---------- */
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));

/* ---------- REGISTER ---------- */
app.post("/register", (req, res) => {
  const users = readJSON(USERS_FILE);
  const { name, age, dob, gender, email, mobile, username, password, address } = req.body;

  if (!name || !username || !password || !email) {
    return res.status(400).json({ success: false, message: "Please fill all required fields." });
  }

  const alreadyExists = users.find((u) => u.username === username || u.email === email);
  if (alreadyExists) {
    return res.status(400).json({ success: false, message: "Username or Email already registered." });
  }

  // Save the new user WITHOUT deleting old ones
  const newUser = { name, age, dob, gender, email, mobile, username, password, address };
  users.push(newUser);
  writeJSON(USERS_FILE, users);

  res.json({ success: true, message: "Registration successful!", user: { name, username } });
});

/* ---------- LOGIN ---------- */
app.post("/login", (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const users = readJSON(USERS_FILE);

  const user = users.find(
    (u) => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  );

  if (user) {
    res.json({ success: true, message: "Login successful!", user: { name: user.name, username: user.username } });
  } else {
    res.status(401).json({ success: false, message: "Invalid username/email or password." });
  }
});

/* ---------- BOOK A SERVICE ---------- */
app.post("/book", (req, res) => {
  const { username, service, date, time, address } = req.body;
  if (!username || !service) {
    return res.status(400).json({ success: false, message: "Missing booking details." });
  }
  const bookings = readJSON(BOOKINGS_FILE);
  const booking = { id: Date.now(), username, service, date, time, address, status: "Confirmed" };
  bookings.push(booking);
  writeJSON(BOOKINGS_FILE, bookings);
  res.json({ success: true, message: `${service} booked successfully!`, booking });
});

app.listen(PORT, () => {
  console.log(`FixApp server running at http://localhost:${PORT}`);
});
