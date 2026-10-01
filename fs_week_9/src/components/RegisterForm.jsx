import { useState } from "react";

const empty = { name: "", email: "", phone: "", city: "", password: "", confirm: "", terms: false };

export default function RegisterForm({ onDone }) {
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState({});

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setF({ ...f, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    const e = {};
    if (f.name.trim().length < 3) e.name = "Enter your full name (min 3 letters).";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = "Enter a 10-digit mobile number.";
    if (!f.city) e.city = "Select your city.";
    if (f.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (f.confirm !== f.password) e.confirm = "Passwords do not match.";
    if (!f.terms) e.terms = "Accept the terms to continue.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) onDone(f);
  };

  const Field = ({ name, label, type = "text", ...rest }) => (
    <label>{label}
      <input name={name} type={type} value={f[name]} onChange={change} {...rest} />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </label>
  );

  return (
    <main className="auth">
      <form className="panel" onSubmit={submit} noValidate>
        <h2>Create your account</h2>
        <p className="muted">One account to book, track and cancel services.</p>
        <Field name="name" label="Full name" />
        <Field name="email" label="Email" type="email" />
        <Field name="phone" label="Mobile number" type="tel" maxLength={10} />
        <label>City
          <select name="city" value={f.city} onChange={change}>
            <option value="">Select city</option>
            {["Hyderabad", "Bengaluru", "Chennai", "Mumbai", "Delhi"].map((c) => <option key={c}>{c}</option>)}
          </select>
          {errors.city && <span className="error">{errors.city}</span>}
        </label>
        <Field name="password" label="Password" type="password" />
        <Field name="confirm" label="Confirm password" type="password" />
        <label className="check">
          <input type="checkbox" name="terms" checked={f.terms} onChange={change} />
          I agree to the terms and privacy policy
        </label>
        {errors.terms && <span className="error">{errors.terms}</span>}
        <button className="btn" type="submit">Create account</button>
      </form>
    </main>
  );
}
