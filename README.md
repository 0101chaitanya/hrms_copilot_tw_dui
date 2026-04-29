# Smart HRMS

A full-stack Human Resource Management System built with React, Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based auth with role-based access control (Admin, HR, Employee)
- **Employee Management**: Add, edit, delete employees with department/position tracking
- **Leave Management**: Request, approve/reject leaves with status tracking
- **Dashboard**: Overview stats and recent activities
- **Profile**: User profile management
- **Responsive UI**: Built with Tailwind CSS and DaisyUI

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Redux Toolkit, React Router, React Hook Form |
| Styling | Tailwind CSS v4, DaisyUI |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Build Tool | Vite |

## Project Structure

```
hrms_copilot_tw_dui/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── slices/        # Redux slices
│   │   └── utils/         # API utilities
│   └── .env              # Frontend env vars
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & error handlers
│   └── .env              # Backend env vars
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

See the Environment Variables section below for detailed setup.

### 3. Run the Application

```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory, in new terminal)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### 4. Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Admin@123 |
| HR | hr@demo.com | Hr@123 |
| Employee | employee@demo.com | Employee@123 |

---

# Environment Setup Guide

## Backend Environment Variables

Create a `.env` file in the `/server` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# CORS - Frontend URL
FRONT_END_URL=http://localhost:5173
```

### Required Backend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `FRONT_END_URL` | Frontend URL for CORS configuration | Yes |

---

## Frontend Environment Variables

Create a `.env` file in the `/client` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### Required Frontend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

---

## Vite Proxy Configuration

The Vite dev server proxy is configured in `/client/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### Proxy Settings Explained

| Setting | Value | Description |
|---------|-------|-------------|
| `port` | `5173` | Frontend dev server port |
| `target` | `http://localhost:5000` | Backend API server URL |
| `changeOrigin` | `true` | Changes the origin of the host header to the target URL |

### How Proxy Works

- Any request to `/api/*` from the frontend is forwarded to `http://localhost:5000/api/*`
- This allows avoiding CORS issues during development
- The browser sees all requests as coming from the same origin

---

## URLs Summary

| Service | URL |
|---------|-----|
| Frontend App | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |
| API Routes | `http://localhost:5000/api/*` |

---

## Example .env Files

### server/.env
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hrms?retryWrites=true&w=majority
JWT_SECRET=my-super-secure-jwt-secret-key-2024
FRONT_END_URL=http://localhost:5173
```

### client/.env
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Important Notes

1. **Never commit `.env` files** - Add them to `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters recommended
3. **Update FRONT_END_URL** - Change this when deploying to production
4. **Vite env vars** - Must start with `VITE_` to be exposed to client code
5. **Restart servers** - After changing `.env` files, restart both servers
