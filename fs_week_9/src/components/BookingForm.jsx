import { useState } from "react";
import { slots } from "../data";

export default function BookingForm({ service, user, onClose, onRegister, onConfirm }) {
  const [f, setF] = useState({ date: "", slot: slots[0], address: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!f.date || f.address.trim().length < 6) {
      setErr("Choose a date and enter your full address.");
      return;
    }
    onConfirm({ ...f, service: service.name });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Book {service.name}</h3>
        {!user ? (
          <>
            <p className="muted">Create an account first so we can confirm your booking.</p>
            <button className="btn" onClick={onRegister}>Register now</button>
          </>
        ) : (
          <form onSubmit={submit} noValidate>
            <label>Date
              <input type="date" value={f.date} min={new Date().toISOString().split("T")[0]} onChange={set("date")} />
            </label>
            <label>Time slot
              <select value={f.slot} onChange={set("slot")}>
                {slots.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Address
              <textarea rows="2" value={f.address} onChange={set("address")} placeholder="House no, street, area" />
            </label>
            {err && <p className="error">{err}</p>}
            <button className="btn" type="submit">Confirm booking</button>
          </form>
        )}
        <button className="link" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
