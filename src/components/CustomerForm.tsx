import React from "react";
import { useForm } from "react-hook-form";
import type { Customer } from "../types/customer";

// Kita buat type untuk input form (tanpa ID karena ID biasanya digenerate backend)
type CustomerInput = Omit<Customer, "id">;

const CustomerForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>();

  const onSubmit = (data: CustomerInput) => {
    console.log("Data Form:", data);
    alert("Data berhasil disubmit! Cek konsol.");
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h3>Add New Customer</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Field Name */}
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <br />
          <input {...register("name", { required: "Name is required" })} />
          {errors.name && (
            <span style={{ color: "red" }}> {errors.name.message}</span>
          )}
        </div>

        {/* Field Email */}
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <br />
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
          />
          {errors.email && (
            <span style={{ color: "red" }}> {errors.email.message}</span>
          )}
        </div>

        {/* Field Phone */}
        <div style={{ marginBottom: "10px" }}>
          <label>Phone:</label>
          <br />
          <input
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && (
            <span style={{ color: "red" }}> {errors.phone.message}</span>
          )}
        </div>

        {/* Field Status */}
        <div style={{ marginBottom: "10px" }}>
          <label>Status:</label>
          <br />
          <select {...register("status", { required: "Status is required" })}>
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && (
            <span style={{ color: "red" }}> {errors.status.message}</span>
          )}
        </div>

        <button type="submit">Submit Customer</button>
      </form>
    </div>
  );
};

export default CustomerForm;
