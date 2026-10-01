import { useState } from "react";
import { services } from "./data";
import ServiceCard from "./components/ServiceCard";
import BookingForm from "./components/BookingForm";
import RegisterForm from "./components/RegisterForm";

export default function App() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const addBooking = (b) => {
    setBookings([...bookings, { ...b, id: Date.now() }]);
    setSelected(null);
  };
  const cancel = (id) => setBookings(bookings.filter((b) => b.id !== id));

  return (
    <>
      <header className="nav">
        <h1 className="logo" onClick={() => setPage("home")}>Premium Fix</h1>
        <nav>
          <button className="link" onClick={() => setPage("home")}>Services</button>
          {user ? (
            <span className="hello">Hi, {user.name.split(" ")[0]}</span>
          ) : (
            <button className="btn small" onClick={() => setPage("register")}>Register</button>
          )}
        </nav>
      </header>

      {page === "register" ? (
        <RegisterForm onDone={(u) => { setUser(u); setPage("home"); }} />
      ) : (
        <main>
          <section className="hero">
            <h2>Something broke? Book a verified pro in minutes.</h2>
            <p>Plumbing, cleaning, laundry and electrical work at your door, with fixed prices.</p>
          </section>

          <section className="grid">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} onBook={() => setSelected(s)} />
            ))}
          </section>

          <section className="mybookings">
            <h3>My bookings</h3>
            {bookings.length === 0 ? (
              <p className="muted">Nothing booked yet. Pick a service above to get started.</p>
            ) : (
              bookings.map((b) => (
                <div className="row" key={b.id}>
                  <div>
                    <strong>{b.service}</strong>
                    <div className="muted">{b.date} at {b.slot} · {b.address}</div>
                  </div>
                  <button className="link danger" onClick={() => cancel(b.id)}>Cancel</button>
                </div>
              ))
            )}
          </section>
        </main>
      )}

      {selected && (
        <BookingForm
          service={selected}
          user={user}
          onClose={() => setSelected(null)}
          onRegister={() => { setSelected(null); setPage("register"); }}
          onConfirm={addBooking}
        />
      )}
    </>
  );
}
