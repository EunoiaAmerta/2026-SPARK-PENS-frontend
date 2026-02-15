import { useEffect, useState } from "react";
import CustomerForm from "../components/CustomerForm"; // Asumsi komponen ini sudah ada
import { customerService } from "../services/customerService";
import type { Customer } from "../types/customer";
import { useTheme } from "../context/ThemeContext";
import {
  Users,
  Trash2,
  Edit2,
  PlusCircle,
  Mail,
  Phone,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";

function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const result: any = await customerService.getAll();
      setCustomers(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Yakin ingin menghapus data peminjam ini secara permanen?")
    ) {
      await customerService.delete(id);
      fetchCustomers();
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    fetchCustomers();
    setEditingCustomer(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon-container">
            <Users size={32} color="white" />
          </div>
          <div>
            <h1 className="page-title">Data Peminjam</h1>
            <p className="page-subtitle">
              {customers.length} peminjam terdaftar
            </p>
          </div>
        </div>
        <button
          className="btn-create"
          onClick={() => {
            setEditingCustomer(null);
            setShowForm(!showForm);
          }}
        >
          <PlusCircle size={18} /> {showForm ? "Tutup" : "Tambah"}
        </button>
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          style={{ padding: "10px 16px", marginLeft: "10px" }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Form Section (Conditional Rendering) */}
      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>
              {editingCustomer ? "✏️ Edit Peminjam" : "➕ Tambah Peminjam Baru"}
            </h3>
          </div>
          <CustomerForm
            onSuccess={handleSuccess}
            initialData={editingCustomer}
          />
        </div>
      )}

      {/* Customers List Section */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat data...</p>
        </div>
      ) : customers.length > 0 ? (
        <div className="customers-list">
          {customers.map((c: any) => (
            <div key={c.id} className="customer-card">
              <div className="customer-card-header">
                <div className="customer-avatar">
                  <Users size={20} />
                </div>
                <div className="customer-name">
                  <h3>{c.name}</h3>
                </div>
              </div>

              <div className="customer-card-body">
                <div className="customer-detail">
                  <Mail size={16} />
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{c.email}</span>
                  </div>
                </div>

                <div className="customer-detail">
                  <Phone size={16} />
                  <div>
                    <span className="detail-label">Telepon</span>
                    <span className="detail-value">{c.phone || "-"}</span>
                  </div>
                </div>

                {c.address && (
                  <div className="customer-detail">
                    <MapPin size={16} />
                    <div>
                      <span className="detail-label">Alamat/Instansi</span>
                      <span className="detail-value">{c.address}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="customer-card-actions">
                <button
                  onClick={() => handleEditClick(c)}
                  className="btn-icon btn-edit"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="btn-icon btn-delete"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={48} />
          </div>
          <h3>Belum Ada Data Peminjam</h3>
          <p>Mulai dengan menambahkan peminjam baru</p>
        </div>
      )}
    </div>
  );
}

export default CustomerPage;
