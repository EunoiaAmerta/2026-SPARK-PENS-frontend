import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./App.css";
import AdminBookingPage from "./pages/AdminBookingPage";
import AdminRoomPage from "./pages/AdminRoomPage";
import BookingPage from "./pages/BookingPage";
import RoomPage from "./pages/RoomPage";
import CustomerPage from "./pages/CustomerPage";
import {
  CalendarCheck,
  Settings,
  LayoutDashboard,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

// Komponen NavItem dengan logika Active Link
const NavItem = ({ to, icon: Icon, children }: any) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  return (
    <li>
      <Link to={to} className={`nav-item ${isActive ? "active" : ""}`}>
        <Icon size={18} /> {children}
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <LayoutDashboard size={24} color="var(--accent)" />
        <span>SPARK ADMIN</span>
      </div>

      <ul className="nav-list">
        <NavItem to="/admin/rooms" icon={Settings}>
          Kelola Ruangan
        </NavItem>
        <NavItem to="/admin/bookings" icon={CalendarCheck}>
          Approval Booking
        </NavItem>
      </ul>

      <div
        className="theme-toggle-wrapper"
        style={{ marginTop: "auto", padding: "1rem 0" }}
      >
        <Link
          to="/bookings"
          className="nav-item"
          style={{
            color: "#ef4444",
            marginBottom: "0.5rem",
            border: "1px solid #ef444422",
          }}
        >
          <LogOut size={18} /> Keluar ke Public
        </Link>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          <span>Mode {theme === "dark" ? "Terang" : "Gelap"}</span>
        </button>
      </div>
    </nav>
  );
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik: 
             Gunakan class 'center-wrapper' agar form booking 
             berada di tengah layar (Sentris)
          */}
        <Route
          path="/bookings"
          element={
            <div className="app-container public-page">
              <main className="main-content public-main">
                <div className="center-wrapper">
                  <BookingPage />
                </div>
              </main>
            </div>
          }
        />
        <Route
          path="/rooms"
          element={
            <div className="app-container public-page">
              <main className="main-content public-main">
                <RoomPage />
              </main>
            </div>
          }
        />
        <Route
          path="/customers"
          element={
            <div className="app-container public-page">
              <main className="main-content public-main">
                <CustomerPage />
              </main>
            </div>
          }
        />

        {/* Rute Admin: Menggunakan Sidebar */}
        <Route
          path="/admin/*"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="rooms" element={<AdminRoomPage />} />
                  <Route path="bookings" element={<AdminBookingPage />} />
                </Routes>
              </main>
            </div>
          }
        />

        {/* Redirect default ke Admin Booking (Approval) */}
        <Route path="/admin" element={<Navigate to="/admin/bookings" />} />

        {/* Redirect default ke Public Page */}
        <Route path="/" element={<Navigate to="/bookings" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
