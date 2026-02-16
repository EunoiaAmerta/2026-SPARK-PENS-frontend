import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomService } from "../services/roomService";
import { bookingService } from "../services/bookingService";
import { Calendar, Users, Building2, CheckCircle, Clock } from "lucide-react";

interface BookedSlot {
  id: string;
  bookingStartDate: string;
  bookingEndDate: string;
  requesterName: string;
  status: string;
}

const RoomPage = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [bookedSlots, setBookedSlots] = useState<Record<string, BookedSlot[]>>(
    {},
  );
  const [loadingSlots, setLoadingSlots] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    roomService.getAll().then((res) => setRooms(Array.isArray(res) ? res : []));
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;

      setLoadingSlots(true);
      const slots: Record<string, BookedSlot[]> = {};

      try {
        // Fetch bookings for all rooms on selected date
        const promises = rooms.map(async (room) => {
          const bookings = await bookingService.getBookingsByRoom(
            room.id,
            selectedDate,
          );
          if (bookings && bookings.length > 0) {
            slots[room.id] = bookings.map((b: any) => ({
              id: b.id,
              bookingStartDate: b.bookingStartDate,
              bookingEndDate: b.bookingEndDate,
              requesterName: b.requesterName,
              status: b.status,
            }));
          }
        });

        await Promise.all(promises);
        setBookedSlots(slots);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      } finally {
        setLoadingSlots(false);
      }
    };

    if (rooms.length > 0) {
      fetchBookedSlots();
    }
  }, [selectedDate, rooms]);

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

  const getRoomStatus = (roomId: string) => {
    const slots = bookedSlots[roomId];
    if (!slots || slots.length === 0) {
      return { available: true, label: "Tersedia", icon: CheckCircle };
    }
    return { available: false, label: "Dipesan", icon: Clock };
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon-container">
            <Building2 size={32} color="white" />
          </div>
          <div>
            <h1 className="page-title">Pilih Ruangan</h1>
            <p className="page-subtitle">
              Temukan ruangan yang sesuai untuk kegiatanmu
            </p>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "var(--glass-bg)",
          borderRadius: "12px",
          border: "1px solid var(--glass-border)",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 500,
            marginBottom: "0.5rem",
          }}
        >
          <Calendar size={18} />
          Pilih Tanggal:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="form-input"
          style={{ maxWidth: "300px" }}
        />
        {loadingSlots && (
          <span style={{ marginLeft: "1rem", color: "var(--text-secondary)" }}>
            Memuat data booking...
          </span>
        )}
      </div>

      {rooms.length > 0 ? (
        <div className="room-grid">
          {rooms.map((room) => {
            const status = getRoomStatus(room.id);
            const StatusIcon = status.icon;
            const roomBookings = bookedSlots[room.id] || [];

            return (
              <div key={room.id} className="room-card">
                <div className="room-card-image">
                  <div className="room-image-placeholder">
                    <Building2 size={48} />
                  </div>
                </div>
                <div className="room-info">
                  <h3 className="room-name">{room.name}</h3>

                  <div className="room-details">
                    <div className="detail-badge">
                      <Users size={16} />
                      <span>{room.capacity} Orang</span>
                    </div>
                  </div>

                  {/* Status & Booked Slots */}
                  <div
                    className="room-status"
                    style={{
                      color: status.available ? "#22c55e" : "#f59e0b",
                    }}
                  >
                    <StatusIcon size={16} />
                    <span>{status.label}</span>
                  </div>

                  {/* Show booked slots if any */}
                  {roomBookings.length > 0 && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.75rem",
                        background: "var(--bg-secondary)",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Clock size={14} />
                        Jadwal Peminjaman:
                      </div>
                      {roomBookings.map((booking, idx) => (
                        <div
                          key={booking.id || idx}
                          style={{
                            padding: "0.5rem",
                            marginBottom: "0.5rem",
                            background:
                              booking.status === "Approved"
                                ? "rgba(34, 197, 94, 0.1)"
                                : "rgba(245, 158, 11, 0.1)",
                            borderRadius: "6px",
                            borderLeft:
                              booking.status === "Approved"
                                ? "3px solid #22c55e"
                                : "3px solid #f59e0b",
                          }}
                        >
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
                            {booking.requesterName} •{" "}
                            <span
                              style={{
                                color:
                                  booking.status === "Approved"
                                    ? "#22c55e"
                                    : "#f59e0b",
                              }}
                            >
                              {booking.status === "Approved"
                                ? "Dikonfirmasi"
                                : "Menunggu"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn-book-room"
                    onClick={() =>
                      navigate("/bookings", {
                        state: { selectedRoom: room.id, selectedDate },
                      })
                    }
                  >
                    Pesan Ruangan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Building2 size={48} />
          </div>
          <h3>Belum Ada Ruangan</h3>
          <p>Cobalah lagi nanti</p>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
