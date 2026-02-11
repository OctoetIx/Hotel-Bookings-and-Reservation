export interface Room {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
}
