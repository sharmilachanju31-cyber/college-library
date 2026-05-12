// ======================================
// API CONFIGURATION
// ======================================

const BASE_URL = 'https://college-library-ipcy.onrender.com/api';


// ======================================
// AUTH HELPERS
// ======================================

function getToken() {
  return localStorage.getItem('lib_token');
}

function getUser() {
  return JSON.parse(
    localStorage.getItem('lib_user') || 'null'
  );
}

function isAdmin() {
  return getUser()?.role === 'admin';
}

function setAuth(token, user) {

  localStorage.setItem('lib_token', token);

  localStorage.setItem(
    'lib_user',
    JSON.stringify(user)
  );
}

function clearAuth() {

  localStorage.removeItem('lib_token');

  localStorage.removeItem('lib_user');
}

function authHeaders() {

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}


// ======================================
// API CALL FUNCTION
// ======================================

async function apiCall(
  endpoint,
  method = 'GET',
  body = null,
  useAuth = true
) {

  const options = {
    method,
    headers: useAuth
      ? authHeaders()
      : { 'Content-Type': 'application/json' }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(
    BASE_URL + endpoint,
    options
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Request failed'
    );
  }

  return data;
}


// ======================================
// TOAST MESSAGE
// ======================================

function showToast(
  msg,
  type = 'success'
) {

  const toast =
    document.createElement('div');

  toast.className =
    `toast toast-${type}`;

  toast.textContent = msg;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {

    toast.classList.remove('show');

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 3000);
}


// ======================================
// LOGIN CHECK
// ======================================

function requireAuth(adminOnly = false) {

  const user = getUser();

  const token = getToken();

  if (!token || !user) {

    window.location.href =
      'login.html';

    return false;
  }

  if (
    adminOnly &&
    user.role !== 'admin'
  ) {

    window.location.href =
      'dashboard.html';

    return false;
  }

  return true;
}
