// document.getElementById('password').addEventListener('input', (e) => {
//   fsRenderPasswordStrength(e.target.value, document.getElementById('strengthMeter'));
// });

// const params = new URLSearchParams(window.location.search);
// const presetRole = params.get('role');

// function selectRole(role) {
//   document.getElementById('roleDonorOption').classList.toggle('active', role === 'donor');
//   document.getElementById('roleNgoOption').classList.toggle('active', role === 'ngo');
//   document.querySelector(`input[name="role"][value="${role}"]`).checked = true;
//   const isNgo = role === 'ngo';
//   document.getElementById('orgField').style.display = isNgo ? 'block' : 'none';
//   document.getElementById('nameLabel').textContent = isNgo ? 'Contact person name' : 'Full name';
//   document.getElementById('addressLabel').textContent = isNgo ? 'Organisation address' : 'Pickup address';
// }

// document.getElementById('roleDonorOption').addEventListener('click', () => selectRole('donor'));
// document.getElementById('roleNgoOption').addEventListener('click', () => selectRole('ngo'));
// selectRole(presetRole === 'ngo' ? 'ngo' : 'donor');

// function setError(id, show) { document.getElementById(id).classList.toggle('show', !!show); }

// document.getElementById('signupForm').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const role = document.querySelector('input[name="role"]:checked').value;
//   const name = document.getElementById('name').value.trim();
//   const orgName = document.getElementById('orgName').value.trim();
//   const email = document.getElementById('email').value.trim();
//   const phone = document.getElementById('phone').value.trim();
//   const address = document.getElementById('address').value.trim();
//   const password = document.getElementById('password').value;

//   let valid = true;
//   setError('nameError', !name); if (!name) valid = false;
//   if (role === 'ngo') { setError('orgError', !orgName); if (!orgName) valid = false; }
//   const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   setError('emailError', !emailOk); if (!emailOk) valid = false;
//   const phoneOk = phone.replace(/\D/g, '').length >= 7;
//   setError('phoneError', !phoneOk); if (!phoneOk) valid = false;
//   setError('passwordError', password.length < 6); if (password.length < 6) valid = false;

//   document.getElementById('formError').classList.remove('show');
//   if (!valid) return;

//   const result = FS.signup({ role, name, email, password, phone, address, orgName });
//   if (!result.ok) {
//     document.getElementById('formError').textContent = result.error;
//     document.getElementById('formError').classList.add('show');
//     return;
//   }
//   fsToast('Welcome to FoodShare, ' + result.user.name + '!', 'success');
//   setTimeout(() => { window.location.href = role === 'donor' ? 'donor-dashboard.html' : 'ngo-dashboard.html'; }, 500);
// });
