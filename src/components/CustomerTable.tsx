import React from "react";
import type { Customer } from "../types/customer";

interface Props {
  customers: Customer[];
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
}

const CustomerTable: React.FC<Props> = ({ customers, onDelete, onEdit }) => {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
      >
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #0f3460" }}>
            <th style={{ padding: "12px" }}>Customer</th>
            <th style={{ padding: "12px" }}>Contact</th>
            <th style={{ padding: "12px" }}>Status</th>
            <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              style={{ borderBottom: "1px solid #0f3460", transition: "0.3s" }}
            >
              <td style={{ padding: "15px 12px" }}>
                <div style={{ fontWeight: "bold" }}>{customer.name}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                  {customer.address}
                </div>
              </td>
              <td style={{ padding: "12px" }}>
                <div>{customer.email}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                  {customer.phone}
                </div>
              </td>
              <td style={{ padding: "12px" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    backgroundColor:
                      customer.status === "active" ? "#1b4332" : "#432818",
                    color: customer.status === "active" ? "#74c69d" : "#ffb703",
                  }}
                >
                  {customer.status.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: "12px", textAlign: "right" }}>
                <button
                  onClick={() => onEdit(customer)}
                  style={{
                    background: "none",
                    border: "1px solid #4ecca3",
                    color: "#4ecca3",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(customer.id)}
                  style={{
                    background: "none",
                    border: "1px solid #e94560",
                    color: "#e94560",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
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
