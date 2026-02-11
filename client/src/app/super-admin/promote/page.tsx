"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { AxiosError } from "axios";

export default function PromoteUserPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePromote = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await api.post("/super-admin/promote", {
        email,
        role,
      });

      setMessage("User role updated successfully.");
      setEmail("");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
        error.response?.data?.message ?? "Failed to update role."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="pt-28 max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">
          Promote / Change Role
        </h1>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block font-medium mb-1">
              User Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="user@email.com"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Assign Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>

          <button
            onClick={handlePromote}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}