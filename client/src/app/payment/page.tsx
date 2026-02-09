"use client";

import Navbar from "@/components/Navbar";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="pt-28 max-w-lg mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-4">Payment</h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <p>Total Amount</p>
          <p className="text-2xl font-bold">₦105,000</p>

          <button className="w-full bg-black text-white py-3 rounded-lg">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}