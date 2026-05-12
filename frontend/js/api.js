// API Configuration
const BASE_URL = 'http://localhost:5000';
// ---- Auth Helpers ----
function getToken() { return localStorage.getItem('lib_token'); }
function getUser()  { return JSON.parse(localStorage.getItem('lib_user') || 'null'); }
function isAdmin()  { return getUser()?.role === 'admin'; }

function setAuth(token, user) {
  localStorage.setItem('lib_token', token);
  localStorage.setItem('lib_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('lib_token');
  localStorage.removeItem('lib_user');
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` };
}

// ---- API Calls ----
async function apiCall(endpoint, method = 'GET', body = null, useAuth = true) {
  const opts = {
    method,
    headers: useAuth ? authHeaders() : { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API_BASE + endpoint, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ---- Toast Notification ----
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ---- Guard: redirect if not logged in ----
function requireAuth(adminOnly = false) {
  const user = getUser();
  const token = getToken();
  if (!token || !user) { window.location.href = 'login.html'; return false; }
  if (adminOnly && user.role !== 'admin') { window.location.href = 'dashboard.html'; return false; }
  return true;
}
