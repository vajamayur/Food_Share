import { useState } from "react";
import { authApi } from "../api/services";

export default function VolunteerSignup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register({ ...form, role: "VOLUNTEER" });
      window.location.href = "/volunteer-dashboard";
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="auth-page container-narrow">
      <p className="eyebrow">FoodShare volunteer</p>
      <h1>Join as a volunteer</h1>
      <p>Your account will be saved with the Volunteer role.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Full name<input required value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(event) => updateField("email", event.target.value)} /></label>
        <label>Password<input type="password" minLength="6" required value={form.password} onChange={(event) => updateField("password", event.target.value)} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create volunteer account"}</button>
      </form>
      <p>Already registered? <a href="/volunteer-login">Sign in</a></p>
    </main>
  );
}
