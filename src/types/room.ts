export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  description: string;
  isAvailable: boolean;
}

export type RoomInput = Omit<Room, "id">;
