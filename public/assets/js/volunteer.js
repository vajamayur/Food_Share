/* ==========================================
   FoodShare — Volunteer dashboard logic
   ========================================== */

let volUser = null;

document.addEventListener('DOMContentLoaded', () => {
  volUser = FS.requireAuth('volunteer');
  if (!volUser) return;
  fsMountUserChrome(volUser);
  bindTabs();
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

function renderAll() {
  const stats = FS.getVolunteerStats(volUser.id);
  document.getElementById('statOpen').textContent = stats.openTasks;
  document.getElementById('statClaimed').textContent = stats.claimed;
  document.getElementById('statCompleted').textContent = stats.completed;
  document.getElementById('statMeals').textContent = stats.mealsMoved;
  renderAvailable();
  renderMine();
  renderHistory();
}

function renderAvailable() {
  const list = FS.getDeliverableDonations();
  const wrap = document.getElementById('availableList');

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>No pickups waiting</h3><p>Every accepted donation already has a volunteer assigned — check back soon.</p>
    </div>`;
    return;
  }

  wrap.innerHTML = list.map(d => `
    <div class="donation-card">
      <div class="donation-card-top">
        <div><h3>${fsEscape(d.foodName)}</h3><div class="donation-meta"><span>${fsEscape(d.category)}</span></div></div>
        ${fsStampHTML(d.expiryTime)}
      </div>
      <div class="donation-meta">
        <span class="mono">${fsEscape(d.quantity)} ${fsEscape(d.unit)}</span>
        <span>📍 ${fsEscape(d.pickupAddress)}</span>
      </div>
      <div class="donation-meta">
        <span>From ${fsEscape(d.donorName)}</span>
        <span>→ ${fsEscape(d.ngoName)}</span>
      </div>
      <div class="donation-card-foot">
        <span style="font-size:0.8rem; color:var(--text-muted);">Ready now</span>
        <button class="btn btn-primary btn-sm" onclick="claimTask('${d.id}')">Claim delivery</button>
      </div>
    </div>
  `).join('');
}

function renderMine() {
  const list = FS.getDonationsByVolunteer(volUser.id).filter(d => d.status === 'accepted');
  const wrap = document.getElementById('mineList');

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>No active deliveries</h3><p>Claim a pickup from the "Available pickups" tab to see it here.</p>
    </div>`;
    return;
  }

  wrap.innerHTML = list.map(d => `
    <div class="donation-card">
      <div class="donation-card-top">
        <div><h3>${fsEscape(d.foodName)}</h3><div class="donation-meta"><span>${fsEscape(d.category)}</span></div></div>
        ${fsStampHTML(d.expiryTime)}
      </div>
      <div class="donation-meta">
        <span class="mono">${fsEscape(d.quantity)} ${fsEscape(d.unit)}</span>
        <span>📍 ${fsEscape(d.pickupAddress)}</span>
      </div>
      <div class="donation-meta">
        <span>From ${fsEscape(d.donorName)}</span>
        <span>→ ${fsEscape(d.ngoName)}</span>
      </div>
      <div class="donation-card-foot">
        <button class="link-btn" onclick="releaseTask('${d.id}')">Release task</button>
        <button class="btn btn-secondary btn-sm" onclick="deliverTask('${d.id}')">Mark delivered</button>
      </div>
    </div>
  `).join('');
}

function renderHistory() {
  const list = FS.getDonationsByVolunteer(volUser.id).filter(d => d.status === 'completed');
  const wrap = document.getElementById('historyList');

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>Nothing delivered yet</h3><p>Completed deliveries will show up here for your records.</p>
    </div>`;
    return;
  }

  wrap.innerHTML = list.map(d => `
    <div class="donation-card">
      <div class="donation-card-top">
        <div><h3>${fsEscape(d.foodName)}</h3><div class="donation-meta"><span>${fsEscape(d.category)}</span></div></div>
      </div>
      <div class="donation-meta">
        <span>From ${fsEscape(d.donorName)}</span>
        <span>→ ${fsEscape(d.ngoName)}</span>
      </div>
      <div class="donation-card-foot">
        ${fsBadgeHTML(d.status)}
        <span class="mono" style="font-size:0.78rem; color:var(--text-muted);">${fsFormatDate(d.completedAt)}</span>
      </div>
    </div>
  `).join('');
}

function claimTask(id) {
  FS.claimDelivery(id, volUser);
  fsToast('Delivery claimed — head out when ready.', 'success');
  renderAll();
}

function releaseTask(id) {
  FS.releaseDelivery(id);
  fsToast('Task released back to the pool.', 'success');
  renderAll();
}

function deliverTask(id) {
  FS.markDelivered(id);
  fsToast('Marked as delivered — thank you!', 'success');
  renderAll();
}
