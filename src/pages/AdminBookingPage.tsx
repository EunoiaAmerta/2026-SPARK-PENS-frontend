import { useEffect, useState } from "react";
import { bookingService } from "../services/bookingService";
import {
  CalendarCheck,
  Clock,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Hourglass,
  FileText,
} from "lucide-react";

// Helper function to parse date safely
const parseDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;

  // If it's already a Date object
  if (dateValue instanceof Date) return dateValue;

  // Try to parse as ISO string
  const parsed = new Date(dateValue);
  if (!isNaN(parsed.getTime())) return parsed;

  // Try parsing .NET JSON date format (e.g., "/Date(1234567890000)/")
  if (typeof dateValue === "string" && dateValue.startsWith("/Date(")) {
    const match = dateValue.match(/\/Date\((-?\d+)\)\//);
    if (match) {
      return new Date(parseInt(match[1]));
    }
  }

  return null;
};

// Helper to format date for display
const formatDate = (dateValue: any): string => {
  const date = parseDate(dateValue);
  if (!date) return "-";

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get date range - handles both PascalCase (from backend) and legacy fields
const getDateRange = (booking: any): string => {
  const startDate = booking.BookingStartDate || booking.bookingStartDate;
  const endDate = booking.BookingEndDate || booking.bookingEndDate;

  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  if (booking.BookingDate || booking.bookingDate) {
    return formatDate(booking.BookingDate || booking.bookingDate);
  }

  return "-";
};

// Booking Card Component
const BookingCard = ({
  booking,
  onApprove,
  onReject,
  onDelete,
  loadingId,
  showActions = true,
}: {
  booking: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  loadingId: string | null;
  showActions?: boolean;
}) => (
  <div
    className="kanban-card"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--glass-border)",
      borderRadius: "14px",
      padding: "16px",
    }}
  >
    <div
      className="kanban-card-header"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        marginBottom: "12px",
      }}
    >
      <div
        className="avatar"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
        }}
      >
        <User size={16} />
      </div>
      <div
        className="requester-info-mini"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          flex: "1",
          minWidth: "0",
        }}
      >
        <span className="requester-name-mini">
          {booking.RequesterName || booking.requesterName || "-"}
        </span>
        <span className="requester-email-mini">
          {booking.RequesterEmail || booking.requesterEmail || "-"}
        </span>
      </div>
    </div>

    <div className="kanban-card-body">
      <div className="kanban-detail">
        <MapPin size={14} />
        <span>
          {booking.room?.name || booking.Room?.name || booking.roomId || "-"}
        </span>
      </div>
      <div className="kanban-detail">
        <Clock size={14} />
        <span>{getDateRange(booking)}</span>
      </div>
      <div className="kanban-detail">
        <User size={14} />
        <span>{booking.RequesterPhone || booking.requesterPhone || "-"}</span>
      </div>
      {(booking.Purpose || booking.purpose) && (
        <div
          className="kanban-detail"
          style={{
            marginTop: "8px",
            padding: "8px",
            background: "var(--bg-secondary)",
            borderRadius: "6px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: "12px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FileText size={12} /> Keperluan:
          </span>
          <span style={{ fontSize: "13px", lineHeight: "1.4" }}>
            {booking.Purpose || booking.purpose}
          </span>
        </div>
      )}
    </div>

    {showActions && (
      <div className="kanban-card-footer">
        <button
          onClick={() => onApprove(booking.id)}
          disabled={loadingId === booking.id}
          className="btn-icon approve"
          title="Setujui"
        >
          {loadingId === booking.id ? (
            <div className="spinner-small"></div>
          ) : (
            <CheckCircle size={16} />
          )}
        </button>
        <button
          onClick={() => onReject(booking.id)}
          disabled={loadingId === booking.id}
          className="btn-icon reject"
          title="Tolak"
        >
          {loadingId === booking.id ? (
            <div className="spinner-small"></div>
          ) : (
            <XCircle size={16} />
          )}
        </button>
        <button
          onClick={() => onDelete(booking.id)}
          disabled={loadingId === booking.id}
          className="btn-icon delete"
          title="Hapus"
        >
          {loadingId === booking.id ? (
            <div className="spinner-small"></div>
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    )}
  </div>
);

// Kanban Column Component
const KanbanColumn = ({
  title,
  icon: Icon,
  bookings,
  color,
  onApprove,
  onReject,
  onDelete,
  loadingId,
}: {
  title: string;
  icon: any;
  bookings: any[];
  color: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  loadingId: string | null;
}) => (
  <div
    className="kanban-column"
    style={{
      background: "var(--glass-bg)",
      borderRadius: "18px",
      border: "1px solid var(--glass-border)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
  >
    <div
      className="kanban-column-header"
      style={{
        borderTop: `4px solid ${color}`,
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Icon size={20} style={{ color }} />
      <span className="kanban-column-title">{title}</span>
      <span className="kanban-column-count">{bookings.length}</span>
    </div>
    <div
      className="kanban-column-body"
      style={{
        flex: "1",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflowY: "auto",
      }}
    >
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
            loadingId={loadingId}
            showActions={title === "Menunggu"}
          />
        ))
      ) : (
        <div className="kanban-empty">
          <p>Tidak ada booking</p>
        </div>
      )}
    </div>
  </div>
);

function AdminBookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadBookings = async () => {
    const data = await bookingService.getAll();
    setBookings(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAction = async (
    id: string,
    newStatus: "Approved" | "Rejected",
  ) => {
    let rejectionReason: string | undefined;
    if (newStatus === "Rejected") {
      const reason = window.prompt("Masukkan alasan penolakan (opsional):");
      if (reason === null) return;
      rejectionReason = reason || undefined;
    }

    try {
      setLoadingId(id);
      await bookingService.updateStatus(id, newStatus, rejectionReason);
      await loadBookings();

      if (newStatus === "Approved") {
        alert(`✅ Booking berhasil disetujui!`);
      } else {
        alert(
          `❌ Booking telah ditolak${rejectionReason ? ` dengan alasan: ${rejectionReason}` : ""}`,
        );
      }
    } catch (error) {
      alert("Waduh, gagal update status ke server!");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus booking ini?")) return;

    try {
      setLoadingId(id);
      await bookingService.delete(id);
      await loadBookings();
      alert("Booking berhasil dihapus!");
    } catch (error) {
      alert("Gagal menghapus booking!");
    } finally {
      setLoadingId(null);
    }
  };

  // Filter bookings by status
  const pendingBookings = bookings.filter(
    (b) => (b.Status || b.status || "Pending") === "Pending",
  );
  const rejectedBookings = bookings.filter(
    (b) => (b.Status || b.status) === "Rejected",
  );
  const approvedBookings = bookings.filter(
    (b) => (b.Status || b.status) === "Approved",
  );

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon-container">
            <CalendarCheck size={32} color="white" />
          </div>
          <div>
            <h1 className="page-title">Persetujuan Booking</h1>
            <p className="page-subtitle">Total: {bookings.length} permintaan</p>
          </div>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div
          className="kanban-board"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            width: "100%",
          }}
        >
          <KanbanColumn
            title="Menunggu"
            icon={Hourglass}
            bookings={pendingBookings}
            color="#f59e0b"
            onApprove={(id) => handleAction(id, "Approved")}
            onReject={(id) => handleAction(id, "Rejected")}
            onDelete={handleDelete}
            loadingId={loadingId}
          />
          <KanbanColumn
            title="Ditolak"
            icon={XCircle}
            bookings={rejectedBookings}
            color="#ef4444"
            onApprove={(id) => handleAction(id, "Approved")}
            onReject={(id) => handleAction(id, "Rejected")}
            onDelete={handleDelete}
            loadingId={loadingId}
          />
          <KanbanColumn
            title="Disetujui"
            icon={CheckCircle}
            bookings={approvedBookings}
            color="#22c55e"
            onApprove={(id) => handleAction(id, "Approved")}
            onReject={(id) => handleAction(id, "Rejected")}
            onDelete={handleDelete}
            loadingId={loadingId}
          />
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertCircle size={48} />
          </div>
          <h3>Tidak Ada Permintaan</h3>
          <p>Semua booking sudah disetujui atau belum ada permintaan baru</p>
        </div>
      )}
    </div>
  );
}

export default AdminBookingPage;
