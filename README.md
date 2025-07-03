# Restaurant POS System

Sistem Point of Sale (POS) modern untuk restoran dengan fitur lengkap untuk manajemen menu, pesanan, pengguna, dan laporan.

## Fitur Utama

### Frontend (React + TypeScript)
- **Dashboard Admin**: Statistik penjualan, grafik, dan overview bisnis
- **Manajemen Menu**: CRUD menu items dengan upload gambar
- **Manajemen User**: Kelola staff dan akses pengguna
- **Sistem Order**: Interface kasir untuk membuat pesanan
- **Riwayat Pesanan**: Tracking dan history semua transaksi
- **Laporan**: Analytics dan reporting lengkap
- **Work Shift Timer**: Sistem tracking jam kerja karyawan
- **Responsive Design**: Optimized untuk desktop dan mobile
- **Dark/Light Theme**: Mode tema yang dapat diubah
- **Real-time Updates**: Update data secara real-time

### Backend (Node.js + Express)
- **RESTful API**: API lengkap untuk semua operasi
- **Authentication**: JWT-based authentication dengan role-based access
- **Database**: MongoDB dengan Mongoose ODM
- **File Upload**: Cloudinary integration untuk upload gambar
- **Payment Gateway**: Integrasi Midtrans untuk pembayaran digital
- **Work Shift Management**: Sistem manajemen jam kerja
- **Reporting**: Advanced analytics dan reporting
- **Security**: Helmet, rate limiting, dan validasi input
- **Documentation**: API documentation dengan EJS views

## Tech Stack

### Frontend
- React 18 dengan TypeScript
- Vite untuk build tool
- Tailwind CSS untuk styling
- React Router untuk routing
- Axios untuk HTTP client
- React Hot Toast untuk notifications
- Recharts untuk grafik
- Lucide React untuk icons

### Backend
- Node.js dengan Express.js
- MongoDB dengan Mongoose
- JWT untuk authentication
- Cloudinary untuk file storage
- Midtrans untuk payment gateway
- EJS untuk templating
- Express Validator untuk validasi
- Helmet untuk security
- Morgan untuk logging

## Instalasi dan Setup

### Prerequisites
- Node.js (v16 atau lebih baru)
- MongoDB (local atau cloud)
- Cloudinary account
- Midtrans account (untuk payment gateway)

### 1. Clone Repository
```bash
git clone <repository-url>
cd restaurant-pos-system
```

### 2. Setup Backend
```bash
cd Backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env file dengan konfigurasi Anda
nano .env
```

### 3. Setup Frontend
```bash
cd Frontend
npm install

# Copy environment file
cp .env.example .env

# Edit .env file jika diperlukan
nano .env
```

### 4. Konfigurasi Environment Variables

#### Backend (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/coffee-shop

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Seed Database (Opsional)
```bash
cd Backend
npm run seed
```

### 6. Menjalankan Aplikasi

#### Development Mode
```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

#### Production Mode
```bash
# Backend
cd Backend
npm start

# Frontend
cd Frontend
npm run build
npm run preview
```

## Akses Aplikasi

### Frontend
- URL: http://localhost:5173
- Admin: admin@restaurant.com / admin123
- Cashier: sarah@restaurant.com / cashier123

### Backend
- API: http://localhost:5000/api
- Web Interface: http://localhost:5000
- API Documentation: http://localhost:5000/api
- API Testing: http://localhost:5000/api-test

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Menu Management
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)
- `PATCH /api/menu/:id/stock` - Update stock

### Order Management
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/stats` - Get order statistics

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/toggle-status` - Toggle user status

### Work Shift Management
- `GET /api/shifts/current` - Get current shift
- `GET /api/shifts` - Get all shifts
- `POST /api/shifts/clock-out` - Clock out from shift
- `GET /api/shifts/stats` - Get shift statistics

### Dashboard & Reports (Admin Only)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/reports/revenue` - Revenue report
- `GET /api/dashboard/reports/products` - Product report
- `GET /api/dashboard/reports/staff` - Staff report
- `GET /api/dashboard/reports/customers` - Customer report

### Payment
- `POST /api/payment/create` - Create payment link
- `POST /api/payment/notification` - Midtrans webhook
- `GET /api/payment/status/:orderId` - Get payment status

## Fitur Keamanan

- JWT Authentication dengan expiry
- Role-based access control (Admin/Cashier)
- Rate limiting untuk API
- Input validation dan sanitization
- CORS configuration
- Helmet untuk security headers
- Password hashing dengan bcrypt
- Work shift time tracking dan auto-logout

## Deployment

### Backend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Deploy dist folder ke hosting pilihan

### Database (MongoDB Atlas)
1. Buat cluster di MongoDB Atlas
2. Update MONGO_URI di environment variables
3. Whitelist IP addresses

## Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.