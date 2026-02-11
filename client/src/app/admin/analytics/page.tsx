"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import useRevenueRealtime from "@/hooks/useRevenueRealtime"; // ✅ correct place
import Skeleton from "react-loading-skeleton";
import { RevenueResponse, DailyRevenue } from "@/types/revenue";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function RevenueDashboard() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // ✅ realtime subscription belongs here (top-level hook)
  useRevenueRealtime(from, to);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["revenue", from, to],
    queryFn: async () => {
      try {
        const res = await api.get<RevenueResponse>("/admin/revenue", {
          params: { from, to },
        });
        return res.data;
      } catch (err) {
        toast.error("Failed to load revenue");
        throw err;
      }
    },
  });

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="pt-28 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">
          Revenue Dashboard
        </h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4 items-end">
          <div>
            <label className="text-sm">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="text-sm">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          <button
            onClick={() => refetch()}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {isFetching ? "Refreshing..." : "Apply"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded">
            Failed to load revenue data
          </div>
        )}

        {/* Total */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          {isLoading ? (
            <Skeleton className="h-8 w-40" />
          ) : (
            <h2 className="text-2xl font-bold">
              ₦{data?.total.toLocaleString()}
            </h2>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data?.daily ?? []}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="revenue"
                  stroke="#000"
                  isAnimationActive
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
