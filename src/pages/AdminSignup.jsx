import { useState } from "react";
import { authApi } from "../api/services";

export default function AdminSignup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register({ ...form, role: "ADMIN" });
      window.location.href = "/admin-dashboard";
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
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-visual auth-visual-alt">
          <div className="auth-visual-badge">Admin access</div>
          <p className="eyebrow eyebrow-light">FoodShare administration</p>
          <h1>Power the next wave of local impact.</h1>
          <p className="auth-visual-copy">Create a secure admin account to monitor activity, coordinate teams, and guide food distribution decisions across the network.</p>

          <div className="auth-stats-grid">
            <div className="auth-stat-card">
              <strong>12k</strong>
              <span>Actions reviewed</span>
            </div>
            <div className="auth-stat-card">
              <strong>99.9%</strong>
              <span>Platform uptime</span>
            </div>
          </div>

          <ul className="auth-feature-list">
            <li>Live operational insights</li>
            <li>Team oversight</li>
            <li>Trusted account controls</li>
          </ul>
        </aside>

        <section className="auth-form-panel">
          <p className="eyebrow">Create admin account</p>
          <h2>Admin sign up</h2>
          <p className="auth-intro">Your account will be saved with the Admin role.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input required value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Your full name" />
            </label>
            <label>
              Email
              <input type="email" required value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="admin@foodshare.org" />
            </label>
            <label>
              Password
              <input type="password" minLength="6" required value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Create a secure password" />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create admin account"}</button>
          </form>

          <div className="auth-footer-links">
            <p>Already registered? <a href="/admin-login">Sign in</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
