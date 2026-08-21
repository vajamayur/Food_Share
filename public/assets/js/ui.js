/* ==========================================
   FoodShare — shared UI helpers
   ========================================== */

function fsToast(message, type) {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const el = document.createElement('div');
  el.className = 'toast ' + (type || 'success');
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function fsFormatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function fsInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function fsStampHTML(expiryTime) {
  const level = FS.freshnessLevel(expiryTime);
  const label = FS.freshnessLabel(expiryTime);
  const cls = level === 'ok' ? '' : level === 'expired' ? 'done' : level;
  return `<div class="stamp ${cls}"><span class="stamp-num">${label.num}</span><span class="stamp-unit">${label.unit}</span></div>`;
}

function fsBadgeHTML(status) {
  const labels = { available: 'Available', accepted: 'Accepted', completed: 'Completed', cancelled: 'Cancelled' };
  return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

function fsToggleNav() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}

function fsToggleSidebar() {
  document.querySelector('.dash-sidebar')?.classList.toggle('open');
}

function fsMountUserChrome(user, opts) {
  const nameEl = document.querySelector('[data-user-name]');
  const roleEl = document.querySelector('[data-user-role]');
  const avatarEl = document.querySelector('[data-user-avatar]');
  if (nameEl) nameEl.textContent = user.name;
  const roleLabels = { donor: 'Donor', ngo: user.orgName || 'NGO Partner', admin: 'Administrator', volunteer: 'Volunteer' };
  if (roleEl) roleEl.textContent = roleLabels[user.role] || user.role;
  if (avatarEl) avatarEl.textContent = fsInitials(user.name);
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      const loginPage = { admin: 'admin-login.html', volunteer: 'volunteer-login.html' }[user.role] || 'login.html';
      FS.logout();
      window.location.href = loginPage;
    });
  });
}

function fsEscape(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

/**
 * Fades/slides elements with the `.reveal` class into view as they enter
 * the viewport (see the `.reveal` / `.revealed` keyframes in style.css).
 * Falls back to showing everything immediately if IntersectionObserver
 * isn't available, and respects prefers-reduced-motion via the CSS media
 * query already defined in tokens.css (transitions collapse to ~0s there).
 */
function fsInitScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('revealed'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  items.forEach((el) => observer.observe(el));
}

function fsInjectBrand() {
  document.querySelectorAll('.site-nav').forEach((nav) => {
    const brand = nav.querySelector('.brand');
    if (brand) {
      brand.href = 'index.html';
      const mark = brand.querySelector('.brand-mark');
      if (mark) mark.remove();
      if (!brand.textContent.trim()) {
        brand.textContent = 'FoodShare';
      }
      return;
    }

    const link = document.createElement('a');
    link.className = 'brand';
    link.href = 'index.html';
    link.textContent = 'FoodShare';
    nav.insertBefore(link, nav.firstChild);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fsInitScrollReveal();
  fsInjectBrand();
});
