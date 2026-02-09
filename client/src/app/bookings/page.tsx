"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function BookingPage() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="pt-28 max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">Book Your Stay</h1>

        <div className="space-y-4 bg-white p-6 rounded-xl shadow">
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <input
            type="number"
            min={1}
            className="w-full border p-2 rounded"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />

          <button className="w-full bg-black text-white py-2 rounded">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}