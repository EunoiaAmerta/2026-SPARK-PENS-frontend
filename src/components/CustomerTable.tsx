import React from "react";
import type { Customer } from "../types/customer";

interface Props {
  customers: Customer[];
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
}

const CustomerTable: React.FC<Props> = ({ customers, onDelete, onEdit }) => {
  return (
    <div style={{ padding: "20px" }}>
      <table
        border={1}
        style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.status}</td>
              <td>
                {/* Sekarang onEdit sudah bisa dipanggil tanpa error */}
                <button onClick={() => onEdit(customer)}>Edit</button>
                <button
                  onClick={() => onDelete(customer.id)}
                  style={{ color: "red", marginLeft: "5px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
