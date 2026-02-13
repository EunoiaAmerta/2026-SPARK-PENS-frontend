import CustomerTable from "./components/CustomerTable";
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
    <div>
      <h1>SparkPens - Customer Management</h1>
      <CustomerTable customers={dummyData} />
    </div>
  );
}

export default App;
