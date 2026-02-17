import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { Lock, User, AlertCircle } from "lucide-react";

// Google Client ID - Replace with your actual Client ID
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({ username, password });
      login(response.token, response.user);

      // Redirect based on role
      if (response.user.role === "Admin") {
        navigate("/admin/rooms");
      } else {
        navigate("/bookings");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.googleLogin(
        credentialResponse.credential,
      );

      // Check if user needs to set password
      if (response.needsPasswordSetup) {
        // IMPORTANT: Save user to localStorage FIRST so they're logged in
        // Then navigate to set password page
        login(response.token, response.user);

        // Navigate to set password page with user info
        navigate("/set-password", {
          state: {
            email: response.user.email,
            userId: response.user.id,
          },
        });
        return;
      }

      login(response.token, response.user);

      // Redirect based on role
      if (response.user.role === "Admin") {
        navigate("/admin/rooms");
      } else {
        navigate("/bookings");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Google login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login was unsuccessful. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1>SPARK PENS</h1>
            <p>Sistem Peminjaman Ruangan</p>
          </div>

          <div className="login-box">
            <h2>Login</h2>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label htmlFor="username">
                  <User size={18} /> Email
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
              </div>

              <div
                style={{
                  textAlign: "right",
                  marginBottom: "1rem",
                  marginTop: "-0.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                  }}
                >
                  Lupa Password?
                </button>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </button>
            </form>

            <div className="divider">
              <span>atau</span>
            </div>

            <div className="google-login">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                width="100%"
              />
            </div>
          </div>

          <div className="login-footer">
            <a href="/bookings">Lanjut sebagai Tamu</a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
