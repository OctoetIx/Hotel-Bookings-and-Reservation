"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import {Booking} from "@/types/booking"

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.get("/bookings/my").then((res) => setBookings(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="pt-28 max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">My Bookings</h1>

        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between"
            >
              <div>
                <p className="font-medium">{b.roomName}</p>
                <p className="text-sm text-neutral-600">
                  {b.checkIn} → {b.checkOut}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">₦{b.total.toLocaleString()}</p>
                <p className="text-xs">{b.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
