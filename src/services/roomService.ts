import api from "./api";
import type { Room, RoomInput } from "../types/room";

export const roomService = {
  getAll: async () => {
    const response = await api.get<Room[]>("/rooms");
    return response.data;
  },
  create: async (data: RoomInput) => {
    const response = await api.post<Room>("/rooms", data);
    return response.data;
  },
  update: async (id: string, data: RoomInput) => {
    try {
      console.log(`[roomService.update] Updating room ${id}`);
      console.log(`[roomService.update] Payload:`, data);

      const response = await api.put(`/rooms/${id}`, data);

      console.log(`[roomService.update] Response status:`, response.status);
      console.log(`[roomService.update] Response data:`, response.data);

      // For 204 No Content, response.data will be empty
      // Just return the data or acknowledge the update was successful
      return response.data || { success: true };
    } catch (error: any) {
      console.error("[roomService.update] Error:", error);
      console.error(
        "[roomService.update] Error response status:",
        error?.response?.status,
      );
      console.error(
        "[roomService.update] Error response data:",
        error?.response?.data,
      );
      console.error("[roomService.update] Error message:", error?.message);
      throw error;
    }
  },
  delete: async (id: string) => {
    await api.delete(`/rooms/${id}`);
  },
};
