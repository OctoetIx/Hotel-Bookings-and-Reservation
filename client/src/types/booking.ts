export interface Booking {
  id: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: "CONFIRMED" | "CANCELLED";
}