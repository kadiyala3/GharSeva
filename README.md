# GHARSEVA 🏠
**"All Your Home Services. One Trusted Place."**

GharSeva is a massive, real-world MERN stack application designed as a complete home-service marketplace. It connects Customers with Service Providers and allows Administrators to manage the platform seamlessly. 

## 🚀 Features
### For Customers:
- Browse and search for verified service providers (Plumbers, Electricians, Chefs, etc.).
- Multi-step booking process with date, time, and address selection.
- View and manage bookings.
- Track provider status (Accepted, On the Way, Completed).
- Leave ratings and reviews.
- Responsive, modern dashboard.

### For Service Providers:
- Comprehensive profile management and service selection.
- Real-time job requests and status updates.
- Track earnings and jobs completed.
- Job management dashboard.

### For Administrators:
- Centralized Admin Dashboard.
- Manage users (Customers & Providers).
- Verify providers before they go live on the platform.
- Manage Service Categories and individual Services.
- System-wide analytics and statistics.

---

## 🛠️ Technology Stack
### Frontend:
- **React.js (Vite)**
- **React Router DOM v6**
- **Axios** (for API requests)
- **CSS Modules & Vanilla CSS** (Custom responsive premium UI)
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)

### Backend:
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database and ODM)
- **JSON Web Tokens (JWT) & bcryptjs** (Authentication & Security)
- **Helmet, Cors, Morgan** (Security & Logging)
- **Multer** (File uploads preparation)
- **Socket.io** (Ready for real-time features)

---

## 📁 Project Architecture
```
ghar-seva/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Header, Footer)
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Application Pages (Home, Dashboards, Auth)
│   │   ├── services/         # API configurations (Axios)
│   │   ├── App.jsx           # Routing configuration
│   │   ├── main.jsx          # React Entry point
│   │   └── index.css         # Global Styles & Design System
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/           # Database configurations
│   │   ├── controllers/      # Route logic & Business logic
│   │   ├── middleware/       # Auth & Error handling middlewares
│   │   ├── models/           # Mongoose schemas (User, Booking, Service, etc.)
│   │   ├── routes/           # Express routers
│   │   ├── utils/            # Utilities (JWT generator)
│   │   ├── seeder.js         # Database population script
│   │   └── app.js            # Express app configuration
│   ├── server.js             # Node entry point (Server & Socket.io)
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or Atlas URI)

### 1. Clone & Install Dependencies
**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd frontend
npm install
```

### 2. Environment Variables
In the `backend` folder, duplicate `.env.example` to `.env` and update the values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gharseva
JWT_SECRET=supersecretjwtkeyforgharseva2026
CLIENT_URL=http://localhost:5173
```

### 3. Database Seeding
To populate the database with dummy users, categories, and services:
```bash
cd backend
npm run data:import
```

### 4. Running the Application
**Start the Backend (Dev mode):**
```bash
cd backend
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔐 Demo Credentials (After Seeding)
- **Admin:** `admin@gharseva.com` | Pass: `password123`
- **Customer:** `customer@gharseva.com` | Pass: `password123`
- **Provider:** `provider@gharseva.com` | Pass: `password123`

---

## 📖 API Documentation (Highlights)

### Authentication
- `POST /api/auth/register` - Register new user (Customer/Provider/Admin)
- `POST /api/auth/login` - Authenticate & get JWT token
- `GET /api/auth/me` - Get current user profile

### Services & Categories
- `GET /api/categories` - List all service categories
- `GET /api/services` - List all available services (supports `?search=`)

### Bookings
- `POST /api/bookings` - Create a new booking (Customer)
- `GET /api/bookings/my` - Get customer bookings
- `GET /api/bookings/provider` - Get provider bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Admin
- `GET /api/admin/dashboard` - Get platform statistics
- `PUT /api/admin/providers/:id/verify` - Verify a provider profile

---

## 🔮 Future Enhancements
- Integration with Cloudinary for robust image uploads.
- Real-time chat integration via WebSockets.
- Razorpay / Stripe payment gateway integration.
- Advanced Geolocation-based provider filtering.
