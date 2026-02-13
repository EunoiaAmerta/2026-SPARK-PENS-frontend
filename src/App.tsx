import CustomerTable from "./components/CustomerTable";
import CustomerForm from "./components/CustomerForm"; // 1. Import form-nya
import type { Customer } from "./types/customer";

const dummyData: Customer[] = [
  {
    id: "1",
    name: "Budi Utomo",
    email: "budi@pens.ac.id",
    phone: "08123456789",
    status: "Active",
  },
  {
    id: "2",
    name: "Ani Wijaya",
    email: "ani@pens.ac.id",
    phone: "08987654321",
    status: "Inactive",
  },
];

function App() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>SparkPens - Customer Management</h1>

      {/* 2. Tambahkan komponen Form di sini */}
      <CustomerForm />

      <hr style={{ margin: "40px 0" }} />

      {/* 3. Tabel di bawahnya */}
      <CustomerTable customers={dummyData} />
    </div>
  );
}

export default App;
