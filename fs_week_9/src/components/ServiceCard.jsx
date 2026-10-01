export default function ServiceCard({ service, onBook }) {
  return (
    <article className="card">
      <div className="icon">{service.icon}</div>
      <h3>{service.name}</h3>
      <p className="muted">{service.desc}</p>
      <div className="meta">
        <span>From ₹{service.price}</span>
        <span>{service.time}</span>
      </div>
      <button className="btn" onClick={onBook}>Book {service.name}</button>
    </article>
  );
}
