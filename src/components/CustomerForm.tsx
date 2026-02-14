import React from "react";
import { useForm } from "react-hook-form";
import { customerService } from "../services/customerService";
import type { Customer } from "../types/customer";

type CustomerInput = Omit<Customer, "id">;

// Tambahkan interface Props ini
interface Props {
  onSuccess: () => void;
}

const CustomerForm: React.FC<Props> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerInput>();

  const onSubmit = async (data: CustomerInput) => {
    try {
      // Kirim data ke Backend (Fitur 1: Menambah data)
      await customerService.create(data);
      alert("Data berhasil disimpan!");
      reset(); // Kosongkan form setelah sukses
      onSuccess(); // Panggil fetchCustomers di App.tsx untuk update tabel
    } catch (error) {
      console.error("Gagal simpan data:", error);
      alert("Gagal simpan data ke server.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ background: "#333", padding: "20px", borderRadius: "8px" }}
    >
      <h3>Add New Customer</h3>
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
        <input {...register("email", { required: "Email is required" })} />
        {errors.email && (
          <span style={{ color: "red" }}> {errors.email.message}</span>
        )}
      </div>
      {/* Field Phone */}
      <div style={{ marginBottom: "10px" }}>
        <label>Phone:</label>
        <br />
        <input {...register("phone", { required: "Phone is required" })} />
      </div>
      {/* Tambahkan ini di dalam return JSX form, misalnya di bawah Phone */}
      <div style={{ marginBottom: "10px" }}>
        <label>Address:</label>
        <br />
        <input {...register("address", { required: "Address is required" })} />
        {errors.address && (
          <span style={{ color: "red" }}> {errors.address.message}</span>
        )}
      </div>
      {/* Field Status */}
      <div style={{ marginBottom: "10px" }}>
        <label>Status:</label>
        <br />
        <select {...register("status", { required: true })}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit">Submit Customer</button>
    </form>
  );
};

export default CustomerForm;
