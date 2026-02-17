import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Get user info - from location state OR from auth context
  const email = location.state?.email || user?.email || "";
  const userId = location.state?.userId || user?.id || 0;

  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [authLoading, isAuthenticated, navigate, location]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-box" style={{ textAlign: "center" }}>
            <p>Memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Mohon isi semua field");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    setIsLoading(true);

    try {
      await authService.setPassword({
        userId: userId,
        newPassword: password,
      });

      setSuccess(true);

      // Navigate immediately to bookings - user is already logged in
      // The password was just saved to the database
      setTimeout(() => {
        if (user?.role === "Admin") {
          navigate("/admin/rooms", { replace: true });
        } else {
          navigate("/bookings", { replace: true });
        }
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Gagal menyimpan password. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-box" style={{ textAlign: "center" }}>
            <div
              className="success-icon"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <CheckCircle size={64} color="var(--success, #22c55e)" />
            </div>
            <h2>Password Berhasil Disimpan!</h2>
            <p>
              Sekarang Anda dapat menggunakan email dan password untuk login.
            </p>
            <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
              Mengarahkan ke halaman utama...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>SPARK PENS</h1>
          <p>Lengkapi Profil Anda</p>
        </div>

        <div className="login-box">
          <h2>Buat Password</h2>
          <p
            style={{
              marginBottom: "1.5rem",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            Anda login menggunakan Google. Silakan buat password untuk dapat
            login juga menggunakan email dan password.
          </p>

          {email && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                background: "var(--bg-secondary)",
                borderRadius: "8px",
                fontSize: "0.9rem",
              }}
            >
              <strong>Email:</strong> {email}
            </div>
          )}

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">
                <Lock size={18} /> Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password (min 6 karakter)"
                  required
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={18} /> Konfirmasi Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan ulang password"
                  required
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </form>

          <div className="login-footer">
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Lewati untuk saat ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
