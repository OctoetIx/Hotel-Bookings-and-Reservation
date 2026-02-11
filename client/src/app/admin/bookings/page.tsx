"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Booking } from "@/types/booking";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.get("/admin/bookings").then((res) => setBookings(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="pt-28 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">All Bookings</h1>

        <table className="w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Room</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="p-3">{b.roomName}</td>
                <td className="p-3">{b.checkIn} → {b.checkOut}</td>
                <td className="p-3 text-center">{b.guests}</td>
                <td className="p-3">₦{b.total.toLocaleString()}</td>
                <td className="p-3">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}