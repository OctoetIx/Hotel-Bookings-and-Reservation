"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const ROOMS = [
  {
    id: "1",
    name: "Standard Room",
    price: 35000,
    guests: 2,
    description: "Comfortable room with modern amenities.",
    image: "/room1.jpg",
  },
  {
    id: "2",
    name: "Deluxe Room",
    price: 55000,
    guests: 3,
    description: "Spacious deluxe room with premium comfort.",
    image: "/room2.jpg",
  },
];

export default function RoomDetailsPage() {
  const { id } = useParams();
  const room = ROOMS.find((r) => r.id === id);

  if (!room) {
    return <p className="pt-32 text-center">Room not found</p>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="pt-28 max-w-5xl mx-auto px-4">
        <div className="relative h-80 rounded-xl overflow-hidden">
          <Image
            src={room.image}
            alt={room.name}
            fill
            className="object-cover"
          />
        </div>

        <h1 className="mt-6 text-3xl font-semibold">{room.name}</h1>
        <p className="mt-2 text-neutral-600">{room.description}</p>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold">
            ₦{room.price.toLocaleString()} / night
          </p>
          <button className="bg-black text-white px-6 py-2 rounded-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}