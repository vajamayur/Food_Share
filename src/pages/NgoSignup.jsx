import { useState } from "react";
import { authApi } from "../api/services";

export default function NgoSignup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register({ ...form, role: "NGO" });
      window.location.href = "/ngo-dashboard";
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
      <p className="eyebrow">FoodShare NGO</p>
      <h1>Join as an NGO</h1>
      <p>Your account will be saved with the NGO role.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Organisation name<input required value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(event) => updateField("email", event.target.value)} /></label>
        <label>Password<input type="password" minLength="6" required value={form.password} onChange={(event) => updateField("password", event.target.value)} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create NGO account"}</button>
      </form>
      <p>Already registered? <a href="/login">Sign in</a></p>
    </main>
  );
}