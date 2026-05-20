# Saraha Lite — Frontend

A clean, dark-themed React frontend for the Saraha anonymous messaging app.

## Stack

- **React 18** — functional components, hooks
- **Bootstrap 5** — responsive layout
- **React Router 6** — client-side routing
- **Axios** — API calls with interceptors (auto token refresh)
- **@react-oauth/google** — Google OAuth
- **react-toastify** — notifications

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Sticky top nav with avatar + logout
│   ├── ProtectedRoute.js  # Redirects to /login if not authenticated
│   ├── MessageCard.js     # Individual message card
│   ├── SkeletonCard.js    # Loading skeleton for message grid
│   └── OTPModal.js        # OTP verification modal (post-signup)
│
├── context/
│   └── AuthContext.js     # Global auth state (user, token, login/logout)
│
├── pages/
│   ├── LoginPage.js       # Email/password + Google login
│   ├── SignupPage.js      # Normal signup with OTP verification flow
│   ├── HomePage.js        # Message grid (read-only)
│   ├── ProfilePage.js     # Upload/change profile picture
│   └── NotFoundPage.js    # 404 fallback
│
├── services/
│   └── api.js             # Axios instance + all API endpoint calls
│
├── utils/
│   └── helpers.js         # timeAgo, getInitials, getErrorMessage
│
├── App.js                 # Router + ToastContainer
├── App.css                # All component/page styles
└── index.css              # Design tokens (CSS variables), global resets
```

---

## Setup

### 1. Clone & install

```bash
git clone <repo>
cd saraha-frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Start the dev server

```bash
npm start
```

App runs at `http://localhost:3001` (or 3000 if backend isn't running).

---

## Features

| Feature | Status |
|---|---|
| Sign up with email/password | ✅ |
| OTP email verification after signup | ✅ |
| Login with email/password | ✅ |
| Login with Google | ✅ |
| Protected routes | ✅ |
| View anonymous messages (Home) | ✅ |
| Change profile picture (cloud upload) | ✅ |
| Auto token refresh via interceptor | ✅ |
| Forget Password | ❌ Removed |
| Sign up with Google | ❌ Not implemented |
| Add/send messages | ❌ Not implemented |

---

## Backend API Endpoints Used

| Method | Endpoint | Used In |
|---|---|---|
| POST | /auth/register | SignupPage |
| POST | /auth/verify | OTPModal |
| POST | /auth/resend-otp | OTPModal |
| POST | /auth/login | LoginPage |
| POST | /auth/google-login | LoginPage |
| POST | /auth/logout | Navbar |
| GET | /message | HomePage |
| POST | /user/upload-profile-cloud | ProfilePage |

---

## Design System

- **Font**: DM Serif Display (headings) + DM Sans (body)
- **Theme**: Dark (#0c0c0f base), gold accent (#d4af37)
- **Animations**: CSS `fadeUp` on cards, shimmer skeletons, gold pulse on avatar
