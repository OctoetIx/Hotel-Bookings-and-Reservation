"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import DateRangePicker from "@/components/DateRangePicker";
import RoomSkeleton from "@/components/RoomSkeleton"
import api from "@/lib/api";

interface Room {
  id: string;
  name: string;
  price: number;
  capacity: number;
}

const ROOMS: Room[] = [
  { id: "1", name: "Standard Room", price: 35000, capacity: 2 },
  { id: "2", name: "Deluxe Room", price: 55000, capacity: 3 },
  { id: "3", name: "Executive Suite", price: 95000, capacity: 4 },
];

export default function BookingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [range, setRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ---- AUTH CHECK ----
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setLoadingAuth(false);
      } catch {
        toast.error("Please login to continue booking");
        router.push("/login?redirect=/booking");
      }
    };
    checkAuth();
  }, []);

  // ---- AVAILABILITY QUERY ----
  const { data, isFetching } = useQuery({
    queryKey: ["availability", range],
    queryFn: async () => {
      if (!range) return { roomIds: [] };
      const res = await api.get("/booking/availability", {
        params: { start: range.startDate, end: range.endDate },
      });
      return res.data;
    },
    enabled: !!range,
  });

  const selectedRoom = ROOMS.find((r) => r.id === roomId);
  const nights = range
    ? Math.ceil((new Date(range.endDate).getTime() - new Date(range.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const createBooking = async () => {
    if (!range || !roomId) return;

    try {
      const res = await api.post("/booking/create", {
        roomId,
        checkIn: range.startDate,
        checkOut: range.endDate,
        guests,
      });
      toast.success("Booking created!");
      router.push(`/payment/${res.data.bookingId}`);
    } catch {
      toast.error("Booking failed");
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="pt-28 max-w-6xl mx-auto px-4 pb-20">
        <h1 className="text-3xl font-semibold mb-8">Book Your Stay</h1>

        {/* STEP 1 - Calendar */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <DateRangePicker onSelect={setRange} />

            <button
              disabled={!range?.startDate || !range?.endDate}
              onClick={() => setStep(2)}
              className="mt-4 bg-black text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Check Availability
            </button>
          </div>
        )}

        {/* STEP 2 - Room Selection */}
        {step === 2 && (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isFetching
              ? Array(3)
                  .fill(0)
                  .map((_, i) => <RoomSkeleton key={i} />)
              : ROOMS.map((room) => {
                  const available = data?.roomIds?.includes(room.id);
                  return (
                    <div
                      key={room.id}
                      className={`p-5 rounded-xl border cursor-pointer ${
                        roomId === room.id ? "border-black shadow-md" : "bg-white"
                      }`}
                    >
                      <h2 className="font-semibold">{room.name}</h2>
                      <p>₦{room.price.toLocaleString()} / night</p>
                      <p>Capacity: {room.capacity}</p>

                      <button
                        disabled={!available}
                        onClick={() => { setRoomId(room.id); setStep(3); }}
                        className="mt-3 w-full bg-black text-white py-2 rounded disabled:bg-gray-400"
                      >
                        {available ? "Select Room" : "Unavailable"}
                      </button>
                    </div>
                  );
                })}
          </div>
        )}

        {/* STEP 3 - Summary */}
        {step === 3 && selectedRoom && (
          <div className="bg-white p-6 rounded-xl shadow max-w-xl mt-6">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

            <p>Room: {selectedRoom.name}</p>
            <p>Nights: {nights}</p>
            <p>Total: ₦{(selectedRoom.price * nights).toLocaleString()}</p>

            <input
              type="number"
              min={1}
              max={selectedRoom.capacity}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-4 w-full border p-2 rounded"
            />

            <button
              onClick={createBooking}
              className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-neutral-800"
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}