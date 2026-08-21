/* ==========================================
   FoodShare — NGO dashboard logic
   ========================================== */

let ngoUser = null;
let activeCategory = 'all';
let activeMineFilter = 'all';
let pendingAcceptId = null;

document.addEventListener('DOMContentLoaded', () => {
  ngoUser = FS.requireAuth('ngo');
  if (!ngoUser) return;
  fsMountUserChrome(ngoUser);
  bindTabs();
  buildCategoryFilters();
  bindMineFilters();
  document.getElementById('confirmAcceptBtn').addEventListener('click', confirmAccept);
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

function buildCategoryFilters() {
  const wrap = document.getElementById('categoryFilters');
  FS.CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'pill-filter';
    btn.dataset.filter = cat;
    btn.textContent = cat;
    wrap.appendChild(btn);
  });
  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-filter');
    if (!btn) return;
    wrap.querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.filter;
    renderBoard();
  });
}

function bindMineFilters() {
  document.getElementById('mineFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-filter');
    if (!btn) return;
    document.querySelectorAll('#mineFilters .pill-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeMineFilter = btn.dataset.filter;
    renderMine();
  });
}

function renderAll() {
  const stats = FS.getNgoStats(ngoUser.id);
  document.getElementById('statAvailable').textContent = stats.available;
  document.getElementById('statAccepted').textContent = stats.accepted;
  document.getElementById('statCompleted').textContent = stats.completed;
  document.getElementById('statMeals').textContent = stats.mealsRescued;
  renderBoard();
  renderMine();
}

function renderBoard() {
  let list = FS.getAvailableDonations();
  if (activeCategory !== 'all') list = list.filter(d => d.category === activeCategory);
  const wrap = document.getElementById('board');

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>Board is clear</h3><p>No surplus food matches this filter right now — check back soon.</p>
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
      <p style="color:var(--text-muted); margin:0; font-size:0.88rem;">${fsEscape(d.description || 'No extra notes from the donor.')}</p>
      <div class="donation-card-foot">
        <span style="font-size:0.8rem; color:var(--text-muted);">From ${fsEscape(d.donorName)}</span>
        <button class="btn btn-primary btn-sm" onclick="openAcceptModal('${d.id}')">Accept</button>
      </div>
    </div>
  `).join('');
}

function renderMine() {
  let list = FS.getDonationsByNgo(ngoUser.id);
  if (activeMineFilter !== 'all') list = list.filter(d => d.status === activeMineFilter);
  const wrap = document.getElementById('myCollections');

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>Nothing collected yet</h3><p>Accept a donation from the surplus board to see it here.</p>
    </div>`;
    return;
  }

  wrap.innerHTML = list.map(d => `
    <div class="donation-card">
      <div class="donation-card-top">
        <div><h3>${fsEscape(d.foodName)}</h3><div class="donation-meta"><span>${fsEscape(d.category)}</span></div></div>
        ${d.status === 'accepted' ? fsStampHTML(d.expiryTime) : ''}
      </div>
      <div class="donation-meta">
        <span class="mono">${fsEscape(d.quantity)} ${fsEscape(d.unit)}</span>
        <span>📍 ${fsEscape(d.pickupAddress)}</span>
      </div>
      <div class="donation-meta"><span>From ${fsEscape(d.donorName)}</span></div>
      <div class="donation-card-foot">
        ${fsBadgeHTML(d.status)}
        ${d.status === 'accepted' ? `<button class="btn btn-secondary btn-sm" onclick="confirmReceived('${d.id}')">Confirm received</button>` : `<span class="mono" style="font-size:0.78rem; color:var(--text-muted);">${fsFormatDate(d.completedAt)}</span>`}
      </div>
    </div>
  `).join('');
}

function openAcceptModal(id) {
  pendingAcceptId = id;
  document.getElementById('acceptModal').classList.add('open');
}
function closeAcceptModal() {
  pendingAcceptId = null;
  document.getElementById('acceptModal').classList.remove('open');
}
function confirmAccept() {
  if (pendingAcceptId) {
    FS.acceptDonation(pendingAcceptId, ngoUser);
    fsToast('Donation accepted — head over to collect it.', 'success');
    renderAll();
  }
  closeAcceptModal();
}

function confirmReceived(id) {
  FS.confirmReceived(id);
  fsToast('Marked as received. Thanks for closing the loop!', 'success');
  renderAll();
}
