import api from "./api";
import type { Customer } from "../types/customer";

export const customerService = {
  // Mendapatkan semua data (Sesuai Fitur 1 di PDF)
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>("/customers");
    return response.data;
  },

  // Menambah data baru (Sesuai Fitur 1 di PDF)
  create: async (customer: Omit<Customer, "id">): Promise<Customer> => {
    const response = await api.post<Customer>("/customers", customer);
    return response.data;
  },

  // Kamu bisa tambah update dan delete nanti di sini
};
