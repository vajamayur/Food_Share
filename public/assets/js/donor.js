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
  mountPaymentPanel();
  populateSelects();
  setDefaultExpiry();
  bindTabs();
  bindFilters();
  bindForm();
  bindPaymentForm();
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
      if (link.dataset.tab === 'payments') loadPaymentHistory();
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function mountPaymentPanel() {
  const nav = document.querySelector('.dash-nav');
  const overview = document.querySelector('[data-panel="overview"]');
  if (!nav || !overview) return;

  const paymentTab = document.createElement('li');
  paymentTab.innerHTML = '<a data-tab="payments" href="#payments"><svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path></svg> Monetary donations</a>';
  nav.appendChild(paymentTab);

  const panel = document.createElement('section');
  panel.dataset.panel = 'payments';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="section-title-row">
      <div>
        <p class="eyebrow">Support FoodShare</p>
        <h2>Monetary donations</h2>
      </div>
    </div>
    <div class="payment-donation-layout">
      <form class="form-shell payment-donation-form" id="paymentDonationForm">
        <div class="field">
          <label for="paymentDonationAmount">Donation amount (INR)</label>
          <input class="input" id="paymentDonationAmount" min="1" name="amount" placeholder="Enter an amount" required step="0.01" type="number">
        </div>
        <button class="btn btn-primary" type="submit">Continue to payment</button>
        <p class="payment-donation-message" id="paymentDonationMessage" role="status" aria-live="polite"></p>
      </form>
      <section class="payment-donation-history" aria-labelledby="paymentDonationHistoryTitle">
        <div class="section-title-row">
          <h3 id="paymentDonationHistoryTitle">My monetary donations</h3>
          <button class="btn btn-secondary btn-sm" id="refreshPaymentHistory" type="button">Refresh</button>
        </div>
        <div id="paymentDonationHistory" aria-live="polite">Your payment history will appear here.</div>
      </section>
    </div>`;
  overview.parentElement.appendChild(panel);
}

function paymentUserId() {
  const userId = Number(currentUser && currentUser.id);
  if (!Number.isSafeInteger(userId) || userId <= 0 || !localStorage.getItem('foodshare_access_token')) {
    throw new Error('Sign in with your FoodShare account to make a monetary donation.');
  }
  return userId;
}

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => window.Razorpay ? resolve() : reject(new Error('Secure checkout could not be loaded.'));
    script.onerror = () => {
      script.remove();
      reject(new Error('Unable to load secure checkout. Please try again.'));
    };
    document.head.appendChild(script);
  });
}

function setPaymentMessage(message, state = '') {
  const status = document.getElementById('paymentDonationMessage');
  if (!status) return;
  status.textContent = message;
  status.className = `payment-donation-message${state ? ` ${state}` : ''}`;
}

function formatPaymentAmount(amount, currency = 'INR') {
  const value = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR'
  }).format(Number.isFinite(value) ? value : 0);
}

async function loadPaymentHistory() {
  const history = document.getElementById('paymentDonationHistory');
  if (!history) return;
  history.textContent = 'Loading payment history...';
  try {
    const payments = await window.foodsharePaymentApi.getByUser(paymentUserId());
    if (!Array.isArray(payments) || payments.length === 0) {
      history.innerHTML = '<p class="payment-history-empty">No monetary donations yet.</p>';
      return;
    }

    const totalPaid = payments
      .filter(payment => String(payment.status).toUpperCase() === 'SUCCESS')
      .reduce((total, payment) => total + Number(payment.amount || 0), 0);
    history.innerHTML = `
      <div class="payment-history-summary"><span>Successfully donated</span><strong>${formatPaymentAmount(totalPaid)}</strong></div>
      <ul class="payment-history-list">${payments.map(payment => `
        <li class="payment-history-row">
          <div><strong>${formatPaymentAmount(payment.amount, payment.currency)}</strong><span>${fsEscape(payment.createdAt ? fsFormatDate(payment.createdAt) : 'Date unavailable')}</span></div>
          <span class="payment-history-status">${fsEscape(payment.status || 'Pending')}</span>
        </li>`).join('')}
      </ul>`;
  } catch (error) {
    history.textContent = error.message || 'Could not load payment history.';
  }
}

function bindPaymentForm() {
  const form = document.getElementById('paymentDonationForm');
  const refreshButton = document.getElementById('refreshPaymentHistory');
  if (!form) return;

  if (refreshButton) refreshButton.addEventListener('click', loadPaymentHistory);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const amount = Number(document.getElementById('paymentDonationAmount').value);
    const button = form.querySelector('button[type="submit"]');
    if (!Number.isFinite(amount) || amount < 1) {
      setPaymentMessage('Enter a donation amount of at least INR 1.', 'error');
      return;
    }

    button.disabled = true;
    button.textContent = 'Preparing secure checkout...';
    setPaymentMessage('');
    try {
      const userId = paymentUserId();
      const api = window.foodsharePaymentApi;
      if (!api) throw new Error('Payment service is unavailable. Please refresh and try again.');
      await loadRazorpayCheckout();
      const order = await api.createOrder({ userId, donationId: null, amount });
      if (!order.success || !order.orderId || !order.keyId || !order.paymentId) {
        throw new Error(order.message || 'Could not start the payment.');
      }

      let paymentHandled = false;
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: Math.round(Number(order.amount) * 100),
        currency: order.currency || 'INR',
        name: 'FoodShare',
        description: 'Monetary donation',
        order_id: order.orderId,
        prefill: { name: currentUser.name || '', email: currentUser.email || '' },
        handler: async response => {
          paymentHandled = true;
          button.textContent = 'Verifying payment...';
          setPaymentMessage('Verifying your payment...');
          try {
            const verification = await api.verify({
              paymentId: order.paymentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            if (!verification.success) throw new Error(verification.message || 'Payment verification failed.');
            setPaymentMessage('Your donation was received. Thank you.', 'success');
            fsToast('Monetary donation received. Thank you!', 'success');
            form.reset();
            await loadPaymentHistory();
          } catch (error) {
            setPaymentMessage(error.message || 'Payment verification failed.', 'error');
            fsToast(error.message || 'Payment verification failed.', 'error');
          } finally {
            button.disabled = false;
            button.textContent = 'Continue to payment';
          }
        },
        modal: {
          ondismiss: () => {
            if (!paymentHandled) setPaymentMessage('Payment was not completed. You can try again.', 'error');
            button.disabled = false;
            button.textContent = 'Continue to payment';
          }
        }
      });
      checkout.on('payment.failed', response => {
        paymentHandled = true;
        setPaymentMessage(response.error && response.error.description || 'Payment failed. Please try again.', 'error');
        button.disabled = false;
        button.textContent = 'Continue to payment';
      });
      checkout.open();
    } catch (error) {
      setPaymentMessage(error.message || 'Could not start the payment.', 'error');
      button.disabled = false;
      button.textContent = 'Continue to payment';
    }
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
  document.getElementById('donationForm').addEventListener('submit', async (e) => {
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

    const food = {
      donorId: Number(currentUser.id),
      foodName,
      category,
      quantity,
      unit,
      expiryTime: new Date(expiryTime).toISOString().slice(0, 19),
      pickupAddress,
      description
    };

    const submitButton = e.target.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
      const response = await fetch('http://localhost:8079/api/foods', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('foodshare_access_token') || ''}`
        },
        body: JSON.stringify(food)
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.error || 'Could not save the food share.');
      }

      FS.createDonation({
        ...food,
        donorName: currentUser.name,
        status: String(payload.status || 'AVAILABLE').toLowerCase(),
        backendId: payload.id
      });
    } catch (error) {
      fsToast(error.message, 'error');
      if (submitButton) submitButton.disabled = false;
      return;
    }
    if (submitButton) submitButton.disabled = false;

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
