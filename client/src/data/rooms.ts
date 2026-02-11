import type { Room } from "@/types/rooms";

export const ROOMS: Room[] = [
  {
    id: "1",
    name: "Standard Room",
    price: 35000,
    capacity: 2, 
    amenities: ["Wi-Fi,"," " ,"Air-Conditioning,"," ", "TV"],
    isAvailable: true, // initial availability
    description: "Comfortable room with modern amenities.",
    image: "/rooms/room1.jpg",
  },
  {
    id: "2",
    name: "Deluxe Room",
    price: 55000,
    capacity: 3,
    amenities: ["Wi-Fi,"," " ,"Air-Conditioning,"," ", "TV,", " ", "Mini Bar"],
    isAvailable: true,
    description: "Spacious deluxe room with premium comfort.",
    image: "/rooms/room2.jpg",
  },
  {
    id: "3",
    name: "Executive Suite",
    price: 95000,
    capacity: 4,
    amenities: ["Wi-Fi,"," " ,"Air-Conditioning,"," ", "TV,", " ", "Mini Bar,", " ", "Living Area,", " ","Balcony"],
    isAvailable: true,
    description: "Luxury suite with living area.",
    image: "/rooms/room3.jpg",
  },
];