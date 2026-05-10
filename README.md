# 📚 College Library Management System

A full-stack library management system with:
- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks needed)
- **Backend**: Node.js + Express.js REST API
- **Database**: MySQL

---

## 🗂️ Project Structure

```
college-library/
├── frontend/
│   ├── index.html               ← Entry point (redirects to login)
│   ├── css/style.css            ← All styles
│   ├── js/api.js                ← API helper functions
│   └── pages/
│       ├── login.html           ← Student/Admin login & register
│       ├── dashboard.html       ← Student dashboard
│       ├── books.html           ← Browse books
│       ├── my-books.html        ← Student's borrowed books
│       ├── admin.html           ← Admin dashboard
│       ├── admin-books.html     ← Admin: add/edit/delete books
│       ├── admin-borrows.html   ← Admin: issue & return books
│       └── admin-students.html  ← Admin: view all students
├── backend/
│   ├── server.js                ← Express app entry point
│   ├── package.json
│   ├── .env                     ← Database & secret config
│   ├── config/db.js             ← MySQL connection pool
│   ├── middleware/auth.js       ← JWT auth middleware
│   └── routes/
│       ├── auth.js              ← Login, register endpoints
│       ├── books.js             ← Books CRUD endpoints
│       ├── borrows.js           ← Issue/return/renew endpoints
│       └── students.js          ← Student endpoints
└── database/
    └── schema.sql               ← Database schema + sample data
```

---

## ⚙️ STEP-BY-STEP SETUP

---

### STEP 1 — Install Prerequisites

Make sure you have these installed:

| Tool        | Download                          |
|-------------|-----------------------------------|
| Node.js     | https://nodejs.org (v18 or above) |
| MySQL       | https://dev.mysql.com/downloads/  |
| VS Code     | https://code.visualstudio.com     |

---

### STEP 2 — Set Up the Database

1. Open **MySQL Workbench** or **MySQL Command Line**
2. Run the database script:

```sql
-- Option A: MySQL Workbench
-- Open schema.sql file and click "Run"

-- Option B: Command line
mysql -u root -p < database/schema.sql
```

3. This will create:
   - `college_library` database
   - `students`, `books`, `borrow_records`, `admins` tables
   - Sample books data

---

### STEP 3 — Configure the Backend

1. Open `backend/.env` file in a text editor:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password    ← CHANGE THIS
DB_NAME=college_library
DB_PORT=3306

PORT=5000
JWT_SECRET=change_this_to_any_long_random_string

FINE_PER_DAY=2
```

2. Replace `your_mysql_password` with your actual MySQL root password.

---

### STEP 4 — Create the Admin Account

Run this SQL in MySQL to create the admin user (replace the password hash):

```sql
USE college_library;

-- Install bcrypt and run this script to generate hash first:
-- In backend folder: node -e "const b=require('bcryptjs'); b.hash('admin123',10).then(h=>console.log(h))"
-- Then replace the hash below:

UPDATE admins SET password = '<paste-hash-here>' WHERE email = 'admin@library.edu';
```

**Shortcut** — in the `backend/` folder run:
```bash
node -e "const b=require('bcryptjs'); b.hash('admin123',10).then(h=>console.log('Hash:',h))"
```
Copy the output and update the admins table.

---

### STEP 5 — Start the Backend Server

```bash
# Open terminal, navigate to backend folder
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

You should see:
```
✅ MySQL Database connected successfully
🚀 Server running on http://localhost:5000
📚 College Library API ready
```

**Test it:** Open browser → http://localhost:5000/api/health
Should return: `{"status":"OK","message":"College Library API is running"}`

---

### STEP 6 — Open the Frontend

The frontend is plain HTML — just open it in a browser:

**Option A (Simplest):**
- Double-click `frontend/index.html` → opens in browser
- Or open `frontend/pages/login.html` directly

**Option B (VS Code Live Server — Recommended):**
1. Install VS Code extension: **"Live Server"** by Ritwick Dey
2. Right-click `frontend/index.html` → **"Open with Live Server"**
3. Frontend runs at: http://127.0.0.1:5500

---

## 🔗 HOW FRONTEND CONNECTS TO BACKEND

The file `frontend/js/api.js` contains:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

Every page imports this file. All API calls go through the `apiCall()` function:

```javascript
async function apiCall(endpoint, method = 'GET', body = null, useAuth = true) {
  const res = await fetch(API_BASE + endpoint, {
    method,
    headers: useAuth
      ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      : { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
```

**If your backend runs on a different port**, change:
```javascript
const API_BASE = 'http://localhost:YOUR_PORT/api';
```

---

## 🚀 USING THE SYSTEM

### Student Flow:
1. Go to login page → **Register** tab → Create account
2. Login with email + password
3. **Browse Books** → view available books
4. Ask librarian to issue a book
5. **My Books** → see borrowed books, renew if needed

### Admin Flow:
1. Login page → **Admin** tab
2. Email: `admin@library.edu` | Password: whatever you set
3. **Manage Books** → Add/edit/delete books
4. **Borrow/Return** → Issue books to students, process returns
5. **Dashboard** → View overdue books and stats

---

## 📡 API ENDPOINTS REFERENCE

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Student registration | None |
| POST | /api/auth/login | Student login | None |
| POST | /api/auth/admin/login | Admin login | None |
| GET | /api/books | Get all books | None |
| POST | /api/books | Add new book | Admin |
| PUT | /api/books/:id | Update book | Admin |
| DELETE | /api/books/:id | Delete book | Admin |
| GET | /api/students | Get all students | Admin |
| GET | /api/students/profile | Get own profile | Student |
| GET | /api/borrows | All borrow records | Admin |
| GET | /api/borrows/my | Own borrow history | Student |
| POST | /api/borrows/issue | Issue book | Admin |
| POST | /api/borrows/return/:id | Return book | Admin |
| POST | /api/borrows/renew/:id | Renew book | Student |

---

## 🌐 DEPLOYING ONLINE (Optional)

### Backend (Railway/Render):
1. Push backend to GitHub
2. Connect to Railway.app or Render.com
3. Set environment variables from `.env`
4. Deploy — get a URL like `https://library-api.railway.app`
5. Update `API_BASE` in `frontend/js/api.js`

### Frontend (Netlify/GitHub Pages):
1. Drag `frontend/` folder to netlify.com/drop
2. Or push to GitHub and connect to Netlify

### Database (PlanetScale/Clever Cloud):
1. Create a free MySQL database on PlanetScale or Railway
2. Update `.env` DB settings with cloud credentials

---

## 🔧 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| `CORS error` | Make sure backend is running on port 5000 |
| `Database connection failed` | Check `.env` password is correct |
| `Cannot GET /api/...` | Backend not started — run `npm start` |
| `Invalid token` | Clear browser localStorage, re-login |
| Admin login fails | Make sure you set the password hash correctly |

---

## 📋 FEATURES

- ✅ Student registration & login (JWT auth)
- ✅ Admin login (separate role)
- ✅ Browse & search books
- ✅ Issue books to students (14-day period)
- ✅ Return books with automatic fine calculation (₹2/day)
- ✅ Renew books (max 2 renewals)
- ✅ Overdue detection
- ✅ Student borrow history
- ✅ Admin dashboard with statistics
- ✅ Full book management (add/edit/delete)
- ✅ Student management view
