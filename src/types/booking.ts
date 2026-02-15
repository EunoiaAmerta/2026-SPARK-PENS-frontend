export interface Booking {
  id?: string;
  roomId: string;
  room?: {
    id?: string;
    name: string;
    building?: string;
    capacity?: number;
  };
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  bookingDate?: string; // Legacy field for backwards compatibility
  bookingStartDate?: string; // ISO datetime (camelCase)
  bookingEndDate?: string; // ISO datetime (camelCase)
  BookingStartDate?: string; // ISO datetime (PascalCase from backend)
  BookingEndDate?: string; // ISO datetime (PascalCase from backend)
  purpose: string;
  status?: "Pending" | "Approved" | "Rejected";
}

// PascalCase version for API requests (matches backend DTO)
export interface BookingInput {
  RoomId: string;
  RequesterName: string;
  RequesterEmail: string;
  RequesterPhone: string;
  BookingStartDate: string;
  BookingEndDate: string;
  Purpose: string;
}
