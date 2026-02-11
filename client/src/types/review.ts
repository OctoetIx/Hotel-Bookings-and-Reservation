export interface Review {
  id: string;
  roomId: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
  userName: string;
}
