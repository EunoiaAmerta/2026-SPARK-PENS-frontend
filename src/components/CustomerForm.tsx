import React, { useEffect } from "react"; // Tambahkan useEffect di sini
import { useForm } from "react-hook-form";
import { customerService } from "../services/customerService";
import type { Customer } from "../types/customer";

interface Props {
  onSuccess: () => void;
  initialData?: Customer | null;
}

const CustomerForm: React.FC<Props> = ({ onSuccess, initialData }) => {
  // Tambahkan formState: { errors } agar variabel errors bisa terbaca
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>();

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("email", initialData.email);
      setValue("phone", initialData.phone);
      setValue("address", initialData.address);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const onSubmit = async (data: any) => {
    if (initialData) {
      await customerService.update(initialData.id, data);
    } else {
      await customerService.create(data);
    }
    onSuccess();
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ background: "#16213e", padding: "20px", borderRadius: "8px" }}
    >
      <input
        {...register("name", { required: "Name is required" })}
        placeholder="Name"
      />
      {errors.name && (
        <span style={{ color: "red" }}>{errors.name.message as string}</span>
      )}
      {/* Tambahkan field lainnya sesuai kebutuhan */}
      <button
        type="submit"
        style={{ background: "#4ecca3", marginLeft: "10px" }}
      >
        Submit
      </button>
    </form>
  );
};

export default CustomerForm;
