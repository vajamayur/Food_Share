import { useState } from "react";
import { authApi, dashboardPathForRole } from "../api/services";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="auth-page container-narrow">
      <p className="eyebrow">FoodShare account</p>
      <h1>Welcome back</h1>
      <p>Sign in to manage donations and requests.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Password<input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>
      <p>New to FoodShare? <a href="/signup">Create an account</a></p>
      <p>Admin? <a href="/admin-login">Admin sign in</a></p>
    </main>
  );
}
