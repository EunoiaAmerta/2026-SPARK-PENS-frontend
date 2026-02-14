import { useEffect, useState } from "react";
import CustomerTable from "./components/CustomerTable";
import CustomerForm from "./components/CustomerForm";
import { customerService } from "./services/customerService";
import type { Customer } from "./types/customer";

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        color: "white",
      }}
    >
      <h1>SparkPens - Customer Management</h1>

      {/* Kirim fungsi fetchCustomers ke Form agar bisa dipanggil setelah submit */}
      <CustomerForm onSuccess={fetchCustomers} />

      <hr style={{ margin: "40px 0" }} />

      <h2>Customer List</h2>
      {loading ? (
        <p>Memuat data dari server...</p>
      ) : (
        <CustomerTable customers={customers} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;
