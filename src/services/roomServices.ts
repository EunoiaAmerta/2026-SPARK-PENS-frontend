import api from "./api";
import type { Room } from "../types/room";

export const roomService = {
  getAll: async () => {
    const response = await api.get("/rooms");
    return response.data;
  },
  create: async (data: Omit<Room, "id">) => {
    const response = await api.post("/rooms", data);
    return response.data;
  },
  update: async (id: string, data: Omit<Room, "id">) => {
    const response = await api.put(`/rooms/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/rooms/${id}`);
  },
};
