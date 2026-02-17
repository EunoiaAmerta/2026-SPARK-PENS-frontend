import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { roomService } from "../services/roomService";
import { bookingService } from "../services/bookingService";
import { useTheme } from "../context/ThemeContext";
import PublicHeader from "../components/PublicHeader";
import {
  Calendar,
  User,
  Building2,
  Send,
  FileText,
  Clock,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface BookedSlot {
  id: string;
  bookingStartDate: string;
  bookingEndDate: string;
  requesterName: string;
  status: string;
}

function BookingPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("17:00");
  const [formError, setFormError] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Get initial state from RoomPage navigation
  useEffect(() => {
    const state = location.state as {
      selectedRoom?: string;
      selectedDate?: string;
    };

    if (state?.selectedRoom) {
      setSelectedRoomId(state.selectedRoom);
      setValue("roomId", state.selectedRoom);
    }
    if (state?.selectedDate) {
      setStartDate(state.selectedDate);
      setEndDate(state.selectedDate);
    }
  }, [location.state, setValue]);

  useEffect(() => {
    roomService.getAll().then((res) => setRooms(Array.isArray(res) ? res : []));
  }, []);

  // Fetch booked slots when room or date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedRoomId) {
        setBookedSlots([]);
        return;
      }

      // Use startDate if available, otherwise use today's date
      const dateToFetch = startDate || new Date().toISOString().split("T")[0];

      setLoadingSlots(true);
      try {
        const bookings = await bookingService.getBookingsByRoom(
          selectedRoomId,
          dateToFetch,
        );
        if (bookings && bookings.length > 0) {
          setBookedSlots(
            bookings.map((b: any) => ({
              id: b.id,
              bookingStartDate: b.bookingStartDate,
              bookingEndDate: b.bookingEndDate,
              requesterName: b.requesterName,
              status: b.status,
            })),
          );
        } else {
          setBookedSlots([]);
        }
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [selectedRoomId, startDate]);

  // Format date and time together
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if a time slot overlaps with any booked slot
  const checkOverlap = (
    checkStartDate: string,
    checkEndDate: string,
  ): BookedSlot | null => {
    const checkStart = new Date(checkStartDate).getTime();
    const checkEnd = new Date(checkEndDate).getTime();

    for (const slot of bookedSlots) {
      const slotStart = new Date(slot.bookingStartDate).getTime();
      const slotEnd = new Date(slot.bookingEndDate).getTime();

      // Overlap if: (newStart < existingEnd) AND (newEnd > existingStart)
      if (checkStart < slotEnd && checkEnd > slotStart) {
        return slot;
      }
    }
    return null;
  };

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

    // Client-side overlap validation
    if (selectedRoomId) {
      const overlap = checkOverlap(
        startDateTime.toISOString(),
        endDateTime.toISOString(),
      );
      if (overlap) {
        setFormError(
          `Ruangan sudah dipinjam pada waktu tersebut! (${formatDateTime(
            overlap.bookingStartDate,
          )} - ${formatDateTime(overlap.bookingEndDate)} oleh ${overlap.requesterName})`,
        );
        return;
      }
    }

    try {
      setLoading(true);
      setFormError("");
      const bookingData = {
        // Konversi ke PascalCase untuk matching backend DTO
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
      setSelectedRoomId("");
      setBookedSlots([]);
    } catch (e: any) {
      // Handle error from backend (overlap validation)
      if (e.response?.data?.message) {
        setFormError(e.response.data.message);
      } else {
        alert("❌ Gagal mengirim permohonan.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = e.target.value;
    setSelectedRoomId(roomId);
    setValue("roomId", roomId);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setStartDate(date);
    // If endDate is empty or before startDate, set it to startDate
    if (!endDate || endDate < date) {
      setEndDate(date);
    }
  };

  return (
    <div className="main-content">
      <PublicHeader />
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
                value={selectedRoomId}
                onChange={handleRoomChange}
              >
                <option value="">-- Pilih Ruangan yang Tersedia --</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} • {r.building} • Kapasitas {r.capacity} orang
                  </option>
                ))}
              </select>
            </div>

            {/* Show booked slots for selected room */}
            {selectedRoomId && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "var(--bg-secondary)",
                  borderRadius: "8px",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Clock size={16} />
                  Jadwal Peminjaman {loadingSlots && "(Memuat...)"}
                </div>
                {bookedSlots.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {bookedSlots.map((booking, idx) => (
                      <div
                        key={booking.id || idx}
                        style={{
                          padding: "0.75rem",
                          background:
                            booking.status === "Approved"
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(245, 158, 11, 0.1)",
                          borderRadius: "6px",
                          borderLeft:
                            booking.status === "Approved"
                              ? "3px solid #22c55e"
                              : "3px solid #f59e0b",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {formatDateTime(booking.bookingStartDate)} -{" "}
                            {formatDateTime(booking.bookingEndDate)}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {booking.requesterName}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            color:
                              booking.status === "Approved"
                                ? "#22c55e"
                                : "#f59e0b",
                          }}
                        >
                          {booking.status === "Approved" ? (
                            <CheckCircle size={14} />
                          ) : (
                            <AlertCircle size={14} />
                          )}
                          {booking.status === "Approved"
                            ? "Dikonfirmasi"
                            : "Menunggu"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <CheckCircle size={16} color="#22c55e" />
                    Ruangan tersedia untuk booking
                  </div>
                )}
              </div>
            )}
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
                    onChange={handleStartDateChange}
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
