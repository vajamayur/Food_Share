import { useState } from "react";
import { authApi, dashboardPathForRole } from "../api/services";

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "DONOR" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.register(form);
      window.location.href = dashboardPathForRole(response.role);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page container-narrow">
      <p className="eyebrow">Join the network</p>
      <h1>Create your account</h1>
      <p>Your details will be stored securely by the FoodShare backend.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Full name<input required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Password<input type="password" minLength="6" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <label>Account type<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="DONOR">Donor</option><option value="NGO">NGO</option><option value="VOLUNTEER">Volunteer</option><option value="ADMIN">Admin</option></select></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
      </form>
      <p>Already registered? <a href="/login">Sign in</a></p>
      <p>Admin account? <a href="/admin-signup">Use admin signup</a></p>
    </main>
  );
}
