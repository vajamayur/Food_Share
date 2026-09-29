import { useState } from "react";
import { authApi, dashboardPathForRole } from "../api/services";

export default function Login({
  title = "FoodShare account",
  heading = "Welcome back",
  intro = "Sign in to manage donations and requests.",
  forgotPasswordHref = "/forgot-password",
  secondaryLink = { label: "Admin?", href: "/admin-login", text: "Admin sign in" }
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.login(form);
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
        <aside className="auth-visual">
          <div className="auth-visual-badge">FoodShare</div>
          <p className="eyebrow eyebrow-light">Community care</p>
          <h1>Share food. Create impact.</h1>
          <p className="auth-visual-copy">Track donations, coordinate requests and support local families with a more connected food network.</p>

          <div className="auth-stats-grid">
            <div className="auth-stat-card">
              <strong>2,480</strong>
              <span>Meals matched</span>
            </div>
            <div className="auth-stat-card">
              <strong>96%</strong>
              <span>Pickup success</span>
            </div>
          </div>

          <ul className="auth-feature-list">
            <li>Live donation board</li>
            <li>Volunteer coordination</li>
            <li>Secure request tracking</li>
          </ul>
        </aside>

        <section className="auth-form-panel">
          <p className="eyebrow">{title}</p>
          <h2>{heading}</h2>
          <p className="auth-intro">{intro}</p>

          <form className="auth-form" onSubmit={handleSubmit}>
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
                  required
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Enter your password"
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

            <div className="auth-meta-row">
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a className="auth-subtle-link" href={forgotPasswordHref}>Forgot password?</a>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
          </form>

          <div className="auth-footer-links">
            <p>New to FoodShare? <a href="/signup">Create an account</a></p>
            <p>{secondaryLink.label} <a href={secondaryLink.href}>{secondaryLink.text}</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
