# 🩸 BloodConnect – Blood Bank Management System

A complete, production-style full-stack Blood Bank Management System built with React.js, Node.js, Express.js, and MongoDB Atlas. Designed mobile-first with a clean healthcare UI.

---

## 📋 Features

### 🔐 Authentication & Authorization
- JWT-based authentication with role-based access control
- Three roles: **Donor**, **Hospital**, **Admin**
- Persistent login with localStorage
- Protected routes per role
- Password hashing with bcrypt

### 🩸 Donor Module
- Donor profile management
- Blood group & availability status
- Donation history with count & last donation date
- Toggle availability (AVAILABLE / UNAVAILABLE)
- In-app notifications

### 🏥 Hospital Module
- Hospital profile with license & verification
- Blood availability search by group/city
- Create blood requests with urgency levels (Normal/Urgent/Emergency)
- Track request status (Pending → Approved → Completed)
- In-app notifications

### 👑 Admin Module
- Comprehensive dashboard with charts
- Manage donors, hospitals, users
- Blood stock management (add/remove units per blood group)
- Record donations (auto-updates stock & donor stats)
- Approve/Reject/Complete blood requests
- System notifications
- Reports

### 🔴 Blood Stock Management
- All 8 blood groups: A+, A-, B+, B-, AB+, AB-, O+, O-
- Real-time status: AVAILABLE / LOW STOCK / OUT OF STOCK
- Auto-update on donations and completed requests
- Prevents negative stock

### 🔔 Notification System
- In-app notifications for all key events
- Unread count badge
- Mark single/all as read

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, Vite 5, Tailwind CSS 3 |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **ODM** | Mongoose |
| **Auth** | JWT (jsonwebtoken) |
| **Password** | bcryptjs |
| **Validation** | express-validator |

---

## 📁 Folder Structure

```
blood-bank-management/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Reusable UI components
│   │   │   └── layout/      # Navbar, Sidebar, BottomNav
│   │   ├── pages/
│   │   │   ├── public/      # Home, About, BloodAvailability
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── donor/       # Donor pages
│   │   │   ├── hospital/    # Hospital pages
│   │   │   └── admin/       # Admin pages
│   │   ├── layouts/         # PublicLayout, DonorLayout, HospitalLayout, AdminLayout
│   │   ├── services/        # Axios API services
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Helper functions
│   │   ├── routes/          # ProtectedRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/         # Business logic
│   ├── middleware/          # auth, roleCheck, errorHandler
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── utils/
│   │   └── seed.js          # Database seeder
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- npm or yarn

---

### Step 1: Clone / Open the Project

```bash
cd blood-bank-management
```

---

### Step 2: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Create a database user with read/write permissions
4. Whitelist IP: `0.0.0.0/0` (Allow from Anywhere)
5. Click **Connect** → **Drivers** → Copy the connection string
6. Replace `<username>` and `<password>` in the connection string

---

### Step 3: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/bloodconnect?retryWrites=true&w=majority
JWT_SECRET=your_very_secret_jwt_key_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

---

### Step 4: Seed the Database

```bash
npm run seed
```

This creates sample data including admin credentials.

---

### Step 5: Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000

---

## 🔑 Demo Login Credentials

After running `npm run seed` in the backend:

| Role | Email | Password |
|------|-------|---------|
| **Admin** | admin@bloodconnect.com | Admin@123 |
| **Donor** | john.donor@example.com | Donor@123 |
| **Hospital** | city.hospital@example.com | Hospital@123 |

---

## 📡 API Overview

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register donor/hospital |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Donors
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/donors` | Public/Admin |
| GET | `/api/donors/:id` | Auth |
| PUT | `/api/donors/:id` | Donor (own) / Admin |
| DELETE | `/api/donors/:id` | Admin |

### Blood Stock
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/blood-stock` | Public |
| GET | `/api/blood-stock/:group` | Public |
| PUT | `/api/blood-stock/:id` | Admin |

### Blood Requests
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/requests` | Hospital |
| GET | `/api/requests` | Hospital (own) / Admin (all) |
| GET | `/api/requests/:id` | Hospital (own) / Admin |
| PUT | `/api/requests/:id/status` | Admin |

### Donations
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/donations` | Admin |
| GET | `/api/donations` | Admin |
| GET | `/api/donations/donor/:id` | Donor / Admin |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/statistics` | Admin |
| GET | `/api/admin/users` | Admin |

---

## 📱 Mobile-First Design

The application is designed mobile-first:
- **Mobile (320px–414px)**: Bottom navigation for donor/hospital, hamburger for admin
- **Tablet (768px+)**: Enhanced layout with more visible sidebar
- **Desktop (1024px+)**: Full sidebar navigation

---

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiry (7 days)
- Role-based route protection (frontend & backend)
- CORS configured for specific client URL
- Input validation on all endpoints
- MongoDB injection prevention via Mongoose
- Sensitive data never exposed in responses
- Environment variables for all secrets

---

## 🎨 UI Design System

- **Primary Color**: Red (#DC2626)
- **Background**: Gray-50
- **Cards**: White, rounded-xl, shadow-sm
- **Typography**: Inter font
- **Status Colors**:
  - Available: Green
  - Low Stock: Yellow
  - Out of Stock: Red
  - Pending: Yellow
  - Approved: Green
  - Rejected: Red
  - Completed: Blue
  - Emergency: Red (animated pulse)

---

## 🚢 Deployment

### Backend (Render / Railway / Heroku)
1. Push code to GitHub
2. Connect repo to Render
3. Set environment variables
4. Deploy

### Frontend (Vercel / Netlify)
1. Push frontend to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL` to your deployed backend URL
4. Deploy

---

## 🛡️ Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=<your mongodb atlas connection string>
JWT_SECRET=<strong random secret>
CLIENT_URL=<frontend url>
```

### Frontend `.env`
```
VITE_API_URL=<backend api url>/api
```

---

## 📊 Database Models

| Model | Description |
|-------|-------------|
| `User` | Authentication (email, password, role) |
| `Donor` | Donor profile (blood group, availability, etc.) |
| `Hospital` | Hospital profile (license, verification status) |
| `BloodStock` | Stock per blood group (8 groups) |
| `BloodRequest` | Hospital blood requests with status flow |
| `Donation` | Donation records linked to donor & blood stock |
| `Notification` | In-app notifications per user |

---

## 👨‍💻 Built By

BloodConnect – A comprehensive Blood Bank Management System.  
Built as a production-quality full-stack application suitable for college final-year projects and GitHub portfolios.

---

## 📄 License

MIT License
