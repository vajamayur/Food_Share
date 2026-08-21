/* ==========================================
   FoodShare — Admin dashboard logic
   ========================================== */

let adminUser = null;
let activeRoleFilter = 'all';
let activeStatusFilter = 'all';
let userSearchTerm = '';

const ROLE_LABELS = { donor: 'Donor', ngo: 'NGO', admin: 'Admin', volunteer: 'Volunteer' };

document.addEventListener('DOMContentLoaded', () => {
  adminUser = FS.requireAuth('admin');
  if (!adminUser) return;
  fsMountUserChrome(adminUser);
  bindTabs();
  bindRoleFilters();
  bindStatusFilters();
  bindUserSearch();
  renderAll();
});

function bindTabs() {
  document.querySelectorAll('.dash-nav a[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.dash-nav a[data-tab]').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('[data-panel]').forEach(p => p.style.display = 'none');
      document.querySelector(`[data-panel="${link.dataset.tab}"]`).style.display = 'block';
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function bindRoleFilters() {
  document.getElementById('roleFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-filter');
    if (!btn) return;
    document.querySelectorAll('#roleFilters .pill-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeRoleFilter = btn.dataset.filter;
    renderUsers();
  });
}

function bindStatusFilters() {
  document.getElementById('statusFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-filter');
    if (!btn) return;
    document.querySelectorAll('#statusFilters .pill-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeStatusFilter = btn.dataset.filter;
    renderDonations();
  });
}

function bindUserSearch() {
  document.getElementById('userSearch').addEventListener('input', (e) => {
    userSearchTerm = e.target.value.trim().toLowerCase();
    renderUsers();
  });
}

function renderAll() {
  const stats = FS.getAdminStats();
  document.getElementById('statUsers').textContent = stats.totalUsers;
  document.getElementById('statDonations').textContent = stats.totalDonations;
  document.getElementById('statCompleted').textContent = stats.completed;
  document.getElementById('statMeals').textContent = stats.mealsShared;
  document.getElementById('chipDonors').textContent = stats.donors + ' Donors';
  document.getElementById('chipNgos').textContent = stats.ngos + ' NGOs';
  document.getElementById('chipVolunteers').textContent = stats.volunteers + ' Volunteers';
  document.getElementById('chipAdmins').textContent = stats.admins + ' Admins';
  document.getElementById('statAvailable').textContent = stats.available;
  document.getElementById('statAccepted').textContent = stats.accepted;
  document.getElementById('statCompleted2').textContent = stats.completed;
  document.getElementById('statCancelled').textContent = stats.cancelled;
  renderUsers();
  renderDonations();
}

function renderUsers() {
  let list = FS.getUsers();
  if (activeRoleFilter !== 'all') list = list.filter(u => u.role === activeRoleFilter);
  if (userSearchTerm) {
    list = list.filter(u => u.name.toLowerCase().includes(userSearchTerm) || u.email.toLowerCase().includes(userSearchTerm));
  }
  const wrap = document.getElementById('userList');

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>No users found</h3><p>Try a different search term or role filter.</p>
    </div>`;
    return;
  }

  wrap.innerHTML = list.map(u => `
    <div class="donation-card">
      <div class="donation-card-top">
        <div><h3>${fsEscape(u.name)}</h3><div class="donation-meta"><span class="mono">${fsEscape(u.email)}</span></div></div>
      </div>
      <div class="donation-meta">
        ${u.orgName ? `<span>${fsEscape(u.orgName)}</span>` : ''}
        ${u.phone ? `<span>📞 ${fsEscape(u.phone)}</span>` : ''}
      </div>
      <div class="donation-card-foot">
        <span class="badge badge-available">${ROLE_LABELS[u.role] || u.role}</span>
        <span class="mono" style="font-size:0.78rem; color:var(--text-muted);">${fsFormatDate(u.createdAt)}</span>
      </div>
    </div>
  `).join('');
}

function renderDonations() {
  let list = FS.getDonations().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (activeStatusFilter !== 'all') list = list.filter(d => d.status === activeStatusFilter);
  const wrap = document.getElementById('donationList');

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>No donations found</h3><p>Try a different status filter.</p>
    </div>`;
    return;
  }

  wrap.innerHTML = list.map(d => `
    <div class="donation-card">
      <div class="donation-card-top">
        <div><h3>${fsEscape(d.foodName)}</h3><div class="donation-meta"><span>${fsEscape(d.category)}</span></div></div>
        ${d.status === 'available' || d.status === 'accepted' ? fsStampHTML(d.expiryTime) : ''}
      </div>
      <div class="donation-meta">
        <span class="mono">${fsEscape(d.quantity)} ${fsEscape(d.unit)}</span>
        <span>📍 ${fsEscape(d.pickupAddress)}</span>
      </div>
      <div class="donation-meta">
        <span>From ${fsEscape(d.donorName)}</span>
        ${d.ngoName ? `<span>→ ${fsEscape(d.ngoName)}</span>` : ''}
        ${d.volunteerName ? `<span>🚲 ${fsEscape(d.volunteerName)}</span>` : ''}
      </div>
      <div class="donation-card-foot">
        ${fsBadgeHTML(d.status)}
        ${(d.status === 'available' || d.status === 'accepted') ? `<button class="btn btn-danger btn-sm" onclick="adminCancel('${d.id}')">Cancel</button>` : `<span class="mono" style="font-size:0.78rem; color:var(--text-muted);">${fsFormatDate(d.completedAt || d.cancelledAt || d.createdAt)}</span>`}
      </div>
    </div>
  `).join('');
}

function adminCancel(id) {
  FS.cancelDonation(id);
  fsToast('Donation cancelled by admin.', 'error');
  renderAll();
}
