import { useEffect, useState } from "react";
import { roomService } from "../services/roomService";
import { Users, Building2, CheckCircle } from "lucide-react";

const RoomPage = () => {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    roomService.getAll().then(setRooms);
  }, []);

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

      {rooms.length > 0 ? (
        <div className="room-grid">
          {rooms.map((room) => (
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

                <div className="room-status">
                  <CheckCircle size={16} />
                  <span>Tersedia</span>
                </div>

                <button className="btn-book-room">Pesan Ruangan</button>
              </div>
            </div>
          ))}
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
