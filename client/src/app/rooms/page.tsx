"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";

type Room = {
  id: number;
  name: string;
  price: number;
  guests: number;
  image: string;
};

const ROOMS: Room[] = [
  {
    id: 1,
    name: "Standard Room",
    price: 35000,
    guests: 2,
    image: "/room1.jpg",
  },
  {
    id: 2,
    name: "Deluxe Room",
    price: 55000,
    guests: 3,
    image: "/room2.jpg",
  },
  {
    id: 3,
    name: "Executive Suite",
    price: 95000,
    guests: 4,
    image: "/room3.jpg",
  },
];

export default function RoomsPage() {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const filteredRooms = ROOMS.filter((room) => {
    const matchesName = room.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPrice = maxPrice
      ? room.price <= maxPrice
      : true;

    return matchesName && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-semibold">Available Rooms</h1>
          <p className="mt-2 text-neutral-600">
            Choose the perfect room for your stay
          </p>

          {/* Search */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Search room type"
              className="rounded-lg border px-3 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="rounded-lg border px-3 py-2"
              onChange={(e) =>
                setMaxPrice(
                  e.target.value ? Number(e.target.value) : null
                )
              }
            >
              <option value="">Any price</option>
              <option value="40000">Below ₦40,000</option>
              <option value="60000">Below ₦60,000</option>
              <option value="100000">Below ₦100,000</option>
            </select>
          </div>

          {/* Rooms */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="rounded-2xl bg-white shadow-sm border overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-48">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg">
                    {room.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Up to {room.guests} guests
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold">
                      ₦{room.price.toLocaleString()} / night
                    </p>

                    <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800">
                      Book now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <p className="mt-10 text-center text-neutral-500">
              No rooms match your search.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}