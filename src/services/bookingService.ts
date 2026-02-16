import api from "./api"; // Pastikan file api.ts sudah disetting baseURL-nya
import type { Booking, BookingInput } from "../types/booking";

export const bookingService = {
  create: async (data: BookingInput) => {
    // URL relative, axios akan otomatis pakai baseURL dari api.ts
    const response = await api.post("/bookings", data);
    return response.data;
  },

  // Get all bookings
  getAll: async () => {
    const response = await api.get<Booking[]>("/bookings");
    // Backend returns camelCase, ensure both formats available
    const data = response.data;
    if (Array.isArray(data)) {
      return data.map((booking: any) => ({
        ...booking,
        // Create aliases for both camelCase and PascalCase
        id: booking.id,
        Id: booking.id,
        roomId: booking.roomId,
        RoomId: booking.roomId,
        requesterName: booking.requesterName,
        RequesterName: booking.requesterName,
        requesterEmail: booking.requesterEmail,
        RequesterEmail: booking.requesterEmail,
        requesterPhone: booking.requesterPhone,
        RequesterPhone: booking.requesterPhone,
        bookingStartDate: booking.bookingStartDate,
        BookingStartDate: booking.bookingStartDate,
        bookingEndDate: booking.bookingEndDate,
        BookingEndDate: booking.bookingEndDate,
        bookingDate: booking.bookingDate,
        BookingDate: booking.bookingDate,
        purpose: booking.purpose,
        Purpose: booking.purpose,
        status: booking.status,
        Status: booking.status,
        room: booking.room,
        Room: booking.room,
        createdDate: booking.createdDate,
        CreatedDate: booking.createdDate,
      }));
    }
    return data;
  },

  // Get bookings by room and optional date
  getBookingsByRoom: async (roomId: string, date?: string) => {
    let url = `/bookings/room/${roomId}`;
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }
    const response = await api.get<Booking[]>(url);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: "Approved" | "Rejected",
    rejectionReason?: string,
  ) => {
    try {
      // Send as plain object with status and optional rejection reason
      const response = await api.patch(
        `/bookings/${id}/status`,
        { Status: status, RejectionReason: rejectionReason || null },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },
};
