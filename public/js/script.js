// ---------- REGISTER PAGE ----------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());
    const msg = document.getElementById("registerMessage");

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        msg.textContent = result.message + " Redirecting...";
        msg.className = "message success";
        // Save logged-in user so Dashboard knows who it is
        localStorage.setItem("fixapp_user", JSON.stringify(result.user));
        setTimeout(() => (window.location.href = "/dashboard"), 1000);
      } else {
        msg.textContent = result.message;
        msg.className = "message error";
      }
    } catch (err) {
      msg.textContent = "Something went wrong. Please try again.";
      msg.className = "message error";
    }
  });
}

// ---------- LOGIN PAGE ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    const msg = document.getElementById("loginMessage");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        msg.textContent = result.message;
        msg.className = "message success";
        localStorage.setItem("fixapp_user", JSON.stringify(result.user));
        setTimeout(() => (window.location.href = "/dashboard"), 800);
      } else {
        msg.textContent = result.message;
        msg.className = "message error";
      }
    } catch (err) {
      msg.textContent = "Something went wrong. Please try again.";
      msg.className = "message error";
    }
  });
}

// ---------- DASHBOARD PAGE ----------
const welcomeText = document.getElementById("welcomeText");
if (welcomeText) {
  const user = JSON.parse(localStorage.getItem("fixapp_user") || "null");
  if (!user) {
    window.location.href = "/login"; // must be logged in / registered to view dashboard
  } else {
    welcomeText.textContent = `Hi, ${user.name}`;
  }

  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("fixapp_user");
    window.location.href = "/";
  });

  const modal = document.getElementById("bookingModal");
  const modalTitle = document.getElementById("modalServiceTitle");
  const bookingForm = document.getElementById("bookingForm");
  const bookingsList = document.getElementById("bookingsList");
  let selectedService = "";

  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedService = card.dataset.service;
      modalTitle.textContent = `Book ${selectedService}`;
      document.getElementById("bookingMessage").textContent = "";
      modal.classList.remove("hidden");
    });
  });

  document.getElementById("cancelBooking").addEventListener("click", () => {
    modal.classList.add("hidden");
    bookingForm.reset();
  });

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());
    data.service = selectedService;
    data.username = user.username;
    const msg = document.getElementById("bookingMessage");

    try {
      const res = await fetch("/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        msg.textContent = result.message;
        msg.className = "message success";
        addBookingToList(result.booking);
        setTimeout(() => {
          modal.classList.add("hidden");
          bookingForm.reset();
        }, 900);
      } else {
        msg.textContent = result.message;
        msg.className = "message error";
      }
    } catch (err) {
      msg.textContent = "Booking failed. Please try again.";
      msg.className = "message error";
    }
  });

  function addBookingToList(booking) {
    const li = document.createElement("li");
    li.textContent = `${booking.service} — ${booking.date} at ${booking.time} (${booking.status})`;
    bookingsList.prepend(li);
  }
}
