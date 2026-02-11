"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

interface Settlement {
  id: string;
  bookingId: string;
  amount: number;
  commission: number;
  payout: number;
  status: string;
}

export default function SettlementPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  useEffect(() => {
    api.get("/admin/settlements").then((res) => {
      setSettlements(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="pt-28 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">
          Payment Settlements
        </h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="p-3 text-left">Booking</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Commission</th>
                <th className="p-3 text-left">Hotel Payout</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-3">{s.bookingId}</td>
                  <td className="p-3">₦{s.amount.toLocaleString()}</td>
                  <td className="p-3">
                    ₦{s.commission.toLocaleString()}
                  </td>
                  <td className="p-3">
                    ₦{s.payout.toLocaleString()}
                  </td>
                  <td className="p-3">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}