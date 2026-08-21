/* ==========================================
   FoodShare — Data layer (localStorage "database")
   Core flow: Donor posts a donation -> NGO accepts it ->
   NGO confirms receipt. Include before any page-specific JS.
   ========================================== */

const FS = (function () {
  const KEYS = {
    users: 'foodshare_users',
    session: 'foodshare_session',
    donations: 'foodshare_donations',
    seeded: 'foodshare_seeded_v1'
  };

  const CATEGORIES = ['Cooked Meals', 'Bakery & Bread', 'Fruits & Vegetables', 'Packaged & Dry Goods', 'Dairy & Eggs', 'Other'];
  const UNITS = ['servings', 'kg', 'items', 'boxes'];

  /* ---------- storage helpers ---------- */
  function read(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { console.error('FS read error', key, e); return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.error('FS write error', key, e); }
  }
  function uid(prefix) { return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  /* ---------- seed demo data ---------- */
  function seedIfNeeded() {
    if (read(KEYS.seeded, false)) return;

    const users = [
      { id: uid('user'), role: 'donor', name: 'Green Table Bistro', email: 'donor@demo.foodshare', password: 'demo1234', phone: '9876500001', address: '12 Market Street' },
      { id: uid('user'), role: 'ngo', name: 'Sarah Ibrahim', email: 'ngo@demo.foodshare', password: 'demo1234', phone: '9876500002', orgName: 'Helping Hands Foundation', address: '4 Community Lane' },
      { id: uid('user'), role: 'admin', name: 'Maya Chen', email: 'admin@demo.foodshare', password: 'demo1234', phone: '9876500003', address: 'FoodShare HQ' },
      { id: uid('user'), role: 'volunteer', name: 'Jordan Patel', email: 'volunteer@demo.foodshare', password: 'demo1234', phone: '9876500004', address: '9 Elm Street' }
    ];
    write(KEYS.users, users);

    const donor = users[0];
    const now = Date.now();
    const donations = [
      mkDonation({
        donorId: donor.id, donorName: donor.name, foodName: 'Vegetable Biryani Trays',
        category: 'Cooked Meals', quantity: 25, unit: 'servings',
        expiryTime: new Date(now + 2 * 3600 * 1000).toISOString(),
        pickupAddress: '12 Market Street, Downtown', description: 'Freshly cooked, packed in sealed trays after an event.',
        status: 'available'
      }),
      mkDonation({
        donorId: donor.id, donorName: donor.name, foodName: 'Assorted Bread & Pastries',
        category: 'Bakery & Bread', quantity: 40, unit: 'items',
        expiryTime: new Date(now + 20 * 3600 * 1000).toISOString(),
        pickupAddress: '12 Market Street, Downtown', description: 'End-of-day bakery surplus, still fresh.',
        status: 'available'
      }),
      mkDonation({
        donorId: donor.id, donorName: donor.name, foodName: 'Mixed Fruit Crates',
        category: 'Fruits & Vegetables', quantity: 15, unit: 'kg',
        expiryTime: new Date(now + 48 * 3600 * 1000).toISOString(),
        pickupAddress: '12 Market Street, Downtown', description: 'Slightly bruised but perfectly edible produce.',
        status: 'accepted', ngoId: users[1].id, ngoName: users[1].orgName, acceptedAt: new Date(now - 3600 * 1000).toISOString()
      })
    ];
    write(KEYS.donations, donations);
    write(KEYS.seeded, true);
  }

  function mkDonation(fields) {
    return Object.assign({
      id: uid('don'), donorId: null, donorName: '', foodName: '', category: CATEGORIES[0],
      quantity: 1, unit: 'servings', expiryTime: '', pickupAddress: '', description: '',
      status: 'available', ngoId: null, ngoName: null, volunteerId: null, volunteerName: null,
      createdAt: new Date().toISOString(), acceptedAt: null, claimedAt: null, completedAt: null, cancelledAt: null
    }, fields);
  }

  /* ---------- Auth ---------- */
  function getUsers() { return read(KEYS.users, []); }
  function saveUsers(list) { write(KEYS.users, list); }

  function signup({ role, name, email, password, phone, address, orgName, availability }) {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const user = { id: uid('user'), role, name, email, password, phone, address: address || '', orgName: orgName || '', availability: availability || '', createdAt: new Date().toISOString() };
    users.push(user);
    saveUsers(users);
    setSession(user.id);
    return { ok: true, user };
  }

  function login({ email, password }) {
    const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    setSession(user.id);
    return { ok: true, user };
  }

  /* ---------- Forgot / reset password ----------
     This is a frontend-only simulation of a password-reset flow.
     A real deployment would swap these three functions for calls to a
     backend endpoint (e.g. POST /api/auth/forgot-password) that emails
     the user a signed, time-limited link instead of returning the token
     directly to the browser. The token/expiry storage shape below is
     intentionally backend-friendly so that swap is a small change. */
  const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

  function requestPasswordReset(email) {
    const users = getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === String(email).toLowerCase());
    // Always resolve "ok" to the caller even when no account exists, so the
    // UI never reveals whether an email is registered (avoids account enumeration).
    if (idx === -1) return { ok: true, token: null };
    const token = uid('reset');
    users[idx] = Object.assign({}, users[idx], { resetToken: token, resetTokenExpiry: Date.now() + RESET_TOKEN_TTL_MS });
    saveUsers(users);
    return { ok: true, token, user: users[idx] };
  }

  function verifyResetToken(token) {
    const user = getUsers().find(u => u.resetToken && u.resetToken === token);
    if (!user) return { ok: false, error: 'This reset link is invalid. Please request a new one.' };
    if (!user.resetTokenExpiry || Date.now() > user.resetTokenExpiry) {
      return { ok: false, error: 'This reset link has expired. Please request a new one.' };
    }
    return { ok: true, user };
  }

  function resetPassword(token, newPassword) {
    const check = verifyResetToken(token);
    if (!check.ok) return check;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === check.user.id);
    if (idx === -1) return { ok: false, error: 'Account not found.' };
    const updated = Object.assign({}, users[idx], { password: newPassword });
    delete updated.resetToken;
    delete updated.resetTokenExpiry;
    users[idx] = updated;
    saveUsers(users);
    return { ok: true, user: updated };
  }

  function setSession(userId) { write(KEYS.session, { userId }); }
  function logout() { localStorage.removeItem(KEYS.session); }
  function getCurrentUser() {
    const s = read(KEYS.session, null);
    if (!s) return null;
    return getUsers().find(u => u.id === s.userId) || null;
  }
  const DASHBOARD_BY_ROLE = {
    donor: 'donor-dashboard.html',
    ngo: 'ngo-dashboard.html',
    admin: 'admin-dashboard.html',
    volunteer: 'volunteer-dashboard.html'
  };

  function dashboardFor(role) { return DASHBOARD_BY_ROLE[role] || 'index.html'; }

  function requireAuth(role) {
    const u = getCurrentUser();
    if (!u) { window.location.href = 'login.html'; return null; }
    if (role && u.role !== role) {
      window.location.href = dashboardFor(u.role);
      return null;
    }
    return u;
  }

  /* ---------- Donations ---------- */
  function getDonations() { return read(KEYS.donations, []); }
  function getDonation(id) { return getDonations().find(d => d.id === id) || null; }
  function getDonationsByDonor(donorId) { return getDonations().filter(d => d.donorId === donorId).sort(byNewest); }
  function getAvailableDonations() { return getDonations().filter(d => d.status === 'available').sort(byExpirySoonest); }
  function getDonationsByNgo(ngoId) { return getDonations().filter(d => d.ngoId === ngoId).sort(byNewest); }
  function getDeliverableDonations() { return getDonations().filter(d => d.status === 'accepted' && !d.volunteerId).sort(byExpirySoonest); }
  function getDonationsByVolunteer(volunteerId) { return getDonations().filter(d => d.volunteerId === volunteerId).sort(byNewest); }

  function byNewest(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }
  function byExpirySoonest(a, b) { return new Date(a.expiryTime) - new Date(b.expiryTime); }

  function createDonation(fields) {
    const list = getDonations();
    const d = mkDonation(fields);
    list.push(d);
    write(KEYS.donations, list);
    return d;
  }

  function updateDonation(id, patch) {
    const list = getDonations();
    const idx = list.findIndex(d => d.id === id);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    write(KEYS.donations, list);
    return list[idx];
  }

  function cancelDonation(id) { return updateDonation(id, { status: 'cancelled', cancelledAt: new Date().toISOString() }); }

  function acceptDonation(id, ngo) {
    return updateDonation(id, { status: 'accepted', ngoId: ngo.id, ngoName: ngo.orgName || ngo.name, acceptedAt: new Date().toISOString() });
  }

  function confirmReceived(id) { return updateDonation(id, { status: 'completed', completedAt: new Date().toISOString() }); }

  function claimDelivery(id, volunteer) {
    return updateDonation(id, { volunteerId: volunteer.id, volunteerName: volunteer.name, claimedAt: new Date().toISOString() });
  }
  function releaseDelivery(id) {
    return updateDonation(id, { volunteerId: null, volunteerName: null, claimedAt: null });
  }
  function markDelivered(id) { return confirmReceived(id); }

  /* ---------- Freshness / expiry helpers ---------- */
  function hoursUntil(iso) { return (new Date(iso) - Date.now()) / 3600000; }
  function freshnessLevel(iso) {
    const h = hoursUntil(iso);
    if (h <= 0) return 'expired';
    if (h <= 2) return 'urgent';
    if (h <= 6) return 'warn';
    return 'ok';
  }
  function freshnessLabel(iso) {
    const h = hoursUntil(iso);
    if (h <= 0) return { num: '0', unit: 'expired' };
    if (h < 1) return { num: Math.round(h * 60), unit: 'min left' };
    if (h < 48) return { num: Math.round(h), unit: 'hr left' };
    return { num: Math.round(h / 24), unit: 'days left' };
  }

  /* ---------- Stats ---------- */
  function getDonorStats(donorId) {
    const mine = getDonationsByDonor(donorId);
    return {
      total: mine.length,
      available: mine.filter(d => d.status === 'available').length,
      accepted: mine.filter(d => d.status === 'accepted').length,
      completed: mine.filter(d => d.status === 'completed').length,
      mealsShared: mine.filter(d => d.status === 'completed').reduce((sum, d) => sum + estimateMeals(d), 0)
    };
  }
  function getNgoStats(ngoId) {
    const mine = getDonationsByNgo(ngoId);
    return {
      accepted: mine.filter(d => d.status === 'accepted').length,
      completed: mine.filter(d => d.status === 'completed').length,
      available: getAvailableDonations().length,
      mealsRescued: mine.filter(d => d.status === 'completed').reduce((sum, d) => sum + estimateMeals(d), 0)
    };
  }
  function getVolunteerStats(volunteerId) {
    const mine = getDonationsByVolunteer(volunteerId);
    return {
      openTasks: getDeliverableDonations().length,
      claimed: mine.filter(d => d.status === 'accepted').length,
      completed: mine.filter(d => d.status === 'completed').length,
      mealsMoved: mine.filter(d => d.status === 'completed').reduce((sum, d) => sum + estimateMeals(d), 0)
    };
  }
  function getAdminStats() {
    const users = getUsers();
    const donations = getDonations();
    return {
      totalUsers: users.length,
      donors: users.filter(u => u.role === 'donor').length,
      ngos: users.filter(u => u.role === 'ngo').length,
      volunteers: users.filter(u => u.role === 'volunteer').length,
      admins: users.filter(u => u.role === 'admin').length,
      totalDonations: donations.length,
      available: donations.filter(d => d.status === 'available').length,
      accepted: donations.filter(d => d.status === 'accepted').length,
      completed: donations.filter(d => d.status === 'completed').length,
      cancelled: donations.filter(d => d.status === 'cancelled').length,
      mealsShared: donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + estimateMeals(d), 0)
    };
  }
  function estimateMeals(d) {
    if (d.unit === 'servings') return d.quantity;
    if (d.unit === 'kg') return Math.round(d.quantity * 2.5);
    if (d.unit === 'items') return d.quantity;
    if (d.unit === 'boxes') return d.quantity * 8;
    return d.quantity;
  }

  return {
    CATEGORIES, UNITS, uid, seedIfNeeded,
    signup, login, logout, getCurrentUser, requireAuth, dashboardFor, getUsers,
    requestPasswordReset, verifyResetToken, resetPassword,
    getDonations, getDonation, getDonationsByDonor, getAvailableDonations, getDonationsByNgo,
    getDeliverableDonations, getDonationsByVolunteer,
    createDonation, updateDonation, cancelDonation, acceptDonation, confirmReceived,
    claimDelivery, releaseDelivery, markDelivered,
    hoursUntil, freshnessLevel, freshnessLabel,
    getDonorStats, getNgoStats, getVolunteerStats, getAdminStats, estimateMeals
  };
})();

document.addEventListener('DOMContentLoaded', () => FS.seedIfNeeded());
