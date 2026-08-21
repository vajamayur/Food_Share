/* ==========================================
   FoodShare — Donor dashboard logic
   ========================================== */

let currentUser = null;
let activeFilter = 'all';
let pendingCancelId = null;

document.addEventListener('DOMContentLoaded', () => {
  currentUser = FS.requireAuth('donor');
  if (!currentUser) return;
  fsMountUserChrome(currentUser);
  populateSelects();
  setDefaultExpiry();
  bindTabs();
  bindFilters();
  bindForm();
  renderAll();
});

function populateSelects() {
  const cat = document.getElementById('category');
  cat.innerHTML = FS.CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
  const unit = document.getElementById('unit');
  unit.innerHTML = FS.UNITS.map(u => `<option value="${u}">${u}</option>`).join('');
}

function setDefaultExpiry() {
  const d = new Date(Date.now() + 6 * 3600 * 1000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  document.getElementById('expiryTime').value = d.toISOString().slice(0, 16);
}

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

function bindFilters() {
  document.querySelectorAll('#statusFilters .pill-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#statusFilters .pill-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderDonations();
    });
  });
}

function bindForm() {
  document.getElementById('donationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const foodName = document.getElementById('foodName').value.trim();
    const category = document.getElementById('category').value;
    const quantity = Math.max(1, parseInt(document.getElementById('quantity').value, 10) || 1);
    const unit = document.getElementById('unit').value;
    const expiryTime = document.getElementById('expiryTime').value;
    const pickupAddress = document.getElementById('pickupAddress').value.trim();
    const description = document.getElementById('description').value.trim();

    let valid = true;
    toggleError('foodNameError', !foodName); if (!foodName) valid = false;
    const expiryValid = expiryTime && new Date(expiryTime).getTime() > Date.now();
    toggleError('expiryError', !expiryValid); if (!expiryValid) valid = false;
    toggleError('addressError', !pickupAddress); if (!pickupAddress) valid = false;
    if (!valid) return;

    FS.createDonation({
      donorId: currentUser.id, donorName: currentUser.name,
      foodName, category, quantity, unit,
      expiryTime: new Date(expiryTime).toISOString(),
      pickupAddress, description, status: 'available'
    });

    fsToast('Donation posted — nearby NGOs can now see it.', 'success');
    e.target.reset();
    populateSelects();
    setDefaultExpiry();
    renderAll();
    document.querySelector('.dash-nav a[data-tab="donations"]').click();
    document.querySelector('.pill-filter[data-filter="all"]').click();
  });
}

function toggleError(id, show) { document.getElementById(id).classList.toggle('show', !!show); }

function renderAll() {
  const stats = FS.getDonorStats(currentUser.id);
  document.getElementById('statTotal').textContent = stats.total;
  document.getElementById('statAvailable').textContent = stats.available;
  document.getElementById('statAccepted').textContent = stats.accepted;
  document.getElementById('statMeals').textContent = stats.mealsShared;
  renderDonations();
}

function renderDonations() {
  const all = FS.getDonationsByDonor(currentUser.id);
  const list = activeFilter === 'all' ? all : all.filter(d => d.status === activeFilter);
  const wrap = document.getElementById('myDonations');

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>Nothing here yet</h3>
      <p>${all.length ? 'No donations match this filter.' : 'Post your first donation above and it will show up here.'}</p>
    </div>`;
    return;
  }

  wrap.innerHTML = list.map(d => `
    <div class="donation-card">
      <div class="donation-card-top">
        <div><h3>${fsEscape(d.foodName)}</h3><div class="donation-meta"><span>${fsEscape(d.category)}</span></div></div>
        ${d.status === 'available' ? fsStampHTML(d.expiryTime) : ''}
      </div>
      <div class="donation-meta">
        <span class="mono">${fsEscape(d.quantity)} ${fsEscape(d.unit)}</span>
        <span>📍 ${fsEscape(d.pickupAddress)}</span>
      </div>
      ${d.status !== 'available' && d.ngoName ? `<div class="donation-meta"><span>🤝 ${d.status === 'accepted' ? 'Accepted by' : 'Collected by'} ${fsEscape(d.ngoName)}</span></div>` : ''}
      <div class="donation-card-foot">
        ${fsBadgeHTML(d.status)}
        ${d.status === 'available' ? `<button class="btn btn-danger btn-sm" onclick="openCancelModal('${d.id}')">Cancel</button>` : `<span class="mono" style="font-size:0.78rem; color:var(--text-muted);">${fsFormatDate(d.status === 'completed' ? d.completedAt : d.createdAt)}</span>`}
      </div>
    </div>
  `).join('');
}

function openCancelModal(id) {
  pendingCancelId = id;
  document.getElementById('cancelModal').classList.add('open');
}
function closeCancelModal() {
  pendingCancelId = null;
  document.getElementById('cancelModal').classList.remove('open');
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('confirmCancelBtn').addEventListener('click', () => {
    if (pendingCancelId) {
      FS.cancelDonation(pendingCancelId);
      fsToast('Donation cancelled.', 'error');
      renderAll();
    }
    closeCancelModal();
  });
});
