# 🖊️ SparkPens Frontend System

**Integrated Room Booking & Customer Management Web Application**

## 📖 Description

SparkPens Frontend adalah aplikasi web frontend yang dirancang untuk berinteraksi dengan backend API SparkPens. Aplikasi ini mengelola tampilan untuk peminjaman ruangan dan manajemen informasi pelanggan (Customer) di lingkungan kampus PENS. Proyek ini bertujuan untuk memberikan pengalaman pengguna yang intuitif dan responsif.

## ✨ Features

- **User Authentication**: Login dengan email/password dan Google OAuth
- **Role-based Access**: Akses berbeda untuk Admin dan User (Tamu)
- **Admin Dashboard**:
  - Kelola Ruangan (Create, Read, Update)
  - Approval Booking (Terima/Tolak peminjaman)
- **Public Pages**:
  - Halaman Booking untuk tamu
  - Lihat Daftar Ruangan
  - Kelola Data Pelanggan
- **Password Management**:
  - Lupa Password dengan reset link via email
  - Set Password untuk pengguna Google
- **Dark/Light Theme**: Dukungan tema gelap dan terang
- **Responsive Design**: Tampilan optimal di berbagai ukuran layar

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **UI Icons**: Lucide React
- **Google OAuth**: @react-oauth/google
- **Form Handling**: React Hook Form
- **Deployment**: Vercel

## ⚙️ Installation

1. Clone repositori ini ke mesin lokal Anda.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` berdasarkan contoh:
   ```bash
   cp .env.example .env
   ```
4. Konfigurasi environment variables di `.env`:
   ```env
   VITE_API_URL=https://spark-pens-api.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```
5. Jalankan aplikasi dalam mode development:
   ```bash
   npm run dev
   ```

## 🚀 Usage

### Development

```bash
npm run dev
```

Akses aplikasi di: http://localhost:5173

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🌐 Environment Variables

| Variable                | Description            | Required               |
| ----------------------- | ---------------------- | ---------------------- |
| `VITE_API_URL`          | Backend API URL        | Yes                    |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes (for Google Login) |

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── CustomerForm.tsx
│   ├── CustomerTable.tsx
│   ├── PublicHeader.tsx
│   └── layouts/
├── context/           # React Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   ├── AdminBookingPage.tsx
│   ├── AdminRoomPage.tsx
│   ├── BookingPage.tsx
│   ├── CustomerPage.tsx
│   ├── LoginPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── RoomPage.tsx
│   └── SetPasswordPage.tsx
├── services/          # API service modules
│   ├── api.ts
│   ├── authService.ts
│   ├── bookingService.ts
│   ├── customerService.ts
│   └── roomService.ts
├── types/             # TypeScript type definitions
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🔗 API Endpoints

Aplikasi ini terhubung dengan SparkPens Backend API. Pastikan backend sudah berjalan dan terkoneksi.

### Authentication

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/set-password` - Set password for Google users

### Rooms

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room (Admin)
- `PUT /api/rooms/{id}` - Update room (Admin)
- `DELETE /api/rooms/{id}` - Delete room (Admin)

### Bookings

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}` - Update booking status (Admin)

### Customers

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer (Soft delete)

## 🌐 Deployment

### Vercel (Recommended)

1. Push kode ke GitHub
2. Import project di Vercel
3. Tambahkan environment variables:
   - `VITE_API_URL`
   - `VITE_GOOGLE_CLIENT_ID`
4. Deploy secara otomatis

### Manual Build

```bash
npm run build
# Upload folder dist ke hosting
```

## 📝 License

Distributed under the MIT License.

## 👤 Author

- Kratos Spartan - Frontend Developer - [GitHub Profile](https://github.com/EunoiaAmerta)
