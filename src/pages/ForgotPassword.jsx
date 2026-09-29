import { useState } from "react";
import { emailApi } from "../api/services";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function PasswordInput({ value, onChange, placeholder, showPassword, onToggle }) {
  return (
    <div className="password-field">
      <input
        className="input"
        type={showPassword ? "text" : "password"}
        minLength="6"
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        type="button"
        className={`password-toggle-btn ${showPassword ? "is-visible" : ""}`}
        onClick={onToggle}
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
  );
}

export default function ForgotPassword({ mode = "forgot", accountLabel = "FoodShare", loginPath = "/login" }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSendOtp(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    const generatedOtp = generateOtp();
    setIsSending(true);

    try {
      await emailApi.sendPasswordResetOtp({
        email: trimmedEmail,
        otp: generatedOtp,
        accountName: accountLabel
      });

      setOtp(generatedOtp);
      setOtpSent(true);
      setSuccess(`Verification code generated for ${trimmedEmail}.`);
    } catch (requestError) {
      setError(requestError.message || "Could not generate verification code.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!otpSent) {
      setError("Please generate a verification code first.");
      return;
    }

    if (!enteredOtp.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    if (enteredOtp.trim() !== otp) {
      setError("The verification code you entered is incorrect.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setIsUpdating(true);

    try {
      const result = await emailApi.resetPassword({ email, password: newPassword });
      setSuccess(result.message || "Password updated successfully. You can now sign in with your new password.");
      setEmail("");
      setOtp("");
      setEnteredOtp("");
      setNewPassword("");
      setOtpSent(false);
      setShowPassword(false);
    } catch (requestError) {
      setError(requestError.message || "Unable to update password right now.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell auth-shell-compact">
        <aside className="auth-visual auth-visual-alt">
          <div className="auth-visual-badge">Secure access</div>
          <p className="eyebrow eyebrow-light">Account recovery</p>
          <h1>Reset your password safely.</h1>
          <p className="auth-visual-copy">Enter your email to generate a verification code, then create a new password to regain access to your account.</p>

          <ul className="auth-feature-list">
            <li>Instant OTP verification</li>
            <li>Secure password reset</li>
            <li>Quick account recovery</li>
          </ul>
        </aside>

        <section className="auth-form-panel auth-panel-compact">
          <p className="eyebrow">{mode === "reset" ? "Set new password" : "Forgot password"}</p>
          <h2>{otpSent ? "Verify code" : "Recover account"}</h2>
          <p className="auth-intro">
            {otpSent
              ? "Use the verification code generated below and choose your new password."
              : "Enter the email linked to your FoodShare account."}
          </p>

          {!otpSent ? (
            <form className="auth-form auth-form-compact" onSubmit={handleSendOtp}>
              <label>
                Email address
                <input
                  className="input"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                />
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}
              {success && <p className="form-success" role="status">{success}</p>}

              <button className="btn btn-primary btn-block" type="submit" disabled={isSending}>
                {isSending ? "Generating code..." : "Generate OTP"}
              </button>
            </form>
          ) : (
            <form className="auth-form auth-form-compact" onSubmit={handleResetPassword}>
              <div
                style={{
                  background: "var(--surface-sunken, #EDF0E6)",
                  border: "1px solid var(--border, #DEE3D5)",
                  borderRadius: "var(--radius-md, 14px)",
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px"
                }}
              >
                <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted, #445243)", fontWeight: 600 }}>
                  Your Verification Code
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.75rem", letterSpacing: "0.2em", fontWeight: 700, color: "var(--leaf-700, #1F4A28)", fontFamily: "var(--font-mono, monospace)" }}>
                    {otp}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: "0.8rem", padding: "4px 10px", height: "auto" }}
                    onClick={() => setEnteredOtp(otp)}
                  >
                    Auto-fill
                  </button>
                </div>
              </div>

              <label>
                Enter OTP
                <input
                  className="input"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  required
                  value={enteredOtp}
                  onChange={(event) => setEnteredOtp(event.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                />
              </label>

              <label>
                New password
                <PasswordInput
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                  showPassword={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                />
              </label>

              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={() => {
                  const newCode = generateOtp();
                  setOtp(newCode);
                  setEnteredOtp("");
                  setSuccess("New verification code generated.");
                  setError("");
                }}
              >
                Generate New Code
              </button>

              {error && <p className="form-error" role="alert">{error}</p>}
              {success && <p className="form-success" role="status">{success}</p>}

              <button className="btn btn-primary btn-block" type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating password..." : "Update password"}
              </button>
            </form>
          )}

          <div className="auth-footer-links">
            <p>Remembered your password? <a href={loginPath}>Back to sign in</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
