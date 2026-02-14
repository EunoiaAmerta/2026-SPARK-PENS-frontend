import { useEffect, useState } from "react";
import CustomerTable from "./components/CustomerTable";
import CustomerForm from "./components/CustomerForm";
import { customerService } from "./services/customerService";
import type { Customer } from "./types/customer";

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Fungsi untuk ambil data dari Backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const result: any = await customerService.getAll();

      // Debug: intip di console apakah benar result.data itu array
      console.log("Cek struktur data:", result);

      if (result && Array.isArray(result.data)) {
        setCustomers(result.data);
      } else if (Array.isArray(result)) {
        setCustomers(result);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await customerService.delete(id);
        alert("Data berhasil dihapus!");
        fetchCustomers(); // Refresh data tabel otomatis setelah hapus
      } catch (error) {
        console.error("Gagal menghapus data:", error);
        alert("Terjadi kesalahan saat menghapus data.");
      }
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    // Scroll ke atas otomatis agar user sadar form sudah terisi
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#1a1a2e",
        minHeight: "100vh",
        color: "#e2e2e2",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <header
          style={{
            borderBottom: "2px solid #16213e",
            marginBottom: "30px",
            paddingBottom: "10px",
          }}
        >
          <h1 style={{ color: "#4ecca3", margin: 0 }}>✨ SparkPens</h1>
          <p style={{ opacity: 0.7 }}>
            Customer Relationship Management System
          </p>
        </header>

        <section style={{ marginBottom: "40px" }}>
          <CustomerForm
            onSuccess={() => {
              fetchCustomers();
              setEditingCustomer(null);
            }}
            initialData={editingCustomer}
          />
        </section>

        <section
          style={{
            backgroundColor: "#16213e",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>
            Customer Directory
          </h2>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner"></div>{" "}
              {/* Nanti tambahkan CSS sedikit */}
              <p>Retrieving data from secure vault...</p>
            </div>
          ) : (
            <CustomerTable
              customers={customers}
              onDelete={handleDelete}
              onEdit={handleEditClick}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
