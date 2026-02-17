import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEmailMode = !token;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Mohon masukkan email Anda");
      return;
    }

    setIsLoading(true);

    try {
      console.log("[Reset] Sending forgot password request for:", email);
      const response = await authService.forgotPassword({ email });
      console.log("[Reset] Response:", response);

      // Check if resetLink exists
      if (!response.resetLink) {
        console.error("[Reset] No resetLink in response");
        setError("Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      // Extract token and navigate to reset page
      // Use URL object to properly parse the link and handle special characters
      const resetUrl = new URL(response.resetLink);
      const tokenParam = resetUrl.searchParams.get("token");

      if (tokenParam) {
        console.log(
          "[Reset] Navigating to reset page with token:",
          tokenParam.substring(0, 20) + "...",
        );
        // Use replace instead of push to avoid adding to history
        navigate(
          `/reset-password?token=${encodeURIComponent(tokenParam)}&email=${encodeURIComponent(email)}`,
          { replace: true },
        );
        return;
      }

      // Fallback: show alert if parsing fails
      console.log("[Reset] Showing fallback alert with link");
      alert(`Link reset:\n${response.resetLink}`);
    } catch (err: any) {
      console.error("[Reset] Error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengirim link reset. Email mungkin tidak terdaftar.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
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

    // Decode the token from URL
    const decodedToken = decodeURIComponent(token);
    console.log("[ResetPassword] Original token from URL:", token);
    console.log("[ResetPassword] Decoded token:", decodedToken);
    console.log("[ResetPassword] Email from URL:", email);

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        token: decodedToken,
        newPassword: password,
      });

      console.log("[ResetPassword] Success:", response);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("[ResetPassword] Error:", err);
      console.error("[ResetPassword] Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          "Gagal mereset password. Token mungkin sudah expired.",
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
            <h2>Password Berhasil Diubah!</h2>
            <p>Mengarahkan ke halaman login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isEmailMode) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1>SPARK PENS</h1>
            <p>Lupa Password?</p>
          </div>

          <div className="login-box">
            <h2>Reset Password</h2>
            <p
              style={{
                marginBottom: "1.5rem",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
              }}
            >
              Masukkan email Anda. Kami akan mengirim link untuk mereset
              password.
            </p>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label htmlFor="email">
                  <Lock size={18} /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? "Mengirim..." : "Kirim Link Reset"}
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
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <ArrowLeft size={18} /> Kembali ke Login
              </button>
            </div>
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
          <p>Buat Password Baru</p>
        </div>

        <div className="login-box">
          <h2>Reset Password</h2>
          <p
            style={{
              marginBottom: "1.5rem",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            Masukkan password baru untuk akun Anda.
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

          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="password">
                <Lock size={18} /> Password Baru
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password baru (min 6 karakter)"
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
              {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
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
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ArrowLeft size={18} /> Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
