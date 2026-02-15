import { useEffect, useState } from "react";
import { roomService } from "../services/roomService";
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Building,
  Users,
  X,
  Check,
  XCircle,
} from "lucide-react";

function AdminRoomPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    building: "",
    floor: 1,
    capacity: 20,
    description: "",
    isAvailable: true,
  });

  const loadRooms = async () => {
    const res = await roomService.getAll();
    setRooms(Array.isArray(res) ? res : []);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "number"
          ? parseInt(value)
          : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
    });
  };

  const handleEditRoom = (room: any) => {
    setEditingRoomId(room.id);
    setFormData({
      name: room.name,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      description: room.description,
      isAvailable: room.isAvailable,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRoomId(null);
    setFormData({
      name: "",
      building: "",
      floor: 1,
      capacity: 20,
      description: "",
      isAvailable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.building) {
      alert("Nama ruangan dan building harus diisi!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        building: formData.building,
        floor: formData.floor,
        capacity: formData.capacity,
        description: formData.description,
        isAvailable: formData.isAvailable,
      };

      if (editingRoomId) {
        const updatePayload = {
          id: editingRoomId,
          ...payload,
        };
        await roomService.update(editingRoomId, updatePayload);
        alert("✅ Ruangan berhasil diperbarui!");
      } else {
        await roomService.create(payload);
        alert("✅ Ruangan berhasil ditambahkan!");
      }

      await loadRooms();
      handleCloseForm();
    } catch (error: any) {
      const isUpdate = !!editingRoomId;
      const defaultMessage = isUpdate
        ? "Gagal memperbarui ruangan!"
        : "Gagal menambahkan ruangan!";

      const errorMessage =
        error?.response?.data?.message || error?.message || defaultMessage;

      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) {
      try {
        await roomService.delete(id);
        await loadRooms();
      } catch (error) {
        alert("Gagal menghapus ruangan!");
      }
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon-container">
            <Settings size={32} color="white" />
          </div>
          <div>
            <h1 className="page-title">Master Ruangan</h1>
            <p className="page-subtitle">{rooms.length} ruangan tersedia</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingRoomId(null);
            setFormData({
              name: "",
              building: "",
              floor: 1,
              capacity: 20,
              description: "",
              isAvailable: true,
            });
            setShowForm(true);
          }}
          className="btn-create"
        >
          <Plus size={18} />
          Tambah Ruangan
        </button>
      </div>

      {/* Modal Form Tambah/Edit Ruangan */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {editingRoomId ? "✏️ Edit Ruangan" : "➕ Tambah Ruangan Baru"}
              </h2>
              <button onClick={handleCloseForm} className="btn-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="room-form">
              <div className="form-group">
                <label className="form-label">Nama Ruangan *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Lab Komputer A"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Gedung / Building *</label>
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    placeholder="Contoh: Gedung A"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lantai</label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    min="0"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kapasitas (orang)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi ruangan, fasilitas, dll..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  <span>Ruangan Tersedia</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="btn-cancel"
                >
                  Batal
                </button>
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading
                    ? "Menyimpan..."
                    : editingRoomId
                      ? "Perbarui Ruangan"
                      : "Simpan Ruangan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel Ruangan */}
      {rooms.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Ruangan</th>
                <th>Gedung</th>
                <th>Lantai</th>
                <th>Kapasitas</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="room-name-cell">
                      <Building size={18} />
                      <span>{r.name}</span>
                    </div>
                  </td>
                  <td>{r.building}</td>
                  <td>{r.floor}</td>
                  <td>
                    <div className="capacity-cell">
                      <Users size={16} />
                      <span>{r.capacity} orang</span>
                    </div>
                  </td>
                  <td className="description-cell">{r.description || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${r.isAvailable ? "available" : "unavailable"}`}
                    >
                      {r.isAvailable ? (
                        <>
                          <Check size={14} /> Tersedia
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> Tidak Tersedia
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditRoom(r)}
                        className="btn-icon btn-edit"
                        title="Edit Ruangan"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(r.id)}
                        className="btn-icon btn-delete"
                        title="Hapus Ruangan"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Building size={48} />
          </div>
          <h3>Belum Ada Ruangan</h3>
          <p>Mulai dengan menambahkan ruangan baru</p>
        </div>
      )}
    </div>
  );
}

export default AdminRoomPage;
