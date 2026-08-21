/* ==========================================
   FoodShare — Auth page helpers
   Shared by: login, signup, admin-login, admin-signup,
   volunteer-login, volunteer-signup, forgot-password, reset-password.
   Include AFTER data.js and ui.js.
   ========================================== */

/**
 * Wires up every "show/hide password" button on the page.
 * Markup contract: a button with [data-toggle-password="<inputId>"]
 * sitting next to the password <input id="<inputId>">.
 */
function fsInitPasswordToggles(root) {
  (root || document).querySelectorAll('[data-toggle-password]').forEach((btn) => {
    // Avoid double-binding if this is called more than once on the same page.
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    const input = document.getElementById(btn.getAttribute('data-toggle-password'));
    if (!input) return;

    btn.setAttribute('aria-label', 'Show password');
    btn.setAttribute('aria-pressed', 'false');

    btn.addEventListener('click', () => {
      const nowVisible = input.type === 'password';
      input.type = nowVisible ? 'text' : 'password';
      btn.classList.toggle('is-visible', nowVisible);
      btn.setAttribute('aria-label', nowVisible ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', String(nowVisible));
      // Keep focus on the field the user was typing into, not the button.
      input.focus({ preventScroll: true });
    });
  });
}

/**
 * Wires up placeholder social-login buttons (Google / GitHub / etc).
 * These are intentionally non-functional — no OAuth app is configured for
 * this demo — but they give a real click target and honest feedback
 * instead of silently doing nothing, and are trivial to replace with a
 * real `window.location.href = '/api/auth/google'`-style redirect later.
 */
function fsInitSocialButtons(root) {
  (root || document).querySelectorAll('[data-social]').forEach((btn) => {
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-social') || 'Social';
      fsToast(`${provider} sign-in is a placeholder — connect an OAuth app to enable it.`, 'info');
    });
  });
}

/** Simple RFC-5322-ish email check, good enough for client-side validation. */
function fsIsValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

/** Requires at least 7 digits once non-digit characters are stripped. */
function fsIsValidPhone(value) {
  return String(value || '').replace(/\D/g, '').length >= 7;
}

/**
 * Scores a password 0–4 across four checks (length, upper, lower, number/symbol).
 * Used to drive the visual strength meter on signup / reset forms.
 */
function fsPasswordStrength(password) {
  const value = String(password || '');
  const checks = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    numberOrSymbol: /[0-9\W]/.test(value),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  return { checks, score, label: labels[value.length ? score : 0] };
}

/**
 * Renders a strength meter into `meterEl` (expects `.strength-meter` markup,
 * see auth.css) and returns whether the password meets the minimum bar
 * (6+ characters, matching the existing signup.html minlength rule).
 */
function fsRenderPasswordStrength(password, meterEl) {
  if (!meterEl) return true;
  const { score, label } = fsPasswordStrength(password);
  const bars = meterEl.querySelectorAll('.strength-bar');
  bars.forEach((bar, i) => {
    bar.classList.toggle('filled', i < score);
    bar.dataset.level = String(score);
  });
  const labelEl = meterEl.querySelector('.strength-label');
  if (labelEl) labelEl.textContent = password ? label : '';
  return password.length >= 6;
}

/** Toggles an error message element and matching aria-invalid on its input. */
function fsSetFieldError(inputId, errorId, show) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (error) error.classList.toggle('show', !!show);
  if (input) input.setAttribute('aria-invalid', show ? 'true' : 'false');
}

document.addEventListener('DOMContentLoaded', () => {
  fsInitPasswordToggles();
  fsInitSocialButtons();
});
