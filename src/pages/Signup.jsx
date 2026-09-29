import { useState } from "react";
import { authApi, dashboardPathForRole } from "../api/services";

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "DONOR" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-visual auth-visual-alt">
          <div className="auth-visual-badge">FoodShare</div>
          <p className="eyebrow eyebrow-light">Join the network</p>
          <h1>Build a stronger local food ecosystem.</h1>
          <p className="auth-visual-copy">Whether you donate, volunteer or coordinate support, your time and resources can help keep surplus food in motion.</p>

          <div className="auth-stats-grid">
            <div className="auth-stat-card">
              <strong>400+</strong>
              <span>Active partners</span>
            </div>
            <div className="auth-stat-card">
              <strong>24/7</strong>
              <span>Request visibility</span>
            </div>
          </div>

          <ul className="auth-feature-list">
            <li>Smart food matching</li>
            <li>Volunteer scheduling</li>
            <li>Donor impact tracking</li>
          </ul>
        </aside>

        <section className="auth-form-panel">
          <p className="eyebrow">Create account</p>
          <h2>Get started</h2>
          <p className="auth-intro">Your details are secure and only used to connect you with local food needs.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input className="input" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="Your full name" />
            </label>
            <label>
              Email
              <input className="input" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  minLength="6"
                  required
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className={`password-toggle-btn ${showPassword ? "is-visible" : ""}`}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg className="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg className="icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                    <path d="M9.1 5.5A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-4 5.3" />
                    <path d="M6.2 6.2A16.6 16.6 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 5.2-1.3" />
                  </svg>
                </button>
              </div>
            </label>
            <label>
              Account type
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option value="DONOR">Donor</option>
                <option value="NGO">NGO</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
          </form>

          <div className="auth-footer-links">
            <p>Already registered? <a href="/login">Sign in</a></p>
            <p>Admin account? <a href="/admin-signup">Use admin signup</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
