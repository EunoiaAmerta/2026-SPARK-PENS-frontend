import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { roomService } from "../services/roomService";
import { bookingService } from "../services/bookingService";
import { useTheme } from "../context/ThemeContext";
import {
  Calendar,
  User,
  Building2,
  Send,
  FileText,
  Clock,
  Sun,
  Moon,
} from "lucide-react";

function BookingPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("17:00");
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, reset } = useForm();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    roomService.getAll().then((res) => setRooms(Array.isArray(res) ? res : []));
  }, []);

  const onSubmit = async (data: any) => {
    // Validate time ranges and end date
    if (!startDate || !endDate || !startTime || !endTime) {
      setFormError("Tanggal dan waktu awal & akhir harus diisi!");
      return;
    }

    // Validate time format (HH:MM)
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);

    if (startHour < 8 || startHour >= 21) {
      setFormError("Waktu mulai harus antara jam 08:00 - 21:00");
      return;
    }

    if (endHour < 8 || endHour > 21) {
      setFormError("Waktu selesai harus antara jam 08:00 - 21:00");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      setFormError("Waktu selesai harus setelah waktu mulai!");
      return;
    }

    try {
      setLoading(true);
      setFormError("");
      const bookingData = {
        // Konversi ke PascalCase untuk匹配 backend DTO
        RoomId: data.roomId,
        RequesterName: data.requesterName,
        RequesterEmail: data.requesterEmail,
        RequesterPhone: data.requesterPhone,
        BookingStartDate: startDateTime.toISOString(),
        BookingEndDate: endDateTime.toISOString(),
        Purpose: data.purpose,
      };
      await bookingService.create(bookingData);
      alert("✅ Sukses! Permohonan booking telah dikirim.");
      reset();
      setStartDate("");
      setEndDate("");
      setStartTime("08:00");
      setEndTime("17:00");
    } catch (e) {
      alert("❌ Gagal mengirim permohonan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div
        className="booking-hero"
        style={{ position: "sticky", top: 0, zIndex: 100 }}
      >
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--glass-border)",
          }}
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <div className="booking-hero-content">
          <h1 className="booking-title">Ajukan Permohonan Booking</h1>
          <p className="booking-subtitle">
            Isi formulir di bawah untuk melakukan pemesanan ruangan
          </p>
        </div>
      </div>

      <div className="booking-form-wrapper">
        <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
          {/* Room Selection */}
          <div className="form-section">
            <div className="form-section-header">
              <Building2 size={20} />
              <h3>Pilih Ruangan</h3>
            </div>
            <div className="form-group">
              <select
                {...register("roomId", { required: "Ruangan harus dipilih" })}
                className="form-select"
              >
                <option value="">-- Pilih Ruangan yang Tersedia --</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} • {r.building} • Kapasitas {r.capacity} orang
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal Info */}
          <div className="form-section">
            <div className="form-section-header">
              <User size={20} />
              <h3>Data Peminjam</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <div className="form-input-wrapper">
                  <input
                    {...register("requesterName", {
                      required: "Nama wajib diisi",
                    })}
                    placeholder="Contoh: Budi Santoso"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email PENS</label>
                <div className="form-input-wrapper">
                  <input
                    {...register("requesterEmail", {
                      required: "Email wajib diisi",
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    })}
                    type="email"
                    placeholder="nama@pens.ac.id"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nomor Telepon</label>
                <div className="form-input-wrapper">
                  <input
                    {...register("requesterPhone", {
                      required: "Nomor telepon wajib diisi",
                    })}
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="form-section">
            <div className="form-section-header">
              <Clock size={20} />
              <h3>Waktu Pelaksanaan</h3>
            </div>

            {formError && (
              <div className="form-error-message">⚠️ {formError}</div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Tanggal Mulai</label>
                <div className="form-input-wrapper">
                  <Calendar size={18} className="input-icon" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="form-input with-icon"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Jam Mulai</label>
                <div className="form-input-wrapper">
                  <Clock size={18} className="input-icon" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    min="08:00"
                    max="21:00"
                    className="form-input with-icon"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Tanggal Selesai</label>
                <div className="form-input-wrapper">
                  <Calendar size={18} className="input-icon" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="form-input with-icon"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Jam Selesai</label>
                <div className="form-input-wrapper">
                  <Clock size={18} className="input-icon" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    min="08:00"
                    max="21:00"
                    className="form-input with-icon"
                  />
                </div>
              </div>
            </div>

            <p className="form-hint">
              Jam kerja: 08:00 - 21:00 • Bisa booking lebih dari sehari
            </p>
          </div>

          {/* Purpose */}
          <div className="form-section">
            <div className="form-section-header">
              <FileText size={20} />
              <h3>Keperluan Kegiatan</h3>
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi Kegiatan</label>
              <textarea
                {...register("purpose", { required: "Deskripsi wajib diisi" })}
                rows={4}
                placeholder="Jelaskan detail kegiatan, agenda, dan peserta..."
                className="form-textarea"
              />
              <p className="form-hint">Minimal 10 karakter</p>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <>
                <span className="spinner-mini"></span>
                Mengirim...
              </>
            ) : (
              <>
                <Send size={18} />
                Kirim Permohonan
              </>
            )}
          </button>

          <p className="form-note">
            Permohonan Anda akan ditinjau oleh admin. Anda akan menerima
            notifikasi via email.
          </p>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
